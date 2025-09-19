import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserRole, getRoleColor, getRoleIcon } from '../types/roles';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useRoleManager } from '../hooks/useRoleManager';
import { canAccessScreen } from '../types/rolePermissions';

// Import screens
import UnifiedHeroDashboard from '../screens/UnifiedHeroDashboard';
import EcoDefenderDashboard from '../screens/EcoDefenderDashboard';
import AdminDashboard from '../screens/AdminDashboard';
import MapScreen from '../screens/MapScreen';
import LiveMapScreen from '../screens/LiveMapScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TrashHeroMissions from '../screens/TrashHeroMissions';
import ImpactWarriorMissions from '../screens/ImpactWarriorMissions';
import MissionsScreen from '../screens/MissionsScreen';
import EcoDefenderMissions from '../screens/EcoDefenderMissions';
import Analytics from '../screens/Analytics';
import UserManagement from '../screens/UserManagement';

const TabNavigator: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { currentRole, getNavigationConfig } = useRoleManager();
  
  // Get role-specific navigation configuration
  const navConfig = getNavigationConfig();

  const getTabBarIcon = (routeName: string, focused: boolean, color: string, size: number) => {
    let iconName: string;

    switch (routeName) {
      case 'Dashboard':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Missions':
        iconName = focused ? 'list' : 'list-outline';
        break;
      case 'Map':
        iconName = focused ? 'map' : 'map-outline';
        break;
      case 'Wallet':
        iconName = focused ? 'wallet' : 'wallet-outline';
        break;
      case 'Profile':
        iconName = focused ? 'person' : 'person-outline';
        break;
      case 'Analytics':
        iconName = focused ? 'analytics' : 'analytics-outline';
        break;
      case 'Users':
        iconName = focused ? 'people' : 'people-outline';
        break;
      default:
        iconName = 'help-outline';
    }

    return <Ionicons name={iconName as any} size={size} color={color} />;
  };

  const getTabBarColor = () => {
    return navConfig.tabBarColor;
  };

  const getMissionsScreen = () => {
    switch (currentRole) {
      case 'TRASH_HERO':
      case 'IMPACT_WARRIOR':
      case 'ECO_DEFENDER':
        return MissionsScreen; // Use the new unified missions screen
      case 'ADMIN':
        return UserManagement; // Admin uses UserManagement as their "missions"
      default:
        return MissionsScreen;
    }
  };

  const getDashboardScreen = () => {
    switch (currentRole) {
      case 'TRASH_HERO':
      case 'IMPACT_WARRIOR':
        return UnifiedHeroDashboard;
      case 'ECO_DEFENDER':
        return EcoDefenderDashboard;
      case 'ADMIN':
        return AdminDashboard;
      default:
        return UnifiedHeroDashboard;
    }
  };

  const getTabBarLabel = (routeName: string) => {
    switch (routeName) {
      case 'Missions':
        if (currentRole === 'ADMIN') return 'Users';
        return 'Missions';
      default:
        return routeName;
    }
  };

  // Helper function to check if a tab should be shown
  const shouldShowTab = (tabName: string): boolean => {
    switch (tabName) {
      case 'Dashboard':
        return canAccessScreen(currentRole, 'AdminDashboard') || 
               canAccessScreen(currentRole, 'EcoDefenderDashboard') ||
               canAccessScreen(currentRole, 'TrashHeroMissions'); // UnifiedHeroDashboard
      case 'Missions':
        return canAccessScreen(currentRole, 'TrashHeroMissions') ||
               canAccessScreen(currentRole, 'ImpactWarriorMissions') ||
               canAccessScreen(currentRole, 'EcoDefenderMissions') ||
               canAccessScreen(currentRole, 'UserManagement');
      case 'Map':
        return canAccessScreen(currentRole, 'MapScreen');
      case 'Wallet':
        return canAccessScreen(currentRole, 'WalletScreen');
      case 'Profile':
        return canAccessScreen(currentRole, 'ProfileScreen');
      default:
        return true;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) =>
          getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: getTabBarColor(),
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.borderColor,
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 5),
          paddingTop: 5,
          height: 60 + Math.max(insets.bottom - 5, 0),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      {shouldShowTab('Dashboard') && (
        <Tab.Screen 
          name="Dashboard" 
          component={getDashboardScreen()}
          options={{
            tabBarLabel: 'Home',
          }}
        />
      )}
      
      {shouldShowTab('Missions') && (
        <Tab.Screen 
          name="Missions" 
          component={getMissionsScreen()}
          options={{
            tabBarLabel: getTabBarLabel('Missions'),
          }}
        />
      )}
      
      {shouldShowTab('Map') && (
        <Tab.Screen 
          name="Map" 
          component={LiveMapScreen}
          options={{
            tabBarLabel: 'Map',
          }}
        />
      )}
      
      {shouldShowTab('Wallet') && (
        <Tab.Screen 
          name="Wallet" 
          component={WalletScreen}
          options={{
            tabBarLabel: 'Wallet',
          }}
        />
      )}
      
      {shouldShowTab('Profile') && (
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;
