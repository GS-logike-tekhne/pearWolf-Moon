import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { XPProvider } from './contexts/XPContext';
import AppNavigator from './navigation/AppNavigator';

export default function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <XPProvider>
            <StatusBar style="auto" />
            <AppNavigator />
          </XPProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
