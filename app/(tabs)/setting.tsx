import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../providers/ThemeProvider";

export default function Settings() {
  const { theme, toggle } = useTheme();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-xl text-black dark:text-white mb-4">
        Settings
      </Text>
      <TouchableOpacity
        onPress={toggle}
        className="bg-blue-600 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold">
          Toggle Theme ({theme})
        </Text>
      </TouchableOpacity>
    </View>
  );
}
