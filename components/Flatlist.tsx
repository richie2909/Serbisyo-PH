import { useEffect, useState } from "react";
import { FlatList, View, Dimensions, ActivityIndicator, Text, StyleSheet } from "react-native";
import FacebookEmbed from "./Card"; // your updated card

type PostItem = {
  caption?: string;
  imageUrl?: string;
  permalink: string;
  timestamp?: string;
};

export default function FacebookFeed() {
  const screenWidth = Dimensions.get("window").width;
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
      console.log("Starting fetch...");
const res = await fetch("http://10.0.2.2:5000/api/posts");
console.log("Fetch completed");

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data: PostItem[] = await res.json();
        setPosts(data);
      } catch (err: any) {
        console.error("Failed to fetch posts:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1877F2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red", textAlign: "center" }}>
          Failed to load posts: {error}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item, index) => `${item.permalink}_${index}`}
      renderItem={({ item }) => (
        <View>
          <FacebookEmbed permalink={item.permalink} />
        </View>
      )}
      contentContainerStyle={{ paddingVertical: 16 }}
      showsVerticalScrollIndicator={true}
      style={{ width: screenWidth }}
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps="handled"
      bounces={true}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
