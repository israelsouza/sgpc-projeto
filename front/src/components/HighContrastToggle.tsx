import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { colors as staticColors } from '@/theme/colors';

function AnimatedSwitch({ value }: { value: boolean }) {
  const anim = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 18] });
  const bgColor = anim.interpolate({ inputRange: [0, 1], outputRange: ["#CCCCCC", "#FFD700"] });

  return (
    <Animated.View
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        backgroundColor: bgColor,
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: "#FFFFFF",
          transform: [{ translateX }],
        }}
      />
    </Animated.View>
  );
}

export function HighContrastToggle() {
  const { isHighContrast, toggleHighContrast } = useTheme();

  const toggleBorderColor = isHighContrast ? "#FFD700" : staticColors.earthAccent;
  const toggleTextColor = isHighContrast ? "#FFD700" : staticColors.earthAccent;

  return (
    <TouchableOpacity
      onPress={toggleHighContrast}
      activeOpacity={0.75}
      accessibilityLabel="Alternar modo de alto contraste"
      accessibilityRole="switch"
      accessibilityState={{ checked: isHighContrast }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: toggleBorderColor,
      }}
    >
      <Feather name="eye" size={13} color={toggleTextColor} />
      <Text style={{ fontSize: 12, fontWeight: "600", color: toggleTextColor }}>
        {isHighContrast ? "Contraste: ON" : "Alto contraste"}
      </Text>
      <AnimatedSwitch value={isHighContrast} />
    </TouchableOpacity>
  );
}
