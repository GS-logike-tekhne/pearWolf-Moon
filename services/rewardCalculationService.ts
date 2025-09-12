import { Mission } from '../types/missions';
import { PhotoVerificationResult } from './photoVerificationService';

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

export class RewardCalculationService {
  private static instance: RewardCalculationService;
  
  public static getInstance(): RewardCalculationService {
    if (!RewardCalculationService.instance) {
      RewardCalculationService.instance = new RewardCalculationService();
    }
    return RewardCalculationService.instance;
  }

  /**
   * Calculate XP reward for mission completion
   */
  calculateMissionXP(mission: Mission, verificationResult?: PhotoVerificationResult): number {
    let baseXP = mission.xpReward || 50;
    
    // Bonus for photo verification
    if (verificationResult?.confidence && verificationResult.confidence >= 90) {
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
  calculateEcoPoints(mission: Mission, verificationResult?: PhotoVerificationResult): number {
    let basePoints = mission.ecoPointsReward || 25;
    
    // Bonus for verification confidence
    if (verificationResult?.confidence && verificationResult.confidence >= 85) {
      basePoints += Math.floor(basePoints * 0.15); // 15% bonus
    }
    
    return basePoints;
  }

  /**
   * Check if this is the first mission today
   */
  private isFirstMissionToday(): boolean {
    // Mock implementation
    return Math.random() > 0.7; // 30% chance for demo
  }

  /**
   * Get streak bonus XP
   */
  private getStreakBonus(): number {
    // Mock implementation - in real app, this would check user's current streak
    return 0; // Will be implemented with real streak data
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

export default RewardCalculationService.getInstance();
