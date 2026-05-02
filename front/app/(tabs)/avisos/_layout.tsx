import { Stack } from "expo-router";
import { colors } from "@/theme/colors";

export default function AvisosLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.primaryDark },
        freezeOnBlur: true,
        animation: "fade",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
