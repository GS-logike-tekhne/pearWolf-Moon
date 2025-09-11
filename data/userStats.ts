import { UserProfile, UserStats, UserRole } from '../types/user';
import { getLevelProgress } from './levels';

// Mock user profiles for each role
export const mockUserProfiles: Record<UserRole, UserProfile> = {
  'trash-hero': {
    id: 'user_th_001',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@example.com',
    role: 'trash-hero',
    avatar: 'AR',
    verified: true,
    joinDate: new Date('2024-01-15'),
    lastActive: new Date(),
  },
  'impact-warrior': {
    id: 'user_iw_001',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'impact-warrior',
    avatar: 'SC',
    verified: true,
    joinDate: new Date('2024-02-01'),
    lastActive: new Date(),
  },
  'eco-defender': {
    id: 'user_ed_001',
    name: 'Marcus Johnson',
    email: 'marcus.johnson@example.com',
    role: 'eco-defender',
    avatar: 'MJ',
    verified: true,
    joinDate: new Date('2024-01-20'),
    lastActive: new Date(),
  },
  'admin': {
    id: 'user_admin_001',
    name: 'Admin User',
    email: 'admin@pear.app',
    role: 'admin',
    avatar: 'AD',
    verified: true,
    joinDate: new Date('2023-12-01'),
    lastActive: new Date(),
  },
};

// Role-specific user stats with realistic XP values
export const mockUserStats: Record<UserRole, UserStats> = {
  'trash-hero': {
    totalXP: 2450,
    currentLevel: 6,
    levelTitle: 'Eco Legend',
    jobsCompleted: 47,
    totalEarned: '$2,340',
    impactRadius: '15km',
    successRate: '98%',
    hoursWorked: '127h',
    verifiedEvents: 12,
    streak: 8,
    badges: [
      {
        id: 'first-cleanup',
        name: 'First Step',
        description: 'Complete your first cleanup',
        icon: '🌱',
        category: 'mission',
        rarity: 'common',
        earnedAt: new Date('2024-01-16'),
      },
      {
        id: 'speed-cleaner',
        name: 'Speed Cleaner',
        description: 'Complete 10 cleanups in under 30 minutes each',
        icon: '⚡',
        category: 'mission',
        rarity: 'uncommon',
        earnedAt: new Date('2024-02-10'),
      },
      {
        id: 'eco-champion',
        name: 'Eco Champion',
        description: 'Reach level 5',
        icon: '🏆',
        category: 'impact',
        rarity: 'rare',
        earnedAt: new Date('2024-03-01'),
      },
    ],
    achievements: [
      {
        id: 'weekly-warrior',
        title: 'Weekly Warrior',
        description: 'Complete 3 cleanups in a week',
        icon: '⚡',
        xpReward: 100,
        completed: true,
        completedAt: new Date('2024-03-05'),
        category: 'weekly',
      },
      {
        id: 'photo-documentarian',
        title: 'Photo Documentarian',
        description: 'Upload 10 cleanup photos',
        icon: '📸',
        xpReward: 75,
        completed: false,
        category: 'milestone',
      },
    ],
  },
  'impact-warrior': {
    totalXP: 1680,
    currentLevel: 4,
    levelTitle: 'Urban Guardian',
    eventsJoined: 23,
    impactPoints: '1,680',
    communityRadius: '25km',
    cleanupsLed: 8,
    volunteerHours: '89h',
    verifiedEvents: 7,
    streak: 12,
    badges: [
      {
        id: 'community-leader',
        name: 'Community Leader',
        description: 'Lead 5 community cleanup events',
        icon: '👑',
        category: 'community',
        rarity: 'rare',
        earnedAt: new Date('2024-02-15'),
      },
      {
        id: 'volunteer-hero',
        name: 'Volunteer Hero',
        description: 'Complete 50 volunteer hours',
        icon: '❤️',
        category: 'impact',
        rarity: 'uncommon',
        earnedAt: new Date('2024-03-01'),
      },
    ],
    achievements: [
      {
        id: 'community-champion',
        title: 'Community Champion',
        description: 'Lead 10 community events',
        icon: '🏅',
        xpReward: 150,
        completed: false,
        category: 'milestone',
      },
    ],
  },
  'eco-defender': {
    totalXP: 3450,
    currentLevel: 7,
    levelTitle: 'Climate Warrior',
    fundedJobs: 15,
    totalInvestment: '$8,500',
    impactRadius: '50km',
    jobsCreated: 12,
    co2Offset: '2.3 tons',
    verifiedEvents: 5,
    streak: 6,
    badges: [
      {
        id: 'green-pioneer',
        name: 'Green Pioneer',
        description: 'Invest in environmental impact',
        icon: '🌱',
        category: 'impact',
        rarity: 'epic',
        earnedAt: new Date('2024-01-25'),
      },
      {
        id: 'impact-investor',
        name: 'Impact Investor',
        description: 'Fund 10+ environmental projects',
        icon: '💰',
        category: 'impact',
        rarity: 'rare',
        earnedAt: new Date('2024-02-20'),
      },
    ],
    achievements: [
      {
        id: 'carbon-neutral',
        title: 'Carbon Neutral',
        description: 'Offset 1 ton of CO2 through funded projects',
        icon: '🌍',
        xpReward: 200,
        completed: true,
        completedAt: new Date('2024-02-25'),
        category: 'milestone',
      },
    ],
  },
  'admin': {
    totalXP: 5200,
    currentLevel: 9,
    levelTitle: "Nature's Champion",
    usersManaged: 1247,
    systemUptime: '99.9%',
    platformReach: 'Global',
    issuesResolved: 89,
    jobsOverseen: 234,
    verifiedEvents: 3,
    streak: 45,
    badges: [
      {
        id: 'platform-guardian',
        name: 'Platform Guardian',
        description: 'Maintain system excellence',
        icon: '🛡️',
        category: 'special',
        rarity: 'legendary',
        earnedAt: new Date('2023-12-15'),
      },
      {
        id: 'system-master',
        name: 'System Master',
        description: 'Achieve 99.9% uptime for 3 months',
        icon: '⚙️',
        category: 'special',
        rarity: 'epic',
        earnedAt: new Date('2024-01-01'),
      },
    ],
    achievements: [
      {
        id: 'platform-builder',
        title: 'Platform Builder',
        description: 'Manage 1000+ active users',
        icon: '🏗️',
        xpReward: 300,
        completed: true,
        completedAt: new Date('2024-01-15'),
        category: 'milestone',
      },
    ],
  },
};

// Helper function to get user stats by role
export const getUserStatsByRole = (role: UserRole): UserStats => {
  return mockUserStats[role];
};

// Helper function to get user profile by role
export const getUserProfileByRole = (role: UserRole): UserProfile => {
  return mockUserProfiles[role];
};

// Helper function to get current user data (for demo purposes)
export const getCurrentUser = (role: UserRole = 'trash-hero') => {
  const profile = getUserProfileByRole(role);
  const stats = getUserStatsByRole(role);
  const levelData = getLevelProgress(stats.totalXP);
  
  return {
    profile,
    stats: {
      ...stats,
      currentLevel: levelData.currentLevel.level,
      levelTitle: levelData.currentLevel.title,
    },
    levelData,
  };
};
