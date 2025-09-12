import { notificationService, NotificationData } from './notificationService';
import { ProximityAlert } from './liveMapService';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../context/XPContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationPreferences {
  proximityAlerts: boolean;
  streakReminders: boolean;
  achievementNotifications: boolean;
  communityEvents: boolean;
  missionReminders: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:MM format
    endTime: string;   // HH:MM format
  };
  frequency: 'low' | 'medium' | 'high';
}

export interface NotificationAnalytics {
  totalSent: number;
  totalOpened: number;
  openRate: number;
  engagementScore: number;
  lastNotificationTime?: Date;
  streakDays: number;
}

export interface SmartNotificationContext {
  userRole: string;
  currentLevel: number;
  currentXP: number;
  lastActiveTime?: Date;
  streakCount: number;
  location?: {
    latitude: number;
    longitude: number;
  };
}

class SmartNotificationManager {
  private preferences: NotificationPreferences | null = null;
  private analytics: NotificationAnalytics = {
    totalSent: 0,
    totalOpened: 0,
    openRate: 0,
    engagementScore: 0,
    streakDays: 0,
  };
  private context: SmartNotificationContext | null = null;
  private isInitialized = false;

  // Initialize the smart notification system
  async initialize(userId: string): Promise<boolean> {
    try {
      // Load user preferences
      await this.loadPreferences(userId);
      
      // Load analytics data
      await this.loadAnalytics(userId);
      
      // Set up notification listeners
      this.setupNotificationListeners();
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize SmartNotificationManager:', error);
      return false;
    }
  }

  // Load user notification preferences
  private async loadPreferences(userId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(`notification_preferences_${userId}`);
      if (stored) {
        this.preferences = JSON.parse(stored);
      } else {
        // Default preferences
        this.preferences = {
          proximityAlerts: true,
          streakReminders: true,
          achievementNotifications: true,
          communityEvents: true,
          missionReminders: true,
          quietHours: {
            enabled: false,
            startTime: '22:00',
            endTime: '08:00',
          },
          frequency: 'medium',
        };
        await this.savePreferences(userId);
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
      this.preferences = this.getDefaultPreferences();
    }
  }

