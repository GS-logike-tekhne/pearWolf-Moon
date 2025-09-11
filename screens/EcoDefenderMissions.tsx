import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';
import { RoleGuard } from '../components/RoleGuard';

interface Mission {
  id: string;
  title: string;
  description: string;
  location: string;
  type: 'cleanup' | 'recycling' | 'education' | 'monitoring';
  status: 'draft' | 'active' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  budget: number;
  assignedHeroes: number;
  maxCapacity: number;
  applications: number;
  startDate: string;
  estimatedDuration: string;
  createdDate: string;
  requirements: string[];
  safety: {
    level: 'low' | 'medium' | 'high';
    equipment: string[];
    training: boolean;
  };
}

interface EcoDefenderMissionsProps {
  navigation: any;
}

const EcoDefenderMissions: React.FC<EcoDefenderMissionsProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const ecoDefenderColor = getRoleColor('business');
  
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: '1',
      title: 'Corporate Campus Cleanup',
      description: 'Comprehensive cleanup of our corporate campus including parking areas, landscaping, and common spaces.',
      location: 'EcoTech Corporate Campus',
      type: 'cleanup',
      status: 'active',
      priority: 'high',
      budget: 500,
      assignedHeroes: 8,
      maxCapacity: 12,
      applications: 15,
      startDate: '2024-03-10T09:00:00Z',
      estimatedDuration: '6 hours',
      createdDate: '2024-03-01T10:00:00Z',
      requirements: ['Physical fitness', 'Attention to detail', 'Team collaboration'],
      safety: {
        level: 'low',
        equipment: ['Gloves', 'Safety vest', 'Trash bags'],
        training: false,
      },
    },
    {
      id: '2',
      title: 'Quarterly Environmental Assessment',
      description: 'Professional environmental monitoring and assessment of our manufacturing facilities for compliance reporting.',
      location: 'Manufacturing Plant A',
      type: 'monitoring',
      status: 'draft',
      priority: 'urgent',
      budget: 800,
      assignedHeroes: 0,
      maxCapacity: 6,
      applications: 3,
      startDate: '2024-03-15T08:00:00Z',
      estimatedDuration: '8 hours',
      createdDate: '2024-03-03T14:00:00Z',
      requirements: ['Environmental certification', 'Technical documentation', 'Equipment operation'],
      safety: {
        level: 'high',
        equipment: ['Hard hat', 'Safety glasses', 'Respiratory protection', 'Steel-toed boots'],
        training: true,
      },
    },
    {
      id: '3',
      title: 'Employee Recycling Education',
      description: 'Educational workshop series to train employees on proper recycling practices and waste reduction.',
      location: 'Corporate Training Center',
      type: 'education',
      status: 'in_progress',
      priority: 'medium',
      budget: 300,
      assignedHeroes: 2,
      maxCapacity: 4,
      applications: 7,
      startDate: '2024-03-05T10:00:00Z',
      estimatedDuration: '4 hours',
      createdDate: '2024-02-28T09:00:00Z',
      requirements: ['Public speaking', 'Environmental knowledge', 'Training experience'],
      safety: {
        level: 'low',
        equipment: ['Name tag', 'Presentation materials'],
        training: false,
      },
    },
    {
      id: '4',
      title: 'Sustainable Office Initiative',
      description: 'Complete overhaul of office waste management including setup of recycling stations and compost areas.',
      location: 'Main Office Building',
      type: 'recycling',
      status: 'completed',
      priority: 'low',
      budget: 200,
      assignedHeroes: 6,
      maxCapacity: 6,
      applications: 12,
      startDate: '2024-02-25T09:00:00Z',
      estimatedDuration: '3 hours',
      createdDate: '2024-02-20T11:00:00Z',
      requirements: ['Organization skills', 'Basic construction', 'Sustainability knowledge'],
      safety: {
        level: 'low',
        equipment: ['Work gloves', 'Basic tools'],
        training: false,
      },
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState('all');

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'cleanup': return { icon: 'trash-bin', color: '#28a745', label: 'Cleanup' };
      case 'recycling': return { icon: 'refresh', color: theme.primary, label: 'Recycling' };
      case 'education': return { icon: 'school', color: theme.secondary, label: 'Education' };
      case 'monitoring': return { icon: 'analytics', color: theme.warning, label: 'Monitoring' };
      default: return { icon: 'leaf', color: ecoDefenderColor, label: 'Mission' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6c757d';
      case 'active': return ecoDefenderColor;
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

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#dc3545';
      default: return theme.secondaryText;
    }
  };

  const handleMissionAction = (mission: Mission, action: string) => {
    switch (action) {
      case 'publish':
        setMissions(missions.map(m => 
          m.id === mission.id ? { ...m, status: 'active' } : m
        ));
        Alert.alert('Success', 'Mission published successfully');
        break;
      case 'pause':
        setMissions(missions.map(m => 
          m.id === mission.id ? { ...m, status: 'draft' } : m
        ));
        Alert.alert('Success', 'Mission paused');
        break;
      case 'cancel':
        Alert.alert(
          'Cancel Mission',
          `Are you sure you want to cancel "${mission.title}"?`,
          [
            { text: 'No', style: 'cancel' },
            {
              text: 'Yes, Cancel',
              style: 'destructive',
              onPress: () => {
                setMissions(missions.map(m => 
                  m.id === mission.id ? { ...m, status: 'cancelled' } : m
                ));
                Alert.alert('Success', 'Mission cancelled');
              },
            },
          ]
        );
        break;
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

        <Text style={[styles.missionDescription, { color: theme.secondaryText }]}>
          {mission.description}
        </Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: theme.textColor }]}>
              Heroes: {mission.assignedHeroes}/{mission.maxCapacity}
            </Text>
            <Text style={[styles.applicationsText, { color: ecoDefenderColor }]}>
              {mission.applications} applications
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: ecoDefenderColor, width: `${completionRate}%` }
              ]}
            />
          </View>
        </View>

        <View style={styles.missionMeta}>
          <View style={styles.metaRow}>
            <Ionicons name="calendar" size={14} color={theme.secondaryText} />
            <Text style={[styles.metaText, { color: theme.secondaryText }]}>
              Start: {new Date(mission.startDate).toLocaleDateString()}
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
              Budget: ${mission.budget}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="shield" size={14} color={getSafetyColor(mission.safety.level)} />
            <Text style={[styles.metaText, { color: theme.secondaryText }]}>
              Safety: {mission.safety.level} risk
            </Text>
          </View>
        </View>

        <View style={styles.requirementsSection}>
          <Text style={[styles.requirementsTitle, { color: theme.textColor }]}>Requirements:</Text>
          <View style={styles.requirementsList}>
            {mission.requirements.slice(0, 2).map((req, index) => (
              <View key={index} style={[styles.requirementTag, { backgroundColor: 'rgba(0,123,255,0.1)' }]}>
                <Text style={[styles.requirementText, { color: ecoDefenderColor }]}>{req}</Text>
              </View>
            ))}
            {mission.requirements.length > 2 && (
              <Text style={[styles.moreRequirements, { color: theme.secondaryText }]}>
                +{mission.requirements.length - 2} more
              </Text>
            )}
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
            style={[styles.actionButton, { backgroundColor: ecoDefenderColor }]}
            onPress={() => navigation.navigate('EditMission', { missionId: mission.id })}
          >
            <Ionicons name="pencil" size={16} color="white" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          {mission.status === 'draft' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#28a745' }]}
              onPress={() => handleMissionAction(mission, 'publish')}
            >
              <Ionicons name="play" size={16} color="white" />
              <Text style={styles.actionButtonText}>Publish</Text>
            </TouchableOpacity>
          )}
          
          {mission.status === 'active' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#ffc107' }]}
              onPress={() => handleMissionAction(mission, 'pause')}
            >
              <Ionicons name="pause" size={16} color="white" />
              <Text style={styles.actionButtonText}>Pause</Text>
            </TouchableOpacity>
          )}
          
          {(mission.status === 'draft' || mission.status === 'active') && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#dc3545' }]}
              onPress={() => handleMissionAction(mission, 'cancel')}
            >
              <Ionicons name="close" size={16} color="white" />
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <RoleGuard allowedRoles={['ECO_DEFENDER']}>
      <ScreenLayout>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          My Posted Missions
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('PostJob')}
        >
          <Ionicons name="add" size={24} color={ecoDefenderColor} />
        </TouchableOpacity>
      </View>

      {/* Mission Summary */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.summaryValue, { color: ecoDefenderColor }]}>
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
          <Text style={[styles.summaryValue, { color: theme.secondaryText }]}>
            {missions.filter(m => m.status === 'draft').length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>Drafts</Text>
        </View>
      </View>

      {/* Filters */}
      <ScrollView {...({ horizontal: true } as any)} showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {['all', 'active', 'in_progress', 'draft', 'completed', 'urgent', 'cleanup', 'monitoring'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              { backgroundColor: selectedFilter === filter ? ecoDefenderColor : theme.cardBackground }
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
      </ScreenLayout>
    </RoleGuard>
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
    marginBottom: THEME.SPACING.sm,
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
  missionDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    lineHeight: 20,
    marginBottom: THEME.SPACING.sm + 4,
  },
  progressSection: {
    marginBottom: THEME.SPACING.sm + 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.xs,
  },
  progressLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  applicationsText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '500',
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
  missionMeta: {
    marginBottom: THEME.SPACING.sm + 4,
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
  requirementsSection: {
    marginBottom: THEME.SPACING.md,
  },
  requirementsTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    marginBottom: THEME.SPACING.sm,
  },
  requirementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  requirementTag: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.lg,
  },
  requirementText: {
    fontSize: 11,
    fontWeight: '500',
  },
  moreRequirements: {
    fontSize: 11,
    fontStyle: 'italic',
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

export default EcoDefenderMissions;