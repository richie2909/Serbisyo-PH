import { View, Text } from "react-native";
import { TouchableHighlight } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

export default function Header() {
    const router = useRouter()
  return (
    <View className="w-full h-12 flex-row items-center justify-between px-4 "
    
    >
      {/* Left side: Bell Icon */}
      <TouchableHighlight onPress={() => router.push("/notification")} underlayColor={"white"} activeOpacity={1}>
      <FontAwesome5 name="bell" size={20} color="black" />
      </TouchableHighlight>

      {/* Right side: Circle placeholder for profile */}
        <TouchableHighlight 
        onPress={() => router.push("/(tabs)/profile")} 
        >  
      <View className="w-8 h-8 rounded-full bg-gray-400" />
        </TouchableHighlight> 
    </View>
  );
}
