import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "@/screens/Home/home.styles";
import { ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";
import { navigation } from "@/utils/navigation";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  initials?: string;
  icon?: ReactNode;
  showBackButton?: boolean;
}

export function Header({
  title,
  subtitle,
  initials,
  icon,
  showBackButton = false,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 16 }]}>
      <View style={styles.headerLeft}>
        {showBackButton ? (
          <TouchableOpacity onPress={() => navigation.safeBack("/home")} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.avatar}>
            {icon ? (
              icon
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
          </View>
        )}
        <View>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}
