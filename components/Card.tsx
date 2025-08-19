import { View, Dimensions, TouchableOpacity, Text, Linking, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function FacebookEmbed({ permalink }: { permalink: string }) {
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth - 32;
  const cardHeight = 600; // max height for post card

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; overflow: hidden; }
          .container { width: 100%; transform-origin: top left; }
        </style>
      </head>
      <body>
        <div id="fb-root"></div>
        <script async defer crossorigin="anonymous" 
          src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0">
        </script>
        <div class="container">
          <div class="fb-post" data-href="${permalink}" data-width="${cardWidth}"></div>
        </div>
      </body>
    </html>
  `;

  return (
    <View style={[styles.card, { height: cardHeight }]}>
      <View style={{ flex: 1, overflow: "hidden" }}>
        <WebView
          originWhitelist={["*"]}
          source={{ html }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          style={{ flex: 1 }}
          scalesPageToFit={true}
          scrollEnabled={false} // <-- lets FlatList handle scrolling
        />
      </View>

      <TouchableOpacity
        onPress={() => Linking.openURL(permalink)}
        style={styles.button}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Visit Post on Facebook</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 12,
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
  button: {
    margin: 12,
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
