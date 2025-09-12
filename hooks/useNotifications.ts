import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../context/XPContext';
import { smartNotificationManager, NotificationPreferences, NotificationAnalytics } from '../services/smartNotificationManager';
import { streakReminderService, StreakData, StreakReminderConfig } from '../services/streakReminderService';
import { notificationService } from '../services/notificationService';

export interface NotificationState {
  preferences: NotificationPreferences | null;
  analytics: NotificationAnalytics | null;
  streakData: StreakData | null;
  reminderConfig: StreakReminderConfig | null;
  isInitialized: boolean;
  loading: boolean;
}

export interface NotificationActions {
  updatePreferences: (preferences: NotificationPreferences) => Promise<void>;
  updateReminderConfig: (config: StreakReminderConfig) => Promise<void>;
  recordActivity: (activity: {
    missionsCompleted: number;
    xpEarned: number;
    activitiesCompleted: number;
  }) => Promise<void>;
  sendTestNotification: () => Promise<void>;
  checkReminders: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useNotifications = (): NotificationState & NotificationActions => {
  const { user } = useAuth();
  const { currentXP, currentLevel } = useXP();
  
  const [state, setState] = useState<NotificationState>({
    preferences: null,
    analytics: null,
    streakData: null,
    reminderConfig: null,
    isInitialized: false,
    loading: true,
  });

  // Initialize notification systems
  useEffect(() => {
    if (user?.id) {
      initializeNotifications();
    }
  }, [user?.id]);

  // Update context when XP or level changes
  useEffect(() => {
    if (state.isInitialized && user?.id) {
      smartNotificationManager.updateContext({
        userRole: user.role,
        currentLevel,
        currentXP,
        streakCount: state.streakData?.currentStreak || 0,
      });
    }
  }, [currentXP, currentLevel, user?.role, state.isInitialized, state.streakData]);

  const initializeNotifications = async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setState(prev => ({ ...prev, loading: true }));

      // Initialize smart notification manager
      const smartNotificationsInitialized = await smartNotificationManager.initialize(user.id);
      
      // Initialize streak reminder service
      const streakRemindersInitialized = await streakReminderService.initialize(user.id);
      
      // Initialize basic notification service
      const basicNotificationsInitialized = await notificationService.initialize();

      if (smartNotificationsInitialized && streakRemindersInitialized && basicNotificationsInitialized) {
        // Load all data
        const preferences = smartNotificationManager.getPreferences();
        const analytics = smartNotificationManager.getAnalytics();
        const streakData = streakReminderService.getStreakData();
        const reminderConfig = streakReminderService.getReminderConfig();

        setState({
          preferences,
          analytics,
          streakData,
          reminderConfig,
          isInitialized: true,
          loading: false,
        });

        // Set up notification listeners
        setupNotificationListeners();
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const setupNotificationListeners = (): void => {
    // Handle notification response (when user taps notification)
    notificationService.addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;
      handleNotificationResponse(data);
    });

    // Handle notification received (when app is in foreground)
    notificationService.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });
  };

  const handleNotificationResponse = (data: any): void => {
    console.log('Notification response:', data);
    
    // Handle different notification types
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
      case 'streak':
        // Show streak reminder
        break;
    }
  };

  const updatePreferences = useCallback(async (preferences: NotificationPreferences): Promise<void> => {
    if (!user?.id) return;

    try {
      await smartNotificationManager.savePreferences(user.id, preferences);
      setState(prev => ({ ...prev, preferences }));
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  }, [user?.id]);

  const updateReminderConfig = useCallback(async (config: StreakReminderConfig): Promise<void> => {
    if (!user?.id) return;

    try {
      await streakReminderService.saveReminderConfig(user.id, config);
      setState(prev => ({ ...prev, reminderConfig: config }));
    } catch (error) {
      console.error('Failed to update reminder config:', error);
      throw error;
    }
  }, [user?.id]);

  const recordActivity = useCallback(async (activity: {
    missionsCompleted: number;
    xpEarned: number;
    activitiesCompleted: number;
  }): Promise<void> => {
    if (!user?.id) return;

    try {
      await streakReminderService.recordActivity(user.id, activity);
      
      // Update streak data in state
      const updatedStreakData = streakReminderService.getStreakData();
      setState(prev => ({ ...prev, streakData: updatedStreakData }));
      
      // Update analytics
      const updatedAnalytics = smartNotificationManager.getAnalytics();
      setState(prev => ({ ...prev, analytics: updatedAnalytics }));
      
    } catch (error) {
      console.error('Failed to record activity:', error);
      throw error;
    }
  }, [user?.id]);

  const sendTestNotification = useCallback(async (): Promise<void> => {
    try {
      const testNotification = {
        type: 'mission_reminder' as const,
        id: `test_${Date.now()}`,
        title: '🍐 PEAR Test Notification',
        body: 'This is a test notification to verify your settings are working correctly!',
        data: { test: true },
      };

      notificationService.scheduleNotification(testNotification);
    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  }, []);

  const checkReminders = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      await streakReminderService.checkAndSendReminders(user.id);
    } catch (error) {
      console.error('Failed to check reminders:', error);
    }
  }, [user?.id]);

  const refreshData = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setState(prev => ({ ...prev, loading: true }));

      // Refresh all data
      const preferences = smartNotificationManager.getPreferences();
      const analytics = smartNotificationManager.getAnalytics();
      const streakData = streakReminderService.getStreakData();
      const reminderConfig = streakReminderService.getReminderConfig();

      setState(prev => ({
        ...prev,
        preferences,
        analytics,
        streakData,
        reminderConfig,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to refresh data:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user?.id]);

  return {
    ...state,
    updatePreferences,
    updateReminderConfig,
    recordActivity,
    sendTestNotification,
    checkReminders,
    refreshData,
  };
};
