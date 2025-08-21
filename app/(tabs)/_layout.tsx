import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header"

export default function TabLayout() {
  return (
    <> 
      <StatusBar />
    <Tabs
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTitleStyle: {
          fontSize: 18,
          color: "#007AFF"
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "save") {
            iconName = focused ? "bookmark" : "bookmark-outline";
          } else if (route.name === "explore") {
            iconName = focused ? "compass" : "compass-outline";
          } else if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "ellipse"; // fallback icon
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        headerRight : () => <Header />
      })}
    >

      <Tabs.Screen name="home" options={{ title: "Serbisyo" }} />
      <Tabs.Screen name="save" options={{ title: "Saved" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs></>
  );
}
