// pages/index.tsx
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AuthModal from "../components/AuthModal";

export default function IndexScreen() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <Text className="text-3xl font-bold mb-8 text-indigo-700">My App</Text>

      <TouchableOpacity
        onPress={() => setShowSignIn(true)}
        className="w-64 py-3 mb-4 rounded-xl bg-indigo-600"
      >
        <Text className="text-white font-semibold text-center text-lg">
          Sign In
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowSignUp(true)}
        className="w-64 py-3 rounded-xl bg-gray-200"
      >
        <Text className="text-indigo-600 font-semibold text-center text-lg">
          Sign Up
        </Text>
      </TouchableOpacity>

      {/* Modals */}
      <AuthModal
        visible={showSignIn}
        onClose={() => setShowSignIn(false)}
        mode="signin"
      />
      <AuthModal
        visible={showSignUp}
        onClose={() => setShowSignUp(false)}
        mode="signup"
      />
    </View>
  );
}
