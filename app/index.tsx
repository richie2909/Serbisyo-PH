import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

export default function Index() {
  const router = useRouter();


  // check if it is the first time using the app then only display this once maybe omething like a cache

  return (
    <ScrollView className="flex-1 bg-indigo-600 dark:bg-indigo-900">
      <View className="flex-1 px-6 pt-20">
        {/* Title */}
        <Text className="text-4xl font-bold text-white">
          Serbisyo
        </Text>
        <Text className="text-lg text-indigo-100 mt-2">
          Get LGU updates, scholarships, and more
        </Text>

        {/* CTA Button */}
        <TouchableOpacity
          className="mt-10 bg-white px-6 py-4 rounded-2xl shadow-md active:opacity-80"
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text className="text-center text-indigo-700 font-semibold text-lg">
            Get Started
          </Text>
        </TouchableOpacity>

        {/* Secondary Action (Optional) */}
        <TouchableOpacity
          className="mt-4 border border-white px-6 py-4 rounded-2xl active:opacity-80"
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text className="text-center text-white font-semibold text-lg">
            Log In
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
