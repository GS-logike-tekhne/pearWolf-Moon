import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';
import { useAuth } from '../context/AuthContext';
import { RoleGuard } from '../components/RoleGuard';
import MenuModal from '../components/MenuModal';

const { width } = Dimensions.get('window');

interface AdminDashboardProps {
  navigation: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { logout } = useAuth();
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

  // Quick actions (2x2 grid - 4 items max)
  const quickActions = [
    { title: 'User Management', icon: 'people', color: getRoleColor('trash-hero'), onPress: () => navigation.navigate('UserManagement') },
    { title: 'Issue Resolution', icon: 'warning', color: getRoleColor('impact-warrior'), onPress: () => navigation.navigate('AdminIssueResolution') },
    { title: 'Mission Control', icon: 'desktop', color: getRoleColor('business'), onPress: () => navigation.navigate('AdminMissionControl') },
    { title: 'Analytics', icon: 'bar-chart', color: '#8b5cf6', onPress: () => navigation.navigate('Analytics') },
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
    <RoleGuard allowedRoles={['ADMIN']}>
      <ScreenLayout>

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
              <Text style={[styles.viewAllText, { color: theme.warning }]}>View All</Text>
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
        onSignOut={async () => {
          try {
            await logout();
            navigation.navigate('Login');
          } catch (error) {
            console.error('Sign out failed:', error);
          }
        }}
      />
      </ScreenLayout>
    </RoleGuard>
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
    margin: THEME.SPACING.md,
    marginTop: THEME.SPACING.sm,
    borderRadius: THEME.BORDER_RADIUS.xl,
    padding: THEME.SPACING.md,
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
    marginBottom: THEME.SPACING.md,
  },
  cardTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.SPACING.md,
  },
  profileAvatar: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.md,
  },
  avatarText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
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
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeEmoji: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
  },
  badgeText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '500',
  },
  levelInfo: {
    alignItems: 'flex-end',
  },
  levelLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    marginBottom: 2,
  },
  levelValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    marginBottom: 2,
  },
  pointsValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  maxLevelSection: {
    marginBottom: THEME.SPACING.md,
    alignItems: 'center',
  },
  maxLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: 20,
    gap: 8,
  },
  maxLevelText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: THEME.BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.SPACING.sm,
  },
  metricValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '700',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    textAlign: 'center',
  },
  quickActionsSection: {
    marginHorizontal: THEME.SPACING.md,
    marginBottom: THEME.SPACING.lg,
  },
  sectionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    marginBottom: THEME.SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 56) / 2,
    alignItems: 'center',
    paddingVertical: THEME.SPACING.md + 4,
    paddingHorizontal: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: THEME.BORDER_RADIUS["2xl"],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.SPACING.sm + 4,
  },
  actionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  recentSection: {
    marginHorizontal: THEME.SPACING.md,
    marginBottom: THEME.SPACING.lg,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.md,
  },
  viewAllText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  activityList: {
    gap: 12,
  },
  activityCard: {
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
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
    marginBottom: THEME.SPACING.sm + 4,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    marginBottom: THEME.SPACING.xs,
  },
  activityLocation: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityReward: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  progressContainer: {
    flex: 1,
    marginLeft: THEME.SPACING.md,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: THEME.SPACING.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  activityStatus: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    textAlign: 'right',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default AdminDashboard;