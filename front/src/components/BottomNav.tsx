import { View, TouchableOpacity } from "react-native";
import { FontAwesome6, Entypo, Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { styles } from "@/screens/Home/home.styles";
import { colors } from "@/theme/colors";

interface BottomNavProps {
  activeIndex?: number;
}

export function BottomNav({ activeIndex = 0 }: BottomNavProps) {
  const inactiveColor = "#B8A89A";
  const activeColor = colors.earthBrown;

  const getColor = (index: number) =>
    activeIndex === index ? activeColor : inactiveColor;

  return (
    <View style={styles.bottomNav}>
      <Link href="../Home/Home" asChild>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome6 name="house" size={24} color={getColor(0)} />
        </TouchableOpacity>
      </Link>
      <Link href="/Historico/historico" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Entypo name="back-in-time" size={24} color={getColor(1)} />
        </TouchableOpacity>
      </Link>
      <Link href="/Avisos/avisos" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Entypo name="megaphone" size={24} color={getColor(2)} />
        </TouchableOpacity>
      </Link>
      <Link href="../Perfil/perfil" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="users" size={24} color={getColor(3)} />
        </TouchableOpacity>
      </Link>
    </View>
  );
}