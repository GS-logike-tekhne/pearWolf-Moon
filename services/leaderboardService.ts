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

export class LeaderboardService {
  private static instance: LeaderboardService;
  
  public static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }
    return LeaderboardService.instance;
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
      {
        userId: 'user4',
        username: 'TrashTerminator',
        role: 'trash-hero',
        totalXP: 1820,
        level: 6,
        missionsCompleted: 15,
        ecoPoints: 450,
        rank: 4,
      },
      {
        userId: 'user5',
        username: 'EcoExplorer',
        role: 'eco-defender',
        totalXP: 1650,
        level: 5,
        missionsCompleted: 13,
        ecoPoints: 420,
        rank: 5,
      },
    ];

    // Sort by category
    let sortedUsers = [...mockUsers];
    switch (category) {
      case 'xp':
        sortedUsers.sort((a, b) => b.totalXP - a.totalXP);
        break;
      case 'missions':
        sortedUsers.sort((a, b) => b.missionsCompleted - a.missionsCompleted);
        break;
      case 'eco_points':
        sortedUsers.sort((a, b) => b.ecoPoints - a.ecoPoints);
        break;
      case 'streak':
        // Mock streak data
        sortedUsers.forEach(user => {
          (user as any).currentStreak = Math.floor(Math.random() * 30) + 1;
        });
        sortedUsers.sort((a, b) => (b as any).currentStreak - (a as any).currentStreak);
        break;
    }

    // Update ranks
    sortedUsers.forEach((user, index) => {
      user.rank = index + 1;
    });

    return sortedUsers.slice(0, limit);
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
      {
        id: 'streak_warrior',
        title: 'Streak Warrior',
        description: 'Maintain a 7-day cleanup streak',
        icon: 'flame',
        unlocked: false,
        progress: 3,
        maxProgress: 7,
        category: 'special',
      },
    ];
  }

  /**
   * Get user's rank in leaderboard
   */
  async getUserRank(userId: string, category: 'xp' | 'missions' | 'eco_points' | 'streak'): Promise<number | null> {
    const leaderboard = await this.getLeaderboard(category, 100); // Get more entries to find user
    const userEntry = leaderboard.find(entry => entry.userId === userId);
    return userEntry ? userEntry.rank : null;
  }

  /**
   * Get leaderboard for specific role
   */
  async getRoleLeaderboard(role: string, category: 'xp' | 'missions' | 'eco_points' | 'streak', limit: number = 10): Promise<LeaderboardEntry[]> {
    const leaderboard = await this.getLeaderboard(category, 100);
    const roleUsers = leaderboard.filter(entry => entry.role === role);
    return roleUsers.slice(0, limit);
  }

  /**
   * Get weekly leaderboard
   */
  async getWeeklyLeaderboard(category: 'xp' | 'missions' | 'eco_points' | 'streak', limit: number = 10): Promise<LeaderboardEntry[]> {
    // Mock implementation - in real app, this would filter by weekly data
    const leaderboard = await this.getLeaderboard(category, limit);
    
    // Add weekly progress data
    leaderboard.forEach(user => {
      (user as any).weeklyXP = Math.floor(user.totalXP * 0.2); // Mock 20% of total as weekly
      (user as any).weeklyMissions = Math.floor(user.missionsCompleted * 0.3); // Mock 30% as weekly
    });

    return leaderboard;
  }

  /**
   * Get global stats
   */
  async getGlobalStats(): Promise<{
    totalUsers: number;
    totalMissionsCompleted: number;
    totalEcoPointsEarned: number;
    totalXP: number;
  }> {
    // Mock global stats
    return {
      totalUsers: 15420,
      totalMissionsCompleted: 89234,
      totalEcoPointsEarned: 2345678,
      totalXP: 5678901,
    };
  }
}

export default LeaderboardService.getInstance();
