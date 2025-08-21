import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { usePostStore, Post } from "../../store/PostStore";
import { Ionicons } from "@expo/vector-icons";

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const decodedPermalink = id ? decodeURIComponent(id) : "";

  const getPostByPermalink = usePostStore((state) => state.getPostByPermalink);

  useEffect(() => {
    const fetchPost = async () => {
      const localPost = getPostByPermalink(decodedPermalink);
      if (localPost) {
        setPost(localPost);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://serbisyo-ph.vercel.app/api/posts");
        const data = await res.json();

        const foundPost: Post | undefined = data.posts
          .map((p: Post) => ({
            ...p,
            page_name: data.page?.name,
            page_logo: data.page?.logo,
          }))
          .find((p: Post) => p.permalink === decodedPermalink);

        setPost(foundPost || null);
      } catch (err) {
        console.error("Error fetching post:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [decodedPermalink, getPostByPermalink]);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#1877F2" />
      </View>
    );

  if (!post) {
    router.replace("/+not-found");
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-500 mb-2">Redirecting...</Text>
        <ActivityIndicator size="large" color="#1877F2" />
      </View>
    );
  }

  const pageName = post.page_name || "Unknown Page";
  const pageLogo = post.page_logo;

  const FadeInImage = ({ uri }: { uri: string }) => {
    const opacity = new Animated.Value(0);

    const onLoad = () => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.Image
        source={{ uri }}
        onLoad={onLoad}
        className="w-full h-80 my-2 rounded-lg bg-gray-200"
        style={{ opacity }}
      />
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Back Button */}
    <TouchableOpacity
  onPress={() => router.back()}
  className="m-4 p-2 bg-white rounded-full shadow flex-row items-center w-24 justify-center"
  activeOpacity={0.7}
>
  <Ionicons name="arrow-back" size={20} color="#007AFF" />
  <Text className="text-blue-600 font-semibold text-lg ml-2">Back</Text>
</TouchableOpacity> 

      <View className="bg-white mx-4 rounded-2xl py-5 px-3 mb-6">
        {/* Header */}
        <View className="flex-row items-center mb-3">
          {pageLogo ? (
            <Image source={{ uri: pageLogo }} className="w-10 h-10 rounded-full mr-3" />
          ) : (
            <View className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
          )}
          <View className="flex-1">
            <Text className="font-bold text-base">{pageName}</Text>
            {post.timestamp && (
              <Text className="text-gray-500 text-xs">
                {new Date(post.timestamp).toLocaleString()}
              </Text>
            )}
          </View>
        </View>

        {/* Caption */}
        {post.caption && (
          <Text className="px-1 py-2 text-gray-800 text-base">
            {post.caption.split(" ").map((word, idx) =>
              word.startsWith("#") ? (
                <Text key={idx} className="text-blue-500">
                  {word}{" "}
                </Text>
              ) : (
                word + " "
              )
            )}
          </Text>
        )}

        {/* Images stacked vertically */}
        {post.images?.map((uri, idx) => (
          <FadeInImage key={idx} uri={uri} />
        ))}

        {/* View on Facebook */}
        {post.permalink && (
          <TouchableOpacity
            onPress={() => Linking.openURL(post.permalink)}
            className="mt-4 py-3 bg-blue-500 rounded-2xl items-center"
          >
            <Text className="text-white font-bold text-base">View on Facebook</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
