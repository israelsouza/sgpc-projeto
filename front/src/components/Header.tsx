import { View, Text } from "react-native";
import { styles } from "@/screens/Home/home.styles";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  initials?: string;
}

export function Header({
  title = "Itaim Bibi",
  subtitle = "Unidade 056",
  initials = "IB",
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}