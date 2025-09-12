import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserStats {
  userId: string;
  username: string;
  role: string;
  totalXP: number;
  level: number;
  missionsCompleted: number;
  totalImpact: {
    trashCollected: number;
    co2Reduced: number;
    hoursVolunteered: number;
  };
  joinDate: Date;
  lastActive: Date;
  verificationStatus: 'none' | 'kyc' | 'background_check';
  badges: string[];
}

export interface MissionStats {
  missionId: string;
  title: string;
  type: string;
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  participants: number;
  maxParticipants: number;
  completionRate: number;
  averageRating: number;
  totalXP: number;
  totalImpact: {
    trashCollected: number;
    co2Reduced: number;
  };
  createdDate: Date;
  completedDate?: Date;
  location: {
    city: string;
    state: string;
    coordinates: { latitude: number; longitude: number };
  };
}

export interface ImpactStats {
  totalUsers: number;
  totalMissions: number;
  totalXP: number;
  totalImpact: {
    trashCollected: number;
    co2Reduced: number;
    hoursVolunteered: number;
  };
  averageUserLevel: number;
  topPerformers: UserStats[];
  missionTypes: {
    [key: string]: {
      count: number;
      completionRate: number;
      averageXP: number;
    };
  };
  locationStats: {
    [key: string]: {
      city: string;
      state: string;
      missionCount: number;
      userCount: number;
      totalImpact: number;
    };
  };
  timeStats: {
    daily: { [key: string]: number };
    weekly: { [key: string]: number };
    monthly: { [key: string]: number };
  };
}

export interface AdminDashboard {
  impactStats: ImpactStats;
  recentActivity: {
    newUsers: UserStats[];
    completedMissions: MissionStats[];
    newMissions: MissionStats[];
  };
  alerts: {
    type: 'warning' | 'error' | 'info' | 'success';
    message: string;
    timestamp: Date;
    actionRequired: boolean;
  }[];
  systemHealth: {
    activeUsers: number;
    serverStatus: 'healthy' | 'warning' | 'error';
    databaseStatus: 'healthy' | 'warning' | 'error';
    apiResponseTime: number;
  };
}

export class AdminAnalyticsService {
  private static instance: AdminAnalyticsService;
  private readonly STORAGE_KEYS = {
    USER_STATS: 'admin_user_stats',
    MISSION_STATS: 'admin_mission_stats',
    IMPACT_STATS: 'admin_impact_stats',
    DASHBOARD: 'admin_dashboard',
  };

  private constructor() {}

  public static getInstance(): AdminAnalyticsService {
    if (!AdminAnalyticsService.instance) {
      AdminAnalyticsService.instance = new AdminAnalyticsService();
    }
    return AdminAnalyticsService.instance;
  }

  /**
   * Get comprehensive admin dashboard data
   */
  async getAdminDashboard(): Promise<AdminDashboard> {
    try {
      const [impactStats, recentActivity, alerts, systemHealth] = await Promise.all([
        this.getImpactStats(),
        this.getRecentActivity(),
        this.getAlerts(),
        this.getSystemHealth(),
      ]);

      return {
        impactStats,
        recentActivity,
        alerts,
        systemHealth,
      };
    } catch (error) {
      console.error('Error getting admin dashboard:', error);
      throw error;
    }
  }

