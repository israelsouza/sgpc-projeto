import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { colors } from "@/theme/colors";
import { styles } from "@/screens/Perfil/perfil.styles";
import { BottomNav } from "@/components/BottomNav";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentType } from "react";

// ── Props da tela ──────────────────────────
interface PerfilScreenProps {
  name?: string;
  email?: string;
  phone?: string;
  avatarUri?: string;
}

// ── Dados dos cards de resumo ──────────────────────────
interface StatCard {
  id: string;
  value: number;
  label: string;
  highlight?: boolean;
}

const statCards: StatCard[] = [
  { id: "chamados", value: 1, label: "CHAMADOS\nABERTOS" },
  { id: "agendamentos", value: 0, label: "AGENDAMENTOS" },
  { id: "avisos", value: 2, label: "AVISOS", highlight: true },
];

// ── Dados dos itens de menu ──────────────────────────
type FeatherIconName = React.ComponentProps<typeof Feather>["name"];
type MCIconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface MenuItem {
  id: string;
  title: string;
  icon: FeatherIconName | MCIconName;
  library: "Feather" | "MaterialCommunityIcons";
  route: string;
}

const menuItems: MenuItem[] = [
  {
    id: "unidade",
    title: "Informações da Unidade",
    icon: "file-text",
    library: "Feather",
    route: "/unidade",
  },
  {
    id: "historicos",
    title: "Meus Históricos",
    icon: "clock",
    library: "Feather",
    route: "/historicos",
  },
  {
    id: "cadastros",
    title: "Cadastros",
    icon: "user",
    library: "Feather",
    route: "/cadastros",
  },
];

export default function PerfilScreen({
  name = "João da Silva",
  email = "joao.silva@gmail.com",
  phone = "11 91234-1234",
  avatarUri,
}: PerfilScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* ── Header de perfil ── */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Feather name="user" size={32} color={colors.textLight} />
            </View>
          )}
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{name}</Text>
          <Text style={styles.headerDetail}>{email}</Text>
          <Text style={styles.headerDetail}>{phone}</Text>
        </View>

        {/* Curva de transição para o conteúdo */}
        <View style={styles.headerCurve} />
      </View>

      {/* ── Conteúdo ── */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cards de resumo */}
        <View style={styles.statsRow}>
          {statCards.map((card) => (
            <View key={card.id} style={styles.statCard}>
              <Text style={[styles.statValue, card.highlight && styles.statValueHighlight]}>
                {card.value}
              </Text>
              <Text style={styles.statLabel}>{card.label}</Text>
            </View>
          ))}
        </View>

        {/* Itens de menu */}
        <View style={styles.menuList}>
          {menuItems.map((item) => {
            const IconComponent = (
              item.library === "Feather" ? Feather : MaterialCommunityIcons
            ) as ComponentType<{ name: string; size: number; color: string }>;

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconBox}>
                  <IconComponent
                    name={item.icon}
                    size={20}
                    color={colors.earthBrown}
                  />
                </View>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Feather name="chevron-down" size={18} color={colors.earthBrown} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Bottom Nav ── */}
      <BottomNav activeIndex={3} />
    </SafeAreaView>
  );
}