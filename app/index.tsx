import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-3xl font-bold text-black dark:text-white">
        Serbisyo
      </Text>
      <Text className="text-gray-600 dark:text-gray-300 mt-2">
        Get LGU updates, scholarships, and more
      </Text>

      <TouchableOpacity
        className="mt-6 bg-blue-600 px-6 py-3 rounded-xl"
        onPress={() => router.push("/(tabs)/home")}
      >
        <Text className="text-white font-semibold">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
