import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import React from "react";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>BLE Messenger</Text>
      <Button title="Go to Chat" onPress={() => router.push("/chat/chat")} />
      <Button title="Go to Files" onPress={() => router.push("/file/file")} />
    </View>
  );
}
