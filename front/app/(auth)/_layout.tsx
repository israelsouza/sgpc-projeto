import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="EsqueciSenha" />
      <Stack.Screen name="ValidarCodigo" />
      <Stack.Screen name="ResetarSenha" />
    </Stack>

  );
}