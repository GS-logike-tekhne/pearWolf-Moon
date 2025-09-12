import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import PEARScreen from '../components/PEARScreen';
import NotificationCenter from '../components/notifications/NotificationCenter';
import NotificationBadge from '../components/notifications/NotificationBadge';
import { getRoleColor } from '../utils/roleColors';
import { normalizeRole } from '../types/roles';

const NotificationIntegrationScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const userRole = normalizeRole(user?.role || 'trash-hero');
  const roleColor = getRoleColor(userRole);
  
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  
  const {
    preferences,
    analytics,
    streakData,
    reminderConfig,
    isInitialized,
    loading,
    updatePreferences,
    recordActivity,
    sendTestNotification,
    checkReminders,
    refreshData,
  } = useNotifications();

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      Alert.alert('Test Sent', 'Test notification sent successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const handleRecordActivity = async () => {
    try {
      await recordActivity({
        missionsCompleted: 1,
        xpEarned: 50,
        activitiesCompleted: 1,
      });
      Alert.alert('Activity Recorded', 'Activity recorded successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to record activity');
    }
  };

  const handleCheckReminders = async () => {
    try {
      await checkReminders();
      Alert.alert('Reminders Checked', 'Reminder system checked successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to check reminders');
    }
  };

  const renderStatsCard = () => (
    <View style={[styles.statsCard, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.cardTitle, { color: theme.textColor }]}>
        Notification Stats
      </Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="notifications" size={24} color={roleColor} />
          <Text style={[styles.statValue, { color: theme.textColor }]}>
            {analytics?.totalSent || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
            Total Sent
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="eye" size={24} color={roleColor} />
          <Text style={[styles.statValue, { color: theme.textColor }]}>
            {Math.round((analytics?.openRate || 0) * 100)}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
            Open Rate
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="trending-up" size={24} color={roleColor} />
          <Text style={[styles.statValue, { color: theme.textColor }]}>
            {Math.round(analytics?.engagementScore || 0)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
            Engagement
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStreakCard = () => (
    <View style={[styles.streakCard, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.cardTitle, { color: theme.textColor }]}>
        Streak Information
      </Text>
      
      <View style={styles.streakRow}>
        <View style={styles.streakItem}>
          <Ionicons name="flame" size={24} color="#FF5722" />
          <Text style={[styles.streakValue, { color: theme.textColor }]}>
            {streakData?.currentStreak || 0}
          </Text>
          <Text style={[styles.streakLabel, { color: theme.secondaryText }]}>
            Current Streak
          </Text>
        </View>
        
        <View style={styles.streakItem}>
          <Ionicons name="trophy" size={24} color="#FFD700" />
          <Text style={[styles.streakValue, { color: theme.textColor }]}>
            {streakData?.longestStreak || 0}
          </Text>
          <Text style={[styles.streakLabel, { color: theme.secondaryText }]}>
            Longest Streak
          </Text>
        </View>
        
        <View style={styles.streakItem}>
          <Ionicons name="calendar" size={24} color={roleColor} />
          <Text style={[styles.streakValue, { color: theme.textColor }]}>
            {streakData?.totalDaysActive || 0}
          </Text>
          <Text style={[styles.streakLabel, { color: theme.secondaryText }]}>
            Total Days
          </Text>
        </View>
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionsSection}>
      <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
        Test Actions
      </Text>
      
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: roleColor }]}
          onPress={handleTestNotification}
        >
          <Ionicons name="send" size={20} color="white" />
          <Text style={styles.actionButtonText}>Send Test</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={handleRecordActivity}
        >
          <Ionicons name="checkmark" size={20} color="white" />
          <Text style={styles.actionButtonText}>Record Activity</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.success }]}
          onPress={handleCheckReminders}
        >
          <Ionicons name="time" size={20} color="white" />
          <Text style={styles.actionButtonText}>Check Reminders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.secondaryText }]}
          onPress={refreshData}
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.actionButtonText}>Refresh Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPreferencesCard = () => (
    <View style={[styles.preferencesCard, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.cardTitle, { color: theme.textColor }]}>
        Current Preferences
      </Text>
      
      {preferences ? (
        <View style={styles.preferencesList}>
          <View style={styles.preferenceItem}>
            <Text style={[styles.preferenceLabel, { color: theme.textColor }]}>
              Proximity Alerts
            </Text>
            <Text style={[styles.preferenceValue, { color: preferences.proximityAlerts ? theme.success : theme.error }]}>
              {preferences.proximityAlerts ? 'ON' : 'OFF'}
            </Text>
          </View>
          
          <View style={styles.preferenceItem}>
            <Text style={[styles.preferenceLabel, { color: theme.textColor }]}>
              Streak Reminders
            </Text>
            <Text style={[styles.preferenceValue, { color: preferences.streakReminders ? theme.success : theme.error }]}>
              {preferences.streakReminders ? 'ON' : 'OFF'}
            </Text>
          </View>
          
          <View style={styles.preferenceItem}>
            <Text style={[styles.preferenceLabel, { color: theme.textColor }]}>
              Achievement Notifications
            </Text>
            <Text style={[styles.preferenceValue, { color: preferences.achievementNotifications ? theme.success : theme.error }]}>
              {preferences.achievementNotifications ? 'ON' : 'OFF'}
            </Text>
          </View>
          
          <View style={styles.preferenceItem}>
            <Text style={[styles.preferenceLabel, { color: theme.textColor }]}>
              Frequency
            </Text>
            <Text style={[styles.preferenceValue, { color: roleColor }]}>
              {preferences.frequency.toUpperCase()}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={[styles.noDataText, { color: theme.secondaryText }]}>
          No preferences loaded
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <PEARScreen title="Notifications" role={userRole} showHeader={true}>
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.loadingText, { color: theme.textColor }]}>
            Loading notification system...
          </Text>
        </View>
      </PEARScreen>
    );
  }

  return (
    <PEARScreen title="Notifications" role={userRole} showHeader={true}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header with Notification Badge */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>
            Notification System
          </Text>
          <NotificationBadge
            onPress={() => setShowNotificationCenter(true)}
            size="medium"
            showCount={true}
            animated={true}
          />
        </View>

        {/* Stats Card */}
        {renderStatsCard()}

        {/* Streak Card */}
        {renderStreakCard()}

        {/* Preferences Card */}
        {renderPreferencesCard()}

        {/* Action Buttons */}
        {renderActionButtons()}

        {/* Status Information */}
        <View style={[styles.statusCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: theme.textColor }]}>
            System Status
          </Text>
          
          <View style={styles.statusItem}>
            <Ionicons 
              name={isInitialized ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={isInitialized ? theme.success : theme.error} 
            />
            <Text style={[styles.statusText, { color: theme.textColor }]}>
              {isInitialized ? 'System Initialized' : 'System Not Initialized'}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <Ionicons 
              name={preferences ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={preferences ? theme.success : theme.error} 
            />
            <Text style={[styles.statusText, { color: theme.textColor }]}>
              {preferences ? 'Preferences Loaded' : 'Preferences Not Loaded'}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <Ionicons 
              name={streakData ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={streakData ? theme.success : theme.error} 
            />
            <Text style={[styles.statusText, { color: theme.textColor }]}>
              {streakData ? 'Streak Data Loaded' : 'Streak Data Not Loaded'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Notification Center Modal */}
      <NotificationCenter
        visible={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        onNotificationPress={(notification) => {
          console.log('Notification pressed:', notification);
          setShowNotificationCenter(false);
        }}
      />
    </PEARScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  streakCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  preferencesCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  preferencesList: {
    gap: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  preferenceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statusCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default NotificationIntegrationScreen;
