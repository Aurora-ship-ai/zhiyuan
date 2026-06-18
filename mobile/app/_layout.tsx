import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontFamily: "Noto Serif CJK SC",
            fontSize: 18,
            fontWeight: "600",
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background.primary },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="note/[id]" options={{ title: "复习笔记" }} />
        <Stack.Screen name="material/[id]" options={{ title: "资料详情" }} />
      </Stack>
    </>
  );
}
