import { View, Text, FlatList, TextInput, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import * as BLE from '../../components/ble';
import { useLocalSearchParams } from 'expo-router';
import ChatBubble from '../../components/chatBubble';

interface Message {
  id: string;
  text: string;
  sentByMe: boolean;
}

export default function Chatpage() {
  const { chatId } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Hook up BLE listener to update messages
    const origLog = console.log;
    console.log = (msg: string) => {
      setMessages((prev) => [...prev, { id: `${Date.now()}`, text: msg, sentByMe: false }]);
      origLog(msg);
    };
  }, []);

  const send = () => {
    if (!input) return;
    BLE.sendMessage(input);
    setMessages((prev) => [...prev, { id: `${Date.now()}`, text: input, sentByMe: true }]);
    setInput('');
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="px-4 py-2 flex-row justify-between items-center bg-blue-500">
        <Text className="text-white text-lg font-bold">Chat</Text>
      </View>

      <FlatList
        className="flex-1 px-4"
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item.text} sentByMe={item.sentByMe} />}
      />

      <View className="flex-row items-center p-2 bg-white border-t border-gray-200">
        <Pressable className="mr-2">
          <Ionicons name="attach-outline" size={28} color="gray" />
        </Pressable>
        <TextInput
          className="flex-1 bg-gray-200 rounded-full px-4 py-2"
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
        />
        <Pressable onPress={send} className="ml-2">
          <Ionicons name="send" size={28} color="blue" />
        </Pressable>
      </View>
    </View>
  );
}
