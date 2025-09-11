import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
  scheduledFor?: Date;
  type: 'mission_reminder' | 'mission_complete' | 'daily_quest' | 'level_up' | 'general';
}

interface NotificationsContextType {
  notifications: NotificationData[];
  permissionGranted: boolean;
  requestPermissions: () => Promise<boolean>;
  scheduleNotification: (notification: Omit<NotificationData, 'id'>) => Promise<string>;
  cancelNotification: (notificationId: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  sendMissionReminder: (missionId: string, missionTitle: string, scheduledTime: Date) => Promise<string>;
  sendDailyQuestReminder: () => Promise<string>;
  sendLevelUpNotification: (newLevel: number) => Promise<string>;
  markAsRead: (notificationId: string) => void;
  getUnreadCount: () => number;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const STORAGE_KEY = 'notifications_data';

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Load notifications from storage
  useEffect(() => {
    loadNotifications();
    checkPermissions();
  }, []);

  // Register for push notifications
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveNotifications = async (newNotifications: NotificationData[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newNotifications));
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionGranted(status === 'granted');
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permission denied');
        return false;
      }

      setPermissionGranted(true);
      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  const registerForPushNotificationsAsync = async () => {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id', // Replace with your actual project ID
      });
      console.log('Expo push token:', token.data);
      
      // Store token for backend use
      await AsyncStorage.setItem('expo_push_token', token.data);
    } catch (error) {
      console.error('Error getting push token:', error);
    }
  };

  const scheduleNotification = async (notification: Omit<NotificationData, 'id'>): Promise<string> => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
        },
        trigger: notification.scheduledFor ? { date: notification.scheduledFor } : null,
      });

      const newNotification: NotificationData = {
        id: notificationId,
        ...notification,
      };

      const updatedNotifications = [...notifications, newNotification];
      await saveNotifications(updatedNotifications);

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  };

  const cancelNotification = async (notificationId: string): Promise<void> => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      await saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  const cancelAllNotifications = async (): Promise<void> => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await saveNotifications([]);
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  };

  const sendMissionReminder = async (
    missionId: string,
    missionTitle: string,
    scheduledTime: Date
  ): Promise<string> => {
    return await scheduleNotification({
      title: 'Mission Reminder 🎯',
      body: `Don't forget about "${missionTitle}" starting soon!`,
      data: { missionId, type: 'mission_reminder' },
      scheduledFor: scheduledTime,
      type: 'mission_reminder',
    });
  };

  const sendDailyQuestReminder = async (): Promise<string> => {
    // Schedule for 9 AM daily
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    return await scheduleNotification({
      title: 'Daily Quests Available! 🌟',
      body: 'New daily quests are ready. Complete them to earn XP and rewards!',
      data: { type: 'daily_quest' },
      scheduledFor: tomorrow,
      type: 'daily_quest',
    });
  };

  const sendLevelUpNotification = async (newLevel: number): Promise<string> => {
    return await scheduleNotification({
      title: 'Level Up! 🎉',
      body: `Congratulations! You've reached level ${newLevel}!`,
      data: { newLevel, type: 'level_up' },
      type: 'level_up',
    });
  };

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    saveNotifications(updatedNotifications);
  };

  const getUnreadCount = (): number => {
    return notifications.filter(n => !n.read).length;
  };

  const value: NotificationsContextType = {
    notifications,
    permissionGranted,
    requestPermissions,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    sendMissionReminder,
    sendDailyQuestReminder,
    sendLevelUpNotification,
    markAsRead,
    getUnreadCount,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

// Helper function to schedule recurring daily quest reminders
export const scheduleDailyQuestReminders = async (notifications: NotificationsContextType) => {
  try {
    // Cancel existing daily quest notifications
    const existingDailyQuests = notifications.notifications.filter(n => n.type === 'daily_quest');
    for (const notification of existingDailyQuests) {
      await notifications.cancelNotification(notification.id);
    }

    // Schedule new daily reminder
    await notifications.sendDailyQuestReminder();
  } catch (error) {
    console.error('Error scheduling daily quest reminders:', error);
  }
};

// Helper function to schedule mission reminders
export const scheduleMissionReminder = async (
  notifications: NotificationsContextType,
  missionId: string,
  missionTitle: string,
  startTime: Date
) => {
  try {
    // Schedule reminder 30 minutes before mission starts
    const reminderTime = new Date(startTime.getTime() - 30 * 60 * 1000);
    
    if (reminderTime > new Date()) {
      await notifications.sendMissionReminder(missionId, missionTitle, reminderTime);
    }
  } catch (error) {
    console.error('Error scheduling mission reminder:', error);
  }
};
