export type MissionType = 'Quick Clean' | 'Timed Mission' | 'Community Quest' | 'Business Mission';
export type MissionStatus = 'available' | 'active' | 'completed' | 'expired';
export type UserRole = 'TRASH_HERO' | 'VOLUNTEER' | 'BUSINESS';

export interface MissionReward {
  xp: number;
  ecoPoints: number;
  badge?: string;
  tokenReward?: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  role: UserRole;
  duration: number; // in seconds
  reward: MissionReward;
  canBoost: boolean;
  requiresUsers: number;
  maxUsers?: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  category: string;
  icon: string;
  
  // Runtime state
  status: MissionStatus;
  startedAt?: Date;
  completedAt?: Date;
  joinedUsers: string[];
  boostUsed: boolean;
  pointsSpentOnBoost: number;
}

export interface MissionProgress {
  missionId: string;
  progress: number; // 0-100
  currentStep?: string;
  stepsCompleted: string[];
  timeRemaining?: number;
}

export interface MissionCompletion {
  missionId: string;
  completedAt: Date;
  actualReward: MissionReward;
  bonusMultiplier?: number;
  collaborators?: string[];
}

export interface BoostOptions {
  cost: number; // eco-points cost
  timeReduction: number; // seconds reduced
  available: boolean;
}

// Mission categories for organization
export const MISSION_CATEGORIES = {
  CLEANUP: 'Cleanup & Collection',
  RECYCLING: 'Recycling & Sorting', 
  COMMUNITY: 'Community Engagement',
  EDUCATION: 'Environmental Education',
  RESTORATION: 'Habitat Restoration',
  BUSINESS: 'Corporate Sustainability'
} as const;

// Mission difficulty colors and multipliers
export const DIFFICULTY_CONFIG = {
  Easy: { color: '#22c55e', multiplier: 1.0, minLevel: 1 },
  Medium: { color: '#f59e0b', multiplier: 1.5, minLevel: 3 },
  Hard: { color: '#ef4444', multiplier: 2.0, minLevel: 7 },
  Epic: { color: '#8b5cf6', multiplier: 3.0, minLevel: 12 }
} as const;