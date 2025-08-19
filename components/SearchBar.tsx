import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <View className="flex-row items-center text-black bg-gray-100 rounded-xl mx-4 mt-4 px-3 py-2">
      <Ionicons name="search" size={20} color="gray" />
      <TextInput
        placeholder={placeholder}
        className="flex-1 ml-2 text-base text-gray-700"
      />
    </View>
  );
}
