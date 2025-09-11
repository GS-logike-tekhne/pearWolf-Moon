// types/rolePermissions.ts
import { UserRole } from './roles';

// Define all possible features
export type Feature = 
  | 'ManageUsers'
  | 'PostMissions' 
  | 'ViewAnalytics'
  | 'ResolveIssues'
  | 'ManageRewards'
  | 'ViewAllData'
  | 'SystemSettings'
  | 'IssueResolution'
  | 'UserManagement'
  | 'MissionControl'
  | 'SuggestedSpots'
  | 'PlatformAnalytics'
  | 'PostJobs'
  | 'FundCleanups' 
  | 'TrackImpact'
  | 'ViewMissions'
  | 'CompleteJobs'
  | 'EarnBadges'
  | 'ViewEarnings'
  | 'WithdrawEarnings'
  | 'TrashHeroMissions'
  | 'TrashHeroEarnings'
  | 'ProfessionalCleanup'
  | 'ReportIssues'
  | 'ImpactWarriorMissions'
  | 'ImpactWarriorImpact'
  | 'CommunityVolunteer'
  | 'SuggestCleanup'
  | 'ManageBusinessProfile'
  | 'PostJob'
  | 'EcoDefenderImpact'
  | 'BusinessDashboard';

// Define feature permissions for each role
export const rolePermissions: Record<UserRole, Feature[]> = {
  ADMIN: [
    'ManageUsers',
    'PostMissions', 
    'ViewAnalytics',
    'ResolveIssues',
    'ManageRewards',
    'ViewAllData',
    'SystemSettings',
    'IssueResolution',
    'UserManagement',
    'MissionControl',
    'SuggestedSpots',
    'PlatformAnalytics'
  ],
  ECO_DEFENDER: [
    'PostJobs',
    'FundCleanups', 
    'TrackImpact',
    'ViewMissions',
    'CompleteJobs',
    'EarnBadges',
    'ViewAnalytics',
    'ManageBusinessProfile',
    'PostJob',
    'EcoDefenderImpact',
    'BusinessDashboard'
  ],
  TRASH_HERO: [
    'ViewMissions',
    'CompleteJobs',
    'EarnBadges',
    'ViewEarnings',
    'WithdrawEarnings',
    'TrashHeroMissions',
    'TrashHeroEarnings',
    'ProfessionalCleanup'
  ],
  IMPACT_WARRIOR: [
    'ViewMissions',
    'CompleteJobs', 
    'ReportIssues',
    'EarnBadges',
    'ImpactWarriorMissions',
    'ImpactWarriorImpact',
    'CommunityVolunteer',
    'SuggestCleanup'
  ]
};

// Helper function to check if a role has a specific permission
export const hasPermission = (role: UserRole, feature: Feature): boolean => {
  return rolePermissions[role]?.includes(feature) || false;
};

// Helper function to get all permissions for a role
export const getRolePermissions = (role: UserRole): Feature[] => {
  return rolePermissions[role] || [];
};

// Helper function to check if user can access a screen/feature
export const canAccess = (role: UserRole, feature: Feature): boolean => {
  return hasPermission(role, feature);
};

// Screen access mapping - which screens require which permissions
export const screenPermissions = {
  // Admin screens
  'AdminDashboard': 'SystemSettings',
  'AdminMissionControl': 'MissionControl', 
  'AdminIssueResolution': 'IssueResolution',
  'AdminRewards': 'ManageRewards',
  'AdminSuggestedSpots': 'SuggestedSpots',
  'UserManagement': 'UserManagement',
  'Analytics': 'PlatformAnalytics',
  
  // EcoDefender screens
  'EcoDefenderDashboard': 'BusinessDashboard',
  'EcoDefenderMissions': 'ViewMissions',
  'EcoDefenderImpact': 'TrackImpact',
  'PostJob': 'PostJobs',
  
  // TrashHero screens  
  'TrashHeroMissions': 'ViewMissions',
  'TrashHeroEarnings': 'ViewEarnings',
  
  // ImpactWarrior screens
  'ImpactWarriorMissions': 'ViewMissions', 
  'ImpactWarriorImpact': 'ReportIssues',
  'SuggestCleanup': 'SuggestCleanup',
  
  // Shared screens (accessible by all roles)
  'MyCard': 'ViewMissions', // All roles can view their card
  'WalletScreen': 'ViewMissions', // All roles can view wallet
  'ProfileScreen': 'ViewMissions', // All roles can view profile
  'Notifications': 'ViewMissions', // All roles can view notifications
  'MapScreen': 'ViewMissions', // All roles can view map
  'EcoNewsScreen': 'ViewMissions', // All roles can view news
  'RewardsScreen': 'ViewMissions', // All roles can view rewards
  'PearVerifiedMissions': 'ViewMissions', // All roles can view verified missions
  'JobListings': 'ViewMissions', // All roles can view job listings
  'EcoStationQuest': 'ViewMissions', // All roles can view eco stations
} as const;

// Helper function to check if a role can access a specific screen
export const canAccessScreen = (role: UserRole, screenName: keyof typeof screenPermissions): boolean => {
  const requiredPermission = screenPermissions[screenName];
  return hasPermission(role, requiredPermission);
};
