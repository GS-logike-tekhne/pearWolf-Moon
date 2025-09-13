import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserRole, getRoleColor, getRoleIcon } from '../types/roles';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useRoleManager } from '../hooks/useRoleManager';
import { canAccessScreen } from '../types/rolePermissions';

// Import main tab screens
import UnifiedHeroDashboard from '../screens/UnifiedHeroDashboardBackup';
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

// Import additional screens that should have tab navigation
import MyCardScreen from '../screens/MyCardScreen';
import RewardsScreen from '../screens/RewardsScreen';
import PearVerifiedMissions from '../screens/PearVerifiedMissions';
import PearVerifiedMissionDetail from '../screens/PearVerifiedMissionDetail';
import Notifications from '../screens/Notifications';
import JobListings from '../screens/JobListings';
import SuggestCleanup from '../screens/SuggestCleanup';
import EcoNewsScreen from '../screens/EcoNewsScreen';
import EcoStationQuest from '../screens/EcoStationQuest';
import TrashHeroEarnings from '../screens/TrashHeroEarnings';
import ImpactWarriorImpact from '../screens/ImpactWarriorImpact';
import EcoDefenderImpact from '../screens/EcoDefenderImpact';
import PostJob from '../screens/PostJob';
import AdminRewards from '../screens/AdminRewards';
import AdminMissionControl from '../screens/AdminMissionControl';
import AdminIssueResolution from '../screens/AdminIssueResolution';
import AdminSuggestedSpots from '../screens/AdminSuggestedSpots';
import AdminAnalytics from '../screens/AdminAnalytics';
import CleanupSubmissionScreen from '../screens/CleanupSubmissionScreen';
import BadgeSystemScreen from '../screens/BadgeSystemScreen';
import MissionFeedScreen from '../screens/MissionFeedScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import ParkRestorationLabScreen from '../screens/ParkRestorationLabScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create a Stack Navigator for each tab to handle nested screens
const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardMain" component={UnifiedHeroDashboard} />
    <Stack.Screen name="MyCard" component={MyCardScreen} />
    <Stack.Screen name="RewardsScreen" component={RewardsScreen} />
    <Stack.Screen name="Notifications" component={Notifications} />
    <Stack.Screen name="EcoNewsScreen" component={EcoNewsScreen} />
    <Stack.Screen name="BadgeSystemScreen" component={BadgeSystemScreen} />
  </Stack.Navigator>
);

const MissionsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MissionsMain" component={TrashHeroMissions} />
    <Stack.Screen name="PearVerifiedMissions" component={PearVerifiedMissions} />
    <Stack.Screen name="PearVerifiedMissionDetail" component={PearVerifiedMissionDetail} />
    <Stack.Screen name="JobListings" component={JobListings} />
    <Stack.Screen name="SuggestCleanup" component={SuggestCleanup} />
    <Stack.Screen name="EcoStationQuest" component={EcoStationQuest} />
    <Stack.Screen name="CleanupSubmission" component={CleanupSubmissionScreen} />
    <Stack.Screen name="MissionFeedScreen" component={MissionFeedScreen} />
    <Stack.Screen name="PlaceholderScreen" component={PlaceholderScreen} />
    <Stack.Screen name="ParkRestorationLabScreen" component={ParkRestorationLabScreen} />
  </Stack.Navigator>
);

const MapStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MapMain" component={MapScreen} />
  </Stack.Navigator>
);

const WalletStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WalletMain" component={WalletScreen} />
    <Stack.Screen name="TrashHeroEarnings" component={TrashHeroEarnings} />
    <Stack.Screen name="ImpactWarriorImpact" component={ImpactWarriorImpact} />
    <Stack.Screen name="EcoDefenderImpact" component={EcoDefenderImpact} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="PostJob" component={PostJob} />
    <Stack.Screen name="AdminRewards" component={AdminRewards} />
    <Stack.Screen name="AdminMissionControl" component={AdminMissionControl} />
    <Stack.Screen name="AdminIssueResolution" component={AdminIssueResolution} />
    <Stack.Screen name="AdminSuggestedSpots" component={AdminSuggestedSpots} />
    <Stack.Screen name="AdminAnalytics" component={AdminAnalytics} />
    <Stack.Screen name="UserManagement" component={UserManagement} />
    <Stack.Screen name="Analytics" component={Analytics} />
  </Stack.Navigator>
);

const UnifiedTabNavigator: React.FC = () => {
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
        return MissionsStack;
      case 'IMPACT_WARRIOR':
        return MissionsStack;
      case 'ECO_DEFENDER':
        return MissionsStack;
      case 'ADMIN':
        return ProfileStack; // Admin uses ProfileStack for user management
      default:
        return MissionsStack;
    }
  };

  const getDashboardScreen = () => {
    switch (currentRole) {
      case 'TRASH_HERO':
      case 'IMPACT_WARRIOR':
        return DashboardStack;
      case 'ECO_DEFENDER':
        return DashboardStack;
      case 'ADMIN':
        return DashboardStack;
      default:
        return DashboardStack;
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
               canAccessScreen(currentRole, 'TrashHeroMissions');
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
            tabBarLabel: 'Dashboard',
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
          component={MapStack}
          options={{
            tabBarLabel: 'Map',
          }}
        />
      )}
      
      {shouldShowTab('Wallet') && (
        <Tab.Screen 
          name="Wallet" 
          component={WalletStack}
          options={{
            tabBarLabel: 'Wallet',
          }}
        />
      )}
      
      {shouldShowTab('Profile') && (
        <Tab.Screen 
          name="Profile" 
          component={ProfileStack}
          options={{
            tabBarLabel: 'Profile',
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default UnifiedTabNavigator;
