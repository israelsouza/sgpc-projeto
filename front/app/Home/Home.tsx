import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme/colors";
import { styles } from "@/screens/Home/home.styles";
import { Feather, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import type { ComponentType } from "react";

// ── Tipos dos ícones ──────────────────────────
type IconLibrary = "Feather" | "AntDesign" | "MaterialCommunityIcons";

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: { name: string; library: IconLibrary };
  iconBg: string;
  iconColor: string;
  route: string;
}

// ── Dados dos cards ──────────────────────────
const menuItems: MenuItem[] = [
  {
    id: "cadastrados",
    title: "Cadastrados",
    subtitle: "Moradores e veículos",
    icon: { name: "users", library: "Feather" },
    iconBg: "#D6E8F7",
    iconColor: "#5B9BC4",
    route: "/cadastrados",
  },
  {
    id: "convidar",
    title: "Convidar alguém",
    subtitle: "Avisar a portaria",
    icon: { name: "user-add", library: "AntDesign" },
    iconBg: "#D6F5E3",
    iconColor: "#4CAF73",
    route: "/convidar",
  },
  {
    id: "agendamentos",
    title: "Agendamentos",
    subtitle: "Espaços e serviços",
    icon: { name: "calendar", library: "Feather" },
    iconBg: "#F5E6D6",
    iconColor: "#B87C4A",
    route: "/agendamentos",
  },
  {
    id: "entregas",
    title: "Entregas",
    subtitle: "Cartas e pacotes",
    icon: { name: "box", library: "Feather" },
    iconBg: "#EDD6F5",
    iconColor: "#9B6BB6",
    route: "/Entregas/Entregas",
  },
  {
    id: "manifestacao",
    title: "Manifestação",
    subtitle: "Reclamações e sugestões",
    icon: { name: "message-square", library: "Feather" },
    iconBg: "#F5F0D6",
    iconColor: "#B8A44A",
    route: "/manifestacao",
  },
  {
    id: "documentos",
    title: "Documentos",
    subtitle: "Atas e regulamentos",
    icon: { name: "book-open-page-variant", library: "MaterialCommunityIcons" },
    iconBg: "#D6E8F7",
    iconColor: "#5B9BC4",
    route: "/documentos",
  },
  {
    id: "bilhetes",
    title: "Bilhetes",
    subtitle: "Avisos para a portaria",
    icon: { name: "send", library: "Feather" },
    iconBg: "#EDD6F5",
    iconColor: "#9B6BB6",
    route: "/bilhetes",
  },
];

// ── Renderizador de ícones ──────────────────────────
function renderIcon(icon: MenuItem["icon"], color: string) {
  const IconComponent = {
    Feather,
    AntDesign,
    MaterialCommunityIcons,
  }[icon.library] as ComponentType<{ name: string; size: number; color: string }>;

  return <IconComponent name={icon.name} size={22} color={color} />;
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* ── Header ── */}
      <Header />

      {/* ── Conteúdo ── */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Boas-vindas */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Seja bem vindo João</Text>
        </View>

        {/* Grid de cards */}
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                {renderIcon(item.icon, item.iconColor)}
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Espaço no final para o scroll não cortar */}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/*  Bottom Nav  */}
      <BottomNav activeIndex={0} />
    </SafeAreaView>
  );
}