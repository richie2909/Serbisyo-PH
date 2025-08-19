import { View, Text, Image } from "react-native";

export default function ProfileHeader({
  name,
  username,
  avatar,
}: {
  name: string;
  username: string;
  avatar: string;
}) {
  return (
    <View className="items-center my-6">
      <Image source={{ uri: avatar }} className="w-20 h-20 rounded-full mb-3" />
      <Text className="text-lg font-bold text-gray-900">{name}</Text>
      <Text className="text-sm text-gray-500">{username}</Text>
    </View>
  );
}
