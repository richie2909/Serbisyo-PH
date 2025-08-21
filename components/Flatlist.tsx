import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, SafeAreaView } from "react-native";
import FacebookCard from "./Card";

type Post = {
  caption?: string;
  images: string[];
  permalink: string;
  timestamp?: string;
};

type Page = {
  name: string;
  logo: string;
};

export default function FacebookFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://serbisyo-ph.vercel.app/api/posts");
        const data = await res.json();

        setPage(data.page);
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#1877F2" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <FlatList
        data={posts}
        keyExtractor={(item, index) => item.permalink + index}
        renderItem={({ item }) => (
          <FacebookCard
            pageName={page?.name || ""}
            pageLogo={page?.logo || ""}
            caption={item.caption || ""}
            images={item.images || []}
            permalink={item.permalink}
            timestamp={item.timestamp}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 5 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
