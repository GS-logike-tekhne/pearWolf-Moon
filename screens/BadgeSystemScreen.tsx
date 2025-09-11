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

  return (
    <ScreenLayout>
      <BadgeSystem 
        navigation={navigation}
        route={route}
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
