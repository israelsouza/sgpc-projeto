// app/(tabs)/home/index.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect, useMemo, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import { Feather, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Header } from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { styles as staticStyles, createStyles } from "@/screens/Home/home.styles";
import { colors as staticColors } from "@/theme/colors";
import type { ComponentType } from "react";

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
    route: "/Manifestacoes",
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
    title: "bilhetes",
    subtitle: "Avisos para a portaria",
    icon: { name: "send", library: "Feather" },
    iconBg: "#EDD6F5",
    iconColor: "#9B6BB6",
    route: "/Bilhetes",
  },
];

function renderIcon(icon: MenuItem["icon"], color: string) {
  const IconComponent = {
    Feather,
    AntDesign,
    MaterialCommunityIcons,
  }[icon.library] as ComponentType<{ name: string; size: number; color: string }>;
  return <IconComponent name={icon.name} size={22} color={color} />;
}

function AnimatedSwitch({ value }: { value: boolean }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 18] });
  const bgColor = anim.interpolate({ inputRange: [0, 1], outputRange: ["#CCCCCC", "#FFD700"] });

  return (
    <Animated.View
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        backgroundColor: bgColor,
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: "#FFFFFF",
          transform: [{ translateX }],
        }}
      />
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors: themeColors, isHighContrast } = useTheme();

  // Normal: usa o styles estático original (palette/colors do seu projeto)
  // Alto contraste: usa createStyles com as cores do tema HC
  const styles = useMemo(
    () => (isHighContrast ? createStyles(themeColors) : staticStyles),
    [isHighContrast, themeColors]
  );

  const [userName, setUserName] = useState("Usuário");
  const [userCondo, setUserCondo] = useState("");
  const [userUnit, setUserUnit] = useState("");

  useEffect(() => {
    async function loadUserData() {
      try {
        const name = await SecureStore.getItemAsync("userName");
        const condo = await SecureStore.getItemAsync("userCondo");
        const unit = await SecureStore.getItemAsync("userUnit");
        if (name) setUserName(name.split(" ")[0]);
        if (condo) setUserCondo(condo);
        if (unit) setUserUnit(unit);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }
    loadUserData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={staticColors.earthBrown} />

      <Header
        title={userCondo || "Condomínio"}
        subtitle={userUnit}
        initials={userCondo ? userCondo.substring(0, 2).toUpperCase() : "SG"}
      />

      <View style={styles.centerContainer}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          {/* ── Boas-vindas ── */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeText}>Seja bem vindo {userName}</Text>
          </View>

          {/* ── Grid ── */}
          <View style={styles.grid}>
            {menuItems.map((item) => {
              const iconBg    = isHighContrast ? themeColors.iconBgOverride : item.iconBg;
              const iconColor = isHighContrast ? themeColors.iconColorOverride : item.iconColor;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() => router.push(item.route as any)}
                  activeOpacity={0.7}
                  accessibilityLabel={`${item.title}: ${item.subtitle}`}
                  accessibilityRole="button"
                >
                  <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                    {renderIcon(item.icon, iconColor)}
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
    </View>
  );
}