  /**
   * Get impact statistics
   */
  async getImpactStats(): Promise<ImpactStats> {
    try {
      // In a real app, this would query the database
      // For now, return mock data
      const mockData: ImpactStats = {
        totalUsers: 1250,
        totalMissions: 340,
        totalXP: 125000,
        totalImpact: {
          trashCollected: 2500, // kg
          co2Reduced: 125, // kg
          hoursVolunteered: 850,
        },
        averageUserLevel: 8.5,
        topPerformers: await this.getTopPerformers(),
        missionTypes: {
          'CLEANUP': { count: 120, completionRate: 85, averageXP: 150 },
          'RECYCLING': { count: 80, completionRate: 90, averageXP: 100 },
          'EDUCATION': { count: 60, completionRate: 75, averageXP: 80 },
          'COMMUNITY': { count: 80, completionRate: 88, averageXP: 120 },
        },
        locationStats: {
          'NYC': { city: 'New York', state: 'NY', missionCount: 120, userCount: 450, totalImpact: 800 },
          'LA': { city: 'Los Angeles', state: 'CA', missionCount: 80, userCount: 300, totalImpact: 600 },
          'CHI': { city: 'Chicago', state: 'IL', missionCount: 60, userCount: 200, totalImpact: 400 },
          'SEA': { city: 'Seattle', state: 'WA', missionCount: 80, userCount: 300, totalImpact: 700 },
        },
        timeStats: {
          daily: this.generateTimeStats('daily'),
          weekly: this.generateTimeStats('weekly'),
          monthly: this.generateTimeStats('monthly'),
        },
      };

      return mockData;
    } catch (error) {
      console.error('Error getting impact stats:', error);
      throw error;
    }
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(): Promise<AdminDashboard['recentActivity']> {
    try {
      return {
        newUsers: await this.getNewUsers(10),
        completedMissions: await this.getCompletedMissions(10),
        newMissions: await this.getNewMissions(10),
      };
    } catch (error) {
      console.error('Error getting recent activity:', error);
      throw error;
    }
  }

  /**
   * Get system alerts
   */
  async getAlerts(): Promise<AdminDashboard['alerts']> {
    try {
      // In a real app, this would check system status
      return [
        {
          type: 'warning',
          message: 'High server load detected in NYC region',
          timestamp: new Date(),
          actionRequired: true,
        },
        {
          type: 'info',
          message: 'New user verification batch processed',
          timestamp: new Date(Date.now() - 3600000),
          actionRequired: false,
        },
        {
          type: 'success',
          message: 'Mission completion rate increased by 15% this week',
          timestamp: new Date(Date.now() - 7200000),
          actionRequired: false,
        },
      ];
    } catch (error) {
      console.error('Error getting alerts:', error);
      throw error;
    }
  }

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<AdminDashboard['systemHealth']> {
    try {
      // In a real app, this would check actual system metrics
      return {
        activeUsers: 450,
        serverStatus: 'healthy',
        databaseStatus: 'healthy',
        apiResponseTime: 120, // ms
      };
    } catch (error) {
      console.error('Error getting system health:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId?: string): Promise<UserStats[]> {
    try {
      // In a real app, this would query the database
      const mockUsers: UserStats[] = [
        {
          userId: 'user1',
          username: 'EcoWarrior123',
          role: 'trash-hero',
          totalXP: 2500,
          level: 12,
          missionsCompleted: 25,
          totalImpact: {
            trashCollected: 45,
            co2Reduced: 2.3,
            hoursVolunteered: 18,
          },
          joinDate: new Date('2024-01-15'),
          lastActive: new Date(),
          verificationStatus: 'background_check',
          badges: ['Eco Champion', 'Trash Hero', 'Community Leader'],
        },
        {
          userId: 'user2',
          username: 'GreenThumb',
          role: 'volunteer',
          totalXP: 1800,
          level: 9,
          missionsCompleted: 18,
          totalImpact: {
            trashCollected: 32,
            co2Reduced: 1.8,
            hoursVolunteered: 14,
          },
          joinDate: new Date('2024-02-01'),
          lastActive: new Date(Date.now() - 86400000),
          verificationStatus: 'kyc',
          badges: ['Eco Champion', 'Trash Hero'],
        },
      ];

      return userId ? mockUsers.filter(user => user.userId === userId) : mockUsers;
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Get mission statistics
   */
  async getMissionStats(missionId?: string): Promise<MissionStats[]> {
    try {
      // In a real app, this would query the database
      const mockMissions: MissionStats[] = [
        {
          missionId: 'mission1',
          title: 'Central Park Cleanup',
          type: 'CLEANUP',
          status: 'completed',
          participants: 15,
          maxParticipants: 20,
          completionRate: 100,
          averageRating: 4.8,
          totalXP: 2250,
          totalImpact: {
            trashCollected: 45,
            co2Reduced: 2.3,
          },
          createdDate: new Date('2024-01-20'),
          completedDate: new Date('2024-01-22'),
          location: {
            city: 'New York',
            state: 'NY',
            coordinates: { latitude: 40.7829, longitude: -73.9654 },
          },
        },
      ];

      return missionId ? mockMissions.filter(mission => mission.missionId === missionId) : mockMissions;
    } catch (error) {
      console.error('Error getting mission stats:', error);
      throw error;
    }
  }

  /**
   * Export data to CSV
   */
  async exportToCSV(dataType: 'users' | 'missions' | 'impact'): Promise<string> {
    try {
      let data: any[];
      let headers: string[];

      switch (dataType) {
        case 'users':
          data = await this.getUserStats();
          headers = ['User ID', 'Username', 'Role', 'Total XP', 'Level', 'Missions Completed', 'Trash Collected', 'CO2 Reduced', 'Hours Volunteered', 'Join Date', 'Last Active', 'Verification Status'];
          break;
        case 'missions':
          data = await this.getMissionStats();
          headers = ['Mission ID', 'Title', 'Type', 'Status', 'Participants', 'Max Participants', 'Completion Rate', 'Average Rating', 'Total XP', 'Trash Collected', 'CO2 Reduced', 'Created Date', 'Completed Date', 'City', 'State'];
          break;
        case 'impact':
          const impactStats = await this.getImpactStats();
          data = [impactStats];
          headers = ['Total Users', 'Total Missions', 'Total XP', 'Total Trash Collected', 'Total CO2 Reduced', 'Total Hours Volunteered', 'Average User Level'];
          break;
        default:
          throw new Error('Invalid data type for export');
      }

      // Convert to CSV format
      const csvContent = [
        headers.join(','),
        ...data.map(row => this.convertRowToCSV(row, headers))
      ].join('\n');

      return csvContent;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }

  /**
   * Switch user role (for testing)
   */
  async switchUserRole(userId: string, newRole: string): Promise<boolean> {
    try {
      // In a real app, this would update the database
      console.log(`Switching user ${userId} to role: ${newRole}`);
      return true;
    } catch (error) {
      console.error('Error switching user role:', error);
      return false;
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private async getTopPerformers(limit: number = 10): Promise<UserStats[]> {
    const users = await this.getUserStats();
    return users
      .sort((a, b) => b.totalXP - a.totalXP)
      .slice(0, limit);
  }

  private async getNewUsers(limit: number): Promise<UserStats[]> {
    const users = await this.getUserStats();
    return users
      .sort((a, b) => b.joinDate.getTime() - a.joinDate.getTime())
      .slice(0, limit);
  }

  private async getCompletedMissions(limit: number): Promise<MissionStats[]> {
    const missions = await this.getMissionStats();
    return missions
      .filter(mission => mission.status === 'completed')
      .sort((a, b) => (b.completedDate?.getTime() || 0) - (a.completedDate?.getTime() || 0))
      .slice(0, limit);
  }

  private async getNewMissions(limit: number): Promise<MissionStats[]> {
    const missions = await this.getMissionStats();
    return missions
      .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime())
      .slice(0, limit);
  }

  private generateTimeStats(period: 'daily' | 'weekly' | 'monthly'): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    const now = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      if (period === 'daily') {
        date.setDate(date.getDate() - i);
        stats[date.toISOString().split('T')[0]] = Math.floor(Math.random() * 100);
      } else if (period === 'weekly') {
        date.setDate(date.getDate() - (i * 7));
        stats[date.toISOString().split('T')[0]] = Math.floor(Math.random() * 500);
      } else if (period === 'monthly') {
        date.setMonth(date.getMonth() - i);
        stats[date.toISOString().split('T')[0]] = Math.floor(Math.random() * 2000);
      }
    }
    
    return stats;
  }

  private convertRowToCSV(row: any, headers: string[]): string {
    return headers.map(header => {
      const value = this.getNestedValue(row, header);
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(',');
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(' ').reduce((current, key) => {
      if (current && typeof current === 'object') {
        const camelKey = key.toLowerCase().replace(/\s+/g, '');
        return current[camelKey] || current[key];
      }
      return current;
    }, obj);
  }
}

export default AdminAnalyticsService.getInstance();
