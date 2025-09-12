import AsyncStorage from '@react-native-async-storage/async-storage';
import { smartNotificationManager } from './smartNotificationManager';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakStartDate: string;
  totalDaysActive: number;
  streakHistory: StreakRecord[];
}

export interface StreakRecord {
  date: string;
  activitiesCompleted: number;
  xpEarned: number;
  missionsCompleted: number;
  streakMaintained: boolean;
}

export interface StreakReminderConfig {
  reminderTimes: string[]; // HH:MM format
  reminderTypes: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    streakEndangered: boolean;
  };
  personalizedMessages: boolean;
  streakGoals: {
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

class StreakReminderService {
  private streakData: StreakData | null = null;
  private reminderConfig: StreakReminderConfig | null = null;
  private isInitialized = false;

  // Initialize streak reminder service
  async initialize(userId: string): Promise<boolean> {
    try {
      await this.loadStreakData(userId);
      await this.loadReminderConfig(userId);
      this.setupStreakTracking();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize StreakReminderService:', error);
      return false;
    }
  }

  // Load streak data from storage
  private async loadStreakData(userId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(`streak_data_${userId}`);
      if (stored) {
        this.streakData = JSON.parse(stored);
      } else {
        this.streakData = this.getDefaultStreakData();
        await this.saveStreakData(userId);
      }
    } catch (error) {
      console.error('Failed to load streak data:', error);
      this.streakData = this.getDefaultStreakData();
    }
  }

  // Save streak data to storage
  async saveStreakData(userId: string): Promise<void> {
    try {
      if (this.streakData) {
        await AsyncStorage.setItem(`streak_data_${userId}`, JSON.stringify(this.streakData));
      }
    } catch (error) {
      console.error('Failed to save streak data:', error);
    }
  }

  // Load reminder configuration
  private async loadReminderConfig(userId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(`streak_reminder_config_${userId}`);
      if (stored) {
        this.reminderConfig = JSON.parse(stored);
      } else {
        this.reminderConfig = this.getDefaultReminderConfig();
        await this.saveReminderConfig(userId);
      }
    } catch (error) {
      console.error('Failed to load reminder config:', error);
      this.reminderConfig = this.getDefaultReminderConfig();
    }
  }

  // Save reminder configuration
  async saveReminderConfig(userId: string, config?: StreakReminderConfig): Promise<void> {
    try {
      if (config) {
        this.reminderConfig = config;
      }
      if (this.reminderConfig) {
        await AsyncStorage.setItem(`streak_reminder_config_${userId}`, JSON.stringify(this.reminderConfig));
      }
    } catch (error) {
      console.error('Failed to save reminder config:', error);
    }
  }

  // Record daily activity
  async recordActivity(userId: string, activity: {
    missionsCompleted: number;
    xpEarned: number;
    activitiesCompleted: number;
  }): Promise<void> {
    if (!this.streakData) return;

    const today = new Date().toISOString().split('T')[0];
    const lastActivityDate = this.streakData.lastActivityDate;

    // Check if this is a new day
    if (today !== lastActivityDate) {
      // Check if streak was broken
      if (this.isStreakBroken(lastActivityDate, today)) {
        this.handleStreakBreak();
      }

      // Update streak data
      this.streakData.currentStreak = this.calculateNewStreak(lastActivityDate, today);
      this.streakData.lastActivityDate = today;
      this.streakData.totalDaysActive++;

      // Add new streak record
      const newRecord: StreakRecord = {
        date: today,
        activitiesCompleted: activity.activitiesCompleted,
        xpEarned: activity.xpEarned,
        missionsCompleted: activity.missionsCompleted,
        streakMaintained: true,
      };

      this.streakData.streakHistory.push(newRecord);

      // Update longest streak
      if (this.streakData.currentStreak > this.streakData.longestStreak) {
        this.streakData.longestStreak = this.streakData.currentStreak;
      }

      // Update streak start date if new streak
      if (this.streakData.currentStreak === 1) {
        this.streakData.streakStartDate = today;
      }

      await this.saveStreakData(userId);
      await smartNotificationManager.updateStreakCount(userId, this.streakData.currentStreak);
    } else {
      // Update today's record
      const todayRecord = this.streakData.streakHistory[this.streakData.streakHistory.length - 1];
      if (todayRecord) {
        todayRecord.activitiesCompleted += activity.activitiesCompleted;
        todayRecord.xpEarned += activity.xpEarned;
        todayRecord.missionsCompleted += activity.missionsCompleted;
        await this.saveStreakData(userId);
      }
    }
  }

  // Check if streak was broken
  private isStreakBroken(lastDate: string, currentDate: string): boolean {
    const last = new Date(lastDate);
    const current = new Date(currentDate);
    const diffDays = Math.floor((current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    
    // Streak is broken if more than 1 day has passed
    return diffDays > 1;
  }

  // Calculate new streak after potential break
  private calculateNewStreak(lastDate: string, currentDate: string): number {
    const last = new Date(lastDate);
    const current = new Date(currentDate);
    const diffDays = Math.floor((current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Streak continues
      return (this.streakData?.currentStreak || 0) + 1;
    } else {
      // Streak broken, start over
      return 1;
    }
  }

  // Handle streak break
  private handleStreakBreak(): void {
    if (!this.streakData) return;

    // Send streak break notification
    smartNotificationManager.sendStreakReminder();
  }

  // Check if reminders should be sent
  async checkAndSendReminders(userId: string): Promise<void> {
    if (!this.reminderConfig || !this.streakData) return;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];

    // Check if user has been active today
    const hasBeenActiveToday = this.streakData.lastActivityDate === today;

    // Send different types of reminders based on time and activity
    if (this.shouldSendMorningReminder(currentTime, hasBeenActiveToday)) {
      await this.sendMorningReminder();
    } else if (this.shouldSendAfternoonReminder(currentTime, hasBeenActiveToday)) {
      await this.sendAfternoonReminder();
    } else if (this.shouldSendEveningReminder(currentTime, hasBeenActiveToday)) {
      await this.sendEveningReminder();
    } else if (this.shouldSendStreakEndangeredReminder(hasBeenActiveToday)) {
      await this.sendStreakEndangeredReminder();
    }
  }

  // Check if morning reminder should be sent
  private shouldSendMorningReminder(currentTime: string, hasBeenActive: boolean): boolean {
    if (!this.reminderConfig?.reminderTypes.morning || hasBeenActive) return false;
    
    const morningReminderTime = this.reminderConfig.reminderTimes[0] || '09:00';
    return currentTime === morningReminderTime;
  }

  // Check if afternoon reminder should be sent
  private shouldSendAfternoonReminder(currentTime: string, hasBeenActive: boolean): boolean {
    if (!this.reminderConfig?.reminderTypes.afternoon || hasBeenActive) return false;
    
    const afternoonReminderTime = this.reminderConfig.reminderTimes[1] || '15:00';
    return currentTime === afternoonReminderTime;
  }

  // Check if evening reminder should be sent
  private shouldSendEveningReminder(currentTime: string, hasBeenActive: boolean): boolean {
    if (!this.reminderConfig?.reminderTypes.evening || hasBeenActive) return false;
    
    const eveningReminderTime = this.reminderConfig.reminderTimes[2] || '20:00';
    return currentTime === eveningReminderTime;
  }

  // Check if streak endangered reminder should be sent
  private shouldSendStreakEndangeredReminder(hasBeenActive: boolean): boolean {
    if (!this.reminderConfig?.reminderTypes.streakEndangered || hasBeenActive) return false;
    
    const now = new Date();
    const hour = now.getHours();
    
    // Send reminder in the evening if streak is at risk
    return hour >= 19 && hour <= 21;
  }

  // Send morning reminder
  private async sendMorningReminder(): Promise<void> {
    const message = this.generatePersonalizedMessage('morning');
    await smartNotificationManager.sendStreakReminder();
  }

  // Send afternoon reminder
  private async sendAfternoonReminder(): Promise<void> {
    const message = this.generatePersonalizedMessage('afternoon');
    await smartNotificationManager.sendStreakReminder();
  }

  // Send evening reminder
  private async sendEveningReminder(): Promise<void> {
    const message = this.generatePersonalizedMessage('evening');
    await smartNotificationManager.sendStreakReminder();
  }

  // Send streak endangered reminder
  private async sendStreakEndangeredReminder(): Promise<void> {
    const message = this.generatePersonalizedMessage('streakEndangered');
    await smartNotificationManager.sendStreakReminder();
  }

  // Generate personalized reminder message
  private generatePersonalizedMessage(type: 'morning' | 'afternoon' | 'evening' | 'streakEndangered'): string {
    if (!this.streakData || !this.reminderConfig?.personalizedMessages) {
      return this.getDefaultMessage(type);
    }

    const streak = this.streakData.currentStreak;
    const longestStreak = this.streakData.longestStreak;

    switch (type) {
      case 'morning':
        return streak >= 7 
          ? `Good morning! Your ${streak}-day streak is amazing! Keep it going today.`
          : `Good morning! Start your day with a cleanup mission and build your ${streak}-day streak!`;
      
      case 'afternoon':
        return streak >= 3
          ? `Afternoon reminder: Your ${streak}-day streak is looking great! Don't break it today.`
          : `Afternoon check-in: Ready to continue your ${streak}-day streak?`;
      
      case 'evening':
        return streak >= 5
          ? `Evening reminder: Your ${streak}-day streak is impressive! One more mission today?`
          : `Evening check-in: Don't let your ${streak}-day streak end today!`;
      
      case 'streakEndangered':
        return streak >= 10
          ? `⚠️ Your ${streak}-day streak is at risk! Complete a mission to save it!`
          : `⚠️ Don't break your ${streak}-day streak! Complete a mission now!`;
      
      default:
        return this.getDefaultMessage(type);
    }
  }

  // Get default reminder message
  private getDefaultMessage(type: 'morning' | 'afternoon' | 'evening' | 'streakEndangered'): string {
    switch (type) {
      case 'morning':
        return 'Good morning! Start your day with a cleanup mission!';
      case 'afternoon':
        return 'Afternoon reminder: Ready for a cleanup mission?';
      case 'evening':
        return 'Evening reminder: Don\'t forget your daily cleanup!';
      case 'streakEndangered':
        return '⚠️ Your streak is at risk! Complete a mission to save it!';
      default:
        return 'Don\'t forget your daily cleanup mission!';
    }
  }

  // Setup streak tracking
  private setupStreakTracking(): void {
    // Set up periodic checks for reminders
    // In a real app, you'd use background tasks or push notifications
    setInterval(() => {
      // Check if reminders should be sent
      // This would be called periodically throughout the day
    }, 60000); // Check every minute
  }

  // Get default streak data
  private getDefaultStreakData(): StreakData {
    const today = new Date().toISOString().split('T')[0];
    
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: today,
      streakStartDate: today,
      totalDaysActive: 0,
      streakHistory: [],
    };
  }

  // Get default reminder configuration
  private getDefaultReminderConfig(): StreakReminderConfig {
    return {
      reminderTimes: ['09:00', '15:00', '20:00'],
      reminderTypes: {
        morning: true,
        afternoon: true,
        evening: true,
        streakEndangered: true,
      },
      personalizedMessages: true,
      streakGoals: {
        weekly: 7,
        monthly: 30,
        yearly: 365,
      },
    };
  }

  // Get current streak data
  getStreakData(): StreakData | null {
    return this.streakData;
  }

  // Get reminder configuration
  getReminderConfig(): StreakReminderConfig | null {
    return this.reminderConfig;
  }

  // Get streak statistics
  getStreakStats(): {
    currentStreak: number;
    longestStreak: number;
    totalDaysActive: number;
    streakPercentage: number;
    averageDailyActivities: number;
  } {
    if (!this.streakData) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalDaysActive: 0,
        streakPercentage: 0,
        averageDailyActivities: 0,
      };
    }

    const totalActivities = this.streakData.streakHistory.reduce(
      (sum, record) => sum + record.activitiesCompleted,
      0
    );

    const averageDailyActivities = this.streakData.totalDaysActive > 0 
      ? totalActivities / this.streakData.totalDaysActive 
      : 0;

    const streakPercentage = this.streakData.longestStreak > 0 
      ? (this.streakData.currentStreak / this.streakData.longestStreak) * 100 
      : 0;

    return {
      currentStreak: this.streakData.currentStreak,
      longestStreak: this.streakData.longestStreak,
      totalDaysActive: this.streakData.totalDaysActive,
      streakPercentage,
      averageDailyActivities,
    };
  }
}

// Export singleton instance
export const streakReminderService = new StreakReminderService();

// Helper function to initialize streak reminders
export const initializeStreakReminders = async (userId: string): Promise<boolean> => {
  return await streakReminderService.initialize(userId);
};
