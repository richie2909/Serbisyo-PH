import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { supabase } from "../../lib/supabase"; // your Supabase client

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

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
      router.replace("/(tabs)/home");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "myapp://auth/callback", // configure deep link
      },
    });
    if (error) setError(error.message);
  };

  // Facebook login
  const signInWithFacebook = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: "myapp://auth/callback",
      },
    });
    if (error) setError(error.message);
  };

  return (
    <ScrollView className="flex-1 bg-orange-50">
      <View className="flex-1 justify-center items-center px-8 py-12">
        {/* App Logo / Food Image */}
        <Image
          source={{ uri: "https://i.imgur.com/tM6x0sO.png" }} // 🍔 replace with your logo/food image
          className="w-32 h-32 mb-6 rounded-full shadow-md"
        />

        <Text className="text-3xl font-extrabold mb-2 text-orange-700">
          Welcome Back!
        </Text>
        <Text className="text-base text-gray-600 mb-8">
          Sign in to order your favorite meals 🍕
        </Text>

        {/* Error Box */}
        {error ? (
          <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4 w-full">
            <Text className="text-red-600 text-sm">{error}</Text>
          </View>
        ) : null}

        {/* Email */}
        <TextInput
          value={email}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          onChangeText={setEmail}
          keyboardType="email-address"
          className="w-full border border-gray-300 bg-white px-4 py-3 mb-4 rounded-xl"
        />

        {/* Password */}
        <TextInput
          value={password}
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          onChangeText={setPassword}
          secureTextEntry
          className="w-full border border-gray-300 bg-white px-4 py-3 mb-6 rounded-xl"
        />

        {/* Email/Password Button */}
        <TouchableOpacity
          onPress={onSignInPress}
          disabled={loading}
          className={`w-full py-3 rounded-2xl items-center mb-4 shadow ${
            loading ? "bg-gray-400" : "bg-orange-600"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Sign In with Email
            </Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center my-6 w-full">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="px-3 text-gray-500">or continue with</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Social Login */}
        <TouchableOpacity
          onPress={signInWithGoogle}
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-2xl w-full py-3 mb-3 shadow"
        >
          <Image
            source={{ uri: "https://img.icons8.com/color/48/google-logo.png" }}
            className="w-6 h-6 mr-2"
          />
          <Text className="text-gray-800 font-semibold">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={signInWithFacebook}
          className="flex-row items-center justify-center bg-blue-600 rounded-2xl w-full py-3 mb-6 shadow"
        >
          <Image
            source={{ uri: "https://img.icons8.com/color/48/facebook-new.png" }}
            className="w-6 h-6 mr-2"
          />
          <Text className="text-white font-semibold">Continue with Facebook</Text>
        </TouchableOpacity>

        {/* Signup Redirect */}
        <View className="flex-row items-center">
          <Text className="text-gray-700 mr-2">Don’t have an account?</Text>
          <Link href="./signup" replace>
            <TouchableOpacity>
              <Text className="text-orange-600 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
