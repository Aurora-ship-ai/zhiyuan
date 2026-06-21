import { Tabs } from "expo-router";
import { colors } from "../../theme";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.accent.primary,
      tabBarInactiveTintColor: "#6B5E50",
      tabBarStyle: {
        backgroundColor: colors.background.card,
        borderTopColor: colors.border.default,
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 6,
        paddingTop: 6,
      },
      tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
    }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="knowledge" options={{ title: "Knowledge" }} />
      <Tabs.Screen name="pending" options={{ title: "Pending" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
