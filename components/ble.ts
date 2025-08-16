import { BleManager, Device, Characteristic } from "react-native-ble-plx";
import { Platform, PermissionsAndroid } from "react-native";
import { Buffer } from "buffer";

const SERVICE_UUID = "12345678-1234-1234-1234-123456789abc";
const CHARACTERISTIC_UUID = "87654321-4321-4321-4321-cba987654321";
const CHUNK_SIZE = 20;

const manager = new BleManager();
const connectedDevices: Record<string, Device> = {};
const receivedMessageIds: Set<string> = new Set();
const fileBuffers: Record<
  string,
  { chunks: string[]; expectedChunks: number; resolve?: Function }
> = {};

// --------------------- Permissions ---------------------
export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    return Object.values(granted).every((status) => status === "granted");
  }
  return true;
}

// --------------------- Scan ---------------------
export function startScan(onDeviceFound: (device: Device) => void): void {
  manager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
    if (error) {
      console.log("Scan error:", error);
      return;
    }
    if (device && device.name) {
      onDeviceFound(device);
    }
  });
}

export function stopScan(): void {
  manager.stopDeviceScan();
}

// --------------------- Connect ---------------------
export async function connectDevice(device: Device): Promise<void> {
  try {
    const connected = await device.connect();
    await connected.discoverAllServicesAndCharacteristics();
    connectedDevices[device.id] = connected;

    connected.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error: Error | null, characteristic: Characteristic | null) => {
        if (error || !characteristic) {
          console.log("Monitor error", error);
          return;
        }
        const data = Buffer.from(characteristic.value ?? "", "base64").toString(
          "utf8",
        );
        handleReceivedData(data);
      },
    );
  } catch (e) {
    console.log("Connect error", e);
  }
}

// --------------------- Send & Relay ---------------------
export async function sendMessage(
  message: string,
  onDelivered?: () => void,
): Promise<void> {
  const messageId = generateMessageId();
  const payload = JSON.stringify({
    id: messageId,
    type: "text",
    message,
    hops: 0,
  });
  await sendPayload(payload);
  receivedMessageIds.add(messageId);

  if (onDelivered) {
    registerAck(messageId, onDelivered);
  }
}

export async function sendFile(
  fileName: string,
  fileData: string,
  onDelivered?: () => void,
): Promise<void> {
  const messageId = generateMessageId();
  const totalChunks = Math.ceil(fileData.length / CHUNK_SIZE);
  fileBuffers[messageId] = {
    chunks: [],
    expectedChunks: totalChunks,
    resolve: onDelivered,
  };

  for (let i = 0; i < totalChunks; i++) {
    const chunk = fileData.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    const payload = JSON.stringify({
      id: messageId,
      type: "file",
      fileName,
      chunk,
      index: i,
      totalChunks,
      hops: 0,
    });
    await sendPayload(payload);
  }
  receivedMessageIds.add(messageId);
}

// Send to all connected devices
async function sendPayload(payload: string): Promise<void> {
  const base64Data = Buffer.from(payload, "utf8").toString("base64");
  Object.values(connectedDevices).forEach(async (device) => {
    try {
      await device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Data,
      );
    } catch (e) {
      console.log("Send error:", e);
    }
  });
}

// --------------------- Receive & Relay ---------------------
function handleReceivedData(payload: string) {
  try {
    const data = JSON.parse(payload) as any;

    if (receivedMessageIds.has(data.id)) return;
    receivedMessageIds.add(data.id);

    data.hops = (data.hops ?? 0) + 1;

    // Relay to other devices if hops < max (optional, e.g., max 10 hops)
    if (data.hops <= 10) {
      sendPayload(JSON.stringify(data));
    }

    if (data.type === "text" && data.message) {
      console.log("Received text:", data.message);
      triggerAck(data.id);
    }

    if (data.type === "file" && data.chunk) {
      handleFileChunk(data);
    }
  } catch (e) {
    console.log("Parse error", e);
  }
}

// --------------------- File Chunk Handling ---------------------
function handleFileChunk(data: any) {
  const { id, fileName, chunk, index, totalChunks } = data;
  if (!fileBuffers[id])
    fileBuffers[id] = { chunks: [], expectedChunks: totalChunks };

  fileBuffers[id].chunks[index] = chunk;

  const buffer = fileBuffers[id];
  if (buffer.chunks.filter(Boolean).length === buffer.expectedChunks) {
    const fullFile = buffer.chunks.join("");
    console.log("Received full file:", fileName, fullFile);
    if (buffer.resolve) buffer.resolve(); // delivery confirmation
    delete fileBuffers[id];
    triggerAck(id);
  }
}

// --------------------- ACK System ---------------------
const ackCallbacks: Record<string, () => void> = {};
function registerAck(messageId: string, callback: () => void) {
  ackCallbacks[messageId] = callback;
}

function triggerAck(messageId: string) {
  if (ackCallbacks[messageId]) {
    ackCallbacks[messageId]();
    delete ackCallbacks[messageId];
  }
}

// --------------------- Utilities ---------------------
function generateMessageId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function disconnectAll(): Promise<void> {
  for (const device of Object.values(connectedDevices)) {
    try {
      await device.cancelConnection();
    } catch {}
  }
  Object.keys(connectedDevices).forEach((key) => delete connectedDevices[key]);
}
