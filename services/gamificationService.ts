import { Alert } from 'react-native';
import { Badge } from '../types/badges';
import { XPData } from '../types/xp';

export interface GamificationReward {
  type: 'xp' | 'eco_points' | 'badge' | 'level_up' | 'streak';
  value: number;
  source: string;
  timestamp: Date;
  metadata?: {
    missionId?: string;
    badgeId?: string;
    level?: number;
    streakCount?: number;
  };
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakRewards: number[];
}

export interface AchievementData {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: Date;
  progress: number;
  maxProgress: number;
  category: 'missions' | 'cleanup' | 'community' | 'special';
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  role: string;
  totalXP: number;
  level: number;
  missionsCompleted: number;
  ecoPoints: number;
  rank: number;
  avatar?: string;
}

export class GamificationService {
  private static instance: GamificationService;
  
  public static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  /**
   * Calculate XP reward for mission completion
   */
  calculateMissionXP(mission: any, verificationResult?: any): number {
    let baseXP = mission.xpReward || 50;
    
    // Bonus for photo verification
    if (verificationResult?.confidence >= 90) {
      baseXP += Math.floor(baseXP * 0.2); // 20% bonus for high confidence
    }
    
    // Bonus for first mission of the day
    if (this.isFirstMissionToday()) {
      baseXP += 25; // Daily first mission bonus
    }
    
    // Bonus for streak
    const streakBonus = this.getStreakBonus();
    baseXP += streakBonus;
    
    return baseXP;
  }

  /**
   * Calculate Eco Points reward
   */
  calculateEcoPoints(mission: any, verificationResult?: any): number {
    let basePoints = mission.ecoPointsReward || 25;
    
    // Bonus for verification confidence
    if (verificationResult?.confidence >= 85) {
      basePoints += Math.floor(basePoints * 0.15); // 15% bonus
    }
    
    return basePoints;
  }

  /**
   * Check for badge unlocks
   */
  async checkBadgeUnlocks(userId: string, xpData: XPData, missionData: any): Promise<Badge[]> {
    const unlockedBadges: Badge[] = [];
    
    // Level-based badges
    if (xpData.currentLevel.level >= 5 && !this.hasBadge(userId, 'level_5_hero')) {
      unlockedBadges.push({
        id: 'level_5_hero',
        title: 'Rising Hero',
        description: 'Reached level 5!',
        icon: 'star',
        category: 'level',
        rarity: 'common',
        unlocked: true,
        unlockedDate: new Date(),
      });
    }
    
    if (xpData.currentLevel.level >= 10 && !this.hasBadge(userId, 'level_10_legend')) {
      unlockedBadges.push({
        id: 'level_10_legend',
        title: 'PEAR Legend',
        description: 'Reached level 10!',
        icon: 'trophy',
        category: 'level',
        rarity: 'rare',
        unlocked: true,
        unlockedDate: new Date(),
      });
    }
    
    // Mission-based badges
    if (missionData.totalMissions >= 10 && !this.hasBadge(userId, 'mission_master')) {
      unlockedBadges.push({
        id: 'mission_master',
        title: 'Mission Master',
        description: 'Completed 10 missions!',
        icon: 'checkmark-circle',
        category: 'missions',
        rarity: 'uncommon',
        unlocked: true,
        unlockedDate: new Date(),
      });
    }
    
    // Streak badges
    const streakData = await this.getStreakData(userId);
    if (streakData.currentStreak >= 7 && !this.hasBadge(userId, 'week_warrior')) {
      unlockedBadges.push({
        id: 'week_warrior',
        title: 'Week Warrior',
        description: '7-day cleanup streak!',
        icon: 'flame',
        category: 'streak',
        rarity: 'rare',
        unlocked: true,
        unlockedDate: new Date(),
      });
    }
    
    return unlockedBadges;
  }

  /**
   * Update streak data
   */
  async updateStreak(userId: string): Promise<StreakData> {
    const currentStreak = await this.getStreakData(userId);
    const today = new Date();
    const lastActivity = new Date(currentStreak.lastActivityDate);
    
    // Check if last activity was yesterday (maintain streak) or today (no change)
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    let newStreak = currentStreak.currentStreak;
    
    if (daysDiff === 1) {
      // Maintain streak - last activity was yesterday
      newStreak += 1;
    } else if (daysDiff > 1) {
      // Streak broken - reset to 1
      newStreak = 1;
    }
    // If daysDiff === 0, streak stays the same (already active today)
    
    const updatedStreak: StreakData = {
      currentStreak: newStreak,
      longestStreak: Math.max(currentStreak.longestStreak, newStreak),
      lastActivityDate: today,
      streakRewards: currentStreak.streakRewards,
    };
    
    // Check for streak milestone rewards
    if (this.isStreakMilestone(newStreak) && !updatedStreak.streakRewards.includes(newStreak)) {
      updatedStreak.streakRewards.push(newStreak);
    }
    
    return updatedStreak;
  }

  /**
   * Get streak bonus XP
   */
  getStreakBonus(): number {
    // Mock implementation - in real app, this would check user's current streak
    return 0; // Will be implemented with real streak data
  }

  /**
   * Check if this is the first mission today
   */
  isFirstMissionToday(): boolean {
    // Mock implementation
    return Math.random() > 0.7; // 30% chance for demo
  }

