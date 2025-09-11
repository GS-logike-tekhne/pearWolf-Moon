import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/roles';

// Import navigation components
import TabNavigator from './TabNavigator';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import MyCard from '../screens/MyCard';
import RewardsScreen from '../screens/RewardsScreen';
import PearVerifiedMissions from '../screens/PearVerifiedMissions';
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
import Analytics from '../screens/Analytics';
import AdminAnalytics from '../screens/AdminAnalytics';
import CleanupSubmissionScreen from '../screens/CleanupSubmissionScreen';
import UserManagement from '../screens/UserManagement';
import MapScreen from '../screens/MapScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TrashHeroMissions from '../screens/TrashHeroMissions';
import ImpactWarriorMissions from '../screens/ImpactWarriorMissions';
import EcoDefenderMissions from '../screens/EcoDefenderMissions';
import BadgeSystemScreen from '../screens/BadgeSystemScreen';
import MissionFeedScreen from '../screens/MissionFeedScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, currentRole } = useAuth();

  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main Tab Navigator */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      
      {/* Shared Screens */}
      <Stack.Screen name="MyCard" component={MyCard} />
      <Stack.Screen name="RewardsScreen" component={RewardsScreen} />
      <Stack.Screen name="PearVerifiedMissions" component={PearVerifiedMissions} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="JobListings" component={JobListings} />
      <Stack.Screen name="SuggestCleanup" component={SuggestCleanup} />
      <Stack.Screen name="EcoNewsScreen" component={EcoNewsScreen} />
      <Stack.Screen name="EcoStationQuest" component={EcoStationQuest} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="Analytics" component={Analytics} />
      <Stack.Screen name="AdminAnalytics" component={AdminAnalytics} />
      <Stack.Screen name="CleanupSubmission" component={CleanupSubmissionScreen} />
      <Stack.Screen name="UserManagement" component={UserManagement} />
      
      {/* Role-specific screens */}
      <Stack.Screen name="TrashHeroEarnings" component={TrashHeroEarnings} />
      <Stack.Screen name="ImpactWarriorImpact" component={ImpactWarriorImpact} />
      <Stack.Screen name="EcoDefenderImpact" component={EcoDefenderImpact} />
      <Stack.Screen name="PostJob" component={PostJob} />
      <Stack.Screen name="TrashHeroMissions" component={TrashHeroMissions} />
      <Stack.Screen name="ImpactWarriorMissions" component={ImpactWarriorMissions} />
      <Stack.Screen name="EcoDefenderMissions" component={EcoDefenderMissions} />
      <Stack.Screen name="BadgeSystem" component={BadgeSystemScreen} />
      <Stack.Screen name="MissionFeed" component={MissionFeedScreen} />
      
      {/* Placeholder screens for features under development */}
      <Stack.Screen name="UserProfile" component={PlaceholderScreen} />
      <Stack.Screen name="CreateImpactReport" component={PlaceholderScreen} />
      <Stack.Screen name="MissionDetails" component={PlaceholderScreen} />
      <Stack.Screen name="EditMission" component={PlaceholderScreen} />
      <Stack.Screen name="MissionParticipants" component={PlaceholderScreen} />
      <Stack.Screen name="MissionAnalytics" component={PlaceholderScreen} />
      <Stack.Screen name="CreateMission" component={PlaceholderScreen} />
      <Stack.Screen name="IssueDetails" component={PlaceholderScreen} />
      <Stack.Screen name="SpotDetails" component={PlaceholderScreen} />
      <Stack.Screen name="JobDetails" component={PlaceholderScreen} />
      <Stack.Screen name="WithdrawEarnings" component={PlaceholderScreen} />
      <Stack.Screen name="EarningsReport" component={PlaceholderScreen} />
      <Stack.Screen name="AdminSettings" component={PlaceholderScreen} />
      
      {/* Admin-specific screens */}
      <Stack.Screen name="AdminRewards" component={AdminRewards} />
      <Stack.Screen name="AdminMissionControl" component={AdminMissionControl} />
      <Stack.Screen name="AdminIssueResolution" component={AdminIssueResolution} />
      <Stack.Screen name="AdminSuggestedSpots" component={AdminSuggestedSpots} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
