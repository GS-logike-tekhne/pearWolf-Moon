import React from 'react';
import { View, StyleSheet } from 'react-native';
import MissionFeed from '../components/MissionFeed';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';

interface MissionFeedScreenProps {
  navigation: any;
  route: any;
}

const MissionFeedScreen: React.FC<MissionFeedScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const params = route.params || {};

  return (
    <ScreenLayout>
      <MissionFeed 
        {...params}
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

export default MissionFeedScreen;
