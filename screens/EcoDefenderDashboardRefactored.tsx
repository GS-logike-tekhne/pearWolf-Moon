import React from 'react';
import ScreenLayout from '../components/ScreenLayout';
import { UserRole } from '../types/roles';
import { getRoleColor } from '../utils/roleColors';
import RoleDashboardLayout from '../components/RoleDashboardLayout';
import { useTheme } from '../context/ThemeContext';

interface EcoDefenderDashboardProps {
  navigation: any;
}

const EcoDefenderDashboardRefactored: React.FC<EcoDefenderDashboardProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const role: UserRole = 'ECO_DEFENDER';
  
  // Role configuration
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

  // Quick actions (2x2 grid - 4 items max)
  const quickActions = [
    { title: 'Post New Job', icon: 'add-circle', color: getRoleColor('business'), onPress: () => navigation.navigate('PostJob') },
    { title: 'Manage Missions', icon: 'list', color: getRoleColor('trash-hero'), onPress: () => navigation.navigate('EcoDefenderMissions') },
    { title: 'Fund Wallet', icon: 'card', color: theme.warning, onPress: () => navigation.navigate('WalletScreen', { role: 'business' }) },
    { title: 'View Impact', icon: 'analytics', color: getRoleColor('admin'), onPress: () => navigation.navigate('EcoDefenderImpact') },
  ];

  // Recent activity
  const recentActivity = [
    {
      id: '1',
      title: 'Beach Cleanup Funded',
      description: 'Sponsored 15 volunteers for Ocean Beach cleanup',
      status: 'Completed',
      time: '2 hours ago',
      icon: 'leaf',
      color: '#28a745',
    },
    {
      id: '2',
      title: 'New Job Posted',
      description: 'Downtown Park Maintenance - $500 budget',
      status: 'Active',
      time: '1 day ago',
      icon: 'add-circle',
      color: theme.primary,
    },
    {
      id: '3',
      title: 'Impact Report Generated',
      description: 'Monthly ESG impact summary ready',
      status: 'Ready',
      time: '3 days ago',
      icon: 'analytics',
      color: '#8b5cf6',
    },
  ];

  return (
    <RoleDashboardLayout
      navigation={navigation}
      role={role}
      roleConfig={roleConfig}
      keyMetrics={keyMetrics}
      quickActions={quickActions}
      recentActivity={recentActivity}
    />
  );
};

export default EcoDefenderDashboardRefactored;
