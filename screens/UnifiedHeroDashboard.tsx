import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from "../context/ThemeContext";
import { THEME } from '../styles/theme';
import { useAuth } from "../context/AuthContext";
import { useRoleManager } from "../hooks/useRoleManager";
import { useXP } from "../hooks/useXP";
import MenuModal from "../components/MenuModal";
import PEARScreen from "../components/PEARScreen";
import UnifiedHeader from "../components/UnifiedHeader";
import { UserRole } from "../types/roles";

const { width } = Dimensions.get('window');

interface UnifiedHeroDashboardProps {
  navigation: any;
  userRole?: UserRole;
}

const UnifiedHeroDashboard: React.FC<UnifiedHeroDashboardProps> = ({ 
  navigation, 
  userRole = 'TRASH_HERO' 
}) => {
  const { theme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { currentRole, toggleHeroRoles, getRoleConfig } = useRoleManager();
  const { currentLevel, getXPSummary } = useXP();
  const [showMenu, setShowMenu] = useState(false);
  
  // Get XP data
  const xpSummary = getXPSummary();
  const xpTotal = xpSummary.totalXP;
  
  // Debug logging
  console.log('UnifiedHeroDashboard: Rendering with role:', currentRole);
  console.log('UnifiedHeroDashboard: User:', user?.name);
  console.log('UnifiedHeroDashboard: Theme:', theme);
  
  // Use current role from role manager
  const activeRole = currentRole || 'TRASH_HERO';
  
  // Get role configuration from role manager
  let baseRoleConfig;
  try {
    baseRoleConfig = getRoleConfig();
  } catch (error) {
    console.error('UnifiedHeroDashboard: Error getting role config:', error);
    baseRoleConfig = {
      title: 'Eco Hero',
      subtitle: 'Environmental Warrior',
      color: '#4CAF50',
      icon: 'leaf',
    };
  }
  
  // Extend role config with additional properties using actual XP data
  const roleConfig = {
    ...baseRoleConfig,
    level: currentLevel.level,
    points: xpTotal,
    progress: Math.min((xpTotal % 1000) / 10, 100),
    nextLevelPoints: 1000 - (xpTotal % 1000),
    badgeIcon: '🏆',
    badge: 'Eco Champion',
  };
  
  // Toggle between roles using role manager
  const toggleRole = () => {
    toggleHeroRoles();
  };

  // Role-specific key metrics
  const getKeyMetrics = () => {
    switch (activeRole) {
      case 'TRASH_HERO':
        return [
          { label: 'Jobs Completed', value: '47', icon: 'briefcase', color: getRoleColor('trash-hero') },
          { label: 'Total Earned', value: '$2,340', icon: 'cash', color: getRoleColor('trash-hero') },
          { label: 'Success Rate', value: '97%', icon: 'trophy', color: '#4CAF50' },
        ];
      case 'IMPACT_WARRIOR':
        return [
          { label: 'Events Joined', value: '34', icon: 'people', color: getRoleColor('impact-warrior') },
          { label: 'Volunteer Hours', value: '128h', icon: 'time', color: getRoleColor('impact-warrior') },
          { label: 'Impact Score', value: '4.9★', icon: 'star', color: '#4CAF50' },
        ];
      case 'ECO_DEFENDER':
        return [
          { label: 'Jobs Created', value: '47', icon: 'briefcase', color: getRoleColor('eco-defender') },
          { label: 'CO₂ Offset', value: '850 kg', icon: 'leaf', color: getRoleColor('eco-defender') },
          { label: 'ESG Rank', value: '#8', icon: 'trophy', color: '#4CAF50' },
        ];
      case 'ADMIN':
        return [
          { label: 'Users Managed', value: '1,247', icon: 'people', color: getRoleColor('admin') },
          { label: 'Issues Resolved', value: '156', icon: 'checkmark-circle', color: getRoleColor('admin') },
          { label: 'Platform Health', value: '98%', icon: 'analytics', color: '#4CAF50' },
        ];
      default:
        return [
          { label: 'Activities', value: '0', icon: 'star', color: theme.primary },
          { label: 'Points', value: '0', icon: 'trophy', color: theme.primary },
          { label: 'Level', value: '1', icon: 'ribbon', color: '#4CAF50' },
        ];
    }
  };

  // Role-specific quick actions (2x3 grid)
  const getQuickActions = () => {
    switch (activeRole) {
      case 'TRASH_HERO':
        return [
          { title: 'Find Jobs', icon: 'search', color: getRoleColor('trash-hero'), onPress: () => navigation.navigate('MainTabs', { screen: 'Missions' }) },
          { title: 'My Earnings', icon: 'wallet', color: '#FF9800', onPress: () => navigation.navigate('TrashHeroEarnings') },
          { title: 'Performance', icon: 'analytics', color: getRoleColor('trash-hero'), onPress: () => navigation.navigate('TrashHeroEarnings') },
          { title: 'Map View', icon: 'map', color: getRoleColor('trash-hero'), onPress: () => navigation.navigate('MapScreen') },
          { title: 'My Badges', icon: 'medal', color: '#4CAF50', onPress: () => navigation.navigate('BadgeSystem', { userRole: 'TRASH_HERO' }) },
          { title: 'Profile', icon: 'person', color: theme.secondaryText, onPress: () => navigation.navigate('ProfileScreen') },
        ];
      case 'IMPACT_WARRIOR':
        return [
          { title: 'Join Mission', icon: 'leaf', color: getRoleColor('impact-warrior'), onPress: () => navigation.navigate('MainTabs', { screen: 'Missions' }) },
          { title: 'Restoration Lab', icon: 'flask', color: '#f97316', onPress: () => navigation.navigate('ParkRestorationLab') },
          { title: 'My Impact', icon: 'analytics', color: getRoleColor('impact-warrior'), onPress: () => navigation.navigate('ImpactWarriorImpact') },
          { title: 'PEAR Verified Missions', icon: 'people', color: getRoleColor('impact-warrior'), onPress: () => navigation.navigate('PearVerifiedMissions') },
          { title: 'My Badges', icon: 'medal', color: '#4CAF50', onPress: () => navigation.navigate('BadgeSystem', { userRole: 'IMPACT_WARRIOR' }) },
          { title: 'Profile', icon: 'person', color: theme.secondaryText, onPress: () => navigation.navigate('ProfileScreen') },
        ];
      case 'ECO_DEFENDER':
        return [
          { title: 'Post New Job', icon: 'add-circle', color: getRoleColor('eco-defender'), onPress: () => navigation.navigate('PostJob') },
          { title: 'Manage Missions', icon: 'list', color: getRoleColor('eco-defender'), onPress: () => navigation.navigate('EcoDefenderMissions') },
          { title: 'Eco Missions', icon: 'rocket', color: '#4CAF50', onPress: () => navigation.navigate('EcoDefenderMissions') },
          { title: 'Fund Wallet', icon: 'card', color: '#FF9800', onPress: () => navigation.navigate('WalletScreen', { role: 'eco-defender' }) },
          { title: 'View Impact', icon: 'analytics', color: '#FF9800', onPress: () => navigation.navigate('EcoDefenderImpact') },
          { title: 'View Map', icon: 'map', color: getRoleColor('eco-defender'), onPress: () => navigation.navigate('MapScreen') },
        ];
      case 'ADMIN':
        return [
          { title: 'Admin Panel', icon: 'speedometer', color: '#FF9800', onPress: () => navigation.navigate('AdminDashboard') },
          { title: 'User Management', icon: 'people', color: getRoleColor('admin'), onPress: () => navigation.navigate('UserManagement') },
          { title: 'Issue Resolution', icon: 'warning', color: '#F44336', onPress: () => navigation.navigate('AdminIssueResolution') },
          { title: 'Mission Control', icon: 'desktop', color: getRoleColor('admin'), onPress: () => navigation.navigate('AdminMissionControl') },
          { title: 'Analytics', icon: 'bar-chart', color: '#4CAF50', onPress: () => navigation.navigate('Analytics') },
          { title: 'Settings', icon: 'settings', color: theme.secondaryText, onPress: () => navigation.navigate('AdminSettings') },
        ];
      default:
        return [];
    }
  };

  // Recent activity data
  const getRecentActivity = () => {
    switch (activeRole) {
      case 'TRASH_HERO':
        return [
          {
            id: '1',
            title: 'Beach Cleanup Initiative',
            location: 'Santa Monica Beach',
            status: 'Completed',
            reward: '$45',
            date: 'Today',
            progress: 100,
          },
          {
            id: '2',
            title: 'Park Restoration Project',
            location: 'Central Park',
            status: 'In Progress',
            reward: '$65',
            date: '2 hours ago',
            progress: 75,
          },
        ];
      case 'IMPACT_WARRIOR':
        return [
          {
            id: '1',
            title: 'Community Beach Day',
            location: 'Venice Beach',
            status: 'Joined',
            reward: '25 pts',
            date: 'Tomorrow',
            progress: 0,
          },
          {
            id: '2',
            title: 'River Cleanup Drive',
            location: 'LA River',
            status: 'Completed',
            reward: '40 pts',
            date: 'Yesterday',
            progress: 100,
          },
        ];
      case 'ECO_DEFENDER':
        return [
          {
            id: '1',
            title: 'Beach Cleanup Initiative',
            location: 'Santa Monica Beach',
            status: 'Active',
            reward: '6 eco warriors',
            date: 'Today',
            progress: 85,
          },
        ];
      case 'ADMIN':
        return [
          {
            id: '1',
            title: 'User Report Resolved',
            location: 'System Alert',
            status: 'Resolved',
            reward: 'Priority: High',
            date: '1 hour ago',
            progress: 100,
          },
        ];
      default:
        return [];
    }
  };

  const keyMetrics = getKeyMetrics();
  const quickActions = getQuickActions();
  const recentActivity = getRecentActivity();

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
    <PEARScreen
      title="Dashboard"
      role={activeRole || 'TRASH_HERO'}
      showHeader={false}
      showScroll={true}
      enableRefresh={true}
      onRefresh={() => {
        // Refresh dashboard data
        console.log('Refreshing dashboard...');
      }}
      refreshing={false}
      navigation={navigation}
      backgroundColor="white"
    >
      {/* Unified Header */}
      <UnifiedHeader
        onMenuPress={() => setShowMenu(true)}
        role={activeRole || 'TRASH_HERO'}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onProfilePress={() => navigation.navigate('ProfileScreen', { 
          role: activeRole || 'TRASH_HERO',
          onSignOut: () => navigation.navigate('Login')
        })}
      />
        {/* My Card Section */}
        <View style={[styles.myCard, { 
          backgroundColor: theme.cardBackground,
          borderTopWidth: 3,
          borderTopColor: roleConfig.color
        }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.textColor }]}>My Card</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={roleConfig.color} />
              <Text style={[styles.verifiedText, { color: roleConfig.color }]}>PEAR Verified</Text>
            </View>
          </View>
          
          {/* Role Toggle Section - Only show for TRASH_HERO/IMPACT_WARRIOR users */}
          {(user && (user.role === 'TRASH_HERO' || user.role === 'IMPACT_WARRIOR')) && (
            <View style={styles.toggleSection}>
              <View style={styles.toggleContainer}>
                <Text style={[
                  styles.toggleLabel, 
                  { color: activeRole === 'TRASH_HERO' ? getRoleColor('TRASH_HERO') : theme.secondaryText }
                ]}>
                  Trash Hero
                </Text>
                
                <TouchableOpacity
                  style={[
                    styles.toggleSwitch,
                    { backgroundColor: activeRole === 'IMPACT_WARRIOR' ? getRoleColor('IMPACT_WARRIOR') : getRoleColor('TRASH_HERO') }
                  ]}
                  onPress={toggleRole}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.toggleThumb,
                    { 
                      backgroundColor: theme.background,
                      transform: [{ 
                        translateX: activeRole === 'IMPACT_WARRIOR' ? 22 : 2 
                      }]
                    }
                  ]} />
                </TouchableOpacity>
                
                <Text style={[
                  styles.toggleLabel, 
                  { color: activeRole === 'IMPACT_WARRIOR' ? getRoleColor('IMPACT_WARRIOR') : theme.secondaryText }
                ]}>
                  Impact Warrior
                </Text>
              </View>
              <Text style={[styles.toggleDescription, { color: theme.secondaryText }]}>
                {activeRole === 'TRASH_HERO' 
                  ? 'Switch to volunteer mode for community missions' 
                  : 'Switch to professional mode for paid cleanup jobs'
                }
              </Text>
            </View>
          )}
          
          <View style={styles.profileSection}>
            <View style={[styles.profileAvatar, { backgroundColor: roleConfig.color }]}>
              <Text style={styles.avatarText}>EC</Text>
              <View style={[styles.avatarBadge, { backgroundColor: roleConfig.color }]}>
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
          
          {roleConfig.progress < 100 && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressTitle, { color: theme.textColor }]}>
                  Progress to 🏆 Impact Investor
                </Text>
                <View style={[styles.evolutionBadge, { backgroundColor: '#007bff' }]}>
                  <Ionicons name="trending-up" size={12} color="white" />
                  <Text style={styles.evolutionText}>Evolution</Text>
                </View>
              </View>
              
              <View style={[styles.progressBarContainer, { backgroundColor: roleConfig.color }]}>
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
          )}
          
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
              <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
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
        userRole={activeRole}
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
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
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
    fontWeight: '700',
    marginBottom: THEME.SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: THEME.SPACING.md + 4,
    paddingHorizontal: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
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
  // Toggle section styles
  toggleSection: {
    marginBottom: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    paddingHorizontal: THEME.SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginHorizontal: THEME.SPACING.sm,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.sm,
  },
  toggleLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: THEME.BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  toggleDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default UnifiedHeroDashboard;