export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakRewards: number[];
}

export class StreakService {
  private static instance: StreakService;
  
  public static getInstance(): StreakService {
    if (!StreakService.instance) {
      StreakService.instance = new StreakService();
    }
    return StreakService.instance;
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
   * Get user's streak data
   */
  async getStreakData(userId: string): Promise<StreakData> {
    // Mock implementation - in real app, this would fetch from database
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
   * Get streak bonus multiplier
   */
  getStreakBonusMultiplier(currentStreak: number): number {
    if (currentStreak >= 30) return 2.0; // 100% bonus for 30+ day streak
    if (currentStreak >= 14) return 1.5; // 50% bonus for 14+ day streak
    if (currentStreak >= 7) return 1.25; // 25% bonus for 7+ day streak
    if (currentStreak >= 3) return 1.1; // 10% bonus for 3+ day streak
    return 1.0; // No bonus for streaks under 3 days
  }

  /**
   * Get streak status message
   */
  getStreakStatusMessage(streakData: StreakData): string {
    if (streakData.currentStreak === 0) {
      return "Start your cleanup streak today!";
    }
    
    if (streakData.currentStreak === 1) {
      return "Great start! Keep it going tomorrow!";
    }
    
    if (streakData.currentStreak < 7) {
      return `${streakData.currentStreak} days strong! Keep the streak alive!`;
    }
    
    if (streakData.currentStreak < 30) {
      return `Amazing ${streakData.currentStreak}-day streak! You're on fire!`;
    }
    
    return `Incredible ${streakData.currentStreak}-day streak! You're a cleanup legend!`;
  }

  /**
   * Get next streak milestone
   */
  getNextStreakMilestone(currentStreak: number): number | null {
    const milestones = [3, 7, 14, 30, 100];
    return milestones.find(milestone => milestone > currentStreak) || null;
  }

  /**
   * Calculate days until next milestone
   */
  getDaysUntilNextMilestone(currentStreak: number): number | null {
    const nextMilestone = this.getNextStreakMilestone(currentStreak);
    return nextMilestone ? nextMilestone - currentStreak : null;
  }
}

export default StreakService.getInstance();
