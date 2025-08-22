import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void; // Callback to trigger search
}

export default function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  // Optional: debounce search to reduce frequent calls
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(query.trim());
    }, 300); // 300ms debounce

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <View className="flex-row items-center bg-gray-100 rounded-xl mx-4 mt-4 px-3 py-2">
      <Ionicons name="search" size={20} color="gray" />
      <TextInput
        placeholder={placeholder}
        value={query}
        onChangeText={setQuery}
        className="flex-1 ml-2 text-base text-gray-700"
        returnKeyType="search"
        onSubmitEditing={() => onSearch(query.trim())} // Trigger search on enter
        clearButtonMode="while-editing"
      />
    </View>
  );
}
