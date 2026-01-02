import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CalculationResult } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface ReceiptSectionProps {
  result: CalculationResult;
  midterm: number;
  final: number;
  midtermWeight: number;
  finalWeight: number;
}

export const ReceiptSection: React.FC<ReceiptSectionProps> = ({
  result,
  midterm,
  final,
  midtermWeight,
  finalWeight,
}) => {
  const { t, language } = useLanguage();
  const { colors } = useTheme();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="receipt-outline" size={24} color={colors.primary} />
        <Text style={[styles.headerText, { color: colors.text }]}>{t.results.reportTitle}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.results.gradeBreakdown}
          </Text>

          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {t.results.midtermGrade}
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>{midterm.toFixed(1)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {t.results.midtermWeight}
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>{midtermWeight}%</Text>
          </View>
          <View style={[styles.calculationRow, { backgroundColor: colors.background }]}>
            <Text style={[styles.calculationText, { color: colors.text }]}>
              {midterm} × {midtermWeight}% = {result.breakdown.midtermContribution.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {t.results.finalGrade}
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>{final.toFixed(1)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {t.results.finalWeight}
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>{finalWeight}%</Text>
          </View>
          <View style={[styles.calculationRow, { backgroundColor: colors.background }]}>
            <Text style={[styles.calculationText, { color: colors.text }]}>
              {final} × {finalWeight}% = {result.breakdown.finalContribution.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={[styles.totalRow, { backgroundColor: colors.infoBackground }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              {t.results.totalSemesterGrade}
            </Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              {result.semesterGrade.toFixed(2)}
            </Text>
          </View>

          {result.letterGrade && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.row}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  {t.results.letterGrade}
                </Text>
                <Text style={[styles.value, styles.letterGrade, { color: colors.primaryLight }]}>
                  {result.letterGrade}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.results.resultAnalysis}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: result.passed
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(239, 68, 68, 0.2)',
              },
            ]}
          >
            <Ionicons
              name={result.passed ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={result.passed ? colors.success : colors.error}
            />
            <Text
              style={[
                styles.statusText,
                { color: result.passed ? colors.success : colors.error },
              ]}
            >
              {result.passed ? t.results.passed : t.results.failed}
            </Text>
          </View>

          <View style={styles.reasonsContainer}>
            {result.reasons.map((reason, index) => (
              <View key={index} style={styles.reasonItem}>
                <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.reasonText, { color: colors.text }]}>{reason}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {t.results.generated} {formatDate(result.timestamp)}
          </Text>
        </View>
      </View>
    </ScrollView>
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
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    card: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    label: {
      fontSize: 15,
    },
    value: {
      fontSize: 15,
      fontWeight: '600',
    },
    calculationRow: {
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
      marginBottom: 12,
    },
    calculationText: {
      fontSize: 14,
      fontFamily: 'monospace',
    },
    divider: {
      height: 1,
      marginVertical: 12,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      marginTop: 8,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '600',
    },
    totalValue: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    letterGrade: {
      fontSize: 24,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 16,
    },
    statusText: {
      fontSize: 14,
      fontWeight: 'bold',
      marginLeft: 6,
    },
    reasonsContainer: {
      gap: 12,
    },
    reasonItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    reasonText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
    },
    footer: {
      borderTopWidth: 1,
      paddingTop: 12,
      marginTop: 8,
    },
    footerText: {
      fontSize: 12,
      textAlign: 'center',
    },
  });
