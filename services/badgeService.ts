import { Badge } from '../types/badges';
import { XPData } from '../types/xp';

export class BadgeService {
  private static instance: BadgeService;
  
  public static getInstance(): BadgeService {
    if (!BadgeService.instance) {
      BadgeService.instance = new BadgeService();
    }
    return BadgeService.instance;
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
   * Check if user has a specific badge
   */
  private hasBadge(userId: string, badgeId: string): boolean {
    // Mock implementation - in real app, this would check user's badge collection
    return false;
  }

  /**
   * Get user's streak data
   */
  private async getStreakData(userId: string): Promise<any> {
    // Mock implementation
    return {
      currentStreak: 3,
      longestStreak: 12,
      lastActivityDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      streakRewards: [3, 7],
    };
  }

  /**
   * Get all available badges
   */
  async getAllBadges(): Promise<Badge[]> {
    // Mock implementation
    return [
      {
        id: 'first_mission',
        title: 'First Steps',
        description: 'Complete your first mission',
        icon: 'footsteps',
        category: 'missions',
        rarity: 'common',
        unlocked: true,
        unlockedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'cleanup_master',
        title: 'Cleanup Master',
        description: 'Complete 50 cleanup missions',
        icon: 'broom',
        category: 'cleanup',
        rarity: 'epic',
        unlocked: false,
      },
      {
        id: 'community_leader',
        title: 'Community Leader',
        description: 'Help 10 other users complete missions',
        icon: 'people',
        category: 'community',
        rarity: 'rare',
        unlocked: false,
      },
    ];
  }

  /**
   * Get badges by category
   */
  async getBadgesByCategory(category: Badge['category']): Promise<Badge[]> {
    const allBadges = await this.getAllBadges();
    return allBadges.filter(badge => badge.category === category);
  }

  /**
   * Get badge by ID
   */
  async getBadge(badgeId: string): Promise<Badge | undefined> {
    const allBadges = await this.getAllBadges();
    return allBadges.find(badge => badge.id === badgeId);
  }
}

export default BadgeService.getInstance();
