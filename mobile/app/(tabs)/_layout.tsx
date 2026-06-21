import { Tabs } from "expo-router";
import { colors } from "../../theme";
import { Platform } from "react-native";

export default function TabLayout() {
  const bottomPad = Platform.OS === "ios" ? 28 : 12;
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.accent.primary,
      tabBarInactiveTintColor: "#5A5045",
      tabBarStyle: {
        backgroundColor: "#FFFFFF",
        borderTopColor: "#D5CCBB",
        borderTopWidth: 1,
        height: 60 + bottomPad,
        paddingBottom: bottomPad,
        paddingTop: 8,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: -2 },
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
    }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="knowledge" options={{ title: "Know" }} />
      <Tabs.Screen name="pending" options={{ title: "Pend" }} />
      <Tabs.Screen name="profile" options={{ title: "Me" }} />
    </Tabs>
  );
}
