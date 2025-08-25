import { View, Text } from "react-native";

export default function LanguageScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold">Language</Text>
      <Text className="text-gray-600 mt-2">Here you can change app language.</Text>
    </View>
  );
}
