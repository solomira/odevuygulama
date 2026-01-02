import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SettingsField } from '../components/SettingsField';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { DEFAULT_SETTINGS } from '../types';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { settings, updateSettings } = useAppContext();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, colors } = useTheme();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = async () => {
    if (localSettings.midtermWeight + localSettings.finalWeight !== 100) {
      Alert.alert(
        t.settings.invalidWeights,
        t.settings.invalidWeightsMessage,
        [{ text: t.settings.success }]
      );
      return;
    }

    await updateSettings(localSettings);
    Alert.alert(t.settings.success, t.settings.saveSuccess, [
      { text: t.settings.success, onPress: () => navigation.goBack() },
    ]);
  };

  const handleReset = () => {
    Alert.alert(
      t.settings.resetTitle,
      t.settings.resetMessage,
      [
        { text: t.settings.cancel, style: 'cancel' },
        {
          text: t.settings.reset,
          style: 'destructive',
          onPress: () => {
            setLocalSettings(DEFAULT_SETTINGS);
            updateSettings(DEFAULT_SETTINGS);
            Alert.alert(t.settings.success, t.settings.resetSuccess);
          },
        },
      ]
    );
  };

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t.settings.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.settings.theme}</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            {t.settings.themeDescription}
          </Text>
          <View style={styles.themeButtons}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.primary },
                theme === 'light' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setTheme('light')}
            >
              <Ionicons
                name="sunny"
                size={20}
                color={theme === 'light' ? '#ffffff' : colors.primary}
              />
              <Text
                style={[
                  styles.themeButtonText,
                  { color: theme === 'light' ? '#ffffff' : colors.primary },
                ]}
              >
                {t.settings.light}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.primary },
                theme === 'dark' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setTheme('dark')}
            >
              <Ionicons
                name="moon"
                size={20}
                color={theme === 'dark' ? '#ffffff' : colors.primary}
              />
              <Text
                style={[
                  styles.themeButtonText,
                  { color: theme === 'dark' ? '#ffffff' : colors.primary },
                ]}
              >
                {t.settings.dark}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.settings.language}</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            {t.settings.languageDescription}
          </Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                { borderColor: colors.primary },
                language === 'tr' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setLanguage('tr')}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  { color: language === 'tr' ? '#ffffff' : colors.primary },
                ]}
              >
                {t.settings.turkish}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                { borderColor: colors.primary },
                language === 'en' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setLanguage('en')}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  { color: language === 'en' ? '#ffffff' : colors.primary },
                ]}
              >
                {t.settings.english}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.settings.gradeWeights}</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            {t.settings.gradeWeightsDescription}
          </Text>

          <SettingsField
            label={t.settings.midtermWeight}
            value={localSettings.midtermWeight}
            onChange={(value) => {
              const newMidterm = value;
              const newFinal = 100 - newMidterm;
              setLocalSettings({
                ...localSettings,
                midtermWeight: newMidterm,
                finalWeight: newFinal,
              });
            }}
            min={0}
            max={100}
            step={1}
            unit="%"
            icon="scale-outline"
            type="slider"
          />

          <SettingsField
            label={t.settings.finalWeight}
            value={localSettings.finalWeight}
            onChange={(value) => {
              const newFinal = value;
              const newMidterm = 100 - newFinal;
              setLocalSettings({
                ...localSettings,
                midtermWeight: newMidterm,
                finalWeight: newFinal,
              });
            }}
            min={0}
            max={100}
            step={1}
            unit="%"
            icon="scale-outline"
            type="slider"
          />

          <View style={[styles.sumBox, { backgroundColor: colors.infoBackground }]}>
            <Text style={[styles.sumText, { color: colors.info }]}>
              {t.settings.total} {localSettings.midtermWeight + localSettings.finalWeight}%
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.settings.passingCriteria}
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            {t.settings.passingCriteriaDescription}
          </Text>

          <SettingsField
            label={t.settings.minimumSemesterGrade}
            value={localSettings.minimumSemesterGrade}
            onChange={(value) =>
              setLocalSettings({ ...localSettings, minimumSemesterGrade: value })
            }
            min={0}
            max={100}
            step={1}
            unit=""
            icon="trophy-outline"
            type="slider"
          />

          <SettingsField
            label={t.settings.minimumFinalGrade}
            value={localSettings.minimumFinalGrade}
            onChange={(value) =>
              setLocalSettings({ ...localSettings, minimumFinalGrade: value })
            }
            min={0}
            max={100}
            step={1}
            unit=""
            icon="document-text-outline"
            type="slider"
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.settings.letterGrades}</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            {t.settings.letterGradesDescription}
          </Text>

          <SettingsField
            label={t.settings.enableLetterGrades}
            value={0}
            onChange={() => {}}
            icon="star-outline"
            type="switch"
            switchValue={localSettings.letterGradesEnabled}
            onSwitchChange={(value) =>
              setLocalSettings({ ...localSettings, letterGradesEnabled: value })
            }
          />

          {localSettings.letterGradesEnabled && (
            <View style={styles.letterGradesContainer}>
              <Text style={[styles.letterGradesTitle, { color: colors.text }]}>
                {t.settings.letterGradeRanges}
              </Text>
              <Text style={[styles.letterGradesDescription, { color: colors.textSecondary }]}>
                {t.settings.letterGradeRangesDescription}
              </Text>
              {localSettings.letterGradeRanges.map((range, index) => (
                <View key={range.letter} style={[styles.letterGradeCard, { backgroundColor: colors.background }]}>
                  <View style={styles.letterGradeHeader}>
                    <Text style={[styles.letterGradeLabel, { color: colors.text }]}>
                      {range.letter}
                    </Text>
                    <Switch
                      value={range.passing}
                      onValueChange={(value) => {
                        const updatedRanges = [...localSettings.letterGradeRanges];
                        updatedRanges[index] = { ...range, passing: value };
                        setLocalSettings({ ...localSettings, letterGradeRanges: updatedRanges });
                      }}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor={range.passing ? '#ffffff' : colors.surface}
                    />
                  </View>
                  <View style={styles.letterGradeInputs}>
                    <View style={styles.letterGradeInputGroup}>
                      <Text style={[styles.letterGradeInputLabel, { color: colors.textSecondary }]}>
                        {t.settings.minimum}
                      </Text>
                      <View
                        style={[
                          styles.letterGradeInput,
                          { backgroundColor: colors.card, borderColor: colors.border },
                        ]}
                      >
                        <TextInput
                          style={[styles.letterGradeInputText, { color: colors.text }]}
                          value={range.min.toString()}
                          onChangeText={(text) => {
                            const num = parseFloat(text) || 0;
                            if (num >= 0 && num <= 100 && num <= range.max) {
                              const updatedRanges = [...localSettings.letterGradeRanges];
                              updatedRanges[index] = { ...range, min: num };
                              setLocalSettings({ ...localSettings, letterGradeRanges: updatedRanges });
                            }
                          }}
                          keyboardType="numeric"
                          maxLength={3}
                        />
                      </View>
                    </View>
                    <View style={styles.letterGradeInputGroup}>
                      <Text style={[styles.letterGradeInputLabel, { color: colors.textSecondary }]}>
                        {t.settings.maximum}
                      </Text>
                      <View
                        style={[
                          styles.letterGradeInput,
                          { backgroundColor: colors.card, borderColor: colors.border },
                        ]}
                      >
                        <TextInput
                          style={[styles.letterGradeInputText, { color: colors.text }]}
                          value={range.max.toString()}
                          onChangeText={(text) => {
                            const num = parseFloat(text) || 0;
                            if (num >= 0 && num <= 100 && num >= range.min) {
                              const updatedRanges = [...localSettings.letterGradeRanges];
                              updatedRanges[index] = { ...range, max: num };
                              setLocalSettings({ ...localSettings, letterGradeRanges: updatedRanges });
                            }
                          }}
                          keyboardType="numeric"
                          maxLength={3}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
            <Text style={styles.saveButtonText}>{t.settings.saveSettings}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
            onPress={handleReset}
          >
            <Ionicons name="refresh-outline" size={20} color={colors.primary} />
            <Text style={[styles.resetButtonText, { color: colors.primary }]}>
              {t.settings.resetToDefault}
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
    section: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 14,
      marginBottom: 20,
      lineHeight: 20,
    },
    themeButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    themeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 2,
      gap: 8,
    },
    themeButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    languageButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    languageButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: 'center',
    },
    languageButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    sumBox: {
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    sumText: {
      fontSize: 16,
      fontWeight: '600',
    },
    actions: {
      gap: 12,
      marginBottom: 20,
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 12,
      gap: 8,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    resetButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 2,
      gap: 8,
    },
    resetButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    letterGradesContainer: {
      marginTop: 20,
      gap: 12,
    },
    letterGradesTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    letterGradesDescription: {
      fontSize: 14,
      marginBottom: 12,
      lineHeight: 20,
    },
    letterGradeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: colors.background,
      marginBottom: 8,
    },
    letterGradeInfo: {
      flex: 1,
    },
    letterGradeLabel: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    letterGradeRange: {
      fontSize: 12,
    },
    letterGradeCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    letterGradeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    letterGradeInputs: {
      flexDirection: 'row',
      gap: 12,
    },
    letterGradeInputGroup: {
      flex: 1,
    },
    letterGradeInputLabel: {
      fontSize: 12,
      marginBottom: 6,
    },
    letterGradeInput: {
      borderRadius: 8,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    letterGradeInputText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });
