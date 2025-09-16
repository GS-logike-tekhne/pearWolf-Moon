// Core Types
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  city?: string;
  state?: string;
  ecoPoints: number;
  kycVerified: boolean;
  backgroundCheckVerified: boolean;
  verificationLevel: VerificationLevel;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'TRASH_HERO' | 'IMPACT_WARRIOR' | 'ECO_DEFENDER' | 'ADMIN';

export type VerificationLevel = 'none' | 'kyc' | 'background_check';

export interface Mission {
  id: string;
  title: string;
  description: string;
  location: Location;
  type: MissionType;
  difficulty: Difficulty;
  reward: number;
  xpReward: number;
  status: MissionStatus;
  createdBy: string;
  assignedTo?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type MissionType = 'cleanup' | 'recycling' | 'education' | 'community';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type MissionStatus = 'available' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface XPData {
  totalXP: number;
  currentLevel: number;
  levelTitle: string;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  progressPercent: number;
  badges: Badge[];
  achievements: Achievement[];
  weeklyXP: number;
  monthlyXP: number;
  streak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  completed: boolean;
  completedAt?: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface SignupRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  MissionDetails: { missionId: string };
  Profile: undefined;
  Settings: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Missions: undefined;
  Map: undefined;
  Rewards: undefined;
  Profile: undefined;
};

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}
