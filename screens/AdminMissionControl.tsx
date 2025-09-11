import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';
import { RoleGuard } from '../components/RoleGuard';
import UnifiedHeader from '../components/UnifiedHeader';
import MenuModal from '../components/MenuModal';

const { width } = Dimensions.get('window');

interface Mission {
  id: string;
  title: string;
  location: string;
  type: 'cleanup' | 'recycling' | 'education' | 'monitoring';
  status: 'draft' | 'active' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedHeroes: number;
  maxCapacity: number;
  startDate: string;
  estimatedDuration: string;
  reward: number;
  postedBy: {
    name: string;
    type: 'business' | 'community' | 'admin';
  };
  participants: {
    heroes: number;
    volunteers: number;
  };
}

interface AdminMissionControlProps {
  navigation: any;
}

const AdminMissionControl: React.FC<AdminMissionControlProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const adminColor = '#fd7e14';
  const [showMenu, setShowMenu] = useState(false);
  
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: '1',
      title: 'Downtown River Cleanup',
      location: 'Downtown River Park',
      type: 'cleanup',
      status: 'active',
      priority: 'high',
      assignedHeroes: 8,
      maxCapacity: 12,
      startDate: '2024-03-05T09:00:00Z',
      estimatedDuration: '4 hours',
      reward: 150,
      postedBy: { name: 'City Environmental Dept', type: 'admin' },
      participants: { heroes: 8, volunteers: 15 },
    },
    {
      id: '2',
      title: 'Beach Plastic Collection',
      location: 'Sunset Beach',
      type: 'cleanup',
      status: 'in_progress',
      priority: 'medium',
      assignedHeroes: 5,
      maxCapacity: 8,
      startDate: '2024-03-04T08:00:00Z',
      estimatedDuration: '3 hours',
      reward: 120,
      postedBy: { name: 'Ocean Conservation Group', type: 'community' },
      participants: { heroes: 5, volunteers: 8 },
    },
    {
      id: '3',
      title: 'Industrial Site Assessment',
      location: 'Industrial District',
      type: 'monitoring',
      status: 'draft',
      priority: 'urgent',
      assignedHeroes: 0,
      maxCapacity: 6,
      startDate: '2024-03-06T07:00:00Z',
      estimatedDuration: '6 hours',
      reward: 250,
      postedBy: { name: 'EcoClean Industries', type: 'business' },
      participants: { heroes: 0, volunteers: 2 },
    },
    {
      id: '4',
      title: 'Community Recycling Drive',
      location: 'Community Center',
      type: 'recycling',
      status: 'completed',
      priority: 'low',
      assignedHeroes: 12,
      maxCapacity: 12,
      startDate: '2024-03-01T10:00:00Z',
      estimatedDuration: '2 hours',
      reward: 80,
      postedBy: { name: 'Local Community Board', type: 'community' },
      participants: { heroes: 12, volunteers: 25 },
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState('all');

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'cleanup': return { icon: 'trash-bin', color: '#28a745', label: 'Cleanup' };
      case 'recycling': return { icon: 'refresh', color: theme.primary, label: 'Recycling' };
      case 'education': return { icon: 'school', color: theme.secondary, label: 'Education' };
      case 'monitoring': return { icon: 'analytics', color: theme.error, label: 'Monitoring' };
      default: return { icon: 'leaf', color: adminColor, label: 'Mission' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6c757d';
      case 'active': return '#007bff';
      case 'in_progress': return '#ffc107';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return theme.secondaryText;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#fd7e14';
      case 'urgent': return '#dc3545';
      default: return theme.secondaryText;
    }
  };

  const filteredMissions = missions.filter(mission => {
    if (selectedFilter === 'all') return true;
    return mission.status === selectedFilter || mission.priority === selectedFilter || mission.type === selectedFilter;
  });

  const MissionCard = ({ mission }: { mission: Mission }) => {
    const typeConfig = getTypeConfig(mission.type);
    const completionRate = (mission.assignedHeroes / mission.maxCapacity) * 100;
    
    return (
      <View style={[styles.missionCard, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.missionHeader}>
          <View style={styles.missionInfo}>
            <Text style={[styles.missionTitle, { color: theme.textColor }]}>{mission.title}</Text>
            <Text style={[styles.missionLocation, { color: theme.secondaryText }]}>
              <Ionicons name="location" size={14} color={theme.secondaryText} /> {mission.location}
            </Text>
          </View>
          <View style={styles.badges}>
            <View style={[styles.typeBadge, { backgroundColor: typeConfig.color }]}>
              <Ionicons name={typeConfig.icon as any} size={12} color="white" />
              <Text style={styles.badgeText}>{typeConfig.label}</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(mission.priority) }]}>
              <Text style={styles.badgeText}>{mission.priority}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(mission.status) }]}>
              <Text style={styles.badgeText}>{mission.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.participantSection}>
          <View style={styles.progressContainer}>
            <Text style={[styles.progressLabel, { color: theme.textColor }]}>
              Heroes: {mission.assignedHeroes}/{mission.maxCapacity}
            </Text>
            <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: adminColor, width: `${completionRate}%` }
                ]}
              />
            </View>
          </View>
          
          <View style={styles.participantStats}>
            <View style={styles.statItem}>
              <Ionicons name="shield" size={16} color="#28a745" />
              <Text style={[styles.statText, { color: theme.textColor }]}>
                {mission.participants.heroes} Heroes
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={16} color="#dc3545" />
              <Text style={[styles.statText, { color: theme.textColor }]}>
                {mission.participants.volunteers} Volunteers
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.missionMeta}>
          <View style={styles.metaRow}>
            <Ionicons name="calendar" size={14} color={theme.secondaryText} />
            <Text style={[styles.metaText, { color: theme.secondaryText }]}>
              {new Date(mission.startDate).toLocaleDateString()} at {new Date(mission.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="time" size={14} color={theme.secondaryText} />
            <Text style={[styles.metaText, { color: theme.secondaryText }]}>
              Duration: {mission.estimatedDuration}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="card" size={14} color={theme.secondaryText} />
            <Text style={[styles.metaText, { color: theme.secondaryText }]}>
              Reward: ${mission.reward}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="business" size={14} color={theme.secondaryText} />
            <Text style={[styles.metaText, { color: theme.secondaryText }]}>
              Posted by: {mission.postedBy.name}
            </Text>
          </View>
        </View>

        <View style={styles.missionActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#007bff' }]}
            onPress={() => navigation.navigate('MissionDetails', { missionId: mission.id })}
          >
            <Ionicons name="eye" size={16} color="white" />
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: adminColor }]}
            onPress={() => navigation.navigate('EditMission', { missionId: mission.id })}
          >
            <Ionicons name="pencil" size={16} color="white" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#28a745' }]}
            onPress={() => navigation.navigate('MissionParticipants', { missionId: mission.id })}
          >
            <Ionicons name="people" size={16} color="white" />
            <Text style={styles.actionButtonText}>Participants</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.background }]}
            onPress={() => navigation.navigate('MissionAnalytics', { missionId: mission.id })}
          >
            <Ionicons name="analytics" size={16} color="white" />
            <Text style={styles.actionButtonText}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <ScreenLayout>
        <UnifiedHeader
          onMenuPress={() => setShowMenu(true)}
          role="admin"
          onNotificationPress={() => navigation.navigate('Notifications')}
          onProfilePress={() => navigation.navigate('ProfileScreen', { 
            role: 'ADMIN',
            onSignOut: () => navigation.navigate('Login')
          })}
        />
      
      {/* Page Header */}
      <View style={[styles.pageHeader, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fd7e14" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Mission Control Center
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateMission')}
        >
          <Ionicons name="add" size={24} color={adminColor} />
        </TouchableOpacity>
      </View>

      {/* Mission Summary */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.summaryValue, { color: adminColor }]}>
            {missions.filter(m => m.status === 'active').length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>Active</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.summaryValue, { color: theme.warning }]}>
            {missions.filter(m => m.status === 'in_progress').length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>In Progress</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.summaryValue, { color: '#28a745' }]}>
            {missions.filter(m => m.status === 'completed').length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>Completed</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.summaryValue, { color: theme.error }]}>
            {missions.filter(m => m.priority === 'urgent').length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>Urgent</Text>
        </View>
      </View>

      {/* Filters */}
      <ScrollView {...({ horizontal: true } as any)} showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {['all', 'active', 'in_progress', 'draft', 'urgent', 'high', 'cleanup', 'monitoring'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              { backgroundColor: selectedFilter === filter ? adminColor : theme.cardBackground }
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              { color: selectedFilter === filter ? 'white' : theme.textColor }
            ]}>
              {filter.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Missions List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.missionsContainer}>
          {filteredMissions.map(mission => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole="ADMIN"
        onNavigate={(screen, params) => navigation.navigate(screen, params)}
        onSignOut={() => navigation.navigate('Login')}
      />
      </ScreenLayout>
    </RoleGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    paddingTop: THEME.SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {},
  headerTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  addButton: {
    padding: THEME.SPACING.sm,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.md,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.md,
  },
  summaryValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  filtersContainer: {
    paddingHorizontal: THEME.SPACING.md,
    paddingBottom: THEME.SPACING.md,
  },
  filterChip: {
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: 20,
    marginRight: THEME.SPACING.sm,
  },
  filterText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
  },
  missionsContainer: {
    paddingHorizontal: THEME.SPACING.md,
  },
  missionCard: {
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginBottom: THEME.SPACING.sm + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.SPACING.sm + 4,
  },
  missionInfo: {
    flex: 1,
    marginRight: THEME.SPACING.sm + 4,
  },
  missionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    marginBottom: THEME.SPACING.xs,
  },
  missionLocation: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.lg,
    gap: 4,
  },
  priorityBadge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.lg,
  },
  statusBadge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.lg,
  },
  badgeText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  participantSection: {
    marginBottom: THEME.SPACING.sm + 4,
    paddingVertical: THEME.SPACING.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  progressContainer: {
    marginBottom: THEME.SPACING.sm,
  },
  progressLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    marginBottom: THEME.SPACING.xs,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  participantStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '500',
  },
  missionMeta: {
    marginBottom: THEME.SPACING.md,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  missionActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.SPACING.sm,
    paddingHorizontal: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.md,
    gap: 4,
    minWidth: 70,
    justifyContent: 'center',
  },
  actionButtonText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default AdminMissionControl;