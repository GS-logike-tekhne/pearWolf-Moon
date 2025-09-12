import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  type: 'trash_encounter' | 'station_event' | 'mission_reminder' | 'level_up' | 'badge_unlocked';
  id: string;
  title: string;
  body: string;
  data?: any;
  trigger?: Notifications.NotificationTriggerInput;
}

export interface LocationNotification {
  latitude: number;
  longitude: number;
  radius: number; // in meters
  type: 'trash_spawn' | 'station_nearby' | 'mission_available';
}

class NotificationService {
  private notifications: Map<string, LocationNotification> = new Map();
  private userLocation: { latitude: number; longitude: number } | null = null;
  private isMonitoring = false;

  // Initialize notification permissions
  async initialize(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Notification Permission',
          'PEAR needs notification permission to alert you about nearby trash encounters and station events.',
          [{ text: 'OK' }]
        );
        return false;
      }

      // Register for push notifications
      await this.registerForPushNotifications();
      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  // Register for push notifications
  private async registerForPushNotifications(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Push notification token:', token.data);
      
      // In a real app, send this token to your backend
      // await api.registerPushToken(token.data);
      
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Update user location for proximity notifications
  updateUserLocation(latitude: number, longitude: number): void {
    this.userLocation = { latitude, longitude };
    this.checkProximityNotifications();
  }

  // Schedule location-based notification
  scheduleLocationNotification(
    id: string,
    notification: NotificationData,
    location: LocationNotification
  ): void {
    this.notifications.set(id, location);
    
    // Schedule the notification
    Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sound: 'default',
      },
      trigger: {
        type: 'location',
        latitude: location.latitude,
        longitude: location.longitude,
        radius: location.radius,
      } as Notifications.NotificationTriggerInput,
    });
  }

  // Schedule time-based notification
  scheduleNotification(notification: NotificationData): void {
    Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sound: 'default',
      },
      trigger: notification.trigger || null,
    });
  }

  // Check for nearby events and send proximity notifications
  private checkProximityNotifications(): void {
    if (!this.userLocation) return;

    this.notifications.forEach((locationData, id) => {
      const distance = this.calculateDistance(
        this.userLocation!.latitude,
        this.userLocation!.longitude,
        locationData.latitude,
        locationData.longitude
      );

      // If user is within notification radius
      if (distance <= locationData.radius) {
        this.sendProximityNotification(id, locationData, distance);
        this.notifications.delete(id); // Remove to avoid duplicate notifications
      }
    });
  }

  // Send immediate proximity notification
  private async sendProximityNotification(
    id: string,
    locationData: LocationNotification,
    distance: number
  ): Promise<void> {
    let title = '';
    let body = '';

    switch (locationData.type) {
      case 'trash_spawn':
        title = '🗑️ Trash Encounter Nearby!';
        body = `A trash cleanup opportunity is ${Math.round(distance)}m away!`;
        break;
      case 'station_nearby':
        title = '🏢 Eco Station Nearby!';
        body = `An Eco Station is ${Math.round(distance)}m away!`;
        break;
      case 'mission_available':
        title = '🎯 New Mission Available!';
        body = `A new mission is ${Math.round(distance)}m away!`;
        break;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: locationData.type, id },
        sound: 'default',
      },
      trigger: null, // Send immediately
    });
  }

  // Calculate distance between two points
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Notification templates for common events
  static createTrashEncounterNotification(encounterId: string): NotificationData {
    return {
      type: 'trash_encounter',
      id: encounterId,
      title: '🗑️ Trash Encounter Spawned!',
      body: 'A new trash cleanup opportunity has appeared nearby!',
      data: { encounterId },
    };
  }

  static createStationEventNotification(stationId: string, stationName: string): NotificationData {
    return {
      type: 'station_event',
      id: stationId,
      title: '🏢 Eco Station Event!',
      body: `${stationName} has a new mission available!`,
      data: { stationId, stationName },
    };
  }

  static createLevelUpNotification(newLevel: number): NotificationData {
    return {
      type: 'level_up',
      id: `level_${newLevel}`,
      title: '🎉 Level Up!',
      body: `Congratulations! You've reached level ${newLevel}!`,
      data: { newLevel },
    };
  }

  static createBadgeUnlockedNotification(badgeName: string): NotificationData {
    return {
      type: 'badge_unlocked',
      id: `badge_${badgeName}`,
      title: '🏆 Badge Unlocked!',
      body: `You've earned the ${badgeName} badge!`,
      data: { badgeName },
    };
  }

  static createMissionReminderNotification(missionTitle: string): NotificationData {
    return {
      type: 'mission_reminder',
      id: `reminder_${Date.now()}`,
      title: '⏰ Mission Reminder',
      body: `Don't forget about your mission: ${missionTitle}`,
      data: { missionTitle },
    };
  }

  // Cancel notification by ID
  async cancelNotification(id: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(id);
    this.notifications.delete(id);
  }

  // Cancel all notifications
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    this.notifications.clear();
  }

  // Get notification history
  async getNotificationHistory(): Promise<Notifications.Notification[]> {
    return await Notifications.getPresentedNotificationsAsync();
  }

  // Handle notification response (when user taps notification)
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Handle notification received (when app is in foreground)
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Helper function to initialize notifications in App.tsx
export const initializeNotifications = async (): Promise<boolean> => {
  return await notificationService.initialize();
};
