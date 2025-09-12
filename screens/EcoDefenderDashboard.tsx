import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import PEARScreen from '../components/PEARScreen';
import { useAuth } from '../context/AuthContext';
import MenuModal from '../components/MenuModal';
import UnifiedHeader from '../components/UnifiedHeader';
import { RoleGuard } from '../components/RoleGuard';

const { width } = Dimensions.get('window');

interface EcoDefenderDashboardProps {
  navigation: any;
}

const EcoDefenderDashboard: React.FC<EcoDefenderDashboardProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const userRole = 'ECO_DEFENDER';
  
  // EcoDefender role configuration
  const roleConfig = {
    title: 'EcoDefender Corp',
    subtitle: 'EcoDefender',
    color: getRoleColor('eco-defender'),
    level: 6,
    points: 3450,
    progress: 93,
    nextLevelPoints: 150,
    badge: 'Green Pioneer',
    badgeIcon: '🌱',
  };

  // Key metrics for EcoDefender
  const keyMetrics = [
    { label: 'Jobs Created', value: '47', icon: 'briefcase', color: getRoleColor('eco-defender') },
    { label: 'CO₂ Offset', value: '850 kg', icon: 'leaf', color: getRoleColor('eco-defender') },
    { label: 'ESG Rank', value: '#8', icon: 'trophy', color: '#8b5cf6' },
  ];

  // Quick actions (2x3 grid)
  const quickActions = [
    { title: 'Post New Job', icon: 'add-circle', color: getRoleColor('eco-defender'), onPress: () => navigation.navigate('PostJob') },
    { title: 'Manage Missions', icon: 'list', color: getRoleColor('eco-defender'), onPress: () => navigation.navigate('EcoDefenderMissions') },
    { title: 'Eco Missions', icon: 'rocket', color: '#8b5cf6', onPress: () => navigation.navigate('EcoDefenderMissions') },
    { title: 'Fund Wallet', icon: 'card', color: '#FF9800', onPress: () => navigation.navigate('WalletScreen', { role: 'eco-defender' }) },
    { title: 'View Impact', icon: 'analytics', color: '#FF9800', onPress: () => navigation.navigate('EcoDefenderImpact') },
    { title: 'View Map', icon: 'map', color: getRoleColor('eco-defender'), onPress: () => navigation.navigate('MapScreen') },
  ];

  // Recent activity
  const recentActivity = [
    {
      id: '1',
      title: 'Beach Cleanup Initiative',
      location: 'Santa Monica Beach',
      status: 'Active',
      reward: '6 eco warriors',
      date: 'Today',
      progress: 85,
    },
    {
      id: '2',
      title: 'Park Restoration Project',
      location: 'Central Park',
      status: 'Completed',
      reward: '12 volunteers',
      date: 'Yesterday',
      progress: 100,
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
            <Ionicons name="location" size={12} color={theme.secondaryText} /> {activity.location}
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
    <RoleGuard allowedRoles={['ECO_DEFENDER']}>
      <PEARScreen
        title="Eco Defender Dashboard"
        role={userRole}
        showHeader={true}
        showScroll={true}
        enableRefresh={true}
        onRefresh={() => {
          // Refresh dashboard data
          console.log('Refreshing EcoDefender dashboard...');
        }}
        refreshing={false}
      >
        {/* Unified Header */}
        <UnifiedHeader
          onMenuPress={() => setShowMenu(true)}
          role={userRole}
          points={roleConfig.points}
          onNotificationPress={() => navigation.navigate('Notifications')}
          onProfilePress={() => navigation.navigate('ProfileScreen', { 
            role: 'eco-defender',
            onSignOut: () => navigation.navigate('Login')
          })}
        />
        {/* My Card Section */}
        <View style={[styles.myCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.textColor }]}>My Card</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={getRoleColor('eco-defender')} />
              <Text style={[styles.verifiedText, { color: getRoleColor('eco-defender') }]}>PEAR Verified</Text>
            </View>
          </View>
          
          <View style={styles.profileSection}>
            <View style={[styles.profileAvatar, { backgroundColor: roleConfig.color }]}>
              <Text style={styles.avatarText}>EC</Text>
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
          
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: theme.textColor }]}>
                Progress to 🏆 Impact Investor
              </Text>
              <View style={[styles.evolutionBadge, { backgroundColor: getRoleColor('eco-defender') }]}>
                <Ionicons name="trending-up" size={12} color="white" />
                <Text style={styles.evolutionText}>Evolution</Text>
              </View>
            </View>
            
            <View style={[styles.progressBarContainer, { backgroundColor: 'rgba(0,123,255,0.2)' }]}>
              <View
                style={[
                  styles.progressBarFill,
                  { backgroundColor: roleConfig.color, width: `${roleConfig.progress}%` }
                ]}
              />
            </View>
            
            <View style={styles.progressFooter}>
              <Text style={[styles.progressPercentage, { color: theme.textColor }]}>{roleConfig.progress}%</Text>
              <Text style={[styles.progressRemaining, { color: theme.secondaryText }]}>{roleConfig.nextLevelPoints} pts to go</Text>
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
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} action={action} />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Recent Missions</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, { color: getRoleColor('eco-defender') }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityList}>
            {recentActivity.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />

        {/* Menu Modal */}
        <MenuModal
          visible={showMenu}
          onClose={() => setShowMenu(false)}
          userRole="ECO_DEFENDER"
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
      </PEARScreen>
    </RoleGuard>
  );
};

const styles = StyleSheet.create({
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
  progressSection: {
    marginBottom: THEME.SPACING.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.sm,
  },
  progressTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  evolutionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.lg,
    gap: 4,
  },
  evolutionText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: THEME.BORDER_RADIUS.sm,
    marginBottom: THEME.SPACING.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: THEME.BORDER_RADIUS.sm,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  progressRemaining: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
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

export default EcoDefenderDashboard;