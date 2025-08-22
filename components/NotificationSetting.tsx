import { View, Text, Switch } from "react-native"
import { useState } from "react";

export default function NotificationSetting() {
    const [sms, setSms] = useState(true);
  const [push, setPush] = useState(false);
  const [email, setEmail] = useState(true);

    return <View className="bg-white p-6 rounded-2xl shadow mb-6">
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
}