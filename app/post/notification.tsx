// app/notifications.tsx
import { useRouter } from "expo-router";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Notification = {
  id: string;
  title: string;
  description: string;
  type: "info" | "alert";
  read: boolean;
  time: string;
};

const notifications: Notification[] = [
  {
    id: "1",
    title: "New Update Available",
    description: "Version 1.1 has been released with performance improvements.",
    type: "info",
    read: false,
    time: "2h ago",
  },
  {
    id: "2",
    title: "Event Reminder",
    description: "City Government scholarship deadline tomorrow.",
    type: "alert",
    read: true,
    time: "1d ago",
  },
  {
    id: "3",
    title: "Profile Update",
    description: "Your account information was updated successfully.",
    type: "info",
    read: true,
    time: "3d ago",
  },
];

export default function NotificationsPage() {
  const router = useRouter()
  const renderItem = ({ item }: { item: Notification }) => {
    const icon =
      item.type === "alert"
        ? "alert-circle"
        : "information-circle-outline";

    const iconColor =
      item.type === "alert"
        ? "#FF3B30" // Red for alerts only
        : item.read
        ? "gray"
        : "#007AFF"; // Blue for unread info

    return (
      <TouchableOpacity className="flex-row items-center px-4 py-3 border-b border-gray-200 bg-white">
        <Ionicons name={icon as any} size={24} color={iconColor} />

        <View className="ml-3 flex-1">
          <Text
            className={`text-base font-medium ${
              item.read ? "text-gray-500" : "text-black"
            }`}
          >
            {item.title}
          </Text>
          <Text className="text-sm text-gray-500">{item.description}</Text>
        </View>

        <Text className="text-xs text-gray-400">{item.time}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      
      

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View className=" bg-white border-b border-gray-200 flex  flex-row align-middle">  
                     <TouchableOpacity
  onPress={() => router.back()}
  className="m-4 p-2 bg-white rounded-full flex-row items-center w-24 justify-center"
  activeOpacity={0.7}
>
  <Ionicons name="arrow-back" size={20} color="#007AFF" />
  <Text className="text-blue-600 font-semibold text-lg ml-2">Back</Text>
</TouchableOpacity> 
            <Text className="text-lg font-bold text-[#007AFF] text-center ml-7 mt-6">
              Notifications
            </Text>
              
            </View>
        }
      />
    </View>
  );
}
