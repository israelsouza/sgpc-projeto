import { View, TouchableOpacity, Platform } from "react-native";
import { FontAwesome6, Entypo, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { styles } from "@/screens/Home/home.styles";
import { colors } from "@/theme/colors";

export function BottomNav({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const inactiveColor = "#B8A89A";
  const activeColor = colors.earthBrown;

  // As rotas na mesma ordem em que foram declaradas no _layout.tsx das Tabs
  const routesInfo = [
    { name: "home/index", icon: FontAwesome6, iconName: "house" },
    { name: "historico/index", icon: Entypo, iconName: "back-in-time" },
    { name: "avisos/index", icon: Entypo, iconName: "megaphone" },
    { name: "perfil/index", icon: Feather, iconName: "users" },
  ];

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
        const isFocused = state.index === index;
        const iconInfo = routesInfo[index];
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