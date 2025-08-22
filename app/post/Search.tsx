import React, { useState } from "react";
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchSearchResults = async (q: string) => {
    setQuery(q);
    if (!q) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://serbisyo-ph.vercel.app/api/search-posts?q=${encodeURIComponent(q)}&limit=50`);
      const data = await res.json();
      setResults(data.posts || []);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePressPost = (permalink: string) => {
    router.push(`/post/${encodeURIComponent(permalink)}`);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <SearchBar placeholder="Search by caption, username or #hashtag" onSearch={fetchSearchResults} />

      {loading && <ActivityIndicator size="large" color="#1877F2" className="mt-4" />}

      {!loading && results.length === 0 && query !== "" && (
        <Text className="text-center mt-4 text-gray-500">No results found</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.permalink}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePressPost(item.permalink)}>
            <View className="bg-white mx-4 my-2 rounded-lg p-4 shadow">
              <Text className="font-bold mb-2">{item.page_name || "Unknown Page"}</Text>
              <Text>{item.caption}</Text>
              {item.images?.[0] && (
                <View className="mt-2">
                  <Text className="text-gray-400 text-sm">{item.images.length} image(s)</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
