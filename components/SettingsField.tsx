import React from 'react';
import { View, Text, StyleSheet, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface SettingsFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  type?: 'slider' | 'input' | 'switch';
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export const SettingsField: React.FC<SettingsFieldProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '%',
  icon = 'settings-outline',
  type = 'slider',
  switchValue,
  onSwitchChange,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (type === 'switch' && switchValue !== undefined && onSwitchChange) {
    return (
      <View style={styles.container}>
        <View style={styles.labelContainer}>
          <Ionicons name={icon} size={20} color={colors.primary} style={styles.icon} />
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        </View>
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={switchValue ? '#ffffff' : colors.surface}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Ionicons name={icon} size={20} color={colors.primary} style={styles.icon} />
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      </View>
      {type === 'slider' ? (
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={value.toString()}
            onChangeText={(text) => {
              const num = parseFloat(text) || 0;
              if (num >= min && num <= max) {
                onChange(num);
              }
            }}
            keyboardType="numeric"
            maxLength={5}
          />
          <Text style={[styles.unit, { color: colors.textSecondary }]}>{unit}</Text>
        </View>
      ) : (
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={value.toString()}
            onChangeText={(text) => {
              const num = parseFloat(text) || 0;
              if (num >= min && num <= max) {
                onChange(num);
              }
            }}
            keyboardType="numeric"
            maxLength={5}
          />
          <Text style={[styles.unit, { color: colors.textSecondary }]}>{unit}</Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 24,
    },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    icon: {
      marginRight: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      flex: 1,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      borderWidth: 2,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
    },
    unit: {
      fontSize: 14,
      marginLeft: 8,
    },
  });
