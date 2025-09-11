import { Level } from '../data/levels';

export interface XPLevelData {
  currentLevel: Level;
  nextLevel: Level | null;
  xpToNext: number;
  progressPercent: number;
  isMaxLevel: boolean;
}

export interface XPReward {
  amount: number;
  source: string;
  timestamp: Date;
}

export interface XPSummary {
  totalXP: number;
  totalEarned: number;
  recentRewards: XPReward[];
  sourceBreakdown: Record<string, number>;
  levelUpCount: number;
  currentLevel: Level;
}

export interface XPData extends XPLevelData {
  // XP actions
  addXP: (amount: number, source: string) => void;
  subtractXP: (amount: number, source: string) => void;
  setXP: (xp: number) => void;
  resetXP: () => void;
  
  // History and analytics
  recentRewards: XPReward[];
  levelUpHistory: Level[];
  getXPSummary: () => XPSummary;
  
  // Utility functions
  canLevelUpWith: (xpAmount: number) => boolean;
  getNextMilestone: () => {
    type: 'max_level' | 'level_up';
    description: string;
    xpNeeded: number;
    progress: number;
  };
  getXPForLevel: (targetLevel: number) => number;
}
