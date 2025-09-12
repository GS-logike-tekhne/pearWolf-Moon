import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { smartNotificationManager, NotificationAnalytics } from '../../services/smartNotificationManager';
import { getRoleColor } from '../../utils/roleColors';

export interface NotificationItem {
  id: string;
  type: 'proximity' | 'achievement' | 'community' | 'mission' | 'streak';
  title: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  data?: any;
}

interface NotificationCenterProps {
  visible: boolean;
  onClose: () => void;
  onNotificationPress?: (notification: NotificationItem) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  visible,
  onClose,
  onNotificationPress,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const userRole = user?.role || 'trash-hero';
  const roleColor = getRoleColor(userRole);
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [analytics, setAnalytics] = useState<NotificationAnalytics | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (visible) {
      loadNotifications();
      loadAnalytics();
    }
  }, [visible]);

  const loadNotifications = async () => {
    try {
      // In a real app, you'd fetch from your backend
      // For now, we'll create mock notifications
      const mockNotifications: NotificationItem[] = [
        {
          id: '1',
          type: 'proximity',
          title: '🗑️ Mission Nearby!',
          body: 'You\'re 150m from a trash cleanup mission!',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          isRead: false,
          data: { distance: 150, missionId: 'mission_1' },
        },
        {
          id: '2',
          type: 'achievement',
          title: '🎉 Level Up!',
          body: 'Congratulations! You\'ve reached level 5!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          isRead: true,
          data: { newLevel: 5, oldLevel: 4 },
        },
        {
          id: '3',
          type: 'streak',
          title: '🔥 Keep Your Streak Alive!',
          body: 'You\'re on a 7-day streak! Complete a mission today.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          isRead: false,
          data: { streakCount: 7 },
        },
        {
          id: '4',
          type: 'community',
          title: '🌍 PEARthquake Event!',
          body: 'Join the community cleanup at Central Park!',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          isRead: true,
          data: { eventId: 'pearthquake_1', eventType: 'cleanup' },
        },
        {
          id: '5',
          type: 'mission',
          title: '⏰ Mission Reminder',
          body: 'Don\'t forget about your mission: Beach Cleanup',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          isRead: true,
          data: { missionId: 'mission_2', missionTitle: 'Beach Cleanup' },
        },
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const loadAnalytics = () => {
    const currentAnalytics = smartNotificationManager.getAnalytics();
    setAnalytics(currentAnalytics);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    loadAnalytics();
    setRefreshing(false);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (onNotificationPress) {
      onNotificationPress(notification);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'proximity':
        return 'location';
      case 'achievement':
        return 'trophy';
      case 'community':
        return 'people';
      case 'mission':
        return 'list';
      case 'streak':
        return 'flame';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'proximity':
        return theme.primary;
      case 'achievement':
        return '#FFD700';
      case 'community':
        return theme.success;
      case 'mission':
        return roleColor;
      case 'streak':
        return '#FF5722';
      default:
        return theme.secondaryText;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => {
    const iconColor = getNotificationColor(item.type);
    const iconName = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          {
            backgroundColor: theme.cardBackground,
            borderLeftColor: item.isRead ? 'transparent' : iconColor,
          },
        ]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
              <Ionicons name={iconName as any} size={20} color={iconColor} />
            </View>
            
            <View style={styles.notificationText}>
              <Text style={[styles.notificationTitle, { color: theme.textColor }]}>
                {item.title}
              </Text>
              <Text style={[styles.notificationBody, { color: theme.secondaryText }]}>
                {item.body}
              </Text>
            </View>
            
            <View style={styles.notificationActions}>
              <Text style={[styles.timestamp, { color: theme.secondaryText }]}>
                {formatTimestamp(item.timestamp)}
              </Text>
              
              {!item.isRead && (
                <View style={[styles.unreadDot, { backgroundColor: iconColor }]} />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: theme.error }]}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
      
      {unreadCount > 0 && (
        <TouchableOpacity
          style={[styles.markAllButton, { borderColor: roleColor }]}
          onPress={markAllAsRead}
        >
          <Text style={[styles.markAllButtonText, { color: roleColor }]}>
            Mark All Read
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAnalytics = () => (
    <View style={[styles.analyticsCard, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.analyticsTitle, { color: theme.textColor }]}>
        Notification Analytics
      </Text>
      
      <View style={styles.analyticsRow}>
        <View style={styles.analyticsItem}>
          <Text style={[styles.analyticsValue, { color: roleColor }]}>
            {analytics?.totalSent || 0}
          </Text>
          <Text style={[styles.analyticsLabel, { color: theme.secondaryText }]}>
            Total Sent
          </Text>
        </View>
        
        <View style={styles.analyticsItem}>
          <Text style={[styles.analyticsValue, { color: roleColor }]}>
            {Math.round((analytics?.openRate || 0) * 100)}%
          </Text>
          <Text style={[styles.analyticsLabel, { color: theme.secondaryText }]}>
            Open Rate
          </Text>
        </View>
        
        <View style={styles.analyticsItem}>
          <Text style={[styles.analyticsValue, { color: roleColor }]}>
            {Math.round(analytics?.engagementScore || 0)}
          </Text>
          <Text style={[styles.analyticsLabel, { color: theme.secondaryText }]}>
            Engagement
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-outline" size={64} color={theme.secondaryText} />
      <Text style={[styles.emptyStateTitle, { color: theme.textColor }]}>
        No Notifications
      </Text>
      <Text style={[styles.emptyStateText, { color: theme.secondaryText }]}>
        You'll receive notifications about nearby missions, achievements, and community events here.
      </Text>
    </View>
  );

  if (!visible) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {renderHeader()}
      
      {analytics && renderAnalytics()}
      
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={roleColor}
          />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  unreadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  markAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  analyticsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  analyticsItem: {
    alignItems: 'center',
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  notificationActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default NotificationCenter;
