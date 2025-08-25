// components/NotificationSetting.tsx
import { View, Text, Switch } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // your supabase client
import { useAuth } from "@/hooks/useAuth"; // custom hook for current user

export default function NotificationSetting() {
  const { user } = useAuth();
  const [sms, setSms] = useState(false);
  const [push, setPush] = useState(false);
  const [email, setEmail] = useState(false);

  // load preferences from Supabase
  useEffect(() => {
    if (!user) return;
    supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setSms(data.sms);
          setPush(data.push);
          setEmail(data.email);
        }
      });
  }, [user]);

  // save preferences to Supabase
  const updatePref = async (key: string, value: boolean) => {
    if (!user) return;

    await supabase.from("notification_preferences").upsert({
      user_id: user.id,
      [key]: value,
    });
  };

  return (
    <View className="bg-white p-6 rounded-2xl shadow mb-6">
      <Text className="text-lg font-bold text-gray-800 mb-4">Notifications</Text>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-gray-700">SMS Alerts</Text>
        <Switch
          value={sms}
          onValueChange={(val) => {
            setSms(val);
            updatePref("sms", val);
          }}
        />
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-gray-700">Push Notifications</Text>
        <Switch
          value={push}
          onValueChange={(val) => {
            setPush(val);
            updatePref("push", val);
          }}
        />
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-gray-700">Email Updates</Text>
        <Switch
          value={email}
          onValueChange={(val) => {
            setEmail(val);
            updatePref("email", val);
          }}
        />
      </View>
    </View>
  );
}
