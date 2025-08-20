import { View, TouchableOpacity, Text, Linking, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

type Props = {
  permalink: string;
  cardHeight?: number; // optional, can override
};

export default function FacebookEmbed({ permalink, cardHeight = 600 }: Props) {
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth - 32;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin:0; padding:0; }
          .fb-post { margin: 0 auto; }
        </style>
      </head>
      <body>
        <div id="fb-root"></div>
        <script async defer crossorigin="anonymous" 
          src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0">
        </script>
        <div class="fb-post" data-href="${permalink}" data-width="${cardWidth}" data-show-text="true"></div>
      </body>
    </html>
  `;

  return (
    <View style={[styles.card, { height: cardHeight }]}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        style={{ flex: 1, backgroundColor: "transparent" }}
        scrollEnabled={false}
      />

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
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  button: {
    padding: 12,
    backgroundColor: "#1877F2",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
