import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MissionFeed from '../components/MissionFeed';
import { useTheme } from '../context/ThemeContext';

interface MissionFeedScreenProps {
  navigation: any;
  route: any;
}

const MissionFeedScreen: React.FC<MissionFeedScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const params = route.params || {};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <MissionFeed 
        {...params}
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

export default MissionFeedScreen;
