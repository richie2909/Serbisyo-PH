import * as React from "react";
import { Stack } from "expo-router";
import { StatusBar, View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../providers/ThemeProvider";
import { account } from "../lib/appwrite";
import "../global.css";

export default function RootLayout() {
  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get(); // Get current user
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false); // Not logged in
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar />
        <Stack screenOptions={{headerShown: false}}/>
        {/* Optional: You can handle redirects inside each route if needed */}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
