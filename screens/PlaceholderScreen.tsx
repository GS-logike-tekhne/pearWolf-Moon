import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface PlaceholderScreenProps {
  navigation: any;
  route: any;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const screenName = route.name || 'Screen';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  message: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  submessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default PlaceholderScreen;
