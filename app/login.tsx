import * as React from "react";
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useRouter, Link } from "expo-router";
import { account } from "../lib/appwrite";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSignInPress = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      // clear existing session if any
      try {
        await account.deleteSession("current");
      } catch {}

      await account.createEmailPasswordSession(email, password);
      router.replace("/(tabs)/home");
    } catch (err: any) {
      console.error(err);
      if (err.code === 401) {
        setError("Invalid email or password.");
      } else if (err.code === 409) {
        setError("Another session is active. Logging you out...");
        try {
          await account.deleteSession("current");
          await account.createEmailPasswordSession(email, password);
          router.replace("/(tabs)/home");
        } catch (reErr: any) {
          setError(reErr.message || "Session conflict. Try again.");
        }
      } else {
        setError(err.message || "Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-10">
      <Text className="text-3xl font-bold mb-6 text-gray-900">Sign In</Text>

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
        className="w-full border border-gray-300 bg-white px-4 py-3 mb-4 rounded-xl"
      />
      <TextInput
        value={password}
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        onChangeText={setPassword}
        secureTextEntry
        className="w-full border border-gray-300 bg-white px-4 py-3 mb-6 rounded-xl"
      />

      <TouchableOpacity
        onPress={onSignInPress}
        disabled={loading}
        className={`w-full py-3 rounded-2xl items-center mb-4 ${
          loading ? "bg-gray-400" : "bg-blue-600"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-lg">Sign In</Text>
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
  );
}


