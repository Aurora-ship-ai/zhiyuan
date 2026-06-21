import { Stack } from "expo-router";
import { colors } from "../theme";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: colors.background.primary },
      headerTintColor: colors.text.primary,
      headerShadowVisible: false,
      contentStyle: { backgroundColor: colors.background.primary },
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
