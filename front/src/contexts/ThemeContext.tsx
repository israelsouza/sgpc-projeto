import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  primary: string;
  card: string;
  border: string;
}

const lightColors: ThemeColors = {
  background: '#F4F1EC',
  surface: '#FFFFFF',
  text: '#2E2E2E',
  textMuted: '#96999E',
  primary: '#AA7452',
  card: '#FFFFFF',
  border: '#D4C9C7',
};

const darkColors: ThemeColors = {
  background: '#051822',
  surface: '#2D383E',
  text: '#FFFFFF',
  textMuted: '#96999E',
  primary: '#AA7452',
  card: '#2D383E',
  border: '#545757',
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme ?? 'light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

/* 

exemplo de uso:

import { useTheme } from '@/contexts/ThemeContext'; 
const { toggleTheme } = useTheme();


<TouchableOpacity
  onPress={toggleTheme}
>
  <Text>{isDark ? "☀️" : "🌙"}</Text>
</TouchableOpacity>


*/