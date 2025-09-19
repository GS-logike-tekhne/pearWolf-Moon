import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ParkRestorationLab from '../components/ParkRestorationLab';
import { useTheme } from '../context/ThemeContext';

const ParkRestorationLabScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'white' }]}>
      <ParkRestorationLab />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ParkRestorationLabScreen;
