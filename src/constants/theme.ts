import { Theme } from '../types';

export const lightTheme: Theme = {
  colors: {
    primary: '#4CAF50',
    secondary: '#81C784',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#66BB6A',
    secondary: '#A5D6A7',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    success: '#66BB6A',
    warning: '#FFB74D',
    error: '#EF5350',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

export const roleColors = {
  TRASH_HERO: '#4CAF50',
  IMPACT_WARRIOR: '#dc2626',
  ECO_DEFENDER: '#2196F3',
  ADMIN: '#9C27B0',
} as const;

export const XP_REWARDS = {
  completeJob: 50,
  suggestCleanupSpot: 25,
  joinCommunityEvent: 30,
  firstCleanup: 100,
  weeklyStreak: 75,
  monthlyStreak: 200,
  referUser: 150,
  completeBadge: 100,
  donateToFund: 20,
  shareCleanup: 15,
  leaveReview: 10,
  uploadPhoto: 15,
} as const;
