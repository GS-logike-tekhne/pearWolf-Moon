import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserRole, getRoleColor, getRoleIcon } from '../types/roles';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

// Import screens
import UnifiedHeroDashboard from '../screens/UnifiedHeroDashboard';
import EcoDefenderDashboard from '../screens/EcoDefenderDashboard';
import AdminDashboard from '../screens/AdminDashboard';
import MapScreen from '../screens/MapScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TrashHeroMissions from '../screens/TrashHeroMissions';
import ImpactWarriorMissions from '../screens/ImpactWarriorMissions';
import EcoDefenderMissions from '../screens/EcoDefenderMissions';
import Analytics from '../screens/Analytics';
import UserManagement from '../screens/UserManagement';

const TabNavigator: React.FC = () => {
  const { theme } = useTheme();
  const { currentRole: userRole } = useAuth();
  const insets = useSafeAreaInsets();

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
    return getRoleColor(userRole);
  };

  const getMissionsScreen = () => {
    switch (userRole) {
      case 'TRASH_HERO':
        return TrashHeroMissions;
      case 'IMPACT_WARRIOR':
        return ImpactWarriorMissions;
      case 'ECO_DEFENDER':
        return EcoDefenderMissions;
      case 'ADMIN':
        return UserManagement; // Admin uses UserManagement as their "missions"
      default:
        return TrashHeroMissions;
    }
  };

  const getDashboardScreen = () => {
    switch (userRole) {
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
        if (userRole === 'ADMIN') return 'Users';
        return 'Missions';
      default:
        return routeName;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) =>
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
      <Tab.Screen 
        name="Dashboard" 
        component={getDashboardScreen()}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      
      <Tab.Screen 
        name="Missions" 
        component={getMissionsScreen()}
        options={{
          tabBarLabel: getTabBarLabel('Missions'),
        }}
      />
      
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
        }}
      />
      
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen}
        options={{
          tabBarLabel: 'Wallet',
        }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
