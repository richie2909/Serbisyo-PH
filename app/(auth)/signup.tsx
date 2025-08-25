import * as React from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { supabase } from "../../lib/supabase";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  
  const [oauthLoading, setOauthLoading] = React.useState<"google" | "facebook" | null>(null);
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // 🔹 Email/Password Sign Up
  const onSignUpPress = async () => {
    setError("");
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // store username in user metadata
      },
    });

    if (error) {
      setError(error.message);
    } else {
      router.replace("/(tabs)/home"); // go to home after sign up
    }

    setLoading(false);
  };

  // 🔹 Social Sign Up (Google / Facebook)
  const onSocialSignUp = async (provider: "google" | "facebook") => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: "exp://localhost:8081/--/auth/callback",
        // 👆 change this for production (EAS build / deployed app)
      },
    });

    if (error) {
      Alert.alert("Sign up failed", error.message);
    } else {
      console.log("OAuth redirect started:", data.url);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50 px-10"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 justify-center items-center">
        <Text className="text-3xl font-bold mb-6 text-gray-900">
          Create Account
        </Text>

        {error ? (
          <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4 w-full">
            <Text className="text-red-600 text-sm">{error}</Text>
          </View>
        ) : null}

        {/* Username */}
        <TextInput
          value={username}
          placeholder="Username"
          placeholderTextColor="#9CA3AF"
          onChangeText={setUsername}
          className="w-full border border-gray-300 bg-white px-4 py-3 mb-4 rounded-xl"
        />

        {/* Email */}
        <TextInput
          value={email}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
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

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={onSignUpPress}
          disabled={loading}
          className={`w-full py-3 rounded-2xl items-center mb-4 ${
            loading ? "bg-gray-400" : "bg-blue-800"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-lg">Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
               <View className="flex-row items-center my-6 w-full">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="px-3 text-gray-500">or continue with</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>
 

        {/* Google & Facebook */}
        <TouchableOpacity
          onPress={onSignUpPress}
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
          onPress={onSignUpPress}
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

        {/* Sign In Link */}
        <View className="flex-row items-center mt-6">
          <Text className="text-gray-700 mr-2">Already have an account?</Text>
          <Link href="./login" replace>
            <TouchableOpacity>
              <Text className="text-blue-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
