import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
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
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = useCallback(async () => {
    try {
      // Load any custom fonts here if needed
      // For now, we're just ensuring expo-font is properly initialized
      await Font.loadAsync({
        // Add custom fonts here when needed
        // 'CustomFont-Regular': require('./assets/fonts/CustomFont-Regular.ttf'),
      });
      
      setFontsLoaded(true);
    } catch (error) {
      console.warn('Font loading failed:', error);
      // Continue with system fonts even if custom font loading fails
      setFontsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFonts();
  }, [loadFonts]);

  // Show loading screen while fonts are loading
  if (!fontsLoaded) {
    return <></>; // Empty fragment while fonts load
  }

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