  /**
   * Check if user has a specific badge
   */
  private hasBadge(userId: string, badgeId: string): boolean {
    // Mock implementation - in real app, this would check user's badge collection
    return false;
  }

  /**
   * Get user's streak data
   */
  private async getStreakData(userId: string): Promise<StreakData> {
    // Mock implementation
    return {
      currentStreak: 3,
      longestStreak: 12,
      lastActivityDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      streakRewards: [3, 7],
    };
  }

  /**
   * Check if streak count is a milestone
   */
  private isStreakMilestone(streakCount: number): boolean {
    const milestones = [3, 7, 14, 30, 100];
    return milestones.includes(streakCount);
  }

  /**
   * Get leaderboard data
   */
  async getLeaderboard(category: 'xp' | 'missions' | 'eco_points' | 'streak', limit: number = 10): Promise<LeaderboardEntry[]> {
    // Mock leaderboard data
    const mockUsers: LeaderboardEntry[] = [
      {
        userId: 'user1',
        username: 'EcoWarrior99',
        role: 'trash-hero',
        totalXP: 2450,
        level: 8,
        missionsCompleted: 23,
        ecoPoints: 580,
        rank: 1,
      },
      {
        userId: 'user2',
        username: 'CleanUpKing',
        role: 'impact-warrior',
        totalXP: 2180,
        level: 7,
        missionsCompleted: 19,
        ecoPoints: 520,
        rank: 2,
      },
      {
        userId: 'user3',
        username: 'GreenGuardian',
        role: 'eco-defender',
        totalXP: 1950,
        level: 6,
        missionsCompleted: 17,
        ecoPoints: 480,
        rank: 3,
      },
    ];

    return mockUsers.slice(0, limit);
  }

  /**
   * Get user's achievements
   */
  async getUserAchievements(userId: string): Promise<AchievementData[]> {
    // Mock achievement data
    return [
      {
        id: 'first_mission',
        title: 'First Steps',
        description: 'Complete your first mission',
        icon: 'footsteps',
        unlocked: true,
        unlockedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        progress: 1,
        maxProgress: 1,
        category: 'missions',
      },
      {
        id: 'cleanup_master',
        title: 'Cleanup Master',
        description: 'Complete 50 cleanup missions',
        icon: 'broom',
        unlocked: false,
        progress: 23,
        maxProgress: 50,
        category: 'cleanup',
      },
      {
        id: 'community_leader',
        title: 'Community Leader',
        description: 'Help 10 other users complete missions',
        icon: 'people',
        unlocked: false,
        progress: 3,
        maxProgress: 10,
        category: 'community',
      },
    ];
  }

  /**
   * Process mission completion rewards
   */
  async processMissionRewards(
    userId: string,
    mission: any,
    verificationResult?: any,
    xpData?: XPData
  ): Promise<GamificationReward[]> {
    const rewards: GamificationReward[] = [];
    
    // Calculate XP reward
    const xpReward = this.calculateMissionXP(mission, verificationResult);
    rewards.push({
      type: 'xp',
      value: xpReward,
      source: `mission_${mission.id}`,
      timestamp: new Date(),
      metadata: { missionId: mission.id },
    });
    
    // Calculate Eco Points reward
    const ecoPointsReward = this.calculateEcoPoints(mission, verificationResult);
    rewards.push({
      type: 'eco_points',
      value: ecoPointsReward,
      source: `mission_${mission.id}`,
      timestamp: new Date(),
      metadata: { missionId: mission.id },
    });
    
    // Check for level up
    if (xpData) {
      const newXP = xpData.currentXP + xpReward;
      const newLevel = this.calculateLevel(newXP);
      if (newLevel > xpData.currentLevel.level) {
        rewards.push({
          type: 'level_up',
          value: newLevel,
          source: 'level_up',
          timestamp: new Date(),
          metadata: { level: newLevel },
        });
      }
    }
    
    // Update streak
    const streakData = await this.updateStreak(userId);
    if (streakData.currentStreak > 0) {
      rewards.push({
        type: 'streak',
        value: streakData.currentStreak,
        source: 'daily_streak',
        timestamp: new Date(),
        metadata: { streakCount: streakData.currentStreak },
      });
    }
    
    return rewards;
  }

  /**
   * Calculate level from XP (mock implementation)
   */
  private calculateLevel(xp: number): number {
    // Simple level calculation - in real app, this would use the levels config
    return Math.floor(xp / 250) + 1;
  }

  /**
   * Get celebration message for rewards
   */
  getCelebrationMessage(rewards: GamificationReward[]): string {
    const messages: string[] = [];
    
    rewards.forEach(reward => {
      switch (reward.type) {
        case 'xp':
          messages.push(`+${reward.value} XP`);
          break;
        case 'eco_points':
          messages.push(`+${reward.value} Eco Points`);
          break;
        case 'level_up':
          messages.push(`Level ${reward.value} Unlocked!`);
          break;
        case 'badge':
          messages.push(`Badge Unlocked!`);
          break;
        case 'streak':
          if (reward.value > 1) {
            messages.push(`${reward.value}-Day Streak!`);
          }
          break;
      }
    });
    
    return messages.join(' • ');
  }
}

export default GamificationService.getInstance();
