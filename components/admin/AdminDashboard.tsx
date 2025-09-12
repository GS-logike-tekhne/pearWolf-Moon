import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminAnalyticsService, { AdminDashboard as AdminDashboardType, UserStats, MissionStats } from '../../services/admin/adminAnalyticsService';

interface AdminDashboardProps {
  onRoleSwitch?: (userId: string, newRole: string) => void;
  onExport?: (dataType: string, csvData: string) => void;
}

const { width } = Dimensions.get('window');

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onRoleSwitch,
  onExport,
}) => {
  const [dashboard, setDashboard] = useState<AdminDashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'missions' | 'analytics'>('overview');
  const [exporting, setExporting] = useState<string | null>(null);

  const adminService = AdminAnalyticsService;

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (dataType: 'users' | 'missions' | 'impact') => {
    try {
      setExporting(dataType);
      const csvData = await adminService.exportToCSV(dataType);
      
      // Share the CSV data
      await Share.share({
        message: csvData,
        title: `PEAR ${dataType} Export`,
      });
      
      onExport?.(dataType, csvData);
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Export Failed', 'Failed to export data. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const handleRoleSwitch = async (userId: string, newRole: string) => {
    try {
      const success = await adminService.switchUserRole(userId, newRole);
      if (success) {
        Alert.alert('Success', `User role switched to ${newRole}`);
        onRoleSwitch?.(userId, newRole);
        loadDashboard(); // Refresh data
      } else {
        Alert.alert('Error', 'Failed to switch user role');
      }
    } catch (error) {
      console.error('Error switching role:', error);
      Alert.alert('Error', 'Failed to switch user role');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Admin Dashboard...</Text>
      </View>
    );
  }

  if (!dashboard) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#F44336" />
        <Text style={styles.errorText}>Failed to load dashboard</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadDashboard}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadDashboard}>
          <Ionicons name="refresh" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { key: 'overview', label: 'Overview', icon: 'home' },
          { key: 'users', label: 'Users', icon: 'people' },
          { key: 'missions', label: 'Missions', icon: 'list' },
          { key: 'analytics', label: 'Analytics', icon: 'analytics' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={selectedTab === tab.key ? '#4CAF50' : '#666'}
            />
            <Text style={[
              styles.tabText,
              selectedTab === tab.key && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && <OverviewTab dashboard={dashboard} />}
        {selectedTab === 'users' && <UsersTab dashboard={dashboard} onRoleSwitch={handleRoleSwitch} />}
        {selectedTab === 'missions' && <MissionsTab dashboard={dashboard} />}
        {selectedTab === 'analytics' && <AnalyticsTab dashboard={dashboard} onExport={handleExport} exporting={exporting} />}
      </ScrollView>
    </View>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ dashboard: AdminDashboardType }> = ({ dashboard }) => (
  <View style={styles.tabContent}>
    {/* Impact Stats */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Impact Overview</Text>
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Users"
          value={dashboard.impactStats.totalUsers.toLocaleString()}
          icon="people"
          color="#4CAF50"
        />
        <StatCard
          title="Total Missions"
          value={dashboard.impactStats.totalMissions.toLocaleString()}
          icon="list"
          color="#2196F3"
        />
        <StatCard
          title="Total XP"
          value={dashboard.impactStats.totalXP.toLocaleString()}
          icon="trophy"
          color="#FF9800"
        />
        <StatCard
          title="Trash Collected"
          value={`${dashboard.impactStats.totalImpact.trashCollected} kg`}
          icon="trash"
          color="#9C27B0"
        />
      </View>
    </View>

    {/* System Health */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>System Health</Text>
      <View style={styles.healthCard}>
        <View style={styles.healthItem}>
          <Ionicons name="people" size={20} color="#4CAF50" />
          <Text style={styles.healthText}>
            {dashboard.systemHealth.activeUsers} Active Users
          </Text>
        </View>
        <View style={styles.healthItem}>
          <Ionicons name="server" size={20} color="#4CAF50" />
          <Text style={styles.healthText}>
            Server: {dashboard.systemHealth.serverStatus}
          </Text>
        </View>
        <View style={styles.healthItem}>
          <Ionicons name="database" size={20} color="#4CAF50" />
          <Text style={styles.healthText}>
            Database: {dashboard.systemHealth.databaseStatus}
          </Text>
        </View>
        <View style={styles.healthItem}>
          <Ionicons name="speedometer" size={20} color="#4CAF50" />
          <Text style={styles.healthText}>
            API Response: {dashboard.systemHealth.apiResponseTime}ms
          </Text>
        </View>
      </View>
    </View>

    {/* Recent Alerts */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Alerts</Text>
      {dashboard.alerts.map((alert, index) => (
        <View key={index} style={[styles.alertCard, { borderLeftColor: getAlertColor(alert.type) }]}>
          <View style={styles.alertHeader}>
            <Ionicons name={getAlertIcon(alert.type)} size={20} color={getAlertColor(alert.type)} />
            <Text style={styles.alertType}>{alert.type.toUpperCase()}</Text>
            <Text style={styles.alertTime}>
              {new Date(alert.timestamp).toLocaleTimeString()}
            </Text>
          </View>
          <Text style={styles.alertMessage}>{alert.message}</Text>
          {alert.actionRequired && (
            <View style={styles.actionRequired}>
              <Text style={styles.actionRequiredText}>Action Required</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  </View>
);

// Users Tab Component
const UsersTab: React.FC<{ 
  dashboard: AdminDashboardType; 
  onRoleSwitch: (userId: string, newRole: string) => void;
}> = ({ dashboard, onRoleSwitch }) => (
  <View style={styles.tabContent}>
    <Text style={styles.sectionTitle}>Top Performers</Text>
    {dashboard.impactStats.topPerformers.map((user, index) => (
      <UserCard key={user.userId} user={user} rank={index + 1} onRoleSwitch={onRoleSwitch} />
    ))}
  </View>
);

// Missions Tab Component
const MissionsTab: React.FC<{ dashboard: AdminDashboardType }> = ({ dashboard }) => (
  <View style={styles.tabContent}>
    <Text style={styles.sectionTitle}>Recent Missions</Text>
    {dashboard.recentActivity.completedMissions.map((mission, index) => (
      <MissionCard key={mission.missionId} mission={mission} />
    ))}
  </View>
);

// Analytics Tab Component
const AnalyticsTab: React.FC<{ 
  dashboard: AdminDashboardType; 
  onExport: (dataType: 'users' | 'missions' | 'impact') => void;
  exporting: string | null;
}> = ({ dashboard, onExport, exporting }) => (
  <View style={styles.tabContent}>
    <Text style={styles.sectionTitle}>Data Export</Text>
    <View style={styles.exportButtons}>
      {[
        { type: 'users', label: 'Export Users', icon: 'people' },
        { type: 'missions', label: 'Export Missions', icon: 'list' },
        { type: 'impact', label: 'Export Impact', icon: 'analytics' },
      ].map(exportType => (
        <TouchableOpacity
          key={exportType.type}
          style={styles.exportButton}
          onPress={() => onExport(exportType.type as 'users' | 'missions' | 'impact')}
          disabled={exporting === exportType.type}
        >
          {exporting === exportType.type ? (
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : (
            <Ionicons name={exportType.icon as any} size={24} color="#4CAF50" />
          )}
          <Text style={styles.exportButtonText}>{exportType.label}</Text>
        </TouchableOpacity>
      ))}
    </View>

    <Text style={styles.sectionTitle}>Mission Types</Text>
    {Object.entries(dashboard.impactStats.missionTypes).map(([type, stats]) => (
      <View key={type} style={styles.missionTypeCard}>
        <Text style={styles.missionTypeTitle}>{type}</Text>
        <View style={styles.missionTypeStats}>
          <Text style={styles.missionTypeStat}>Count: {stats.count}</Text>
          <Text style={styles.missionTypeStat}>Completion: {stats.completionRate}%</Text>
          <Text style={styles.missionTypeStat}>Avg XP: {stats.averageXP}</Text>
        </View>
      </View>
    ))}
  </View>
);

// Helper Components
const StatCard: React.FC<{ title: string; value: string; icon: string; color: string }> = ({
  title, value, icon, color
}) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Ionicons name={icon as any} size={24} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const UserCard: React.FC<{ 
  user: UserStats; 
  rank: number; 
  onRoleSwitch: (userId: string, newRole: string) => void;
}> = ({ user, rank, onRoleSwitch }) => (
  <View style={styles.userCard}>
    <View style={styles.userHeader}>
      <Text style={styles.userRank}>#{rank}</Text>
      <Text style={styles.userName}>{user.username}</Text>
      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => handleRoleSwitch(user.userId, user.role, onRoleSwitch)}
      >
        <Text style={styles.roleButtonText}>{user.role}</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.userStats}>
      <Text style={styles.userStat}>Level {user.level}</Text>
      <Text style={styles.userStat}>{user.totalXP} XP</Text>
      <Text style={styles.userStat}>{user.missionsCompleted} missions</Text>
    </View>
  </View>
);

const MissionCard: React.FC<{ mission: MissionStats }> = ({ mission }) => (
  <View style={styles.missionCard}>
    <Text style={styles.missionTitle}>{mission.title}</Text>
    <View style={styles.missionStats}>
      <Text style={styles.missionStat}>{mission.type}</Text>
      <Text style={styles.missionStat}>{mission.participants}/{mission.maxParticipants} participants</Text>
      <Text style={styles.missionStat}>{mission.completionRate}% completion</Text>
    </View>
  </View>
);

// Helper functions
const getAlertColor = (type: string): string => {
  switch (type) {
    case 'error': return '#F44336';
    case 'warning': return '#FF9800';
    case 'success': return '#4CAF50';
    case 'info': return '#2196F3';
    default: return '#9E9E9E';
  }
};

const getAlertIcon = (type: string): string => {
  switch (type) {
    case 'error': return 'alert-circle';
    case 'warning': return 'warning';
    case 'success': return 'checkmark-circle';
    case 'info': return 'information-circle';
    default: return 'help-circle';
  }
};

const handleRoleSwitch = (userId: string, currentRole: string, onRoleSwitch: (userId: string, newRole: string) => void) => {
  const roles = ['volunteer', 'trash-hero', 'business', 'admin'];
  const currentIndex = roles.indexOf(currentRole);
  const nextRole = roles[(currentIndex + 1) % roles.length];
  onRoleSwitch(userId, nextRole);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  healthCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertType: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  alertTime: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#666',
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  actionRequired: {
    backgroundColor: '#FFE0B2',
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  actionRequiredText: {
    fontSize: 10,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  roleButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  roleButtonText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userStat: {
    fontSize: 12,
    color: '#666',
  },
  missionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  missionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  missionStat: {
    fontSize: 12,
    color: '#666',
  },
  exportButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  exportButton: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exportButtonText: {
    marginTop: 8,
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  missionTypeCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  missionTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  missionTypeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  missionTypeStat: {
    fontSize: 12,
    color: '#666',
  },
});

export default AdminDashboard;
