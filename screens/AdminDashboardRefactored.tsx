import React from 'react';
import ScreenLayout from '../components/ScreenLayout';
import { UserRole } from '../types/roles';
import { getRoleColor } from '../utils/roleColors';
import RoleDashboardLayout from '../components/RoleDashboardLayout';
import { useTheme } from '../context/ThemeContext';

interface AdminDashboardProps {
  navigation: any;
}

const AdminDashboardRefactored: React.FC<AdminDashboardProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const role: UserRole = 'ADMIN';
  
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
      title: 'User Verification',
      description: 'Approved 12 new user applications',
      status: 'Completed',
      time: '1 hour ago',
      icon: 'checkmark-circle',
      color: '#28a745',
    },
    {
      id: '2',
      title: 'Issue Resolved',
      description: 'Fixed payment processing bug',
      status: 'Resolved',
      time: '3 hours ago',
      icon: 'bug',
      color: theme.primary,
    },
    {
      id: '3',
      title: 'Mission Approved',
      description: 'Beach cleanup mission approved for funding',
      status: 'Approved',
      time: '1 day ago',
      icon: 'checkmark',
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

export default AdminDashboardRefactored;
