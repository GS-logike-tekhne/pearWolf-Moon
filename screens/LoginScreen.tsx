import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useAuth } from '../context/AuthContext';
import ScreenLayout, { ScreenLayoutCentered } from '../components/ScreenLayout';
import { THEME } from '../styles/theme';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  // Animated color rotation for sign in button text
  const colorAnimation = useRef(new Animated.Value(0)).current;
  const colors = ['#FF4444', '#90E31C', '#FF9500', '#007AFF', '#FF4444']; // Red, Green, Orange, Blue, Red (to loop back)

  useEffect(() => {
    const animateColors = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(colorAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(colorAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animateColors();
  }, []);

  const handleLogin = async () => {
    try {
      await login(username, password);
      // Navigation will happen automatically when user state changes
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials. Please try again.');
    }
  };

  const TestCredentialButton: React.FC<{
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
    color: string;
  }> = ({ icon, title, subtitle, onPress, color }) => (
    <TouchableOpacity style={[styles.testButton, { borderColor: color }]} onPress={onPress}>
      <View style={styles.testButtonContent}>
        <Ionicons name={icon} size={24} color={color} />
        <View style={styles.testButtonText}>
          <Text style={[styles.testButtonTitle, { color }]}>{title}</Text>
          <Text style={styles.testButtonSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenLayoutCentered>
      {/* PEAR Logo and Title */}
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🍐</Text>
        </View>
        <Text style={styles.title}>PEAR</Text>
        <Text style={styles.subtitle}>Platform for Environmental Action & Responsibility</Text>
      </View>

      {/* Login Form */}
      <View style={styles.formSection}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            {...({ autoCapitalize: "none" } as any)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            {...({ secureTextEntry: true } as any)}
          />
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Animated.Text 
            style={[
              styles.loginButtonText,
              {
                color: colorAnimation.interpolate({
                  inputRange: [0, 0.25, 0.5, 0.75, 1],
                  outputRange: colors,
                }),
              }
            ]}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Animated.Text>
        </TouchableOpacity>
      </View>

      {/* Test Credentials */}
      <View style={styles.testSection}>
        <Text style={styles.testSectionTitle}>Demo Accounts</Text>
        
        <TestCredentialButton
          icon="shield-checkmark"
          title="Admin Access"
          subtitle="admin / admin123"
          color={getRoleColor('admin')}
          onPress={() => {
            setUsername('admin');
            setPassword('admin123');
          }}
        />
        
        <TestCredentialButton
          icon="business"
          title="EcoDefender (Business)"
          subtitle="jjmoore254 / business123"
          color={getRoleColor('business')}
          onPress={() => {
            setUsername('jjmoore254');
            setPassword('business123');
          }}
        />
        
        <TestCredentialButton
          icon="leaf"
          title="Hero (Trash Hero + Impact Warrior)"
          subtitle="testuser / password123"
          color={getRoleColor('trash-hero')}
          onPress={() => {
            setUsername('testuser');
            setPassword('password123');
          }}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Protecting our planet, one cleanup at a time</Text>
      </View>
    </ScreenLayoutCentered>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fdf9',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: getRoleColor('trash-hero'),
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 280,
  },
  formSection: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: theme.background,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  testSection: {
    marginBottom: 30,
  },
  testSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  testButton: {
    // backgroundColor: theme.background,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  testButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  testButtonText: {
    marginLeft: 16,
    flex: 1,
  },
  testButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  testButtonSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default LoginScreen;