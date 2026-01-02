import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GradeSettings, GradeInput, CalculationResult, DEFAULT_SETTINGS } from '../types';

interface AppContextType {
  settings: GradeSettings;
  updateSettings: (newSettings: Partial<GradeSettings>) => Promise<void>;
  gradeInput: GradeInput;
  setGradeInput: (input: GradeInput) => void;
  calculationResult: CalculationResult | null;
  setCalculationResult: (result: CalculationResult | null) => void;
  resetCalculation: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = '@grade_calculator_settings';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GradeSettings>(DEFAULT_SETTINGS);
  const [gradeInput, setGradeInput] = useState<GradeInput>({ midterm: null, final: null });
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<GradeSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const resetCalculation = () => {
    setCalculationResult(null);
    setGradeInput({ midterm: null, final: null });
  };

  if (isLoading) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        gradeInput,
        setGradeInput,
        calculationResult,
        setCalculationResult,
        resetCalculation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

