import React, { useEffect, useState } from "react";
import { View, TextInput, Button, FlatList, Text, KeyboardAvoidingView } from "react-native";
import { BLEMesh } from "../../lib/ble";

const mesh = new BLEMesh();

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    mesh.setOnMessageReceived?.((peerId, text) => {
      setMessages((prev) => [...prev, { id: peerId + Date.now(), text }]);
    });
  }, []);

  const sendMessage = () => {
    mesh.getConnectedPeers().forEach((peerId) => mesh.sendMessage(message));
    setMessages((prev) => [...prev, { id: "me" + Date.now(), text: message }]);
    setMessage("");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, padding: 10 }} behavior="padding">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: item.id.startsWith("me") ? "#0b93f6" : "#e5e5ea",
              alignSelf: item.id.startsWith("me") ? "flex-end" : "flex-start",
              marginVertical: 2,
              padding: 10,
              borderRadius: 20,
              maxWidth: "80%",
            }}
          >
            <Text style={{ color: item.id.startsWith("me") ? "#fff" : "#000" }}>{item.text}</Text>
          </View>
        )}
      />
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            paddingHorizontal: 15,
            flex: 1,
          }}
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}