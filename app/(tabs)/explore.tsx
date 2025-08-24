import React, { useEffect, useState, useMemo } from "react";
import { View, FlatList, ActivityIndicator, SafeAreaView, Text } from "react-native";
import SearchBar from "@/components/SearchBar";
import FilterHeaderComponent from "@/components/FilterHeader";
import FacebookCard from "@/components/Card";

type Post = {
  caption?: string;
  images: string[];
  permalink: string;
  timestamp?: string;
};

type Page = {
  name: string;
  logo: string;
};

type SortMode = "time" | "alpha";
type TimeOrder = "newest" | "oldest";
type AlphaOrder = "asc" | "desc";

export default function Explore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  // UI states
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // sorting state
  const [sortMode, setSortMode] = useState<SortMode>("time");
  const [timeOrder, setTimeOrder] = useState<TimeOrder>("newest");
  const [alphaOrder, setAlphaOrder] = useState<AlphaOrder>("asc");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://serbisyo-ph.vercel.app/api/posts");
        const data = await res.json();

        setPage(data.page || null);
        setPosts(data.posts || []);

        // 🔹 Extract hashtags as categories
        const tags = Array.from(
          new Set(
            (data.posts || [])
              .flatMap((p: Post) =>
                (p.caption?.match(/#\w+/g) || []).map((tag) =>
                  tag.replace("#", "")
                )
              )
              .filter(Boolean)
          )
        );
        setCategories(["All", ...tags]);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // filtering + sorting
  const filteredPosts = useMemo(() => {
    let result = posts;

    // filter by category
    if (selectedCategory !== "All") {
      result = result.filter((p) =>
        p.caption?.includes(`#${selectedCategory}`)
      );
    }

    // filter by search
    if (query.trim()) {
      result = result.filter((p) =>
        p.caption?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // sort
    if (sortMode === "time") {
      result = result.slice().sort((a, b) => {
        const ta = new Date(a.timestamp || "").getTime();
        const tb = new Date(b.timestamp || "").getTime();
        return timeOrder === "newest" ? tb - ta : ta - tb;
      });
    } else {
      result = result.slice().sort((a, b) => {
        const ca = a.caption || "";
        const cb = b.caption || "";
        return alphaOrder === "asc"
          ? ca.localeCompare(cb)
          : cb.localeCompare(ca);
      });
    }

    return result;
  }, [posts, query, selectedCategory, sortMode, timeOrder, alphaOrder]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#1877F2" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* 🔍 Search */}
      <SearchBar placeholder="Search posts..." onSearch={setQuery} />

      {/* 🏷 Categories + Sorting */}
      <FilterHeaderComponent
        categories={categories}
        onFilterChange={(cat) => setSelectedCategory(cat)}
        onSortChange={({ mode, order }) => {
          setSortMode(mode);
          if (mode === "time") setTimeOrder(order as TimeOrder);
          else setAlphaOrder(order as AlphaOrder);
        }}
      />

      {/* 📌 Posts */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item, index) => item.permalink + index}
        renderItem={({ item }) => (
          <FacebookCard
            pageName={page?.name || ""}
            pageLogo={page?.logo || ""}
            caption={item.caption || ""}
            images={item.images || []}
            permalink={item.permalink}
            timestamp={item.timestamp}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: 20,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500 text-base">No posts found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
