import { View, TouchableOpacity, Platform } from "react-native";
import { FontAwesome6, Entypo, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { styles } from "@/screens/Home/home.styles";
import { colors } from "@/theme/colors";

export default function BottomNav({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const inactiveColor = "#B8A89A";
  const activeColor = colors.earthBrown;

  // Dicionário de ícones por nome de rota
  const routesConfig: Record<string, { icon: any; iconName: string }> = {
    "home/index": { icon: FontAwesome6, iconName: "house" },
    "historico/index": { icon: Entypo, iconName: "back-in-time" },
    "avisos": { icon: Entypo, iconName: "megaphone" },
    "perfil/index": { icon: Feather, iconName: "users" },
  };

  return (
    <View 
      style={[
        styles.bottomNav, 
        { 
          paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 12) : insets.bottom + 12 
        }
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        // Se a rota foi marcada com href: null no _layout, não a exibimos no menu
        // @ts-ignore
        if (options.href === null) return null;

        const isFocused = state.index === index;
        const iconInfo = routesConfig[route.name];
        
        // Se a rota não tem ícone configurado no nosso dicionário, pulamos
        if (!iconInfo) return null;

        const IconComponent = iconInfo.icon as any;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
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
