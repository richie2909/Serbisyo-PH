import { View, Text } from "react-native";

export default function ThemeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold">Theme</Text>
      <Text className="text-gray-600 mt-2">Here you can choose dark/light mode.</Text>
    </View>
  );
}
