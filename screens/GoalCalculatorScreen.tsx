import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { GoalCalculatorUI } from '../components/GoalCalculatorUI';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const GoalCalculatorScreen: React.FC = () => {
  const navigation = useNavigation();
  const { settings } = useAppContext();
  const { t } = useLanguage();
  const { colors } = useTheme();

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t.goal.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.infoCard, { backgroundColor: colors.infoBackground }]}>
          <Ionicons name="bulb-outline" size={24} color={colors.primary} />
          <Text style={[styles.infoTitle, { color: colors.info }]}>{t.goal.infoTitle}</Text>
          <Text style={[styles.infoText, { color: colors.info }]}>{t.goal.infoText}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <GoalCalculatorUI settings={settings} />
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
    infoCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      gap: 8,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    infoText: {
      fontSize: 14,
      lineHeight: 20,
    },
    card: {
      borderRadius: 16,
      padding: 24,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
  });
