import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MissionPin as MissionPinType } from '../../services/liveMapService';
import { useTheme } from '../../context/ThemeContext';
import { getRoleColor } from '../../utils/roleColors';

const { width, height } = Dimensions.get('window');

interface MissionPinModalProps {
  visible: boolean;
  mission: MissionPinType | null;
  onClose: () => void;
  onAccept: (mission: MissionPinType) => void;
  onNavigate: (mission: MissionPinType) => void;
}

const MissionPinModal: React.FC<MissionPinModalProps> = ({
  visible,
  mission,
  onClose,
  onAccept,
  onNavigate,
}) => {
  const { theme } = useTheme();

  if (!mission) return null;

  const roleColor = getRoleColor(mission.role);

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1000) return `${Math.round(distance)}m away`;
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  const getStatusColor = () => {
    switch (mission.status) {
      case 'available':
        return roleColor;
      case 'in_progress':
        return '#FF9800';
      case 'completed':
        return '#4CAF50';
      case 'expired':
        return '#9E9E9E';
      default:
        return roleColor;
    }
  };

  const getStatusText = () => {
    switch (mission.status) {
      case 'available':
        return 'Available';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const getPriorityColor = () => {
    switch (mission.priority) {
      case 'urgent':
        return '#FF5722';
      case 'high':
        return '#FF9800';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  const getPriorityText = () => {
    switch (mission.priority) {
      case 'urgent':
        return 'URGENT';
      case 'high':
        return 'HIGH';
      case 'medium':
        return 'MEDIUM';
      case 'low':
        return 'LOW';
      default:
        return 'UNKNOWN';
    }
  };

  const canAcceptMission = mission.status === 'available' && mission.participants < mission.maxParticipants;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>
            Mission Details
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Mission Header */}
          <View style={[styles.missionHeader, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.missionTitleRow}>
              <Text style={[styles.missionTitle, { color: theme.textColor }]}>
                {mission.title}
              </Text>
              <View style={[styles.roleBadge, { backgroundColor: roleColor }]}>
                <Text style={styles.roleBadgeText}>
                  {mission.role.replace('-', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.missionDescription, { color: theme.secondaryText }]}>
              {mission.description}
            </Text>

            {/* Status and Priority */}
            <View style={styles.statusRow}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                <Text style={styles.statusBadgeText}>{getStatusText()}</Text>
              </View>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
                <Text style={styles.priorityBadgeText}>{getPriorityText()}</Text>
              </View>
            </View>
          </View>

          {/* Mission Info */}
          <View style={[styles.infoSection, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Mission Information
            </Text>
            
            <View style={styles.infoRow}>
              <Ionicons name="location" size={16} color={theme.secondaryText} />
              <Text style={[styles.infoText, { color: theme.secondaryText }]}>
                {mission.location.address}
              </Text>
            </View>
            
            {mission.distance && (
              <View style={styles.infoRow}>
                <Ionicons name="walk" size={16} color={theme.secondaryText} />
                <Text style={[styles.infoText, { color: theme.secondaryText }]}>
                  {formatDistance(mission.distance)}
                </Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Ionicons name="time" size={16} color={theme.secondaryText} />
              <Text style={[styles.infoText, { color: theme.secondaryText }]}>
                Estimated Duration: {formatDuration(mission.estimatedDuration)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="people" size={16} color={theme.secondaryText} />
              <Text style={[styles.infoText, { color: theme.secondaryText }]}>
                Participants: {mission.participants}/{mission.maxParticipants}
              </Text>
            </View>
          </View>

          {/* Rewards */}
          <View style={[styles.rewardsSection, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Rewards
            </Text>
            
            <View style={styles.rewardsRow}>
              <View style={styles.rewardItem}>
                <Ionicons name="star" size={20} color={theme.primary} />
                <Text style={[styles.rewardText, { color: theme.textColor }]}>
                  {mission.xpReward} XP
                </Text>
              </View>
              
              <View style={styles.rewardItem}>
                <Ionicons name="leaf" size={20} color={roleColor} />
                <Text style={[styles.rewardText, { color: theme.textColor }]}>
                  {mission.ecoPointsReward} Eco Points
                </Text>
              </View>
            </View>
          </View>

          {/* Equipment */}
          {mission.metadata?.equipment && (
            <View style={[styles.equipmentSection, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                Required Equipment
              </Text>
              
              <View style={styles.equipmentList}>
                {mission.metadata.equipment.map((item: string, index: number) => (
                  <View key={index} style={styles.equipmentItem}>
                    <Ionicons name="checkmark-circle" size={16} color={roleColor} />
                    <Text style={[styles.equipmentText, { color: theme.textColor }]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Actions */}
        <View style={[styles.footer, { backgroundColor: theme.cardBackground }]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.navigateButton, { borderColor: roleColor }]}
            onPress={() => onNavigate(mission)}
          >
            <Ionicons name="navigate" size={20} color={roleColor} />
            <Text style={[styles.actionButtonText, { color: roleColor }]}>
              Navigate
            </Text>
          </TouchableOpacity>
          
          {canAcceptMission ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton, { backgroundColor: roleColor }]}
              onPress={() => onAccept(mission)}
            >
              <Ionicons name="play" size={20} color="white" />
              <Text style={styles.acceptButtonText}>
                Accept Mission
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.disabledButton, { backgroundColor: theme.borderColor }]}
              disabled
            >
              <Ionicons name="lock-closed" size={20} color="white" />
              <Text style={styles.acceptButtonText}>
                {mission.status === 'completed' ? 'Completed' : 'Full'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  missionHeader: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  missionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  missionDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priorityBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    flex: 1,
  },
  rewardsSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: '600',
  },
  equipmentSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  equipmentList: {
    gap: 8,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  equipmentText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  navigateButton: {
    borderWidth: 2,
  },
  acceptButton: {
    // backgroundColor set dynamically
  },
  disabledButton: {
    // backgroundColor set dynamically
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MissionPinModal;
