import React, { useEffect } from 'react';
import { UserRole } from '../types/roles';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';
import { useAuth } from '../context/AuthContext';
import RoleDashboardLayout from '../components/RoleDashboardLayout';

interface UnifiedHeroDashboardProps {
  navigation: any;
  userRole?: UserRole;
}

const UnifiedHeroDashboardRefactored: React.FC<UnifiedHeroDashboardProps> = ({ 
  navigation, 
  userRole = 'TRASH_HERO' 
}) => {
  const { theme, setTheme } = useTheme();
  const { currentRole, setCurrentRole, user } = useAuth();
  
  // Sync theme with current role from auth context
  useEffect(() => {
    const themeRole = currentRole === 'TRASH_HERO' ? 'TRASH_HERO' : 
                     currentRole === 'IMPACT_WARRIOR' ? 'IMPACT_WARRIOR' :
                     currentRole === 'ECO_DEFENDER' ? 'ECO_DEFENDER' : 'ADMIN';
    setTheme(themeRole);
  }, [currentRole, setTheme]);
  
  // Toggle between TRASH_HERO and IMPACT_WARRIOR
  const toggleRole = () => {
    console.log('Toggle clicked! Current role:', currentRole, 'User role:', user?.role);
    if (user && (user.role === 'TRASH_HERO' || user.role === 'IMPACT_WARRIOR')) {
      const newRole = currentRole === 'TRASH_HERO' ? 'IMPACT_WARRIOR' : 'TRASH_HERO';
      console.log('Switching to role:', newRole);
      setCurrentRole(newRole);
    } else {
      console.log('Cannot switch roles - user role:', user?.role);
    }
  };
  
  // Use current role from auth context for display logic
  const activeRole = currentRole;
  
  // Role configuration based on active role
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
      case 'IMPACT_WARRIOR':
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
      default:
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
    }
  };

  // Get key metrics based on active role
  const getKeyMetrics = () => {
    switch (activeRole) {
      case 'TRASH_HERO':
        return [
          { label: 'Jobs Completed', value: '47', icon: 'briefcase', color: theme.primary },
          { label: 'Total Earned', value: '$2,340', icon: 'card', color: theme.primary },
          { label: 'Success Rate', value: '97%', icon: 'shield-checkmark', color: theme.primary },
        ];
      case 'IMPACT_WARRIOR':
        return [
          { label: 'Events Joined', value: '34', icon: 'people', color: theme.primary },
          { label: 'Impact Points', value: '1,680', icon: 'star', color: theme.primary },
          { label: 'Cleanups Led', value: '12', icon: 'people-circle', color: theme.primary },
        ];
      default:
        return [
          { label: 'Jobs Completed', value: '47', icon: 'briefcase', color: theme.primary },
          { label: 'Total Earned', value: '$2,340', icon: 'card', color: theme.primary },
          { label: 'Success Rate', value: '97%', icon: 'shield-checkmark', color: theme.primary },
        ];
    }
  };

  // Get quick actions based on active role
  const getQuickActions = () => {
    switch (activeRole) {
      case 'TRASH_HERO':
        return [
          { title: 'Find Jobs', icon: 'search', color: theme.primary, onPress: () => navigation.navigate('MainTabs', { screen: 'Missions' }) },
          { title: 'My Earnings', icon: 'wallet', color: theme.warning, onPress: () => navigation.navigate('TrashHeroEarnings') },
          { title: 'Performance', icon: 'analytics', color: theme.primary, onPress: () => navigation.navigate('TrashHeroEarnings') },
          { title: 'Map View', icon: 'map', color: theme.primary, onPress: () => navigation.navigate('MapScreen') },
          { title: 'My Badges', icon: 'medal', color: '#8b5cf6', onPress: () => navigation.navigate('BadgeSystem', { userRole: 'TRASH_HERO' }) },
          { title: 'Profile', icon: 'person', color: theme.secondaryText, onPress: () => navigation.navigate('ProfileScreen', { role: 'trash-hero' }) },
        ];
      case 'IMPACT_WARRIOR':
        return [
          { title: 'Join Mission', icon: 'leaf', color: theme.error, onPress: () => navigation.navigate('MainTabs', { screen: 'Missions' }) },
          { title: 'My Impact', icon: 'analytics', color: theme.primary, onPress: () => navigation.navigate('ImpactWarriorImpact') },
          { title: 'PEAR Verified Missions', icon: 'people', color: theme.primary, onPress: () => navigation.navigate('PearVerifiedMissions') },
          { title: 'Map View', icon: 'map', color: theme.primary, onPress: () => navigation.navigate('MapScreen') },
          { title: 'My Badges', icon: 'medal', color: '#8b5cf6', onPress: () => navigation.navigate('BadgeSystem', { userRole: 'IMPACT_WARRIOR' }) },
          { title: 'Profile', icon: 'person', color: theme.secondaryText, onPress: () => navigation.navigate('ProfileScreen', { role: 'impact-warrior' }) },
        ];
      default:
        return [];
    }
  };

  // Get recent activity based on active role
  const getRecentActivity = () => {
    switch (activeRole) {
      case 'TRASH_HERO':
        return [
          {
            id: '1',
            title: 'Downtown Cleanup',
            description: 'Completed street cleaning job',
            status: 'Completed',
            time: '2 hours ago',
            icon: 'checkmark-circle',
            color: '#28a745',
          },
          {
            id: '2',
            title: 'Park Maintenance',
            description: 'Scheduled for tomorrow morning',
            status: 'Scheduled',
            time: '1 day ago',
            icon: 'calendar',
            color: theme.primary,
          },
        ];
      case 'IMPACT_WARRIOR':
        return [
          {
            id: '1',
            title: 'Beach Cleanup',
            description: 'Joined community beach cleanup event',
            status: 'Completed',
            time: '3 hours ago',
            icon: 'leaf',
            color: '#28a745',
          },
          {
            id: '2',
            title: 'Tree Planting',
            description: 'Volunteered for urban reforestation',
            status: 'Completed',
            time: '2 days ago',
            icon: 'flower',
            color: '#28a745',
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

  // Show toggle only for users who can switch between TRASH_HERO and IMPACT_WARRIOR
  const showToggle = Boolean(user && (user.role === 'TRASH_HERO' || user.role === 'IMPACT_WARRIOR'));

  return (
    <RoleDashboardLayout
      navigation={navigation}
      role={activeRole}
      roleConfig={roleConfig}
      keyMetrics={keyMetrics}
      quickActions={quickActions}
      recentActivity={recentActivity}
      showToggle={showToggle}
      onToggleRole={toggleRole}
    />
  );
};

export default UnifiedHeroDashboardRefactored;
