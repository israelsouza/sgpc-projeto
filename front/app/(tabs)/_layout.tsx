import { Tabs } from "expo-router";
import BottomNav from "@/components/BottomNav";

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

      {/* Rotas ocultas da tab bar — acessadas via router.push */}
      <Tabs.Screen name="bilhetes/index" options={{ title: "bilhetes", href: null }} />
      <Tabs.Screen name="convidar/index" options={{ title: "Convidar", href: null }} />
      <Tabs.Screen name="documentos/index" options={{ title: "Documentos", href: null }} />
      <Tabs.Screen name="Entregas/index" options={{ title: "Entregas", href: null }} />
      <Tabs.Screen name="Manifestacoes/index" options={{ title: "Manifestações", href: null }} />
    </Tabs>
  );
}
