import React from 'react';
import { View, StyleSheet } from 'react-native';
import BadgeSystem from '../components/BadgeSystem';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';

interface BadgeSystemScreenProps {
  navigation: any;
  route: any;
}

const BadgeSystemScreen: React.FC<BadgeSystemScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { userRole } = route.params || {};

  return (
    <ScreenLayout>
      <BadgeSystem 
        userRole={userRole}
        onBack={() => navigation.goBack()}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BadgeSystemScreen;
