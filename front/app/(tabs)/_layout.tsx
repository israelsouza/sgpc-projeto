import { Tabs } from "expo-router";
import { BottomNav } from "@/components/BottomNav";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNav {...props} />}
    >
      <Tabs.Screen name="home/index" options={{ title: "Home" }} />
      <Tabs.Screen name="historico/index" options={{ title: "Histórico" }} />
      <Tabs.Screen name="avisos/index" options={{ title: "Avisos" }} />
      <Tabs.Screen name="perfil/index" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
