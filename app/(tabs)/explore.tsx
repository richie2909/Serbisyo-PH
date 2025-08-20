import { View } from "react-native";
import FlatList from "@/components/Flatlist"
import FilterHeaderComponent from "@/components/FilterHeader";
import SearchBar from "../../components/SearchBar";

export default function ExploreScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <SearchBar placeholder="Search categories..." />
        <FilterHeaderComponent />
        <FlatList />
        
    </View>
  );
}
