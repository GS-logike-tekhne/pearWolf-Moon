import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Text, Card } from '../components/ui';

const LoginScreen: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {
      await login({ username: username.trim(), password });
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleDemoLogin = (demoUser: string, demoPass: string) => {
    setUsername(demoUser);
    setPassword(demoPass);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text variant="h1" color="primary" align="center">
              🌱 PEAR
            </Text>
            <Text variant="h3" align="center" style={styles.subtitle}>
              Eco Cleaning Platform
            </Text>
            <Text variant="body" color="textSecondary" align="center" style={styles.description}>
              Join the movement to clean our planet, one mission at a time
            </Text>
          </View>

          <Card style={styles.loginCard}>
            <Text variant="h2" style={styles.loginTitle}>
              Welcome Back
            </Text>
            
            <View style={styles.inputContainer}>
              <Text variant="label" style={styles.inputLabel}>
                Username
              </Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                }]}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text variant="label" style={styles.inputLabel}>
                Password
              </Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.loginButton}
            />
          </Card>

          <Card style={styles.demoCard}>
            <Text variant="h3" style={styles.demoTitle}>
              Demo Accounts
            </Text>
            <Text variant="caption" color="textSecondary" style={styles.demoDescription}>
              Try these demo accounts to explore different roles
            </Text>
            
            <View style={styles.demoButtons}>
              <Button
                title="Admin"
                variant="outline"
                size="small"
                onPress={() => handleDemoLogin('admin', 'admin123')}
                style={styles.demoButton}
              />
              <Button
                title="Trash Hero"
                variant="outline"
                size="small"
                onPress={() => handleDemoLogin('testuser', 'password123')}
                style={styles.demoButton}
              />
              <Button
                title="Impact Warrior"
                variant="outline"
                size="small"
                onPress={() => handleDemoLogin('volunteer', 'volunteer123')}
                style={styles.demoButton}
              />
              <Button
                title="Eco Defender"
                variant="outline"
                size="small"
                onPress={() => handleDemoLogin('jjmoore254', 'business123')}
                style={styles.demoButton}
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  description: {
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  loginCard: {
    marginBottom: 20,
  },
  loginTitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  demoCard: {
    marginTop: 20,
  },
  demoTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  demoDescription: {
    marginBottom: 16,
    textAlign: 'center',
  },
  demoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  demoButton: {
    width: '48%',
    marginBottom: 8,
  },
});

export default LoginScreen;
