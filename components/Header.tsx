import { View } from "react-native";
import { TouchableHighlight } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Header() {
  const router = useRouter();

  return (
    <View className="w-full h-12 flex-row items-center justify-end px-4">
      {/* Icons container */}
      <View className="flex-row items-center space-x-4 gap-x-3" >
        {/* Bell Icon */}
        <TouchableHighlight
          onPress={() => router.push("/post/notification")}
          underlayColor="transparent"
          activeOpacity={0.7}
          className="rounded-full p-2"
        >
          <FontAwesome5 name="bell" size={20} color="black" />
        </TouchableHighlight>

        {/* Profile Circle */}
        <TouchableHighlight
          onPress={() => router.replace("/(tabs)/profile")}
          underlayColor="transparent"
          activeOpacity={0.7}
          className="rounded-full"
        >
          <View className="w-8 h-8 rounded-full bg-gray-400" />
        </TouchableHighlight>
      </View>
    </View>
  );
}
