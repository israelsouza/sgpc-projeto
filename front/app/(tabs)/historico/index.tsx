// app/(tabs)/historico/index.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Feather, MaterialCommunityIcons, AntDesign, Entypo } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { styles as staticStyles, createStyles } from "@/screens/Historico/historico.styles";
import { Header } from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useMemo } from "react";
import type { ComponentType } from "react";

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
  {
    id: "5",
    title: "Aviso de visita ao porteiro",
    subtitle: "Julia Santos",
    icon: { name: "user", library: "Feather" },
    iconBg: "#D6E8F7",
    iconColor: "#5B9BC4",
    date: "15/03/25",
    time: "14:50",
  },
  {
    id: "6",
    title: "Aviso de visita ao porteiro",
    subtitle: "Julia Santos",
    icon: { name: "user", library: "Feather" },
    iconBg: "#D6E8F7",
    iconColor: "#5B9BC4",
    date: "15/03/25",
    time: "14:50",
  },
  {
    id: "7",
    title: "Aviso de visita ao porteiro",
    subtitle: "Julia Santos",
    icon: { name: "user", library: "Feather" },
    iconBg: "#D6E8F7",
    iconColor: "#5B9BC4",
    date: "15/03/25",
    time: "14:50",
  },
];

function renderIcon(icon: HistoricoItem["icon"], color: string) {
  const IconComponent = {
    Feather,
    MaterialCommunityIcons,
    AntDesign,
  }[icon.library] as ComponentType<{ name: string; size: number; color: string }>;
  return <IconComponent name={icon.name} size={22} color={color} />;
}

export default function HistoricoScreen() {
  const { colors: themeColors, isHighContrast } = useTheme();

  // Normal: styles original intacto / HC: styles dinâmico
  const styles = useMemo(
    () => (isHighContrast ? createStyles(themeColors) : staticStyles),
    [isHighContrast, themeColors]
  );

  const historyIcon = (
    <Entypo name="back-in-time" size={26} color={colors.textLight} />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <Header
        title="Minhas Ações"
        subtitle={`${historicoItems.length} ações recentes`}
        icon={historyIcon}
      />

      <View style={styles.contentWrapper}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {historicoItems.map((item) => {
            const iconBg    = isHighContrast ? themeColors.iconBgOverride : item.iconBg;
            const iconColor = isHighContrast ? themeColors.iconColorOverride : item.iconColor;

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                activeOpacity={0.7}
                accessibilityLabel={`${item.title}: ${item.subtitle}`}
                accessibilityRole="button"
              >
                {/* Ícone + badge */}
                <View style={styles.iconWrapper}>
                  <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                    {renderIcon(item.icon, iconColor)}
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
            );
          })}

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
    </View>
  );
}