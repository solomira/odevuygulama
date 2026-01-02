import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from '../components/InputField';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { performCalculation, validateGrade } from '../helpers/calculations';

export const GradeInputScreen: React.FC = () => {
  const navigation = useNavigation();
  const { gradeInput, setGradeInput, setCalculationResult, settings } = useAppContext();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [errors, setErrors] = useState<{ midterm?: string; final?: string }>({});

  const handleMidtermChange = (text: string) => {
    const num = text === '' ? null : parseFloat(text);
    if (text === '' || (num !== null && !isNaN(num))) {
      setGradeInput({ ...gradeInput, midterm: num });
      if (errors.midterm) {
        setErrors({ ...errors, midterm: undefined });
      }
    }
  };

  const handleFinalChange = (text: string) => {
    const num = text === '' ? null : parseFloat(text);
    if (text === '' || (num !== null && !isNaN(num))) {
      setGradeInput({ ...gradeInput, final: num });
      if (errors.final) {
        setErrors({ ...errors, final: undefined });
      }
    }
  };

  const handleCalculate = () => {
    const newErrors: { midterm?: string; final?: string } = {};

    if (gradeInput.midterm === null || gradeInput.midterm === undefined) {
      newErrors.midterm = t.calculator.midtermError;
    } else if (!validateGrade(gradeInput.midterm)) {
      newErrors.midterm = t.calculator.gradeRangeError;
    }

    if (gradeInput.final === null || gradeInput.final === undefined) {
      newErrors.final = t.calculator.finalError;
    } else if (!validateGrade(gradeInput.final)) {
      newErrors.final = t.calculator.gradeRangeError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert(t.calculator.validationError, t.calculator.validationMessage);
      return;
    }

    const result = performCalculation(gradeInput, settings, t);
    if (result) {
      setCalculationResult(result);
      navigation.navigate('Results' as never);
    } else {
      Alert.alert(t.calculator.calculationError, t.calculator.calculationErrorMessage);
    }
  };

  const styles = createStyles(colors);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="calculator-outline" size={48} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>{t.calculator.title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t.calculator.subtitle}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <InputField
            label={t.calculator.midtermLabel}
            value={gradeInput.midterm}
            onChangeText={handleMidtermChange}
            placeholder={t.calculator.midtermPlaceholder}
            error={errors.midterm}
            icon="school-outline"
          />

          <InputField
            label={t.calculator.finalLabel}
            value={gradeInput.final}
            onChangeText={handleFinalChange}
            placeholder={t.calculator.finalPlaceholder}
            error={errors.final}
            icon="document-text-outline"
          />

          <View style={[styles.infoBox, { backgroundColor: colors.infoBackground }]}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.info }]}>
              {t.calculator.currentWeights
                .replace('{midterm}', settings.midtermWeight.toString())
                .replace('{final}', settings.finalWeight.toString())}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.calculateButton, { backgroundColor: colors.primary }]}
            onPress={handleCalculate}
          >
            <Ionicons name="calculator" size={24} color="#ffffff" />
            <Text style={styles.calculateButtonText}>{t.calculator.calculateButton}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
          onPress={() => navigation.navigate('GoalCalculator' as never)}
        >
          <Ionicons name="flag-outline" size={20} color={colors.primary} />
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
            {t.calculator.goalCalculator}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingTop: 40,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 16,
    },
    subtitle: {
      fontSize: 16,
      marginTop: 8,
      textAlign: 'center',
    },
    card: {
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    infoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      marginBottom: 20,
      gap: 8,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
    },
    calculateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 12,
      gap: 8,
      elevation: 2,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    calculateButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    secondaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 2,
      gap: 8,
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });
