import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type Theme = 'light' | 'dark';

export interface ColorPalette {
  background: string;
  surface: string;
  primary: string;
  primaryLight: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  card: string;
  shadow: string;
  info: string;
  infoBackground: string;
}

const lightColors: ColorPalette = {
  background: '#f9fafb',
  surface: '#ffffff',
  primary: '#6366f1',
  primaryLight: '#818cf8',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  error: '#ef4444',
  success: '#10b981',
  card: '#ffffff',
  shadow: '#000000',
  info: '#1e40af',
  infoBackground: '#f0f9ff',
};

const darkColors: ColorPalette = {
  background: '#111827',
  surface: '#1f2937',
  primary: '#818cf8',
  primaryLight: '#a5b4fc',
  text: '#f9fafb',
  textSecondary: '#9ca3af',
  border: '#374151',
  error: '#f87171',
  success: '#34d399',
  card: '#1f2937',
  shadow: '#000000',
  info: '#60a5fa',
  infoBackground: '#1e3a8a',
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
  colors: ColorPalette;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>(systemTheme === 'dark' ? 'dark' : 'light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored && (stored === 'light' || stored === 'dark')) {
        setThemeState(stored as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = theme === 'dark' ? darkColors : lightColors;
  const isDark = theme === 'dark';

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};









