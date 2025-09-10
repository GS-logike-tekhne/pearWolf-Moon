import React, { ReactNode, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/roles';
import UnifiedHeader from './UnifiedHeader';
import MenuModal from './MenuModal';

const { width } = Dimensions.get('window');

interface QuickAction {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface KeyMetric {
  label: string;
  value: string;
  icon: string;
  color: string;
}

interface RecentActivity {
  id: string;
  title: string;
  description: string;
  status: string;
  time: string;
  icon: string;
  color: string;
}

interface RoleConfig {
  title: string;
  subtitle: string;
  color: string;
  level: number;
  points: number;
  progress: number;
  nextLevelPoints: number;
  badge: string;
  badgeIcon: string;
}

interface RoleDashboardLayoutProps {
  navigation: any;
  role: UserRole;
  roleConfig: RoleConfig;
  keyMetrics: KeyMetric[];
  quickActions: QuickAction[];
  recentActivity: RecentActivity[];
  children?: ReactNode;
  showToggle?: boolean;
  onToggleRole?: () => void;
  customHeader?: ReactNode;
  customContent?: ReactNode;
}

const RoleDashboardLayout: React.FC<RoleDashboardLayoutProps> = ({
  navigation,
  role,
  roleConfig,
  keyMetrics,
  quickActions,
  recentActivity,
  children,
  showToggle = false,
  onToggleRole,
  customHeader,
  customContent,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const QuickActionCard = ({ action, index }: { action: QuickAction; index: number }) => (
    <TouchableOpacity
      key={index}
      style={[styles.quickActionCard, { backgroundColor: theme.cardBackground }]}
      onPress={action.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
        <Ionicons name={action.icon as any} size={20} color="white" />
      </View>
      <Text style={[styles.actionTitle, { color: theme.textColor }]}>{action.title}</Text>
    </TouchableOpacity>
  );

  const MetricCard = ({ metric, index }: { metric: KeyMetric; index: number }) => (
    <View key={index} style={[styles.metricCard, { backgroundColor: theme.cardBackground }]}>
      <View style={[styles.metricIcon, { backgroundColor: metric.color }]}>
        <Ionicons name={metric.icon as any} size={16} color="white" />
      </View>
      <Text style={[styles.metricValue, { color: theme.textColor }]}>{metric.value}</Text>
      <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>{metric.label}</Text>
    </View>
  );

  const ActivityCard = ({ activity }: { activity: RecentActivity }) => (
    <View style={[styles.activityCard, { backgroundColor: theme.cardBackground }]}>
      <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
        <Ionicons name={activity.icon as any} size={16} color="white" />
      </View>
      <View style={styles.activityContent}>
        <Text style={[styles.activityTitle, { color: theme.textColor }]}>{activity.title}</Text>
        <Text style={[styles.activityDescription, { color: theme.secondaryText }]}>
          {activity.description}
        </Text>
        <View style={styles.activityFooter}>
          <Text style={[styles.activityStatus, { color: activity.color }]}>{activity.status}</Text>
          <Text style={[styles.activityTime, { color: theme.secondaryText }]}>{activity.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      {customHeader || (
        <UnifiedHeader
          onMenuPress={() => setShowMenu(true)}
          role={role}
          points={roleConfig.points}
          onNotificationPress={() => navigation.navigate('Notifications')}
          onProfilePress={() => navigation.navigate('ProfileScreen', { 
            role: role.toLowerCase().replace('_', '-'),
            onSignOut: () => navigation.navigate('Login')
          })}
        />
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Role Toggle Section (if enabled) */}
        {showToggle && onToggleRole && (
          <View style={[styles.toggleSection, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.toggleHeader}>
              <Text style={[styles.toggleTitle, { color: theme.textColor }]}>Switch Role</Text>
              <View style={[styles.toggleSwitch, { backgroundColor: role === 'IMPACT_WARRIOR' ? roleConfig.color : '#e0e0e0' }]}>
                <TouchableOpacity
                  style={[styles.toggleThumb, { backgroundColor: role === 'IMPACT_WARRIOR' ? 'white' : '#f0f0f0' }]}
                  onPress={onToggleRole}
                >
                  <Ionicons 
                    name={role === 'IMPACT_WARRIOR' ? 'flame' : 'leaf'} 
                    size={16} 
                    color={role === 'IMPACT_WARRIOR' ? roleConfig.color : '#666'} 
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.toggleSubtitle, { color: theme.secondaryText }]}>
              {role === 'IMPACT_WARRIOR' ? 'Impact Warrior Mode' : 'Trash Hero Mode'}
            </Text>
          </View>
        )}

        {/* My Card Section */}
        <View style={[styles.myCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.textColor }]}>My Card</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={roleConfig.color} />
              <Text style={[styles.verifiedText, { color: roleConfig.color }]}>PEAR Verified</Text>
            </View>
          </View>
          
          <View style={styles.profileSection}>
            <View style={[styles.profileAvatar, { backgroundColor: roleConfig.color }]}>
              <Text style={styles.avatarText}>{roleConfig.badgeIcon}</Text>
              <View style={styles.avatarBadge}>
                <Ionicons name="checkmark" size={12} color="white" />
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.textColor }]}>{roleConfig.title}</Text>
              <Text style={[styles.profileRole, { color: theme.secondaryText }]}>{roleConfig.subtitle}</Text>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeEmoji}>{roleConfig.badgeIcon}</Text>
                <Text style={[styles.badgeText, { color: roleConfig.color }]}>{roleConfig.badge}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            {keyMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} index={index} />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} action={action} index={index} />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, { color: roleConfig.color }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityList}>
            {recentActivity.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </View>
        </View>

        {/* Custom Content */}
        {customContent}

        {/* Children Content */}
        {children}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={role}
        userName={roleConfig.title}
        userLevel={roleConfig.level}
        onNavigate={(screen, params) => {
          navigation.navigate(screen, params);
        }}
        onSignOut={() => {
          navigation.navigate('Login');
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
  toggleSection: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleSwitch: {
    width: 60,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleSubtitle: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  myCard: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#28a745',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    marginBottom: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeEmoji: {
    fontSize: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  actionsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 44) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  activitySection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityList: {
    gap: 8,
  },
  activityCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    marginBottom: 4,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  activityTime: {
    fontSize: 12,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default RoleDashboardLayout;
