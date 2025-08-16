import { View, Text, FlatList, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as BLE from '../components/ble';

interface DeviceItem {
  id: string;
  name: string;
}

export default function Home() {
  const router = useRouter();
  const [devices, setDevices] = useState<DeviceItem[]>([]);

  useEffect(() => {
    BLE.requestPermissions().then((granted) => {
      if (granted) {
        BLE.startScan((device) => {
          if (!devices.find((d) => d.id === device.id)) {
            setDevices((prev) => [...prev, { id: device.id, name: device.name ?? 'Unknown' }]);
          }
        });
      }
    });

    return () => BLE.stopScan();
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
      <View className="px-4 py-2 flex-row justify-between items-center bg-blue-500">
        <Text className="text-white text-xl font-bold">Mesh Chat</Text>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="white" />
      </View>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            className="p-4 bg-white border-b border-gray-200 flex-row justify-between items-center"
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <Text className="text-lg">{item.name}</Text>
            <Ionicons name="chevron-forward" size={24} color="gray" />
          </Pressable>
        )}
      />
    </View>
  );
}
