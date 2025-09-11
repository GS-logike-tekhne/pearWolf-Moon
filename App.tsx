import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { ThemeProvider } from './context/ThemeContext';
import { XPProvider } from './context/XPContext';
import { MissionProvider } from './context/MissionContext';
import { NotificationsProvider } from './context/NotificationsContext';

// Import navigation
import AppNavigator from './navigation/AppNavigator';

// Import components
import ErrorBoundary from './components/ErrorBoundary';
import OfflineIndicator from './components/OfflineIndicator';

export default function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LocationProvider>
          <XPProvider>
            <MissionProvider>
              <NotificationsProvider>
                <ThemeProvider>
                  <ErrorBoundary>
                    <OfflineIndicator />
                    <NavigationContainer>
                      <StatusBar style="auto" />
                      <AppNavigator />
                    </NavigationContainer>
                  </ErrorBoundary>
                </ThemeProvider>
              </NotificationsProvider>
            </MissionProvider>
          </XPProvider>
        </LocationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}


