import { useState } from "react";
import { View, Text, FlatList } from "react-native";
import SearchBar from "@/components/SearchBar";

type PostItem = {
  caption?: string;
  imageUrl?: string;
  permalink: string;
  timestamp?: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");

  // Example posts (replace with your fetched posts)
  const posts: PostItem[] = [
    {
      caption: "Learning React Native is fun! #reactnative #mobiledev",
      permalink: "1",
      timestamp: "2025-08-22",
    },
    {
      caption: "Exploring TypeScript with Expo #typescript #expo",
      permalink: "2",
      timestamp: "2025-08-21",
    },
    {
      caption: "No hashtags here just text",
      permalink: "3",
      timestamp: "2025-08-20",
    },
  ];

  // 🔍 Filter posts by query
  const filteredPosts = posts.filter((post) =>
    post.caption?.toLowerCase().includes(query.toLowerCase())
  );

  // 🏷️ Extract unique hashtags from captions
  const uniqueTags: string[] = Array.from(
    new Set(
      posts.flatMap((post) =>
        post.caption
          ? post.caption
              .split(" ")
              .filter((word) => word.startsWith("#"))
          : []
      )
    )
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <SearchBar placeholder="Search posts..." onSearch={setQuery} />

      {/* Unique Hashtags */}
      <View className="flex-row flex-wrap px-4 mt-2">
        {uniqueTags.map((tag) => (
          <Text
            key={tag}
            className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full mr-2 mb-2"
          >
            {tag}
          </Text>
        ))}
      </View>

      {/* Results */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.permalink}
        renderItem={({ item }) => (
          <View className="bg-white shadow rounded-xl p-4 mx-4 mt-4">
            <Text className="text-lg font-semibold text-gray-800">
              {item.caption}
            </Text>
            <Text className="text-sm text-gray-500">{item.timestamp}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-6">
            No posts found.
          </Text>
        }
      />
    </View>
  );
}
