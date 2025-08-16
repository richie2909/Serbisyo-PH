import { View, Text } from 'react-native';

interface Props {
  message: string;
  sentByMe: boolean;
}

export default function ChatBubble({ message, sentByMe }: Props) {
  return (
    <View className={`my-1 p-2 rounded-lg max-w-3/4 ${sentByMe ? 'bg-blue-500 self-end' : 'bg-gray-300 self-start'}`}>
      <Text className={`${sentByMe ? 'text-white' : 'text-black'}`}>{message}</Text>
    </View>
  );
}
