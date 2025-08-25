import { View, Text } from "react-native";

export default function PrivacyScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold">Privacy & Security</Text>
      <Text className="text-gray-600 mt-2">Here you can manage your privacy settings.</Text>
    </View>
  );
}
