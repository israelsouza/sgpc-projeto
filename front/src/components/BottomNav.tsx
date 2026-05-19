import { View, TouchableOpacity, Platform } from "react-native";
import { FontAwesome6, Entypo, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { styles } from "@/screens/Home/home.styles";
import { colors } from "@/theme/colors";

const routesInfo = [
  { name: "home/index", icon: FontAwesome6, iconName: "house" },
  { name: "historico/index", icon: Entypo, iconName: "back-in-time" },
  { name: "avisos/index", icon: Entypo, iconName: "megaphone" },
  { name: "perfil/index", icon: Feather, iconName: "users" },
];

export default function BottomNav({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const inactiveColor = "#B8A89A";
  const activeColor = colors.earthBrown;

  // Guarda se state não estiver pronto, não renderiza nada

  if (!state || !state.routes) return null;


  const visibleRoutes = state.routes.filter((route) => {
    const options = descriptors[route.key]?.options as any;
    return options?.href !== null;
  });

  return (
    <View
      style={[
        styles.bottomNav,
        {
          paddingBottom:
            Platform.OS === "ios"
              ? Math.max(insets.bottom, 12)
              : insets.bottom + 12,
        },
      ]}
    >
      {visibleRoutes.map((route, tabIndex) => {
        // Usa o index real do state para checar qual está focado
        const realIndex = state.routes.indexOf(route);
        const isFocused = state.index === realIndex;
        const iconInfo = routesInfo[tabIndex];

        // Segurança: se não tiver ícone mapeado, não renderiza
        if (!iconInfo) return null;

        const IconComponent = iconInfo.icon as any;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={onPress}
          >
            <IconComponent
              name={iconInfo.iconName}
              size={24}
              color={isFocused ? activeColor : inactiveColor}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
