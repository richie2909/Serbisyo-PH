import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SortMode = "time" | "alpha";
type TimeOrder = "newest" | "oldest";
type AlphaOrder = "asc" | "desc";

interface SortChange {
  mode: SortMode;
  order: TimeOrder | AlphaOrder;
}

interface Props {
  onFilterChange?: (category: string) => void;
  onSortChange?: (sort: SortChange) => void;
  categories?: string[]; // 🔹 dynamic categories from SearchPage
}

export default function FilterHeaderComponent({
  onFilterChange,
  onSortChange,
  categories = ["All"],
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortMode, setSortMode] = useState<SortMode>("time");
  const [timeOrder, setTimeOrder] = useState<TimeOrder>("newest");
  const [alphaOrder, setAlphaOrder] = useState<AlphaOrder>("asc");

  function handleCategory(cat: string) {
    setSelectedCategory(cat);
    onFilterChange?.(cat);
  }

  function toggleSort() {
    if (sortMode === "time") {
      const newOrder: TimeOrder = timeOrder === "newest" ? "oldest" : "newest";
      setTimeOrder(newOrder);
      onSortChange?.({ mode: "time", order: newOrder });
    } else {
      const newOrder: AlphaOrder = alphaOrder === "asc" ? "desc" : "asc";
      setAlphaOrder(newOrder);
      onSortChange?.({ mode: "alpha", order: newOrder });
    }
  }

  return (
    <View className="w-full bg-gray-1000 px-3 mt-4 py-2">
      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => handleCategory(cat)}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedCategory === cat ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-sm ${
                selectedCategory === cat ? "text-white" : "text-gray-700"
              }`}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort Options */}
      <View className="flex-row items-center justify-between mt-4 px-1">
        <View className="flex-row space-x-3 mr-2">
          <TouchableOpacity
            onPress={() => {
              setSortMode("time");
              onSortChange?.({ mode: "time", order: timeOrder });
            }}
            className={`px-3 py-1 rounded ${
              sortMode === "time" ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={`${
                sortMode === "time" ? "text-white" : "text-gray-700"
              }`}
            >
              Time
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSortMode("alpha");
              onSortChange?.({ mode: "alpha", order: alphaOrder });
            }}
            className={`px-3 py-1 rounded mx-2 ${
              sortMode === "alpha" ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={`${
                sortMode === "alpha" ? "text-white" : "text-gray-700"
              }`}
            >
              A–Z
            </Text>
          </TouchableOpacity>
        </View>

        {/* Toggle Asc/Desc */}
        <TouchableOpacity
          onPress={toggleSort}
          className="flex-row items-center px-3 py-1 rounded bg-gray-200"
        >
          <Ionicons
            name={
              sortMode === "time"
                ? timeOrder === "newest"
                  ? "time-outline"
                  : "refresh-outline"
                : alphaOrder === "asc"
                ? "arrow-up-outline"
                : "arrow-down-outline"
            }
            size={18}
            color="#007AFF"
          />
          <Text className="ml-1 text-blue-500 text-sm">
            {sortMode === "time"
              ? timeOrder === "newest"
                ? "Newest"
                : "Oldest"
              : alphaOrder === "asc"
              ? "A–Z"
              : "Z–A"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
