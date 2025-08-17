import { BleManager, Device, Characteristic } from "react-native-ble-plx";
import { Platform, PermissionsAndroid } from "react-native";
import { Buffer } from "buffer";

const SERVICE_UUID = "12345678-1234-1234-1234-123456789abc";
const CHARACTERISTIC_UUID = "87654321-4321-4321-4321-cba987654321";
const CHUNK_SIZE = 512; // increased MTU for Android

type AckCallback = () => void;

interface FileBuffer {
  chunks: string[];
  expectedChunks: number;
  resolve?: AckCallback;
}

export class BLEMesh {
  setOnFileReceived(arg0: (peerId: any, fileName: any, data: any) => void) {
      throw new Error("Method not implemented.");
  }
  setOnMessageReceived(arg0: (peerId: any, text: any) => void) {
      throw new Error("Method not implemented.");
  }
  private manager = new BleManager();
  private connectedDevices: Record<string, Device> = {};
  private receivedMessageIds: Set<string> = new Set();
  private fileBuffers: Record<string, FileBuffer> = {};
  private ackCallbacks: Record<string, AckCallback> = {};

  /** Request Android BLE permissions */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      ]);
      return Object.values(granted).every((status) => status === "granted");
    }
    return true;
  }

  /** Start scanning for BLE devices */
  startScan(onDeviceFound: (device: Device) => void) {
    this.manager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
      if (error || !device || !device.name) return;
      onDeviceFound(device);
    });
  }

  stopScan() {
    this.manager.stopDeviceScan();
  }

  /** Connect to a device and monitor characteristic */
  async connectDevice(device: Device) {
    try {
      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();
      this.connectedDevices[device.id] = connected;

      connected.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error || !characteristic) return;
          const data = Buffer.from(characteristic.value ?? "", "base64").toString("utf8");
          this.handleReceivedData(data);
        }
      );
    } catch (e) {
      console.log("Connect error", e);
    }
  }

  /** Disconnect all devices */
  async disconnectAll() {
    for (const device of Object.values(this.connectedDevices)) {
      try {
        await device.cancelConnection();
      } catch {}
    }
    this.connectedDevices = {};
  }

  /** Send a chat message */
  async sendMessage(message: string, onDelivered?: AckCallback) {
    const messageId = this.generateMessageId();
    const payload = JSON.stringify({ id: messageId, type: "text", message, hops: 0 });
    await this.sendPayload(payload);
    this.receivedMessageIds.add(messageId);
    if (onDelivered) this.registerAck(messageId, onDelivered);
  }

  /** Send a binary file (PDF, image, etc.) */
  async sendFile(fileName: string, fileData: Uint8Array, onDelivered?: AckCallback) {
    const messageId = this.generateMessageId();
    const base64Data = Buffer.from(fileData).toString("base64");
    const totalChunks = Math.ceil(base64Data.length / CHUNK_SIZE);
    this.fileBuffers[messageId] = { chunks: [], expectedChunks: totalChunks, resolve: onDelivered };

    for (let i = 0; i < totalChunks; i++) {
      const chunk = base64Data.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      const payload = JSON.stringify({ id: messageId, type: "file", fileName, chunk, index: i, totalChunks, hops: 0 });
      await this.sendPayload(payload);
    }
    this.receivedMessageIds.add(messageId);
  }

  /** Send payload to all connected devices */
  private async sendPayload(payload: string) {
    const base64Data = Buffer.from(payload, "utf8").toString("base64");
    for (const device of Object.values(this.connectedDevices)) {
      try {
        await device.writeCharacteristicWithResponseForService(SERVICE_UUID, CHARACTERISTIC_UUID, base64Data);
      } catch (e) {
        console.log("Send error:", e);
      }
    }
  }

  /** Handle incoming messages or file chunks */
  private handleReceivedData(payload: string) {
    try {
      const data = JSON.parse(payload);
      if (this.receivedMessageIds.has(data.id)) return;
      this.receivedMessageIds.add(data.id);

      data.hops = (data.hops ?? 0) + 1;
      if (data.hops <= 10) this.sendPayload(JSON.stringify(data));

      if (data.type === "text" && data.message) {
        console.log("Received message:", data.message);
        this.triggerAck(data.id);
      }

      if (data.type === "file" && data.chunk) this.handleFileChunk(data);
    } catch (e) {
      console.log("Parse error:", e);
    }
  }

  /** Handle file chunk assembly */
  private handleFileChunk(data: any) {
    const { id, fileName, chunk, index, totalChunks } = data;
    if (!this.fileBuffers[id]) this.fileBuffers[id] = { chunks: [], expectedChunks: totalChunks };
    this.fileBuffers[id].chunks[index] = chunk;

    const buffer = this.fileBuffers[id];
    if (buffer.chunks.filter(Boolean).length === buffer.expectedChunks) {
      const fullBase64 = buffer.chunks.join("");
      const fileData = Buffer.from(fullBase64, "base64");
      console.log("Received full file:", fileName, fileData.byteLength, "bytes");
      if (buffer.resolve) buffer.resolve();
      delete this.fileBuffers[id];
      this.triggerAck(id);
    }
  }

  /** ACK system */
  private registerAck(messageId: string, callback: AckCallback) {
    this.ackCallbacks[messageId] = callback;
  }
  private triggerAck(messageId: string) {
    if (this.ackCallbacks[messageId]) {
      this.ackCallbacks[messageId]();
      delete this.ackCallbacks[messageId];
    }
  }

  /** Generate unique message ID */
  private generateMessageId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /** Return connected peer IDs */
  getConnectedPeers(): string[] {
    return Object.keys(this.connectedDevices);
  }
}

