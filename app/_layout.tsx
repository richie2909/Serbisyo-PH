// app/_layout.tsx
import { Stack, useRouter, useSegments } from "expo-router";
import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  const router = useRouter();
  const segments = useSegments();

  // Check if current route is in auth group
  const isAuthRoute = React.useMemo(() => {
    return segments.some(segment => segment === "(auth)");
  }, [segments]);

  React.useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Only redirect if not authenticated and not already on auth pages
          if (!session && !isAuthRoute) {
            router.replace("/(auth)/login");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        
        // Only redirect if not authenticated and not already on auth pages
        if (!session && !isAuthRoute) {
          router.replace("/(auth)/login");
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isAuthRoute, router]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
