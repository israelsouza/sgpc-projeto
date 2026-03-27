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
import { FontAwesome6, Entypo, Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';


// ── Dados dos cards ──────────────────────────
const menuItems = [
  {
    id: "cadastrados",
    title: "Cadastrados",
    subtitle: "Moradores e veículos",
    icon: <Feather name="users" size={24} color="black" />,
    iconBg: "#D6E8F7",
    route: "/cadastrados",
  },
  {
    id: "convidar",
    title: "Convidar alguém",
    subtitle: "Avisar a portaria",
    icon: <AntDesign name="user-add" size={24} color="black" />,
    iconBg: "#D6F5E3",
    route: "/convidar",
  },
  {
    id: "agendamentos",
    title: "Agendamentos",
    subtitle: "Espaços e serviços",
    icon: <Feather name="calendar" size={24} color="black" />,
    iconBg: "#F5E6D6",
    route: "/agendamentos",
  },
  {
    id: "entregas",
    title: "Entregas",
    subtitle: "Cartas e pacotes",
    icon: <Feather name="box" size={24} color="black" />,
    iconBg: "#EDD6F5",
    route: "/entregas",
  },
  {
    id: "manifestacao",
    title: "Manifestação",
    subtitle: "Reclamações e sugestões",
    icon: <Feather name="message-square" size={24} color="black" />,
    iconBg: "#F5F0D6",
    route: "/manifestacao",
  },
  {
    id: "documentos",
    title: "Documentos",
    subtitle: "Atas e regulamentos",
    icon: <MaterialCommunityIcons name="book-open-page-variant" size={24} color="black" />,
    iconBg: "#D6E8F7",
    route: "/documentos",
  },
  {
    id: "bilhetes",
    title: "Bilhetes",
    subtitle: "Avisos para a portaria",
    icon: <Feather name="send" size={24} color="black" />,
    iconBg: "#EDD6F5",
    route: "/bilhetes",
  },
];

const navItems = [
  { icon: <FontAwesome6 name="house" size={24} color="black" />, active: true },
  { icon: <Entypo name="back-in-time" size={24} color="black" />, active: false },
  { icon: <Entypo name="megaphone" size={24} color="black" />, active: false },
  { icon: <Feather name="users" size={24} color="black" />, active: false },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>IB</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Itaim Bibi</Text>
            <Text style={styles.headerSubtitle}>Unidade 056</Text>
          </View>
        </View>
      </View>

      {/* ── Conteúdo ── */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Boas-vindas */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Seja bem vindo João 👋</Text>
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
                <Text style={{ fontSize: 22 }}>{item.icon}</Text>
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
      <View style={styles.bottomNav}>
        {navItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.navItem}>
            <Text style={item.active ? styles.navIconActive : styles.navIcon}>
              {item.icon}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}