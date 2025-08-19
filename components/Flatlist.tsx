import { FlatList, View, Dimensions, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import FacebookEmbed from "./Card";
import antipoloData from "../constants/antipolo.json";
import { useNavigation } from "@react-navigation/native";

type PostItem = {
  id: string;
  permalink_url: string;
};

export default function FacebookFeed() {
  const screenWidth = Dimensions.get("window").width;
    const router = useRouter()

  return (
    <FlatList
      data={antipoloData as PostItem[]}
      keyExtractor={(item, index) => item.id + "_" + index}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.9}
 onPress={() => router.push(`/post/${item.id}`)}
 
        >
          <View>
            <FacebookEmbed permalink={item.permalink_url} />
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingVertical: 16 }}
      showsVerticalScrollIndicator={true}
      style={{ width: screenWidth }}
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps="handled"
      bounces={true}
    />
  );
}
