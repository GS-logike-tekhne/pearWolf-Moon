import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import UnifiedHeader from '../components/UnifiedHeader';
import MenuModal from '../components/MenuModal';

const { width } = Dimensions.get('window');

interface AdminDashboardProps {
  navigation: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const userRole = 'ADMIN';
  
  // Admin role configuration
  const roleConfig = {
    title: 'Platform Admin',
    subtitle: 'System Administrator',
    color: getRoleColor('admin'),
    level: 8,
    points: 5200,
    progress: 100,
    nextLevelPoints: 0,
    badge: 'Platform Guardian',
    badgeIcon: '🛡️',
  };

  // Key metrics for Admin
  const keyMetrics = [
    { label: 'Users Managed', value: '1,247', icon: 'people', color: getRoleColor('business') },
    { label: 'Issues Resolved', value: '156', icon: 'checkmark-circle', color: getRoleColor('trash-hero') },
    { label: 'Platform Health', value: '98%', icon: 'analytics', color: '#8b5cf6' },
  ];

  // Quick actions (2x3 grid)
  const quickActions = [
    { title: 'Admin Panel', icon: 'speedometer', color: getRoleColor('admin'), onPress: () => navigation.navigate('AdminDashboard') },
    { title: 'User Management', icon: 'people', color: getRoleColor('trash-hero'), onPress: () => navigation.navigate('UserManagement') },
    { title: 'Issue Resolution', icon: 'warning', color: getRoleColor('impact-warrior'), onPress: () => navigation.navigate('AdminIssueResolution') },
    { title: 'Mission Control', icon: 'desktop', color: getRoleColor('business'), onPress: () => navigation.navigate('AdminMissionControl') },
    { title: 'Analytics', icon: 'bar-chart', color: '#8b5cf6', onPress: () => navigation.navigate('Analytics') },
    { title: 'Settings', icon: 'settings', color: '#6c757d', onPress: () => navigation.navigate('AdminSettings') },
  ];

  // Recent activity
  const recentActivity = [
    {
      id: '1',
      title: 'User Report Resolved',
      location: 'System Alert',
      status: 'Resolved',
      reward: 'Priority: High',
      date: '1 hour ago',
      progress: 100,
    },
    {
      id: '2',
      title: 'Platform Maintenance',
      location: 'System Update',
      status: 'In Progress',
      reward: 'Scheduled',
      date: '2 hours ago',
      progress: 75,
    },
  ];

  const MetricCard = ({ metric }: any) => (
    <View style={[styles.metricCard, { backgroundColor: theme.cardBackground }]}>
      <View style={[styles.metricIcon, { backgroundColor: metric.color }]}>
        <Ionicons name={metric.icon} size={16} color="white" />
      </View>
      <Text style={[styles.metricValue, { color: theme.textColor }]}>{metric.value}</Text>
      <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>{metric.label}</Text>
    </View>
  );

  const QuickActionCard = ({ action }: any) => (
    <TouchableOpacity
      style={[styles.actionCard, { backgroundColor: theme.cardBackground }]}
      onPress={action.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
        <Ionicons name={action.icon} size={20} color="white" />
      </View>
      <Text style={[styles.actionTitle, { color: theme.textColor }]}>{action.title}</Text>
    </TouchableOpacity>
  );

  const ActivityCard = ({ activity }: any) => (
    <View style={[styles.activityCard, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.activityHeader}>
        <View style={styles.activityInfo}>
          <Text style={[styles.activityTitle, { color: theme.textColor }]}>{activity.title}</Text>
          <Text style={[styles.activityLocation, { color: theme.secondaryText }]}>
            <Ionicons name="shield-checkmark" size={12} color={theme.secondaryText} /> {activity.location}
          </Text>
        </View>
        <Text style={[styles.activityDate, { color: theme.secondaryText }]}>{activity.date}</Text>
      </View>
      <View style={styles.activityFooter}>
        <Text style={[styles.activityReward, { color: roleConfig.color }]}>{activity.reward}</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: roleConfig.color, width: `${activity.progress}%` }
              ]}
            />
          </View>
          <Text style={[styles.activityStatus, { color: theme.secondaryText }]}>{activity.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <UnifiedHeader
        onMenuPress={() => setShowMenu(true)}
        role="admin"
        points={roleConfig.points}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onProfilePress={() => navigation.navigate('ProfileScreen', { 
          role: 'admin',
          onSignOut: () => navigation.navigate('Login')
        })}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* My Card Section */}
        <View style={[styles.myCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.textColor }]}>My Card</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={getRoleColor('admin')} />
              <Text style={[styles.verifiedText, { color: getRoleColor('admin') }]}>PEAR Verified</Text>
            </View>
          </View>
          
          <View style={styles.profileSection}>
            <View style={[styles.profileAvatar, { backgroundColor: roleConfig.color }]}>
              <Text style={styles.avatarText}>PA</Text>
              <View style={styles.avatarBadge}>
                <Ionicons name="checkmark" size={12} color="white" />
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.textColor }]}>{roleConfig.title}</Text>
              <Text style={[styles.profileRole, { color: theme.secondaryText }]}>{roleConfig.subtitle}</Text>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeEmoji}>{roleConfig.badgeIcon}</Text>
                <Text style={[styles.badgeText, { color: theme.secondaryText }]}>{roleConfig.badge}</Text>
              </View>
            </View>
            
            <View style={styles.levelInfo}>
              <Text style={[styles.levelLabel, { color: theme.secondaryText }]}>Level</Text>
              <Text style={[styles.levelValue, { color: theme.textColor }]}>{roleConfig.level}</Text>
              <Text style={[styles.pointsValue, { color: theme.secondaryText }]}>{roleConfig.points.toLocaleString()} pts</Text>
            </View>
          </View>
          
          {/* Admin is at max level - no progress bar needed */}
          <View style={styles.maxLevelSection}>
            <View style={[styles.maxLevelBadge, { backgroundColor: roleConfig.color }]}>
              <Ionicons name="checkmark-circle" size={16} color="white" />
              <Text style={styles.maxLevelText}>Maximum Level Achieved</Text>
            </View>
          </View>
          
          {/* Key Metrics Row */}
          <View style={styles.metricsRow}>
            {keyMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Admin Tools</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} action={action} />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>System Activity</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, { color: '#fd7e14' }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityList}>
            {recentActivity.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={userRole}
        userName={roleConfig.title}
        userLevel={roleConfig.level}
        onNavigate={(screen, params) => {
          navigation.navigate(screen, params);
        }}
        onSignOut={() => {
          // Handle sign out
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  myCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#28a745',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeEmoji: {
    fontSize: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  levelInfo: {
    alignItems: 'flex-end',
  },
  levelLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  levelValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  pointsValue: {
    fontSize: 12,
  },
  maxLevelSection: {
    marginBottom: 16,
    alignItems: 'center',
  },
  maxLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  maxLevelText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  quickActionsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 56) / 2,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  recentSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityList: {
    gap: 12,
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityLocation: {
    fontSize: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: 12,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityReward: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    flex: 1,
    marginLeft: 16,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  activityStatus: {
    fontSize: 10,
    textAlign: 'right',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default AdminDashboard;