// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// ── Storage helper: SecureStore no device, localStorage na web ──
const storage = {
  get: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  set: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
};

type Theme = 'light' | 'dark' | 'highContrast';

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  primary: string;
  card: string;
  border: string;
  // ── extras usados no Home ──
  cardBorder: string;
  iconBgOverride: string;
  iconColorOverride: string;
  welcomeBg: string;
}

const lightColors: ThemeColors = {
  background: '#F4F1EC',
  surface: '#FFFFFF',
  text: '#2E2E2E',
  textMuted: '#96999E',
  primary: '#AA7452',
  card: '#FFFFFF',
  border: '#D4C9C7',
  cardBorder: '#AA7452',
  iconBgOverride: '',      // vazio = usa cor original do item
  iconColorOverride: '',   // vazio = usa cor original do item
  welcomeBg: '#FFFFFF',
};

const darkColors: ThemeColors = {
  background: '#051822',
  surface: '#2D383E',
  text: '#FFFFFF',
  textMuted: '#96999E',
  primary: '#AA7452',
  card: '#2D383E',
  border: '#545757',
  cardBorder: '#545757',
  iconBgOverride: '',
  iconColorOverride: '',
  welcomeBg: '#2D383E',
};

// ── Alto contraste: preto + amarelo, WCAG AAA ──
const highContrastColors: ThemeColors = {
  background: '#000000',
  surface: '#1A1A1A',
  text: '#FFFFFF',
  textMuted: '#FFD700',
  primary: '#FFD700',
  card: '#1A1A1A',
  border: '#FFFFFF',
  cardBorder: '#FFFFFF',
  iconBgOverride: '#2A2A00',
  iconColorOverride: '#FFD700',
  welcomeBg: '#1A1A1A',
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  isHighContrast: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const HC_KEY = 'accessibility_high_contrast';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme ?? 'light');

  // Carrega preferência de alto contraste ao iniciar (persiste entre sessões)
  useEffect(() => {
    storage.get(HC_KEY).then((val) => {
      if (val === 'true') setTheme('highContrast');
    });
  }, []);

  const toggleTheme = () => {
    // Não alterna light/dark se estiver em alto contraste
    setTheme(prev => {
      if (prev === 'highContrast') return 'highContrast';
      return prev === 'light' ? 'dark' : 'light';
    });
  };

  const toggleHighContrast = async () => {
    const turningOn = theme !== 'highContrast';
    const nextTheme: Theme = turningOn
      ? 'highContrast'
      : (systemColorScheme ?? 'light');   // volta para o tema do sistema
    setTheme(nextTheme);
    await storage.set(HC_KEY, String(turningOn));
  };

  const colors =
    theme === 'highContrast'
      ? highContrastColors
      : theme === 'dark'
      ? darkColors
      : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        isHighContrast: theme === 'highContrast',
        colors,
        toggleTheme,
        toggleHighContrast,
      }}
    >
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

Exemplos de uso:

import { useTheme } from '@/contexts/ThemeContext';
const { toggleTheme, toggleHighContrast, isHighContrast, isDark, colors } = useTheme();

// Botão light/dark (igual ao que já existia):
<TouchableOpacity onPress={toggleTheme}>
  <Text>{isDark ? "☀️" : "🌙"}</Text>
</TouchableOpacity>

// Botão alto contraste (novo):
<TouchableOpacity onPress={toggleHighContrast}>
  <Text>{isHighContrast ? "Contraste: ON" : "Alto contraste"}</Text>
</TouchableOpacity>

*/