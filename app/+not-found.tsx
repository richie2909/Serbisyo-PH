import { View, Text, Switch, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfilePage() {
  return (
    <ScrollView className="flex-1 bg-white px-5 py-6">
      {/* Header */}
      <Text className="text-2xl font-bold text-[#111827] mb-6">Profile Settings</Text>

      {/* Personal Info */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-[#111827] mb-3">Personal Information</Text>
        <TouchableOpacity className="flex-row justify-between items-center border-b border-gray-200 py-3">
          <Text className="text-base text-[#111827]">Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row justify-between items-center border-b border-gray-200 py-3">
          <Text className="text-base text-[#111827]">Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Notification Preferences */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-[#111827] mb-3">Notification Preferences</Text>

        {[
          { label: "Push Notifications" },
          { label: "SMS Notifications" },
          { label: "Email Notifications" },
        ].map((item, index) => (
          <View
            key={index}
            className="flex-row justify-between items-center border-b border-gray-200 py-3"
          >
            <Text className="text-base text-[#111827]">{item.label}</Text>
            <Switch
              trackColor={{ false: "#D1D5DB", true: "#007AFF" }}
              thumbColor={"#fff"}
            />
          </View>
        ))}
      </View>

      {/* General Settings */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-[#111827] mb-3">General Settings</Text>
        <TouchableOpacity className="flex-row justify-between items-center border-b border-gray-200 py-3">
          <Text className="text-base text-[#111827]">Privacy Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row justify-between items-center border-b border-gray-200 py-3">
          <Text className="text-base text-[#111827]">Language</Text>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Delete Account */}
      <View className="mt-8">
        <TouchableOpacity className="py-3 px-4 rounded-xl bg-[#EF4444]">
          <Text className="text-center text-white font-semibold text-base">
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
