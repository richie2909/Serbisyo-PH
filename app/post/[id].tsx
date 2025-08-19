// app/post/[id].tsx
import { View, Dimensions, TouchableOpacity, Text, Linking, StyleSheet, ScrollView } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter, useLocalSearchParams } from "expo-router";
import antipoloData from "../../constants/antipolo.json";

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  if (!id)
    return (
      <View style={styles.centered}>
        <Text>Invalid post ID</Text>
      </View>
    );

  const post = antipoloData.find((p) => p.id === id);
  if (!post)
    return (
      <View style={styles.centered}>
        <Text>Post not found</Text>
      </View>
    );

  const permalink = post.permalink_url ?? "";
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth - 32;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>body { margin:0; padding:0; }</style>
      </head>
      <body>
        <div id="fb-root"></div>
        <script async defer crossorigin="anonymous" 
          src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0">
        </script>
        <div class="fb-post" data-href="${permalink}" data-width="${cardWidth}"></div>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* WebView container */}
      <View style={styles.webviewWrapper}>
        <WebView
          originWhitelist={["*"]}
          source={{ html }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          style={styles.webview}
          nestedScrollEnabled
        />
      </View>

      {/* Visit post button */}
      {permalink ? (
        <TouchableOpacity
          onPress={() => Linking.openURL(permalink)}
          style={styles.button}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Visit Post on Facebook</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    margin: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  webviewWrapper: {
    flex: 1, // take all remaining space
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  webview: {
    flex: 1,
  },
  button: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#1877F2",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
