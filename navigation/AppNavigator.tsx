import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { GradeInputScreen } from '../screens/GradeInputScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { GoalCalculatorScreen } from '../screens/GoalCalculatorScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="GradeInput" component={GradeInputScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="GoalCalculator" component={GoalCalculatorScreen} />
    </Stack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { t } = useLanguage();
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === t.navigation.calculator) {
              iconName = focused ? 'calculator' : 'calculator-outline';
            } else if (route.name === t.navigation.goal) {
              iconName = focused ? 'target' : 'target-outline';
            } else if (route.name === t.navigation.settings) {
              iconName = focused ? 'settings' : 'settings-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen name={t.navigation.calculator} component={MainStack} />
        <Tab.Screen name={t.navigation.goal} component={GoalCalculatorScreen} />
        <Tab.Screen name={t.navigation.settings} component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
