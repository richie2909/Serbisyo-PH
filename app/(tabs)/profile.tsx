// app/Profile.tsx
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput, Image } from "react-native";
import { useState } from "react";

export default function Profile() {
  const [sms, setSms] = useState(true);
  const [push, setPush] = useState(false);
  const [email, setEmail] = useState(true);

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Profile Card */}
      <View className="bg-white p-6 rounded-2xl shadow mb-6 items-center">
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          className="w-24 h-24 rounded-full mb-4"
        />
        <Text className="text-xl font-bold text-gray-800">John Doe</Text>
        <Text className="text-gray-500">johndoe@email.com</Text>
      </View>

      {/* Personal Info */}
      <View className="bg-white p-6 rounded-2xl shadow mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-4">Personal Info</Text>
        <TextInput
          placeholder="Full Name"
          defaultValue="John Doe"
          className="border border-gray-300 rounded-xl px-4 py-3 mb-3"
        />
        <TextInput
          placeholder="Email"
          defaultValue="johndoe@email.com"
          keyboardType="email-address"
          className="border border-gray-300 rounded-xl px-4 py-3 mb-3"
        />
        <TextInput
          placeholder="Phone Number"
          defaultValue="+63 912 345 6789"
          keyboardType="phone-pad"
          className="border border-gray-300 rounded-xl px-4 py-3"
        />
      </View>

      {/* Notifications */}
      <View className="bg-white p-6 rounded-2xl shadow mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-4">Notifications</Text>

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-700">SMS Alerts</Text>
          <Switch value={sms} onValueChange={setSms} />
        </View>

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-700">Push Notifications</Text>
          <Switch value={push} onValueChange={setPush}        />
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-700">Email Updates</Text>
        <Switch value={email} onValueChange={setEmail}   />
        </View>
      </View>

      {/* General Settings */}
      <View className="bg-white p-6 rounded-2xl shadow mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-4">General Settings</Text>
        <TouchableOpacity className="py-3">
          <Text className="text-gray-700">Privacy & Security</Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-3">
          <Text className="text-gray-700">Theme</Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-3">
          <Text className="text-gray-700">Language</Text>
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View className="bg-white p-6 rounded-2xl shadow mb-10">
        <Text className="text-lg font-bold text-gray-800 mb-4">Danger Zone</Text>
        <TouchableOpacity className="bg-red-500 py-3 rounded-xl">
          <Text className="text-white text-center font-semibold">Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
