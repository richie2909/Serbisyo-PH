import { View } from "react-native";
import SearchBar from "@/components/SearchBar";
import Flatlist from "@/components/Flatlist"

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
     <SearchBar placeholder="Search for scholarships"/> 
      <Flatlist />

    </View>
  );
}
