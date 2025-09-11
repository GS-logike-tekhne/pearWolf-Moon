export type UserRole = 'trash-hero' | 'impact-warrior' | 'eco-defender' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
  joinDate: Date;
  lastActive: Date;
}

export interface UserStats {
  // XP and Level
  totalXP: number;
  currentLevel: number;
  levelTitle: string;
  
  // Role-specific stats
  jobsCompleted?: number;
  eventsJoined?: number;
  fundedJobs?: number;
  usersManaged?: number;
  
  // Financial
  totalEarned?: string;
  totalInvestment?: string;
  
  // Impact metrics
  impactRadius: string;
  successRate?: string;
  hoursWorked?: string;
  volunteerHours?: string;
  co2Offset?: string;
  systemUptime?: string;
  platformReach?: string;
  issuesResolved?: number;
  jobsOverseen?: number;
  jobsCreated?: number;
  cleanupsLed?: number;
  verifiedEvents: number;
  
  // Engagement
  streak: number;
  badges: Badge[];
  achievements: Achievement[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  category: 'mission' | 'streak' | 'impact' | 'community' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  completed: boolean;
  completedAt?: Date;
  category: 'weekly' | 'monthly' | 'milestone' | 'special';
}

export interface UserWallet {
  ecoPoints: number;
  totalEarned: number;
  totalSpent: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'reward';
  amount: number;
  description: string;
  timestamp: Date;
  source?: string;
}
