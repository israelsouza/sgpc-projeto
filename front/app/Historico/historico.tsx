import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { styles } from "@/screens/Historico/historico.styles";
import { BottomNav } from "@/components/BottomNav";
import type { ComponentType } from "react";

// ── Tipos ──────────────────────────────────────────
type IconLibrary = "Feather" | "MaterialCommunityIcons" | "AntDesign";

interface HistoricoItem {
  id: string;
  title: string;
  subtitle: string;
  icon: { name: string; library: IconLibrary };
  iconBg: string;
  iconColor: string;
  date: string;
  time: string;
  hasBadge?: boolean;
}

// ── Dados mockados ─────────────────────────────────
// TODO: substituir por chamada à API quando o endpoint estiver pronto
const historicoItems: HistoricoItem[] = [
  {
    id: "1",
    title: "Aviso de entrega ao porteiro",
    subtitle: "Uma entrega está para chegar mas precisei ir a...",
    icon: { name: "package", library: "Feather" },
    iconBg: "#D6F5E3",
    iconColor: "#4CAF73",
    date: "18/03/25",
    time: "14:50",
    hasBadge: true,
  },
  {
    id: "2",
    title: "Aviso de visita ao porteiro",
    subtitle: "Mariana Lira Silva",
    icon: { name: "user", library: "Feather" },
    iconBg: "#D6E8F7",
    iconColor: "#5B9BC4",
    date: "17/03/25",
    time: "14:50",
  },
  {
    id: "3",
    title: "Veículo registrado",
    subtitle: "Ferrari Enzo Vermelha",
    icon: { name: "car-outline", library: "MaterialCommunityIcons" },
    iconBg: "#F5E6D6",
    iconColor: "#B87C4A",
    date: "16/03/25",
    time: "09:55",
  },
  {
    id: "4",
    title: "Aviso de visita ao porteiro",
    subtitle: "Julia Santos",
    icon: { name: "user", library: "Feather" },
    iconBg: "#D6E8F7",
    iconColor: "#5B9BC4",
    date: "15/03/25",
    time: "14:50",
  },
];

// ── Renderizador de ícones (mesmo padrão do Home) ──
function renderIcon(icon: HistoricoItem["icon"], color: string) {
  const IconComponent = {
    Feather,
    MaterialCommunityIcons,
    AntDesign,
  }[icon.library] as ComponentType<{ name: string; size: number; color: string }>;

  return <IconComponent name={icon.name} size={22} color={color} />;
}

// ── Tela ───────────────────────────────────────────
export default function HistoricoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* ── Header com botão voltar ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={18} color={colors.textLight} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Minhas Ações</Text>
          <Text style={styles.headerSubtitle}>
            {historicoItems.length} ações recentes
          </Text>
        </View>

        {/* Curva de transição (mesmo efeito do Header compartilhado) */}
        <View style={styles.headerCurve} />
      </View>

      {/* ── Lista ── */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {historicoItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemCard}
            activeOpacity={0.7}
          >
            {/* Ícone + badge */}
            <View style={styles.iconWrapper}>
              <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                {renderIcon(item.icon, item.iconColor)}
              </View>
              {item.hasBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>!</Text>
                </View>
              )}
            </View>

            {/* Texto */}
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemSubtitle} numberOfLines={2}>
                {item.subtitle}
              </Text>
            </View>

            {/* Data e hora */}
            <View style={styles.itemMeta}>
              <Text style={styles.itemDate}>{item.date}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Bottom Nav (índice 1 = Histórico) ── */}
      <BottomNav activeIndex={1} />
    </SafeAreaView>
  );
}