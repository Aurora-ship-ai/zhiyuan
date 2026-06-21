import { Tabs } from "expo-router";
import { colors } from "../../theme";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.accent.primary,
      tabBarInactiveTintColor: colors.text.tertiary,
      tabBarStyle: { backgroundColor: colors.background.card, borderTopColor: colors.border.default, height: 56 },
    }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="knowledge" options={{ title: "Knowledge" }} />
      <Tabs.Screen name="pending" options={{ title: "Pending" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
