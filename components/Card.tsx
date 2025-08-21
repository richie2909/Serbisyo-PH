import React from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { useRouter } from "expo-router";

interface FacebookCardProps {
  pageName: string;
  pageLogo: string;
  caption?: string;
  images?: string[];
  permalink: string;
  timestamp?: string;
}

export default function FacebookCard({
  pageName,
  pageLogo,
  caption = "",
  images = [],
  permalink,
  timestamp,
}: FacebookCardProps) {
  const router = useRouter();
  const fixedHeight = 150;

  const handleNavigatePost = () => {
    // Encode permalink to safely pass as dynamic route
    const encoded = encodeURIComponent(permalink);
    router.push(`/post/${encoded}`);
  };

  // Render caption with hashtag highlighting
  const renderCaption = () => {
    const words = caption.split(" ");
    return (
      <Text className="px-4 py-2 text-gray-800 flex-wrap">
        {words.map((word, idx) =>
          word.startsWith("#") ? (
            <Text key={idx} className="text-blue-500">
              {word}{" "}
            </Text>
          ) : (
            word + " "
          )
        )}
      </Text>
    );
  };

  // Render images like Facebook grid
  const renderImages = () => {
    const count = images.length;
    if (count === 0) return null;

    // 1 image
    if (count === 1) {
      return (
        <TouchableOpacity onPress={handleNavigatePost}>
          <Image
            source={{ uri: images[0] }}
            className="w-full rounded-lg my-2"
            style={{ height: fixedHeight }}
          />
        </TouchableOpacity>
      );
    }

    // 2 images
    if (count === 2) {
      return (
        <View className="flex-row space-x-1 my-2">
          {images.map((uri, idx) => (
            <TouchableOpacity key={idx} onPress={handleNavigatePost} className="flex-1">
              <Image
                source={{ uri }}
                className="rounded-lg"
                style={{ height: fixedHeight }}
              />
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    // 3 images
    if (count === 3) {
      return (
        <View className="flex-row space-x-1 my-2">
          <TouchableOpacity onPress={handleNavigatePost}>
            <Image
              source={{ uri: images[0] }}
              className="rounded-lg"
              style={{ width: "60%", height: fixedHeight * 2 + 2 }}
            />
          </TouchableOpacity>
          <View className="flex-1 justify-between space-y-1">
            {images.slice(1, 3).map((uri, idx) => (
              <TouchableOpacity key={idx} onPress={handleNavigatePost}>
                <Image
                  source={{ uri }}
                  className="rounded-lg"
                  style={{ height: fixedHeight }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    // 4+ images
    const displayImages = images.slice(0, 4);
    return (
      <View className="flex-row flex-wrap -m-0.5 my-2">
        {displayImages.map((uri, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={handleNavigatePost}
            className="w-1/2 p-0.5 relative"
          >
            <Image
              source={{ uri }}
              className={`w-full rounded-lg ${idx === 3 && images.length > 4 ? "blur-sm" : ""}`}
              style={{ height: fixedHeight }}
            />
            {idx === 3 && images.length > 4 && (
              <View className="absolute inset-0 bg-black bg-opacity-40 justify-center items-center rounded-lg">
                <Text className="text-white text-2xl font-bold">
                  +{images.length - 4}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View className="bg-white rounded-lg shadow overflow-hidden mb-4">
      {/* Header */}
      <View className="flex-row items-center px-4 py-2">
        <Image
          source={{ uri: pageLogo }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="font-bold text-sm">{pageName}</Text>
          {timestamp && (
            <Text className="text-gray-500 text-xs">
              {new Date(timestamp).toLocaleString()}
            </Text>
          )}
        </View>
      </View>

      {/* Caption */}
      {caption ? renderCaption() : null}

      {/* Images */}
      <View className="px-4">{renderImages()}</View>

      {/* Visit post button */}
      <TouchableOpacity
        onPress={() => Linking.openURL(permalink)}
        className="px-4 py-2 bg-blue-500 w-[50%] mx-[25%] my-4 rounded-2xl items-center"
      >
        <Text className="text-sm text-white font-semibold text-center py-1">
          View on Facebook
        </Text>
      </TouchableOpacity>
    </View>
  );
}
