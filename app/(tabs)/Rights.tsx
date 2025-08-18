import { View, Text } from "react-native";

export default function Rights() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-xl text-black dark:text-white font-semibold">
        Know Your Rights
      </Text>
      <View className="w-20 h-20 bg-gray-400 dark:bg-gray-600 mt-6 rounded-full" />
    </View>
  );
}
