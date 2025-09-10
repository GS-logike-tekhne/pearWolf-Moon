import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BadgeSystem from '../components/BadgeSystem';
import { useTheme } from '../context/ThemeContext';

interface BadgeSystemScreenProps {
  navigation: any;
  route: any;
}

const BadgeSystemScreen: React.FC<BadgeSystemScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { userRole } = route.params || {};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <BadgeSystem 
        userRole={userRole}
        onBack={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BadgeSystemScreen;
