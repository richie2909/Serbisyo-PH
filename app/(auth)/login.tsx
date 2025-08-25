import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, Link } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState<"google" | "facebook" | null>(null);

  // Build a correct redirect URL for the current platform
  const redirectTo = React.useMemo(() => {
    // This becomes: serbisyo://auth/callback on native, and http://localhost:19006/auth/callback on web dev
    return Linking.createURL("/auth/callback");
  }, []);

  // 1) Try to restore a session from a deep link (initial + subsequent)
  React.useEffect(() => {
    let mounted = true;

    const handleUrl = async (url: string | null) => {
      if (!url) return;
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(url);
        if (error) {
          // If the URL wasn't an auth URL, Supabase returns an error—ignore non-auth URLs
          // but show real auth errors.
          if (error.message?.toLowerCase().includes("oauth")) {
            setError(error.message);
          }
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to finish OAuth.");
      } finally {
        // Stop any OAuth spinners; if session is valid, the auth listener below will navigate.
        setOauthLoading(null);
      }
    };

    // Handle app cold start deep link
    Linking.getInitialURL().then((url) => {
      if (mounted) {
        handleUrl(url);
      }
    });

    // Handle when app is already open
    const sub = Linking.addEventListener("url", (evt) => handleUrl(evt.url));

    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  // 2) Navigate when authenticated
  React.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.replace("/(tabs)/home");
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  // Email + Password login
  const onSignInPress = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      // Navigation happens via onAuthStateChange
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const signInWithGoogle = async () => {
    setError("");
    setOauthLoading("google");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: false },
      });
      if (error) throw error;
      // App will leave to browser → come back via deep link
    } catch (e: any) {
      setError(e?.message ?? "Google sign-in failed");
      setOauthLoading(null);
    }
  };

  // Facebook login
  const signInWithFacebook = async () => {
    setError("");
    setOauthLoading("facebook");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: { redirectTo, skipBrowserRedirect: false },
      });
      if (error) throw error;
    } catch (e: any) {
      setError(e?.message ?? "Facebook sign-in failed");
      setOauthLoading(null);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center px-8 py-12">
        <Image
          source={{ uri: "https://i.imgur.com/tM6x0sO.png" }}
          className="w-32 h-32 mb-6 rounded-full shadow-md"
        />
        <Text className="text-3xl font-extrabold mb-2 text-black-700">Welcome Back!</Text>
        <Text className="text-base text-gray-600 mb-8">Sign in to order your favorite meals 🍕</Text>

        {error ? (
          <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4 w-full">
            <Text className="text-red-600 text-sm">{error}</Text>
          </View>
        ) : null}

        <TextInput
          value={email}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          className="w-full border border-gray-300 bg-white px-4 py-3 mb-4 rounded-xl"
        />

        <TextInput
          value={password}
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          className="w-full border border-gray-300 bg-white px-4 py-3 mb-6 rounded-xl"
        />

        <TouchableOpacity
          onPress={onSignInPress}
          disabled={loading}
          className={`w-full py-3 rounded-2xl items-center mb-4 shadow ${
            loading ? "bg-gray-400" : "bg-blue-600"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-lg">Sign In with Email</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center my-6 w-full">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="px-3 text-gray-500">or continue with</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        <TouchableOpacity
          onPress={signInWithGoogle}
          disabled={oauthLoading === "google"}
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-2xl w-full py-3 mb-3 shadow"
        >
          {oauthLoading === "google" ? (
            <ActivityIndicator />
          ) : (
            <>
              <Image
                source={{ uri: "https://img.icons8.com/color/48/google-logo.png" }}
                className="w-6 h-6 mr-2"
              />
              <Text className="text-gray-800 font-semibold">Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={signInWithFacebook}
          disabled={oauthLoading === "facebook"}
          className="flex-row items-center justify-center bg-blue-600 rounded-2xl w-full py-3 mb-6 shadow"
        >
          {oauthLoading === "facebook" ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Image
                source={{ uri: "https://img.icons8.com/color/48/facebook-new.png" }}
                className="w-6 h-6 mr-2"
              />
              <Text className="text-white font-semibold">Continue with Facebook</Text>
            </>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center">
          <Text className="text-gray-700 mr-2">Don’t have an account?</Text>
          <Link href="./signup" replace>
            <TouchableOpacity>
              <Text className="text-blue-600 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
