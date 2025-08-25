import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";

export default function GeneralSetting() {
  const router = useRouter();

  return (
    <View className="bg-white p-6 rounded-2xl shadow mb-6">
      <Text className="text-lg font-bold text-gray-800 mb-4">General Settings</Text>

      <TouchableOpacity
        className="py-3"
        onPress={() => router.push("/setting/privacy")}
      >
        <Text className="text-gray-700">Privacy & Security</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="py-3"
        onPress={() => router.push("/setting/theme")}
      >
        <Text className="text-gray-700">Theme</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="py-3"
        onPress={() => router.push("/setting/language")}
      >
        <Text className="text-gray-700">Language</Text>
      </TouchableOpacity>
    </View>
  );
}
