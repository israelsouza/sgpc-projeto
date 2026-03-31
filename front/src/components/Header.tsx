import { View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { styles } from "@/screens/Home/home.styles";
import { colors } from "@/theme/colors";
import { ReactNode } from "react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  initials?: string;
  /** Se fornecido, substitui as iniciais pelo ícone */
  icon?: ReactNode;
}

export function Header({
  title = "Itaim Bibi",
  subtitle = "Unidade 056",
  initials = "IB",
  icon,
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.avatar}>
          {icon ? (
            icon
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
        </View>
        <View>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.headerCurve} />
    </View>
  );
}