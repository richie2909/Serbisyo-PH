import * as React from "react";
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useRouter, Link } from "expo-router";
import { account } from "../lib/appwrite";

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSignUpPress = async () => {
    setError("");

    if (!/^[a-zA-Z0-9-_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, - or _");
      return;
    }
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
        // no active session, ignore
      }

      // Create new user
      await account.create("unique()", email, password, username);

      // Create session after signup
      await account.createEmailPasswordSession(email, password);

      router.replace("/"); // Redirect to home
    } catch (err: any) {
      console.error(err);
      switch (err.code) {
        case 409:
          setError("A user with this email already exists. Please login.");
          break;
        case 400:
          setError("Invalid input. Check your email and password.");
          break;
        case 401:
          setError("Unauthorized. Check project ID or endpoint.");
          break;
        default:
          setError(err.message || "Sign-up failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold mb-6">Create Account</Text>
      {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}

      <TextInput
        value={username}
        placeholder="Username"
        onChangeText={setUsername}
        className="w-full border px-4 py-3 mb-4 rounded"
      />
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
        onPress={onSignUpPress}
        disabled={loading}
        className="w-full bg-blue-600 py-3 rounded-xl items-center mb-4"
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold text-lg">Sign Up</Text>}
      </TouchableOpacity>

      <View className="flex-row items-center">
        <Text className="mr-2">Already have an account?</Text>
        <Link href="./login">
          <Text className="text-blue-600 font-semibold">Sign In</Text>
        </Link>
      </View>
    </View>
  );
}
