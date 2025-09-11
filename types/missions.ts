import { UserRole } from './user';

export type MissionType = 'cleanup' | 'restoration' | 'data-collection' | 'community-event' | 'recycling' | 'analytics';
export type MissionStatus = 'available' | 'accepted' | 'in-progress' | 'completed' | 'expired';
export type MissionUrgency = 'low' | 'medium' | 'high' | 'urgent';

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  status: MissionStatus;
  urgency: MissionUrgency;
  
  // Location
  location: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    address?: string;
  };
  
  // Timing
  startDate: Date;
  endDate: Date;
  estimatedDuration: number; // in minutes
  
  // Requirements
  requiredRole: UserRole;
  minParticipants?: number;
  maxParticipants?: number;
  currentParticipants: number;
  
  // Rewards
  xpReward: number;
  ecoPointsReward: number;
  badgeReward?: string;
  
  // Progress
  progress: {
    current: number;
    target: number;
    unit: string;
  };
  
  // Additional data
  photos?: string[];
  instructions: string[];
  equipment?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Verification
  requiresPhotoVerification: boolean;
  requiresLocationVerification: boolean;
  
  // Creator info
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MissionTemplate {
  id: string;
  name: string;
  description: string;
  type: MissionType;
  requiredRole: UserRole;
  defaultRewards: {
    xpReward: number;
    ecoPointsReward: number;
  };
  instructions: string[];
  equipment: string[];
  estimatedDuration: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface MissionCompletion {
  missionId: string;
  userId: string;
  completedAt: Date;
  photos?: string[];
  notes?: string;
  xpEarned: number;
  ecoPointsEarned: number;
  badgesEarned: string[];
}