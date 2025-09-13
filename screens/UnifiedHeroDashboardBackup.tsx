import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { THEME } from '../styles/theme';
import { useAuth } from "../context/AuthContext";
import UnifiedHeader from "../components/UnifiedHeader";
import MenuModal from "../components/MenuModal";
import PEARScreen from "../components/PEARScreen";
import { UserRole } from "../types/roles";

const { width } = Dimensions.get('window');

interface UnifiedHeroDashboardBackupProps {
  navigation: any;
  userRole?: UserRole;
}

const UnifiedHeroDashboardBackup: React.FC<UnifiedHeroDashboardBackupProps> = ({ 
  navigation, 
  userRole = 'TRASH_HERO' 
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  
  console.log('UnifiedHeroDashboardBackup: Rendering with role:', userRole);
  
  // Simple role configuration
  const roleConfig = {
    title: 'Eco Hero',
    subtitle: 'Environmental Warrior',
    color: '#4CAF50',
    icon: 'leaf',
    level: 6,
    points: 2450,
    progress: 85,
    nextLevelPoints: 150,
    badgeIcon: '🏆',
    badge: 'Eco Champion',
  };

  // Simple quick actions
  const quickActions = [
    { title: 'Find Jobs', icon: 'search', color: roleConfig.color, onPress: () => navigation.navigate('MainTabs', { screen: 'Missions' }) },
    { title: 'My Earnings', icon: 'wallet', color: '#FF9800', onPress: () => navigation.navigate('WalletScreen', { role: userRole.toLowerCase() }) },
    { title: 'Performance', icon: 'analytics', color: roleConfig.color, onPress: () => navigation.navigate('TrashHeroEarnings') },
    { title: 'Map View', icon: 'map', color: roleConfig.color, onPress: () => navigation.navigate('MapScreen') },
  ];

  return (
    <PEARScreen
      title="Dashboard"
      role={userRole}
      showHeader={false}
      showScroll={true}
      enableRefresh={false}
      contentPadding={true}
      onRefresh={() => {
        console.log('Refreshing dashboard...');
      }}
      refreshing={false}
    >
      <UnifiedHeader
        onMenuPress={() => setShowMenu(true)}
        role={userRole.toLowerCase().replace('_', '-')}
        points={roleConfig.points}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onProfilePress={() => navigation.navigate('ProfileScreen', { 
          role: userRole.toLowerCase().replace('_', '-'),
          onSignOut: () => navigation.navigate('Login')
        })}
      />

      <View style={styles.content}>
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

        {/* Role Toggle Section */}
        <View style={[styles.roleToggleSection, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.roleToggleHeader}>
            <Text style={[styles.roleToggleTitle, { color: theme.textColor }]}>
              Current Role: {roleConfig.title}
            </Text>
            <Text style={[styles.roleToggleSubtitle, { color: theme.textSecondary }]}>
              {roleConfig.subtitle}
            </Text>
          </View>
          
          {/* Role Toggle Switch */}
          <View style={styles.toggleContainer}>
            <Text style={[
              styles.toggleLabel, 
              { color: userRole === 'TRASH_HERO' ? '#4CAF50' : theme.secondaryText }
            ]}>
              Trash Hero
            </Text>
            
            <TouchableOpacity
              style={[
                styles.toggleSwitch,
                { backgroundColor: userRole === 'TRASH_HERO' ? '#4CAF50' : '#E0E0E0' }
              ]}
              onPress={() => {
                // Toggle between TRASH_HERO and IMPACT_WARRIOR
                console.log('Role toggle pressed');
              }}
            >
              <View style={[
                styles.toggleThumb,
                { 
                  backgroundColor: 'white',
                  transform: [{ translateX: userRole === 'TRASH_HERO' ? 0 : 20 }]
                }
              ]} />
            </TouchableOpacity>
            
            <Text style={[
              styles.toggleLabel, 
              { color: userRole === 'IMPACT_WARRIOR' ? '#FF5722' : theme.secondaryText }
            ]}>
              Impact Warrior
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickActionCard, { backgroundColor: theme.cardBackground }]}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="white" />
                </View>
                <Text style={[styles.actionTitle, { color: theme.textColor }]}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={userRole}
        userName={user?.name || 'User'}
        userLevel={roleConfig.level}
        onNavigate={(screen, params) => {
          navigation.navigate(screen, params);
        }}
        onSignOut={() => {
          navigation.navigate('Login');
        }}
      />
    </PEARScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: THEME.SPACING.md,
  },
  myCard: {
    borderRadius: THEME.BORDER_RADIUS.lg,
    padding: THEME.SPACING.lg,
    marginBottom: THEME.SPACING.lg,
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
    marginBottom: THEME.SPACING.md,
  },
  cardTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.xs,
  },
  verifiedText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.md,
    position: 'relative',
  },
  avatarText: {
    fontSize: 24,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
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
    marginBottom: THEME.SPACING.xs,
  },
  profileRole: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    marginBottom: THEME.SPACING.sm,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.xs,
  },
  badgeEmoji: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
  },
  badgeText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  roleToggleSection: {
    borderRadius: THEME.BORDER_RADIUS.lg,
    padding: THEME.SPACING.lg,
    marginBottom: THEME.SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleToggleHeader: {
    alignItems: 'center',
  },
  roleToggleTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    marginBottom: THEME.SPACING.xs,
  },
  roleToggleSubtitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: THEME.SPACING.md,
    gap: THEME.SPACING.md,
  },
  toggleLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionsSection: {
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
    gap: THEME.SPACING.md,
  },
  quickActionCard: {
    width: (width - THEME.SPACING.md * 2 - THEME.SPACING.md) / 2,
    padding: THEME.SPACING.lg,
    borderRadius: THEME.BORDER_RADIUS.lg,
    alignItems: 'center',
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
    marginBottom: THEME.SPACING.sm,
  },
  actionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default UnifiedHeroDashboardBackup;
