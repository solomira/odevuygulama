import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from './InputField';
import { GoalInput, GoalResult, GradeSettings } from '../types';
import { calculateGoal } from '../helpers/calculations';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface GoalCalculatorUIProps {
  settings: GradeSettings;
}

export const GoalCalculatorUI: React.FC<GoalCalculatorUIProps> = ({ settings }) => {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [goalInput, setGoalInput] = useState<GoalInput>({
    midterm: null,
    final: null,
    targetType: 'pass',
    targetValue: null,
  });
  const [result, setResult] = useState<GoalResult | null>(null);

  const handleCalculate = () => {
    if (!goalInput.midterm) {
      Alert.alert(t.goal.missingMidterm, t.goal.missingMidtermMessage);
      return;
    }

    if (goalInput.targetType === 'score' && !goalInput.targetValue) {
      Alert.alert(t.goal.missingScore, t.goal.missingScoreMessage);
      return;
    }

    if (goalInput.targetType === 'letter' && !goalInput.targetValue) {
      Alert.alert(t.goal.missingLetter, t.goal.missingLetterMessage);
      return;
    }

    const calculated = calculateGoal(goalInput, settings, t);
    setResult(calculated);
  };

  const getLetterGrades = () => {
    return settings.letterGradeRanges
      .filter((r) => r.passing)
      .map((r) => r.letter)
      .reverse();
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <InputField
        label={t.goal.midtermLabel}
        value={goalInput.midterm}
        onChangeText={(text) => {
          const num = parseFloat(text);
          setGoalInput({ ...goalInput, midterm: isNaN(num) ? null : num });
        }}
        placeholder={t.goal.midtermPlaceholder}
        icon="school-outline"
      />

      <InputField
        label={t.goal.finalLabel}
        value={goalInput.final}
        onChangeText={(text) => {
          const num = parseFloat(text);
          setGoalInput({ ...goalInput, final: isNaN(num) ? null : num });
        }}
        placeholder={t.goal.finalPlaceholder}
        icon="document-text-outline"
      />

      <View style={styles.targetSection}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>{t.goal.targetGoal}</Text>
        <View style={styles.targetButtons}>
          <TouchableOpacity
            style={[
              styles.targetButton,
              { borderColor: colors.primary },
              goalInput.targetType === 'pass' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setGoalInput({ ...goalInput, targetType: 'pass', targetValue: null })}
          >
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={goalInput.targetType === 'pass' ? '#ffffff' : colors.primary}
            />
            <Text
              style={[
                styles.targetButtonText,
                {
                  color: goalInput.targetType === 'pass' ? '#ffffff' : colors.primary,
                },
              ]}
            >
              {t.goal.pass}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.targetButton,
              { borderColor: colors.primary },
              goalInput.targetType === 'score' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setGoalInput({ ...goalInput, targetType: 'score', targetValue: null })}
          >
            <Ionicons
              name="trophy"
              size={20}
              color={goalInput.targetType === 'score' ? '#ffffff' : colors.primary}
            />
            <Text
              style={[
                styles.targetButtonText,
                {
                  color: goalInput.targetType === 'score' ? '#ffffff' : colors.primary,
                },
              ]}
            >
              {t.goal.score}
            </Text>
          </TouchableOpacity>

          {settings.letterGradesEnabled && (
            <TouchableOpacity
              style={[
                styles.targetButton,
                { borderColor: colors.primary },
                goalInput.targetType === 'letter' && { backgroundColor: colors.primary },
              ]}
              onPress={() =>
                setGoalInput({ ...goalInput, targetType: 'letter', targetValue: null })
              }
            >
              <Ionicons
                name="star"
                size={20}
                color={goalInput.targetType === 'letter' ? '#ffffff' : colors.primary}
              />
              <Text
                style={[
                  styles.targetButtonText,
                  {
                    color: goalInput.targetType === 'letter' ? '#ffffff' : colors.primary,
                  },
                ]}
              >
                {t.goal.letter}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {goalInput.targetType === 'score' && (
          <InputField
            label={t.goal.targetScore}
            value={
              goalInput.targetValue && typeof goalInput.targetValue === 'number'
                ? goalInput.targetValue
                : null
            }
            onChangeText={(text) => {
              const num = parseFloat(text);
              setGoalInput({
                ...goalInput,
                targetValue: isNaN(num) ? null : num,
              });
            }}
            placeholder={t.goal.targetScorePlaceholder}
            icon="target-outline"
          />
        )}

        {goalInput.targetType === 'letter' && settings.letterGradesEnabled && (
          <View style={styles.letterGrid}>
            {getLetterGrades().map((letter) => (
              <TouchableOpacity
                key={letter}
                style={[
                  styles.letterButton,
                  { borderColor: colors.primary },
                  goalInput.targetValue === letter && { backgroundColor: colors.primary },
                ]}
                onPress={() => setGoalInput({ ...goalInput, targetValue: letter })}
              >
                <Text
                  style={[
                    styles.letterButtonText,
                    {
                      color:
                        goalInput.targetValue === letter ? '#ffffff' : colors.primary,
                    },
                  ]}
                >
                  {letter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.calculateButton, { backgroundColor: colors.primary }]}
        onPress={handleCalculate}
      >
        <Ionicons name="calculator" size={24} color="#ffffff" />
        <Text style={styles.calculateButtonText}>{t.goal.calculateButton}</Text>
      </TouchableOpacity>

      {result && (
        <View
          style={[
            styles.resultCard,
            {
              backgroundColor: result.possible
                ? 'rgba(16, 185, 129, 0.2)'
                : 'rgba(239, 68, 68, 0.2)',
            },
          ]}
        >
          <Ionicons
            name={result.possible ? 'checkmark-circle' : 'close-circle'}
            size={32}
            color={result.possible ? colors.success : colors.error}
          />
          {result.possible && result.requiredFinal !== null && (
            <Text style={[styles.resultValue, { color: colors.success }]}>
              {result.requiredFinal.toFixed(1)}
            </Text>
          )}
          <Text style={[styles.resultMessage, { color: colors.text }]}>{result.message}</Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    targetSection: {
      marginBottom: 24,
    },
    sectionLabel: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
    },
    targetButtons: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    targetButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 2,
      backgroundColor: 'transparent',
      gap: 6,
    },
    targetButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    letterGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 12,
    },
    letterButton: {
      width: 60,
      height: 60,
      borderRadius: 12,
      borderWidth: 2,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    letterButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    calculateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 12,
      gap: 8,
      marginBottom: 24,
    },
    calculateButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    resultCard: {
      padding: 20,
      borderRadius: 16,
      alignItems: 'center',
      gap: 12,
    },
    resultValue: {
      fontSize: 48,
      fontWeight: 'bold',
    },
    resultMessage: {
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
    },
  });
