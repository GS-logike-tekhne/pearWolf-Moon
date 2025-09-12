import { EventEmitter } from 'events';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RealTimeNotification {
  id: string;
  type: 'mission_completed' | 'level_up' | 'badge_unlocked' | 'streak_milestone' | 'social_activity' | 'system_alert';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userId: string;
  actionUrl?: string;
  actionText?: string;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  types: {
    mission_completed: boolean;
    level_up: boolean;
    badge_unlocked: boolean;
    streak_milestone: boolean;
    social_activity: boolean;
    system_alert: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "08:00"
  };
  frequency: 'instant' | 'digest' | 'daily';
}

class RealTimeNotificationService extends EventEmitter {
  private static instance: RealTimeNotificationService;
  private notifications: RealTimeNotification[] = [];
  private preferences: NotificationPreferences;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  private constructor() {
    super();
    this.preferences = this.getDefaultPreferences();
    this.loadNotifications();
    this.loadPreferences();
    this.setupConnection();
  }

  static getInstance(): RealTimeNotificationService {
    if (!RealTimeNotificationService.instance) {
      RealTimeNotificationService.instance = new RealTimeNotificationService();
    }
    return RealTimeNotificationService.instance;
  }

  private getDefaultPreferences(): NotificationPreferences {
    return {
      pushEnabled: true,
      emailEnabled: false,
      inAppEnabled: true,
      types: {
        mission_completed: true,
        level_up: true,
        badge_unlocked: true,
        streak_milestone: true,
        social_activity: true,
        system_alert: true,
      },
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00',
      },
      frequency: 'instant',
    };
  }

  private async loadNotifications(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('realTimeNotifications');
      if (stored) {
        this.notifications = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  private async saveNotifications(): Promise<void> {
    try {
      await AsyncStorage.setItem('realTimeNotifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  private async loadPreferences(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('notificationPreferences');
      if (stored) {
        this.preferences = { ...this.preferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }

  private async savePreferences(): Promise<void> {
    try {
      await AsyncStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  private setupConnection(): void {
    // Simulate WebSocket connection
    this.simulateConnection();
  }

  private simulateConnection(): void {
    // In a real app, this would be a WebSocket connection
    setTimeout(() => {
      this.isConnected = true;
      this.emit('connected');
      this.reconnectAttempts = 0;
    }, 1000);
  }

  private isInQuietHours(): boolean {
    if (!this.preferences.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = this.parseTime(this.preferences.quietHours.start);
    const endTime = this.parseTime(this.preferences.quietHours.end);
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  async sendNotification(notification: Omit<RealTimeNotification, 'id' | 'timestamp' | 'read'>): Promise<void> {
    const newNotification: RealTimeNotification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false,
    };

    // Check if user wants this type of notification
    if (!this.preferences.types[notification.type]) {
      return;
    }

    // Check quiet hours
    if (this.isInQuietHours() && notification.priority !== 'urgent') {
      // Store for later delivery
      await this.scheduleNotification(newNotification);
      return;
    }

    // Add to notifications list
    this.notifications.unshift(newNotification);
    
    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    await this.saveNotifications();
    this.emit('notification', newNotification);

    // Send push notification if enabled
    if (this.preferences.pushEnabled) {
      await this.sendPushNotification(newNotification);
    }
  }

  private async scheduleNotification(notification: RealTimeNotification): Promise<void> {
    // In a real app, this would schedule the notification for later
    console.log('Notification scheduled for after quiet hours:', notification.title);
  }

  private async sendPushNotification(notification: RealTimeNotification): Promise<void> {
    // In a real app, this would use Expo Notifications or similar
    console.log('Push notification sent:', notification.title);
  }

  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      await this.saveNotifications();
      this.emit('notificationRead', notification);
    }
  }

  async markAllAsRead(): Promise<void> {
    this.notifications.forEach(n => n.read = true);
    await this.saveNotifications();
    this.emit('allNotificationsRead');
  }

  async deleteNotification(notificationId: string): Promise<void> {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    await this.saveNotifications();
    this.emit('notificationDeleted', notificationId);
  }

  async clearAllNotifications(): Promise<void> {
    this.notifications = [];
    await this.saveNotifications();
    this.emit('allNotificationsCleared');
  }

  getNotifications(): RealTimeNotification[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getNotificationsByType(type: RealTimeNotification['type']): RealTimeNotification[] {
    return this.notifications.filter(n => n.type === type);
  }

  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    this.preferences = { ...this.preferences, ...preferences };
    await this.savePreferences();
    this.emit('preferencesUpdated', this.preferences);
  }

  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  // Convenience methods for common notification types
  async notifyMissionCompleted(missionId: string, userId: string, xpGained: number): Promise<void> {
    await this.sendNotification({
      type: 'mission_completed',
      title: 'Mission Completed! 🎉',
      message: `You earned ${xpGained} XP for completing this mission!`,
      data: { missionId, xpGained },
      priority: 'medium',
      userId,
      actionUrl: `/missions/${missionId}`,
      actionText: 'View Mission',
    });
  }

  async notifyLevelUp(userId: string, newLevel: number): Promise<void> {
    await this.sendNotification({
      type: 'level_up',
      title: 'Level Up! ⭐',
      message: `Congratulations! You've reached level ${newLevel}!`,
      data: { newLevel },
      priority: 'high',
      userId,
      actionUrl: '/profile',
      actionText: 'View Profile',
    });
  }

  async notifyBadgeUnlocked(userId: string, badgeName: string, badgeId: string): Promise<void> {
    await this.sendNotification({
      type: 'badge_unlocked',
      title: 'New Badge Unlocked! 🏆',
      message: `You've earned the "${badgeName}" badge!`,
      data: { badgeId, badgeName },
      priority: 'high',
      userId,
      actionUrl: '/badges',
      actionText: 'View Badges',
    });
  }

  async notifyStreakMilestone(userId: string, streak: number): Promise<void> {
    await this.sendNotification({
      type: 'streak_milestone',
      title: 'Streak Milestone! 🔥',
      message: `Amazing! You've maintained a ${streak}-day streak!`,
      data: { streak },
      priority: 'medium',
      userId,
      actionUrl: '/profile',
      actionText: 'View Profile',
    });
  }

  async notifySocialActivity(userId: string, activityType: string, data: any): Promise<void> {
    await this.sendNotification({
      type: 'social_activity',
      title: 'Social Activity',
      message: `Someone ${activityType} your activity!`,
      data,
      priority: 'low',
      userId,
      actionUrl: '/social',
      actionText: 'View Activity',
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Connection management
  isOnline(): boolean {
    return this.isConnected;
  }

  async reconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('connectionFailed');
      return;
    }

    this.reconnectAttempts++;
    this.isConnected = false;
    
    setTimeout(() => {
      this.simulateConnection();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  disconnect(): void {
    this.isConnected = false;
    this.emit('disconnected');
  }
}

export default RealTimeNotificationService;
