import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface InputFieldProps {
  label: string;
  value: number | null;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder = '0',
  error,
  icon = 'calculator-outline',
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Ionicons name={icon} size={20} color={colors.primary} style={styles.icon} />
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      </View>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.background, borderColor: error ? colors.error : colors.border },
          error && styles.inputContainerError,
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value !== null ? value.toString() : ''}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          maxLength={3}
        />
        <Text style={[styles.unit, { color: colors.textSecondary }]}>/ 100</Text>
      </View>
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    icon: {
      marginRight: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      borderWidth: 2,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    inputContainerError: {},
    input: {
      flex: 1,
      fontSize: 18,
      fontWeight: '600',
    },
    unit: {
      fontSize: 14,
      marginLeft: 8,
    },
    errorText: {
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
  });
