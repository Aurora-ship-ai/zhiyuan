import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.accent.primary,
      tabBarInactiveTintColor: "#8A7E70",
      tabBarStyle: {
        backgroundColor: colors.background.card,
        borderTopColor: colors.border.default,
        height: 64,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: "500" },
    }}>
      <Tabs.Screen name="index" options={{
        title: "Home",
        tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
      }} />
      <Tabs.Screen name="knowledge" options={{
        title: "Knowledge",
        tabBarIcon: ({ color, size }) => <Ionicons name="library-outline" size={size} color={color} />,
      }} />
      <Tabs.Screen name="pending" options={{
        title: "Pending",
        tabBarIcon: ({ color, size }) => <Ionicons name="bookmark-outline" size={size} color={color} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: "Profile",
        tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
      }} />
    </Tabs>
  );
}
