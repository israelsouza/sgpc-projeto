import { View, TouchableOpacity, Text } from "react-native";
import { FontAwesome6, Entypo, Feather } from "@expo/vector-icons";
import { styles } from "@/screens/Home/home.styles";

// Rodapé inferior do aplicativo

interface NavItem {
  icon: React.ReactNode;
  active: boolean;
}

interface BottomNavProps {
  activeIndex?: number;
}

export function BottomNav({ activeIndex = 0 }: BottomNavProps) {
  const navItems: NavItem[] = [
    {
      icon: <FontAwesome6 name="house" size={24} color="black" />,
      active: activeIndex === 0,
    },
    {
      icon: <Entypo name="back-in-time" size={24} color="black" />,
      active: activeIndex === 1,
    },
    {
      icon: <Entypo name="megaphone" size={24} color="black" />,
      active: activeIndex === 2,
    },
    {
      icon: <Feather name="users" size={24} color="black" />,
      active: activeIndex === 3,
    },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item, index) => (
        <TouchableOpacity key={index} style={styles.navItem}>
          <Text style={item.active ? styles.navIconActive : styles.navIcon}>
            {item.icon}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}