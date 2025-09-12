import RewardCalculationService, { GamificationReward } from './rewardCalculationService';
import BadgeService from './badgeService';
import StreakService, { StreakData } from './streakService';
import LeaderboardService, { LeaderboardEntry, AchievementData } from './leaderboardService';
import { Mission } from '../types/missions';
import { XPData } from '../types/xp';
import { PhotoVerificationResult } from './photoVerificationService';

export { GamificationReward, StreakData, LeaderboardEntry, AchievementData };

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
  calculateMissionXP(mission: Mission, verificationResult?: PhotoVerificationResult): number {
    return RewardCalculationService.calculateMissionXP(mission, verificationResult);
  }

  /**
   * Calculate Eco Points reward
   */
  calculateEcoPoints(mission: Mission, verificationResult?: PhotoVerificationResult): number {
    return RewardCalculationService.calculateEcoPoints(mission, verificationResult);
  }

  /**
   * Check for badge unlocks
   */
  async checkBadgeUnlocks(userId: string, xpData: XPData, missionData: any) {
    return BadgeService.checkBadgeUnlocks(userId, xpData, missionData);
  }

  /**
   * Update streak data
   */
  async updateStreak(userId: string): Promise<StreakData> {
    return StreakService.updateStreak(userId);
  }

  /**
   * Get leaderboard data
   */
  async getLeaderboard(category: 'xp' | 'missions' | 'eco_points' | 'streak', limit: number = 10): Promise<LeaderboardEntry[]> {
    return LeaderboardService.getLeaderboard(category, limit);
  }

  /**
   * Get user's achievements
   */
  async getUserAchievements(userId: string): Promise<AchievementData[]> {
    return LeaderboardService.getUserAchievements(userId);
  }

  /**
   * Process mission completion rewards
   */
  async processMissionRewards(
    userId: string,
    mission: Mission,
    verificationResult?: PhotoVerificationResult,
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
      const newXP = (xpData as any).currentXP + xpReward;
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
    return RewardCalculationService.getCelebrationMessage(rewards);
  }
}

export default GamificationService.getInstance();
