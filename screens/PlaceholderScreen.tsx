import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';

interface PlaceholderScreenProps {
  navigation: any;
  route: any;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const screenName = route.name || 'Screen';

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textColor }]}>{screenName}</Text>
      </View>
      
      <View style={styles.content}>
        <Ionicons name="construct-outline" size={64} color={theme.secondaryText} />
        <Text style={[styles.message, { color: theme.textColor }]}>
          {screenName} is coming soon!
        </Text>
        <Text style={[styles.submessage, { color: theme.secondaryText }]}>
          This feature is under development and will be available in a future update.
        </Text>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.SPACING.md,
    paddingTop: THEME.SPACING.sm,
  },
  backButton: {
    marginRight: THEME.SPACING.md,
  },
  title: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.SPACING.xl,
  },
  message: {
    fontSize: THEME.TYPOGRAPHY.fontSize["2xl"],
    fontWeight: '600',
    marginTop: THEME.SPACING.md,
    marginBottom: THEME.SPACING.sm,
    textAlign: 'center',
  },
  submessage: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default PlaceholderScreen;
