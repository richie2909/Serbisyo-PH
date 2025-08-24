import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, TextInput, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";

interface SearchBarProps {
  placeholder: string;
  initialQuery?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ placeholder, initialQuery = "", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (pathname === "/tabs/explore") {
      onSearch?.(trimmed);
    } else {
      router.push(`/(tabs)/explore?query=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <View className="flex-row items-center bg-white rounded-xl mx-4 my-4 px-3 py-2 shadow">
      <Ionicons name="search" size={20} color="gray" />
      <TextInput
        placeholder={placeholder}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          onSearch?.(text); // ✅ filter as you type
        }}
        onSubmitEditing={handleSearch}
        className="ml-2 flex-1 text-base text-black"
        placeholderTextColor="gray"
      />
      <Pressable onPress={handleSearch}>
        <Ionicons name="arrow-forward" size={20} color="black" />
      </Pressable>
    </View>
  );
}
