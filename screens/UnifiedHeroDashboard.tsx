import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import UnifiedHeader from "../components/UnifiedHeader";
import MenuModal from "../components/MenuModal";

const { width } = Dimensions.get('window');

interface UnifiedHeroDashboardProps {
  navigation: any;
  userRole?: 'TRASH_HERO' | 'VOLUNTEER' | 'BUSINESS' | 'ADMIN';
}

const UnifiedHeroDashboard: React.FC<UnifiedHeroDashboardProps> = ({ 
  navigation, 
  userRole = 'BUSINESS' 
}) => {
  const { theme, setTheme } = useTheme();
  const { currentRole, setCurrentRole, user, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  
  // Sync theme with current role from auth context
  useEffect(() => {
    const themeRole = currentRole === 'TRASH_HERO' ? 'trash-hero' : 
                     currentRole === 'VOLUNTEER' ? 'impact-warrior' :
                     currentRole === 'BUSINESS' ? 'business' : 'admin';
    setTheme(themeRole);
  }, [currentRole, setTheme]);
  
  // Toggle between TRASH_HERO and VOLUNTEER
  const toggleRole = () => {
    if (user && (user.role === 'TRASH_HERO' || user.role === 'VOLUNTEER')) {
      const newRole = currentRole === 'TRASH_HERO' ? 'VOLUNTEER' : 'TRASH_HERO';
      setCurrentRole(newRole);
    }
  };
  
  // Use current role from auth context for display logic
  const activeRole = currentRole;
  
  // Role configuration with correct colors
  const getRoleConfig = () => {
    switch (activeRole) {
      case 'TRASH_HERO':
        return {
          title: 'TrashHero Pro',
          subtitle: 'Professional Cleaner',
          color: getRoleColor('trash-hero'),
          level: 6,
          points: 2450,
          progress: 85,
          nextLevelPoints: 150,
          badge: 'Elite Cleaner',
          badgeIcon: '🎯',
        };
      case 'VOLUNTEER':
        return {
          title: 'Impact Warrior',
          subtitle: 'Community Volunteer',
          color: getRoleColor('impact-warrior'),
          level: 4,
          points: 1680,
          progress: 72,
          nextLevelPoints: 320,
          badge: 'Community Champion',
          badgeIcon: '❤️',
        };
      case 'BUSINESS':
        return {
          title: 'EcoDefender Corp',
          subtitle: 'EcoDefender',
          color: getRoleColor('business'),
          level: 6,
          points: 3450,
          progress: 93,
          nextLevelPoints: 150,
          badge: 'Green Pioneer',
          badgeIcon: '🌱',
        };
      case 'ADMIN':
        return {
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
      default:
        return {
          title: 'User',
          subtitle: 'Platform User',
          color: theme.primary,
          level: 1,
          points: 0,
          progress: 0,
          nextLevelPoints: 100,
          badge: 'Beginner',
          badgeIcon: '⭐',
        };
    }
  };

  // Role-specific key metrics
  const getKeyMetrics = () => {
    switch (activeRole) {
      case 'TRASH_HERO':
        return [
          { label: 'Jobs Completed', value: '47', icon: 'briefcase', color: getRoleColor('business') },
          { label: 'Total Earned', value: '$2,340', icon: 'cash', color: getRoleColor('trash-hero') },
          { label: 'Success Rate', value: '97%', icon: 'trophy', color: '#8b5cf6' },
        ];
      case 'VOLUNTEER':
        return [
          { label: 'Events Joined', value: '34', icon: 'people', color: getRoleColor('business') },
          { label: 'Volunteer Hours', value: '128h', icon: 'time', color: getRoleColor('trash-hero') },
          { label: 'Impact Score', value: '4.9★', icon: 'star', color: '#8b5cf6' },
        ];
      case 'BUSINESS':
        return [
          { label: 'Jobs Created', value: '47', icon: 'briefcase', color: '#007bff' },
          { label: 'CO₂ Offset', value: '850 kg', icon: 'leaf', color: '#28A745' },
          { label: 'ESG Rank', value: '#8', icon: 'trophy', color: '#8b5cf6' },
        ];
      case 'ADMIN':
        return [
          { label: 'Users Managed', value: '1,247', icon: 'people', color: '#007bff' },
          { label: 'Issues Resolved', value: '156', icon: 'checkmark-circle', color: '#28A745' },
          { label: 'Platform Health', value: '98%', icon: 'analytics', color: '#8b5cf6' },
        ];
      default:
        return [
          { label: 'Activities', value: '0', icon: 'star', color: '#007bff' },
          { label: 'Points', value: '0', icon: 'trophy', color: '#28A745' },
          { label: 'Level', value: '1', icon: 'ribbon', color: '#8b5cf6' },
        ];
    }
  };

  // Role-specific quick actions (2x3 grid)
  const getQuickActions = () => {
    switch (activeRole) {
      case 'TRASH_HERO':
        return [
          { title: 'Find Jobs', icon: 'search', color: '#28A745', onPress: () => navigation.navigate('TrashHeroMissions') },
          { title: 'My Earnings', icon: 'wallet', color: '#ffc107', onPress: () => navigation.navigate('TrashHeroEarnings') },
          { title: 'Performance', icon: 'analytics', color: '#007bff', onPress: () => navigation.navigate('TrashHeroEarnings') },
          { title: 'Map View', icon: 'map', color: '#17a2b8', onPress: () => navigation.navigate('MapScreen') },
          { title: 'My Badges', icon: 'medal', color: '#8b5cf6', onPress: () => navigation.navigate('BadgeSystem', { userRole: 'TRASH_HERO' }) },
          { title: 'Profile', icon: 'person', color: '#6c757d', onPress: () => navigation.navigate('ProfileScreen', { role: 'trash-hero' }) },
        ];
      case 'VOLUNTEER':
        return [
          { title: 'Join Mission', icon: 'leaf', color: '#dc3545', onPress: () => navigation.navigate('ImpactWarriorMissions') },
          { title: 'My Impact', icon: 'analytics', color: '#28A745', onPress: () => navigation.navigate('ImpactWarriorImpact') },
          { title: 'PEAR Verified Missions', icon: 'people', color: '#007bff', onPress: () => navigation.navigate('PearVerifiedMissions') },
          { title: 'Map View', icon: 'map', color: '#17a2b8', onPress: () => navigation.navigate('MapScreen') },
          { title: 'My Badges', icon: 'medal', color: '#8b5cf6', onPress: () => navigation.navigate('BadgeSystem', { userRole: 'VOLUNTEER' }) },
          { title: 'Profile', icon: 'person', color: '#6c757d', onPress: () => navigation.navigate('ProfileScreen', { role: 'impact-warrior' }) },
        ];
      case 'BUSINESS':
        return [
          { title: 'Post New Job', icon: 'add-circle', color: '#007bff', onPress: () => navigation.navigate('PostJob') },
          { title: 'Manage Missions', icon: 'list', color: '#28A745', onPress: () => navigation.navigate('EcoDefenderMissions') },
          { title: 'Eco Missions', icon: 'rocket', color: '#8b5cf6', onPress: () => navigation.navigate('EcoDefenderMissions') },
          { title: 'Fund Wallet', icon: 'card', color: '#ffc107', onPress: () => navigation.navigate('WalletScreen', { role: 'business' }) },
          { title: 'View Impact', icon: 'analytics', color: '#fd7e14', onPress: () => navigation.navigate('EcoDefenderImpact') },
          { title: 'View Map', icon: 'map', color: '#17a2b8', onPress: () => navigation.navigate('MapScreen') },
        ];
      case 'ADMIN':
        return [
          { title: 'Admin Panel', icon: 'speedometer', color: '#fd7e14', onPress: () => navigation.navigate('AdminDashboard') },
          { title: 'User Management', icon: 'people', color: '#28A745', onPress: () => navigation.navigate('UserManagement') },
          { title: 'Issue Resolution', icon: 'warning', color: '#dc3545', onPress: () => navigation.navigate('AdminIssueResolution') },
          { title: 'Mission Control', icon: 'desktop', color: '#007bff', onPress: () => navigation.navigate('AdminMissionControl') },
          { title: 'Analytics', icon: 'bar-chart', color: '#8b5cf6', onPress: () => navigation.navigate('Analytics') },
          { title: 'Settings', icon: 'settings', color: '#6c757d', onPress: () => navigation.navigate('AdminSettings') },
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
      case 'VOLUNTEER':
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
      case 'BUSINESS':
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

  const roleConfig = getRoleConfig();
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <UnifiedHeader
        onMenuPress={() => setShowMenu(true)}
        role={activeRole}
        points={roleConfig.points}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onProfilePress={() => navigation.navigate('ProfileScreen', { 
          role: activeRole === 'TRASH_HERO' ? 'trash-hero' : 'impact-warrior',
          onSignOut: () => navigation.navigate('Login')
        })}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* My Card Section */}
        <View style={[styles.myCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.textColor }]}>My Card</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={roleConfig.color} />
              <Text style={[styles.verifiedText, { color: roleConfig.color }]}>PEAR Verified</Text>
            </View>
          </View>
          
          {/* Role Toggle Section - Only show for TRASH_HERO/VOLUNTEER users */}
          {(user && (user.role === 'TRASH_HERO' || user.role === 'VOLUNTEER')) && (
            <View style={styles.toggleSection}>
              <View style={styles.toggleContainer}>
                <Text style={[
                  styles.toggleLabel, 
                  { color: activeRole === 'TRASH_HERO' ? '#28A745' : theme.secondaryText }
                ]}>
                  Trash Hero
                </Text>
                
                <TouchableOpacity
                  style={[
                    styles.toggleSwitch,
                    { backgroundColor: activeRole === 'VOLUNTEER' ? '#dc3545' : '#28A745' }
                  ]}
                  onPress={toggleRole}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.toggleThumb,
                    { 
                      backgroundColor: 'white',
                      transform: [{ 
                        translateX: activeRole === 'VOLUNTEER' ? 22 : 2 
                      }]
                    }
                  ]} />
                </TouchableOpacity>
                
                <Text style={[
                  styles.toggleLabel, 
                  { color: activeRole === 'VOLUNTEER' ? '#dc3545' : theme.secondaryText }
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
              <Text style={[styles.viewAllText, { color: '#007bff' }]}>View All</Text>
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
        userRole={activeRole}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 8,
  },
  menuButton: {
    padding: 8,
  },
  pearLogo: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pearText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  profileButton: {
    position: 'relative',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#28a745',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
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
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  evolutionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  evolutionText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressRemaining: {
    fontSize: 12,
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
    fontWeight: '700',
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
  // Toggle section styles
  toggleSection: {
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginHorizontal: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleLabel: {
    fontSize: 14,
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
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  toggleDescription: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default UnifiedHeroDashboard;