import { View, Text } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-2xl font-bold text-black dark:text-white">
        LGU News & Scholarships
      </Text>
      <View className="w-32 h-32 bg-gray-300 dark:bg-gray-700 mt-6 rounded-xl" />
    </View>
  );
}
