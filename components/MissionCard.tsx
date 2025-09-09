import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useMissions } from '../context/MissionContext';
import { Mission, DIFFICULTY_CONFIG } from '../types/missions';

interface MissionCardProps {
  mission: Mission;
  userRole: string;
  onMissionPress?: (mission: Mission) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ 
  mission, 
  userRole,
  onMissionPress 
}) => {
  const { theme } = useTheme();
  const { state: missionState, acceptMission, boostMission, joinMission } = useMissions();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  // Get mission progress from context
  const missionProgress = missionState.missionProgress[mission.id];
  const isActive = mission.status === 'active';
  const isCompleted = mission.status === 'completed';
  const canJoin = mission.joinedUsers.length < mission.requiresUsers && mission.status === 'available';
  const canBoost = isActive && mission.canBoost && !mission.boostUsed;
  const boostCost = 20; // eco-points cost for boost
  
  useEffect(() => {
    if (missionProgress?.timeRemaining !== undefined) {
      setTimeRemaining(missionProgress.timeRemaining);
      setProgress(missionProgress.progress || 0);
    }
  }, [missionProgress]);

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return 'Complete!';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getDifficultyColor = () => {
    return DIFFICULTY_CONFIG[mission.difficulty].color;
  };

  const handleAcceptMission = () => {
    if (mission.requiresUsers > 1 && mission.joinedUsers.length < mission.requiresUsers) {
      Alert.alert(
        'Mission Requirements',
        `This mission requires ${mission.requiresUsers} participants. Currently ${mission.joinedUsers.length} joined.`,
        [{ text: 'OK' }]
      );
      return;
    }
    acceptMission(mission.id);
  };

  const handleJoinMission = () => {
    joinMission(mission.id, 'current_user_id'); // In real app, use actual user ID
    if (mission.joinedUsers.length + 1 >= mission.requiresUsers) {
      Alert.alert(
        'Mission Ready!',
        'All required participants have joined. Mission can now be started.',
        [
          { text: 'Start Now', onPress: () => acceptMission(mission.id) },
          { text: 'Wait', style: 'cancel' }
        ]
      );
    }
  };

  const handleBoostMission = () => {
    if (missionState.userEcoPoints < boostCost) {
      Alert.alert(
        'Insufficient Eco-Points',
        `You need ${boostCost} eco-points to boost this mission. You have ${missionState.userEcoPoints}.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    Alert.alert(
      'Boost Mission',
      `Spend ${boostCost} eco-points to reduce mission time by 10 minutes?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Boost', onPress: () => boostMission(mission.id, boostCost) }
      ]
    );
  };

  const getStatusColor = () => {
    switch (mission.status) {
      case 'active': return theme.primary;
      case 'completed': return '#22c55e';
      case 'expired': return '#ef4444';
      default: return theme.secondaryText;
    }
  };

  const getTypeIcon = () => {
    switch (mission.type) {
      case 'Quick Clean': return 'flash-outline';
      case 'Timed Mission': return 'timer-outline';
      case 'Community Quest': return 'people-outline';
      case 'Business Mission': return 'business-outline';
      default: return 'leaf-outline';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { 
          backgroundColor: theme.cardBackground,
          borderColor: getDifficultyColor(),
        },
        isCompleted && { opacity: 0.7 }
      ]}
      onPress={() => onMissionPress && onMissionPress(mission)}
      activeOpacity={0.8}
    >
      {/* Header with mission type and difficulty */}
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <Ionicons 
            name={getTypeIcon()} 
            size={16} 
            color={getDifficultyColor()}
          />
          <Text style={[styles.missionType, { color: getDifficultyColor() }]}>
            {mission.type}
          </Text>
        </View>
        
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
          <Text style={styles.difficultyText}>{mission.difficulty}</Text>
        </View>
      </View>

      {/* Mission Title and Description */}
      <View style={styles.contentSection}>
        <Text style={[styles.missionTitle, { color: theme.textColor }]}>
          {mission.title}
        </Text>
        <Text style={[styles.missionDescription, { color: theme.secondaryText }]}>
          {mission.description}
        </Text>
      </View>

      {/* Progress Bar (for active missions) */}
      {isActive && timeRemaining !== null && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: theme.textColor }]}>
              Progress
            </Text>
            <Text style={[styles.timeRemaining, { color: theme.primary }]}>
              {formatTime(timeRemaining)}
            </Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: theme.accent }]}>
            <View
              style={[
                styles.progressFill,
                { 
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: theme.primary 
                }
              ]}
            />
          </View>
        </View>
      )}

      {/* Participants Info (for multiplayer missions) */}
      {mission.requiresUsers > 1 && (
        <View style={styles.participantsSection}>
          <Ionicons name="people-outline" size={16} color={theme.secondaryText} />
          <Text style={[styles.participantsText, { color: theme.secondaryText }]}>
            {mission.joinedUsers.length}/{mission.requiresUsers} joined
          </Text>
          {mission.maxUsers && (
            <Text style={[styles.maxParticipants, { color: theme.secondaryText }]}>
              (max {mission.maxUsers})
            </Text>
          )}
        </View>
      )}

      {/* Rewards Section */}
      <View style={styles.rewardsSection}>
        <View style={styles.rewardItem}>
          <Ionicons name="flash-outline" size={16} color="#fbbf24" />
          <Text style={[styles.rewardText, { color: theme.textColor }]}>
            +{mission.reward.xp} XP
          </Text>
        </View>
        <View style={styles.rewardItem}>
          <Ionicons name="leaf-outline" size={16} color="#22c55e" />
          <Text style={[styles.rewardText, { color: theme.textColor }]}>
            +{mission.reward.ecoPoints} Points
          </Text>
        </View>
        {mission.reward.badge && (
          <View style={styles.rewardItem}>
            <Ionicons name="trophy-outline" size={16} color="#8b5cf6" />
            <Text style={[styles.rewardText, { color: theme.textColor }]}>
              {mission.reward.badge}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        {mission.status === 'available' && !canJoin && (
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton, { backgroundColor: theme.primary }]}
            onPress={handleAcceptMission}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-outline" size={18} color="white" />
            <Text style={styles.actionButtonText}>Accept Mission</Text>
          </TouchableOpacity>
        )}
        
        {canJoin && (
          <TouchableOpacity
            style={[styles.actionButton, styles.joinButton, { borderColor: theme.primary }]}
            onPress={handleJoinMission}
            activeOpacity={0.8}
          >
            <Ionicons name="add-outline" size={18} color={theme.primary} />
            <Text style={[styles.actionButtonText, { color: theme.primary }]}>
              Join Mission
            </Text>
          </TouchableOpacity>
        )}
        
        {canBoost && (
          <TouchableOpacity
            style={[styles.actionButton, styles.boostButton, { backgroundColor: '#f59e0b' }]}
            onPress={handleBoostMission}
            activeOpacity={0.8}
          >
            <Ionicons name="rocket-outline" size={18} color="white" />
            <Text style={styles.actionButtonText}>Boost ({boostCost})</Text>
          </TouchableOpacity>
        )}
        
        {isCompleted && (
          <View style={[styles.actionButton, styles.completedButton, { backgroundColor: '#22c55e' }]}>
            <Ionicons name="checkmark-circle-outline" size={18} color="white" />
            <Text style={styles.actionButtonText}>Completed</Text>
          </View>
        )}
      </View>

      {/* Status Indicator */}
      <View style={styles.statusIndicator}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionType: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  contentSection: {
    marginBottom: 16,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  missionDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
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
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeRemaining: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  participantsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  participantsText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  maxParticipants: {
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 4,
  },
  rewardsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  acceptButton: {
    backgroundColor: '#22c55e',
  },
  joinButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  boostButton: {
    backgroundColor: '#f59e0b',
  },
  completedButton: {
    backgroundColor: '#22c55e',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginLeft: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 12,
    right: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default MissionCard;