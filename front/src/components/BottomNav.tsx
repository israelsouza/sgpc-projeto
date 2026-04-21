import { View, TouchableOpacity, Platform } from "react-native";
import { FontAwesome6, Entypo, Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "@/screens/Home/home.styles";
import { colors } from "@/theme/colors";

interface BottomNavProps {
  activeIndex?: number;
}

export function BottomNav({ activeIndex = 0 }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const inactiveColor = "#B8A89A";
  const activeColor = colors.earthBrown;

  const getColor = (index: number) =>
    activeIndex === index ? activeColor : inactiveColor;

  return (
    <View 
      style={[
        styles.bottomNav, 
        { 
          paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 12) : insets.bottom + 12 
        }
      ]}
    >
      <Link href="../home" asChild>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome6 name="house" size={24} color={getColor(0)} />
        </TouchableOpacity>
      </Link>
      <Link href="/historico" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Entypo name="back-in-time" size={24} color={getColor(1)} />
        </TouchableOpacity>
      </Link>
      <Link href="/avisos" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Entypo name="megaphone" size={24} color={getColor(2)} />
        </TouchableOpacity>
      </Link>
      <Link href="../perfil" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="users" size={24} color={getColor(3)} />
        </TouchableOpacity>
      </Link>
    </View>
  );
}