import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import PEARScreen from '../components/PEARScreen';
import { smartNotificationManager, NotificationPreferences } from '../services/smartNotificationManager';
import { getRoleColor } from '../utils/roleColors';

const NotificationPreferencesScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const userRole = user?.role || 'trash-hero';
  const roleColor = getRoleColor(userRole);
  
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const currentPreferences = smartNotificationManager.getPreferences();
      setPreferences(currentPreferences);
    } catch (error) {
      console.error('Failed to load preferences:', error);
      Alert.alert('Error', 'Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      setPreferences(newPreferences);
      if (user?.id) {
        await smartNotificationManager.savePreferences(user.id, newPreferences);
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      Alert.alert('Error', 'Failed to save notification preferences');
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    if (!preferences) return;
    
    const updatedPreferences = {
      ...preferences,
      [key]: value,
    };
    
    savePreferences(updatedPreferences);
  };

  const updateQuietHours = (key: keyof NotificationPreferences['quietHours'], value: any) => {
    if (!preferences) return;
    
    const updatedPreferences = {
      ...preferences,
      quietHours: {
        ...preferences.quietHours,
        [key]: value,
      },
    };
    
    savePreferences(updatedPreferences);
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'Are you sure you want to reset all notification preferences to default settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaultPreferences: NotificationPreferences = {
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
            savePreferences(defaultPreferences);
          },
        },
      ]
    );
  };

  if (loading || !preferences) {
    return (
      <PEARScreen title="Notification Settings" role={userRole} showHeader={true}>
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.loadingText, { color: theme.textColor }]}>
            Loading preferences...
          </Text>
        </View>
      </PEARScreen>
    );
  }

  const PreferenceSwitch = ({ 
    title, 
    description, 
    value, 
    onValueChange 
  }: {
    title: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={[styles.preferenceRow, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.preferenceContent}>
        <Text style={[styles.preferenceTitle, { color: theme.textColor }]}>
          {title}
        </Text>
        <Text style={[styles.preferenceDescription, { color: theme.secondaryText }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.borderColor, true: roleColor + '40' }}
        thumbColor={value ? roleColor : theme.secondaryText}
      />
    </View>
  );

  const FrequencyButton = ({ 
    label, 
    value, 
    description 
  }: {
    label: string;
    value: 'low' | 'medium' | 'high';
    description: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.frequencyButton,
        {
          backgroundColor: preferences.frequency === value ? roleColor : theme.cardBackground,
          borderColor: preferences.frequency === value ? roleColor : theme.borderColor,
        },
      ]}
      onPress={() => updatePreference('frequency', value)}
    >
      <Text
        style={[
          styles.frequencyButtonText,
          {
            color: preferences.frequency === value ? 'white' : theme.textColor,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.frequencyButtonDescription,
          {
            color: preferences.frequency === value ? 'white' : theme.secondaryText,
          },
        ]}
      >
        {description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <PEARScreen title="Notification Settings" role={userRole} showHeader={true}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Notification Types */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Notification Types
          </Text>
          
          <PreferenceSwitch
            title="Proximity Alerts"
            description="Get notified when you're near missions or trash encounters"
            value={preferences.proximityAlerts}
            onValueChange={(value) => updatePreference('proximityAlerts', value)}
          />
          
          <PreferenceSwitch
            title="Streak Reminders"
            description="Daily reminders to maintain your cleanup streak"
            value={preferences.streakReminders}
            onValueChange={(value) => updatePreference('streakReminders', value)}
          />
          
          <PreferenceSwitch
            title="Achievement Notifications"
            description="Celebrate level ups and badge unlocks"
            value={preferences.achievementNotifications}
            onValueChange={(value) => updatePreference('achievementNotifications', value)}
          />
          
          <PreferenceSwitch
            title="Community Events"
            description="Notifications about PEARthquake events and community activities"
            value={preferences.communityEvents}
            onValueChange={(value) => updatePreference('communityEvents', value)}
          />
          
          <PreferenceSwitch
            title="Mission Reminders"
            description="Reminders about accepted missions"
            value={preferences.missionReminders}
            onValueChange={(value) => updatePreference('missionReminders', value)}
          />
        </View>

        {/* Notification Frequency */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Notification Frequency
          </Text>
          
          <View style={styles.frequencyContainer}>
            <FrequencyButton
              label="Low"
              value="low"
              description="Max 1 per hour"
            />
            <FrequencyButton
              label="Medium"
              value="medium"
              description="Max 2 per hour"
            />
            <FrequencyButton
              label="High"
              value="high"
              description="Max 4 per hour"
            />
          </View>
        </View>

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Quiet Hours
          </Text>
          
          <View style={[styles.preferenceRow, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.preferenceContent}>
              <Text style={[styles.preferenceTitle, { color: theme.textColor }]}>
                Enable Quiet Hours
              </Text>
              <Text style={[styles.preferenceDescription, { color: theme.secondaryText }]}>
                Pause notifications during specified hours
              </Text>
            </View>
            <Switch
              value={preferences.quietHours.enabled}
              onValueChange={(value) => updateQuietHours('enabled', value)}
              trackColor={{ false: theme.borderColor, true: roleColor + '40' }}
              thumbColor={preferences.quietHours.enabled ? roleColor : theme.secondaryText}
            />
          </View>
          
          {preferences.quietHours.enabled && (
            <View style={styles.quietHoursContainer}>
              <View style={[styles.timeInputContainer, { backgroundColor: theme.cardBackground }]}>
                <Text style={[styles.timeLabel, { color: theme.textColor }]}>
                  From
                </Text>
                <TouchableOpacity
                  style={[styles.timeButton, { borderColor: theme.borderColor }]}
                  onPress={() => {
                    // In a real app, you'd show a time picker
                    Alert.alert('Time Picker', 'Time picker would open here');
                  }}
                >
                  <Text style={[styles.timeButtonText, { color: theme.textColor }]}>
                    {preferences.quietHours.startTime}
                  </Text>
                  <Ionicons name="time" size={16} color={theme.secondaryText} />
                </TouchableOpacity>
              </View>
              
              <View style={[styles.timeInputContainer, { backgroundColor: theme.cardBackground }]}>
                <Text style={[styles.timeLabel, { color: theme.textColor }]}>
                  To
                </Text>
                <TouchableOpacity
                  style={[styles.timeButton, { borderColor: theme.borderColor }]}
                  onPress={() => {
                    // In a real app, you'd show a time picker
                    Alert.alert('Time Picker', 'Time picker would open here');
                  }}
                >
                  <Text style={[styles.timeButtonText, { color: theme.textColor }]}>
                    {preferences.quietHours.endTime}
                  </Text>
                  <Ionicons name="time" size={16} color={theme.secondaryText} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Analytics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Notification Analytics
          </Text>
          
          <View style={[styles.analyticsContainer, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.analyticsRow}>
              <Ionicons name="notifications" size={20} color={roleColor} />
              <Text style={[styles.analyticsLabel, { color: theme.textColor }]}>
                Total Notifications Sent
              </Text>
              <Text style={[styles.analyticsValue, { color: roleColor }]}>
                {smartNotificationManager.getAnalytics().totalSent}
              </Text>
            </View>
            
            <View style={styles.analyticsRow}>
              <Ionicons name="eye" size={20} color={roleColor} />
              <Text style={[styles.analyticsLabel, { color: theme.textColor }]}>
                Open Rate
              </Text>
              <Text style={[styles.analyticsValue, { color: roleColor }]}>
                {Math.round(smartNotificationManager.getAnalytics().openRate * 100)}%
              </Text>
            </View>
            
            <View style={styles.analyticsRow}>
              <Ionicons name="trending-up" size={20} color={roleColor} />
              <Text style={[styles.analyticsLabel, { color: theme.textColor }]}>
                Engagement Score
              </Text>
              <Text style={[styles.analyticsValue, { color: roleColor }]}>
                {Math.round(smartNotificationManager.getAnalytics().engagementScore)}/100
              </Text>
            </View>
          </View>
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          style={[styles.resetButton, { borderColor: theme.error }]}
          onPress={resetToDefaults}
        >
          <Ionicons name="refresh" size={20} color={theme.error} />
          <Text style={[styles.resetButtonText, { color: theme.error }]}>
            Reset to Defaults
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  preferenceContent: {
    flex: 1,
    marginRight: 16,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  frequencyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  frequencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  frequencyButtonDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  quietHoursContainer: {
    gap: 12,
    marginTop: 8,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  analyticsContainer: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  analyticsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  analyticsLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  analyticsValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
    marginTop: 24,
    marginBottom: 32,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationPreferencesScreen;
