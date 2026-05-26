import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { colors } from "@/theme/colors";
import { styles as staticStyles, createStyles } from "@/screens/Perfil/perfil.styles";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useMemo, useState } from "react";
import { VisitasModal } from "@/components/VisitasModal";
import { VisitanteService, Visita } from "@/services/visitanteService";

// ── Props da tela ──────────────────────────
interface PerfilScreenProps {
  name?: string;
  email?: string;
  phone?: string;
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
}: PerfilScreenProps) {
  const { colors: themeColors, isHighContrast } = useTheme();

  // Normal: styles estático original / HC: styles dinâmico
  const styles = useMemo(
    () => (isHighContrast ? createStyles(themeColors) : staticStyles),
    [isHighContrast, themeColors]
  );

    const [modalVisible, setModalVisible] = useState(false);
  const [visitas, setVisitas] = useState<Visita[]>([]);

  const profileIcon = (
    <Feather name="user" size={32} color={colors.textLight} />
  );

  const handleOpenVisitasModal = async () => {
    try {
      const data = await VisitanteService.getAll();
      setVisitas(data);
      setModalVisible(true);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* ── Header de perfil ── */}
      <Header
        title={name}
        subtitle={`${email}\n${phone}`}
        icon={profileIcon}
      />

      {/* ── Conteúdo ── */}
      <View style={styles.contentWrapper}>
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

              // Cor do ícone: usa override no HC, marrom padrão no normal
              const iconColor = isHighContrast
                ? themeColors.iconColorOverride
                : colors.earthBrown;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  activeOpacity={0.7}
                  onPress={item.id === 'cadastros' ? handleOpenVisitasModal : undefined}
                >
                  <View style={styles.menuIconBox}>
                    <IconComponent
                      name={item.icon}
                      size={20}
                      color={iconColor}
                    />
                  </View>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Feather name="chevron-down" size={18} color={iconColor} />
                </TouchableOpacity>
              );
            })}
          </View>

          <VisitasModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        visitas={visitas}
      />
        </ScrollView>
      </View>
    </View>
  );
}