  // Save user notification preferences
  async savePreferences(userId: string, preferences?: NotificationPreferences): Promise<void> {
    try {
      if (preferences) {
        this.preferences = preferences;
      }
      await AsyncStorage.setItem(`notification_preferences_${userId}`, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    }
  }

  // Load notification analytics
  private async loadAnalytics(userId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(`notification_analytics_${userId}`);
      if (stored) {
        this.analytics = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load notification analytics:', error);
    }
  }

  // Save notification analytics
  async saveAnalytics(userId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`notification_analytics_${userId}`, JSON.stringify(this.analytics));
    } catch (error) {
      console.error('Failed to save notification analytics:', error);
    }
  }

  // Update user context for smart notifications
  updateContext(context: Partial<SmartNotificationContext>): void {
    if (!this.context) {
      this.context = {
        userRole: 'trash-hero',
        currentLevel: 1,
        currentXP: 0,
        streakCount: 0,
      };
    }
    this.context = { ...this.context, ...context };
  }

  // Smart proximity notification
  async sendProximityNotification(alert: ProximityAlert): Promise<void> {
    if (!this.shouldSendNotification('proximityAlerts')) return;

    const notification = this.createProximityNotification(alert);
    await this.sendNotification(notification);
  }

  // Streak reminder notification
  async sendStreakReminder(): Promise<void> {
    if (!this.shouldSendNotification('streakReminders')) return;

    const notification = this.createStreakReminderNotification();
    await this.sendNotification(notification);
  }

  // Achievement notification
  async sendAchievementNotification(type: 'level_up' | 'badge_unlocked', data: any): Promise<void> {
    if (!this.shouldSendNotification('achievementNotifications')) return;

    const notification = this.createAchievementNotification(type, data);
    await this.sendNotification(notification);
  }

  // Community event notification
  async sendCommunityEventNotification(eventType: string, eventData: any): Promise<void> {
    if (!this.shouldSendNotification('communityEvents')) return;

    const notification = this.createCommunityEventNotification(eventType, eventData);
    await this.sendNotification(notification);
  }

  // Mission reminder notification
  async sendMissionReminder(missionTitle: string, missionId: string): Promise<void> {
    if (!this.shouldSendNotification('missionReminders')) return;

    const notification = this.createMissionReminderNotification(missionTitle, missionId);
    await this.sendNotification(notification);
  }

  // Check if notification should be sent based on preferences and context
  private shouldSendNotification(type: keyof Omit<NotificationPreferences, 'quietHours' | 'frequency'>): boolean {
    if (!this.preferences || !this.isInitialized) return false;

    // Check if notification type is enabled
    if (!this.preferences[type]) return false;

    // Check quiet hours
    if (this.preferences.quietHours.enabled && this.isInQuietHours()) return false;

    // Check frequency limits
    if (!this.shouldSendBasedOnFrequency()) return false;

    return true;
  }

  // Check if current time is within quiet hours
  private isInQuietHours(): boolean {
    if (!this.preferences?.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const { startTime, endTime } = this.preferences.quietHours;
    
    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    }
    
    // Handle same-day quiet hours (e.g., 12:00 to 14:00)
    return currentTime >= startTime && currentTime <= endTime;
  }

  // Check if notification should be sent based on frequency setting
  private shouldSendBasedOnFrequency(): boolean {
    if (!this.preferences || !this.analytics.lastNotificationTime) return true;

    const now = new Date();
    const timeSinceLastNotification = now.getTime() - this.analytics.lastNotificationTime.getTime();
    const minutesSinceLastNotification = timeSinceLastNotification / (1000 * 60);

    switch (this.preferences.frequency) {
      case 'low':
        return minutesSinceLastNotification >= 60; // Max 1 notification per hour
      case 'medium':
        return minutesSinceLastNotification >= 30; // Max 2 notifications per hour
      case 'high':
        return minutesSinceLastNotification >= 15; // Max 4 notifications per hour
      default:
        return true;
    }
  }

  // Create proximity notification
  private createProximityNotification(alert: ProximityAlert): NotificationData {
    const distance = Math.round(alert.distance);
    const roleEmoji = this.getRoleEmoji(alert.role);
    
    return {
      type: 'trash_encounter',
      id: `proximity_${alert.id}`,
      title: `${roleEmoji} Mission Nearby!`,
      body: `You're ${distance}m from a ${alert.role} mission!`,
      data: {
        alertId: alert.id,
        missionId: alert.missionId,
        distance,
        role: alert.role,
      },
    };
  }

  // Create streak reminder notification
  private createStreakReminderNotification(): NotificationData {
    const streakCount = this.context?.streakCount || 0;
    const streakEmoji = streakCount >= 7 ? '🔥' : streakCount >= 3 ? '⭐' : '🌱';
    
    return {
      type: 'mission_reminder',
      id: `streak_reminder_${Date.now()}`,
      title: `${streakEmoji} Keep Your Streak Alive!`,
      body: `You're on a ${streakCount}-day streak! Complete a mission today to keep it going.`,
      data: {
        streakCount,
        reminderType: 'streak',
      },
    };
  }

  // Create achievement notification
  private createAchievementNotification(type: 'level_up' | 'badge_unlocked', data: any): NotificationData {
    if (type === 'level_up') {
      return {
        type: 'level_up',
        id: `level_up_${data.newLevel}`,
        title: '🎉 Level Up!',
        body: `Congratulations! You've reached level ${data.newLevel}!`,
        data: {
          newLevel: data.newLevel,
          oldLevel: data.oldLevel,
        },
      };
    } else {
      return {
        type: 'badge_unlocked',
        id: `badge_${data.badgeName}`,
        title: '🏆 Badge Unlocked!',
        body: `You've earned the ${data.badgeName} badge!`,
        data: {
          badgeName: data.badgeName,
          badgeDescription: data.badgeDescription,
        },
      };
    }
  }

  // Create community event notification
  private createCommunityEventNotification(eventType: string, eventData: any): NotificationData {
    const eventEmoji = this.getEventEmoji(eventType);
    
    return {
      type: 'station_event',
      id: `community_event_${eventData.id}`,
      title: `${eventEmoji} Community Event!`,
      body: `${eventData.title} is happening nearby!`,
      data: {
        eventId: eventData.id,
        eventType,
        eventData,
      },
    };
  }

  // Create mission reminder notification
  private createMissionReminderNotification(missionTitle: string, missionId: string): NotificationData {
    return {
      type: 'mission_reminder',
      id: `mission_reminder_${missionId}`,
      title: '⏰ Mission Reminder',
      body: `Don't forget about your mission: ${missionTitle}`,
      data: {
        missionId,
        missionTitle,
      },
    };
  }

  // Send notification and update analytics
  private async sendNotification(notification: NotificationData): Promise<void> {
    try {
      notificationService.scheduleNotification(notification);
      
      // Update analytics
      this.analytics.totalSent++;
      this.analytics.lastNotificationTime = new Date();
      this.analytics.openRate = this.analytics.totalOpened / this.analytics.totalSent;
      
      // Calculate engagement score
      this.calculateEngagementScore();
      
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  // Calculate user engagement score
  private calculateEngagementScore(): void {
    const openRate = this.analytics.openRate;
    const streakDays = this.analytics.streakDays;
    const frequency = this.preferences?.frequency || 'medium';
    
    let score = 0;
    
    // Open rate contribution (0-50 points)
    score += Math.min(openRate * 100, 50);
    
    // Streak contribution (0-30 points)
    score += Math.min(streakDays * 2, 30);
    
    // Frequency preference contribution (0-20 points)
    switch (frequency) {
      case 'high': score += 20; break;
      case 'medium': score += 10; break;
      case 'low': score += 5; break;
    }
    
    this.analytics.engagementScore = Math.min(score, 100);
  }

  // Get role emoji
  private getRoleEmoji(role: string): string {
    switch (role) {
      case 'trash-hero': return '🗑️';
      case 'impact-warrior': return '⚔️';
      case 'eco-defender': return '🛡️';
      case 'admin': return '👑';
      default: return '🍐';
    }
  }

  // Get event emoji
  private getEventEmoji(eventType: string): string {
    switch (eventType) {
      case 'pearthquake': return '🌍';
      case 'cleanup': return '🧹';
      case 'education': return '📚';
      case 'conservation': return '🌱';
      default: return '🎉';
    }
  }

  // Get default preferences
  private getDefaultPreferences(): NotificationPreferences {
    return {
      proximityAlerts: true,
      streakReminders: true,
      achievementNotifications: true,
      communityEvents: true,
      missionReminders: true,
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
      },
      frequency: 'medium',
    };
  }

  // Set up notification listeners
  private setupNotificationListeners(): void {
    // Handle notification response (when user taps notification)
    notificationService.addNotificationResponseListener((response) => {
      this.analytics.totalOpened++;
      this.calculateEngagementScore();
      
      // Handle different notification types
      const data = response.notification.request.content.data;
      this.handleNotificationResponse(data);
    });
  }

  // Handle notification response
  private handleNotificationResponse(data: any): void {
    // Navigate to appropriate screen based on notification type
    switch (data.type) {
      case 'proximity':
        // Navigate to map screen
        break;
      case 'mission':
        // Navigate to mission details
        break;
      case 'achievement':
        // Show achievement modal
        break;
      case 'community':
        // Navigate to community events
        break;
    }
  }

  // Get current preferences
  getPreferences(): NotificationPreferences | null {
    return this.preferences;
  }

  // Get analytics
  getAnalytics(): NotificationAnalytics {
    return this.analytics;
  }

  // Update streak count
  async updateStreakCount(userId: string, streakCount: number): Promise<void> {
    this.analytics.streakDays = streakCount;
    await this.saveAnalytics(userId);
  }
}

// Export singleton instance
export const smartNotificationManager = new SmartNotificationManager();

// Helper function to initialize smart notifications
export const initializeSmartNotifications = async (userId: string): Promise<boolean> => {
  return await smartNotificationManager.initialize(userId);
};
