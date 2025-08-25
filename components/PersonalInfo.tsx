import { View, Text } from "react-native";

export interface PersonalInfoProps {
  fullName?: string;
  phoneNumber?: string;
}

export default function PersonalInfo({ fullName, phoneNumber }: PersonalInfoProps) {
  return (
    <View className="bg-white p-6 rounded-2xl shadow mb-6">
      <Text className="font-semibold text-lg text-gray-800 mb-3">Personal Info</Text>

      <View className="mb-2">
        <Text className="text-sm text-gray-500">Full Name</Text>
        <Text className="text-base text-black">
          {fullName || "Not set"}
        </Text>
      </View>

      <View>
        <Text className="text-sm text-gray-500">Phone Number</Text>
        <Text className="text-base text-black">
          {phoneNumber || "Not set"}
        </Text>
      </View>
    </View>
  );
}
