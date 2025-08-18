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
      // Delete any active session first
      try {
        await account.deleteSession("current");
      } catch {
        // no session, ignore
      }

      // Create session
      await account.createEmailPasswordSession(email, password);

      router.replace("/(tabs)/Home"); // Redirect to home
    } catch (err: any) {
      console.error(err);
      if (err.code === 401) {
        setError("Invalid credentials. Check your email and password.");
      } else if (err.code === 409) {
        setError("A session is already active. Logging out previous session...");
        try {
          await account.deleteSession("current");
          await account.createEmailPasswordSession(email, password);
          router.replace("/(tabs)/Home");
        } catch (reErr: any) {
          setError(reErr.message || "Session conflict. Try again.");
        }
      } else {
        setError(err.message || "Sign-in failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold mb-6">Sign In</Text>
      {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}

      <TextInput
        value={email}
        placeholder="Email"
        onChangeText={setEmail}
        keyboardType="email-address"
        className="w-full border px-4 py-3 mb-4 rounded"
      />
      <TextInput
        value={password}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
        className="w-full border px-4 py-3 mb-6 rounded"
      />

      <TouchableOpacity
        onPress={onSignInPress}
        disabled={loading}
        className="w-full bg-blue-600 py-3 rounded-xl items-center mb-4"
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold text-lg">Sign In</Text>}
      </TouchableOpacity>

      <View className="flex-row items-center">
        <Text className="mr-2">Don’t have an account?</Text>
        <Link href="./signup">
          <Text className="text-blue-600 font-semibold">Sign Up</Text>
        </Link>
      </View>
    </View>
  );
}
