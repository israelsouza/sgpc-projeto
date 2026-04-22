import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "@/screens/Home/home.styles";
import { ReactNode } from "react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  initials?: string;
  /** Se fornecido, substitui as iniciais pelo ícone */
  icon?: ReactNode;
}

export function Header({
  title,
  subtitle,
  initials,
  icon,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 16 }]}>
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