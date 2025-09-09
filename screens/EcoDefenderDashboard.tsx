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
import MenuModal from '../components/MenuModal';
import UnifiedHeader from '../components/UnifiedHeader';

const { width } = Dimensions.get('window');

interface EcoDefenderDashboardProps {
  navigation: any;
}

const EcoDefenderDashboard: React.FC<EcoDefenderDashboardProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const userRole = 'BUSINESS';
  
  // EcoDefender role configuration
  const roleConfig = {
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

  // Key metrics for EcoDefender
  const keyMetrics = [
    { label: 'Jobs Created', value: '47', icon: 'briefcase', color: getRoleColor('business') },
    { label: 'CO₂ Offset', value: '850 kg', icon: 'leaf', color: getRoleColor('trash-hero') },
    { label: 'ESG Rank', value: '#8', icon: 'trophy', color: '#8b5cf6' },
  ];

  // Quick actions (2x3 grid)
  const quickActions = [
    { title: 'Post New Job', icon: 'add-circle', color: getRoleColor('business'), onPress: () => navigation.navigate('PostJob') },
    { title: 'Manage Missions', icon: 'list', color: getRoleColor('trash-hero'), onPress: () => navigation.navigate('EcoDefenderMissions') },
    { title: 'Eco Missions', icon: 'rocket', color: '#8b5cf6', onPress: () => navigation.navigate('EcoDefenderMissions') },
    { title: 'Fund Wallet', icon: 'card', color: '#ffc107', onPress: () => navigation.navigate('WalletScreen', { role: 'business' }) },
    { title: 'View Impact', icon: 'analytics', color: getRoleColor('admin'), onPress: () => navigation.navigate('EcoDefenderImpact') },
    { title: 'View Map', icon: 'map', color: '#17a2b8', onPress: () => navigation.navigate('MapScreen') },
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <UnifiedHeader
        onMenuPress={() => setShowMenu(true)}
        role={userRole}
        points={roleConfig.points}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onProfilePress={() => navigation.navigate('ProfileScreen', { 
          role: 'business',
          onSignOut: () => navigation.navigate('Login')
        })}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* My Card Section */}
        <View style={[styles.myCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.textColor }]}>My Card</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={getRoleColor('business')} />
              <Text style={[styles.verifiedText, { color: getRoleColor('business') }]}>PEAR Verified</Text>
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
              <View style={[styles.evolutionBadge, { backgroundColor: getRoleColor('business') }]}>
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
              <Text style={[styles.viewAllText, { color: getRoleColor('business') }]}>View All</Text>
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

export default EcoDefenderDashboard;