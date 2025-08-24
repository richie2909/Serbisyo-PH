import * as React from "react";
import { View, ActivityIndicator } from "react-native";
import { Slot, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function RootLayout() {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  const router = useRouter();

  React.useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
      } else {
        router.replace("/login");
      }
      setLoading(false);
    });

    // Optional: listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return <Slot />; // Render the authenticated routes
}
