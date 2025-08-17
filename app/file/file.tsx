import React, { useEffect, useState } from "react";
import { View, Button, FlatList, Text } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { BLEMesh } from "../../lib/ble";
import { encodeFile } from "../../lib/libHelper";

const mesh = new BLEMesh();

export default function Files() {
  const [receivedFiles, setReceivedFiles] = useState<{ name: string; size: number }[]>([]);

  useEffect(() => {
    mesh.setOnFileReceived?.((peerId, fileName, data) => {
      setReceivedFiles((prev) => [...prev, { name: fileName, size: data.length }]);
    });
  }, []);

  const pickAndSendFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      const response = await fetch(file.uri);
      const arrayBuffer = await response.arrayBuffer();
      const data = encodeFile(arrayBuffer);

      mesh.getConnectedPeers().forEach((peerId) => mesh.sendFile(file.name, data));
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Button title="Pick and Send File" onPress={pickAndSendFile} />
      <Text style={{ marginVertical: 10, fontSize: 18 }}>Received Files:</Text>
      <FlatList
        data={receivedFiles}
        keyExtractor={(item) => item.name + item.size}
        renderItem={({ item }) => (
          <Text style={{ padding: 5 }}>{item.name} ({item.size} bytes)</Text>
        )}
      />
    </View>
  );
}