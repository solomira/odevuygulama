import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ResultCard } from '../components/ResultCard';
import { ReceiptSection } from '../components/ReceiptSection';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const ResultsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { calculationResult, gradeInput, settings, resetCalculation } = useAppContext();
  const { t } = useLanguage();
  const { colors } = useTheme();

  if (!calculationResult || gradeInput.midterm === null || gradeInput.final === null) {
    const styles = createStyles(colors);
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{t.results.noResult}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('GradeInput' as never)}
        >
          <Text style={styles.buttonText}>{t.results.goToCalculator}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t.results.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ResultCard
          title={t.results.semesterGrade}
          value={calculationResult.semesterGrade.toFixed(2)}
          subtitle={calculationResult.letterGrade || undefined}
          icon={calculationResult.passed ? 'checkmark-circle' : 'close-circle'}
          gradientColors={
            calculationResult.passed ? ['#10b981', '#059669'] : ['#ef4444', '#dc2626']
          }
        />

        <ReceiptSection
          result={calculationResult}
          midterm={gradeInput.midterm}
          final={gradeInput.final}
          midtermWeight={settings.midtermWeight}
          finalWeight={settings.finalWeight}
        />

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              resetCalculation();
              navigation.navigate('GradeInput' as never);
            }}
          >
            <Ionicons name="refresh-outline" size={20} color="#ffffff" />
            <Text style={styles.actionButtonTextPrimary}>{t.results.calculateAgain}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.secondaryActionButton,
              { backgroundColor: colors.card, borderColor: colors.primary },
            ]}
            onPress={() => navigation.navigate('GoalCalculator' as never)}
          >
            <Ionicons name="target-outline" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              {t.results.goalCalculator}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 16,
      borderBottomWidth: 1,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    placeholder: {
      width: 40,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignSelf: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
      marginBottom: 20,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 12,
      gap: 8,
    },
    secondaryActionButton: {
      borderWidth: 2,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    actionButtonTextPrimary: {
      fontSize: 14,
      fontWeight: '600',
      color: '#ffffff',
    },
  });
