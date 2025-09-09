import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { ThemeProvider } from './context/ThemeContext';
import { XPProvider } from './context/XPContext';
import { MissionProvider } from './context/MissionContext';

// Import all screens
import LoginScreen from './screens/LoginScreen';
import AdminDashboard from './screens/AdminDashboard';
import EcoDefenderDashboard from './screens/EcoDefenderDashboard';
import UnifiedHeroDashboard from './screens/UnifiedHeroDashboard';

// Mission screens for different roles
import TrashHeroMissions from './screens/TrashHeroMissions';
import ImpactWarriorMissions from './screens/ImpactWarriorMissions';
import EcoDefenderMissions from './screens/EcoDefenderMissions';
import UserManagement from './screens/UserManagement';
import Analytics from './screens/Analytics';
import PostJob from './screens/PostJob';
import WalletScreen from './screens/WalletScreen';
import ProfileScreen from './screens/ProfileScreen';
import MapScreen from './screens/MapScreen';
import RewardsScreen from './screens/RewardsScreen';
import AdminRewards from './screens/AdminRewards';
import PearVerifiedMissions from './screens/PearVerifiedMissions';
import TrashHeroEarnings from './screens/TrashHeroEarnings';
import ImpactWarriorImpact from './screens/ImpactWarriorImpact';
import EcoDefenderImpact from './screens/EcoDefenderImpact';
import Notifications from './screens/Notifications';
import JobListings from './screens/JobListings';
import AdminMissionControl from './screens/AdminMissionControl';
import AdminIssueResolution from './screens/AdminIssueResolution';
import SuggestCleanup from './screens/SuggestCleanup';
import AdminSuggestedSpots from './screens/AdminSuggestedSpots';
import EcoNewsScreen from './screens/EcoNewsScreen';
import MyCard from './screens/MyCard';
import EcoStations from './components/EcoStations';
import EvolutionSystem from './components/EvolutionSystem';
import MissionFeed from './components/MissionFeed';
import EcoStationQuest from './screens/EcoStationQuest';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineIndicator from './components/OfflineIndicator';
import BadgeSystem from './components/BadgeSystem';

const Stack = createStackNavigator();

export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <LocationProvider>
        <XPProvider>
          <MissionProvider>
            <ThemeProvider>
              <ErrorBoundary>
                <OfflineIndicator />
                <NavigationContainer>
                  <StatusBar style="auto" />
        <Stack.Navigator 
          initialRouteName="Login"
        >
          {/* Authentication */}
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          
          {/* Admin Routes */}
          <Stack.Screen 
            name="AdminDashboard" 
            component={AdminDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="UserManagement" 
            component={UserManagement}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Analytics" 
            component={Analytics}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AdminRewards" 
            component={AdminRewards}
            options={{ headerShown: false }}
          />
          
          {/* EcoDefender (Business) Routes */}
          <Stack.Screen 
            name="EcoDefenderDashboard" 
            component={EcoDefenderDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PostJob" 
            component={PostJob}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="EcoDefenderMissions" 
            component={EcoDefenderMissions}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="EcoDefenderImpact" 
            component={EcoDefenderImpact}
            options={{ headerShown: false }}
          />
          
          {/* Unified Hero Routes */}
          <Stack.Screen 
            name="UnifiedHeroDashboard" 
            component={UnifiedHeroDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="TrashHeroMissions" 
            component={TrashHeroMissions}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ImpactWarriorMissions" 
            component={ImpactWarriorMissions}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="TrashHeroEarnings" 
            component={TrashHeroEarnings}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ImpactWarriorImpact" 
            component={ImpactWarriorImpact}
            options={{ headerShown: false }}
          />
          
          {/* Shared Routes */}
          <Stack.Screen 
            name="WalletScreen" 
            component={WalletScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ProfileScreen" 
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="MapScreen" 
            component={MapScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="RewardsScreen" 
            component={RewardsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PearVerifiedMissions" 
            component={PearVerifiedMissions}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Notifications" 
            component={Notifications}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="JobListings" 
            component={JobListings}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AdminMissionControl" 
            component={AdminMissionControl}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AdminIssueResolution" 
            component={AdminIssueResolution}
            options={{ headerShown: false }}
          />
          
          {/* Community Features */}
          <Stack.Screen 
            name="SuggestCleanup" 
            component={SuggestCleanup}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AdminSuggestedSpots" 
            component={AdminSuggestedSpots}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="EcoNewsScreen" 
            component={EcoNewsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="MyCard" 
            component={MyCard}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="EcoStations" 
            component={EcoStations}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="EvolutionSystem" 
            component={EvolutionSystem}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="MissionFeed" 
            component={MissionFeed}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="EcoStationQuest" 
            component={EcoStationQuest}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="BadgeSystem" 
            component={BadgeSystem}
            options={{ headerShown: false }}
          />
                </Stack.Navigator>
                </NavigationContainer>
              </ErrorBoundary>
            </ThemeProvider>
          </MissionProvider>
        </XPProvider>
      </LocationProvider>
    </AuthProvider>
  );
}