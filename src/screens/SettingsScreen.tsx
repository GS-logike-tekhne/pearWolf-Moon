import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { Text, Card } from '../components/ui';

const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Card style={styles.placeholderCard}>
          <Text variant="h2" align="center" color="primary">
            ⚙️ Settings
          </Text>
          <Text variant="body" align="center" color="textSecondary" style={styles.placeholderText}>
            App settings and preferences will be implemented here.
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  placeholderCard: {
    paddingVertical: 40,
  },
  placeholderText: {
    marginTop: 16,
    lineHeight: 22,
  },
});

export default SettingsScreen;
