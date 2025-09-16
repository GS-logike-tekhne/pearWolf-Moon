import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mission } from '../../types/missions';
import { useTheme } from '../../context/ThemeContext';
import { THEME } from '../../styles/theme';
import { getRoleColor } from '../../utils/roleColors';

interface MissionDetailsModalProps {
  visible: boolean;
  mission: Mission;
  onClose: () => void;
  onAccept: () => void;
  onComplete: () => void;
  isAccepted: boolean;
  isCompleted: boolean;
}

const MissionDetailsModal: React.FC<MissionDetailsModalProps> = ({
  visible,
  mission,
  onClose,
  onAccept,
  onComplete,
  isAccepted,
  isCompleted,
}) => {
  const { theme } = useTheme();
  const roleColor = getRoleColor(mission.requiredRole);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.textColor }]}>
            Mission Details
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          {/* Mission Header */}
          <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.missionTitle, { color: theme.textColor }]}>
              {mission.title}
            </Text>
            <Text style={[styles.missionDescription, { color: theme.secondaryText }]}>
              {mission.description}
            </Text>
            
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: roleColor }]}>
                <Text style={styles.badgeText}>
                  {mission.requiredRole.replace('-', ' ').toUpperCase()}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: getDifficultyColor(mission.difficulty) }]}>
                <Text style={styles.badgeText}>
                  {mission.difficulty.toUpperCase()}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: getUrgencyColor(mission.urgency) }]}>
                <Text style={styles.badgeText}>
                  {mission.urgency.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          {/* Mission Info */}
          <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Mission Information
            </Text>
            
            <View style={styles.infoRow}>
              <Ionicons name="location" size={16} color={theme.secondaryText} />
              <Text style={[styles.infoText, { color: theme.secondaryText }]}>
                {mission.location.address}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="time" size={16} color={theme.secondaryText} />
              <Text style={[styles.infoText, { color: theme.secondaryText }]}>
                Estimated Duration: {formatDuration(mission.estimatedDuration)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="people" size={16} color={theme.secondaryText} />
              <Text style={[styles.infoText, { color: theme.secondaryText }]}>
                Participants: {mission.currentParticipants}/{mission.maxParticipants}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={16} color={theme.secondaryText} />
              <Text style={[styles.infoText, { color: theme.secondaryText }]}>
                Available until: {formatDate(mission.endDate)}
              </Text>
            </View>
          </View>

          {/* Instructions */}
          <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Instructions
            </Text>
            {mission.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={[styles.instructionNumber, { color: roleColor }]}>
                  {index + 1}.
                </Text>
                <Text style={[styles.instructionText, { color: theme.textColor }]}>
                  {instruction}
                </Text>
              </View>
            ))}
          </View>

          {/* Equipment */}
          <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Required Equipment
            </Text>
            <View style={styles.equipmentList}>
              {mission.equipment?.map((item, index) => (
                <View key={index} style={styles.equipmentItem}>
                  <Ionicons name="checkmark-circle" size={16} color={roleColor} />
                  <Text style={[styles.equipmentText, { color: theme.textColor }]}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Rewards */}
          <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Rewards
            </Text>
            <View style={styles.rewardsList}>
              <View style={[styles.rewardItem, styles.xpRewardItem]}>
                <Text style={[styles.rewardIcon, { color: '#FFD700' }]}>⭐</Text>
                <Text style={[styles.rewardText, styles.xpRewardText]}>
                  {mission.xpReward} XP Points
                </Text>
              </View>
              <View style={styles.rewardItem}>
                <Text style={[styles.rewardIcon, { color: roleColor }]}>🍐</Text>
                <Text style={[styles.rewardText, { color: theme.textColor }]}>
                  {mission.ecoPointsReward} Eco Points
                </Text>
              </View>
              {mission.badgeReward && (
                <View style={styles.rewardItem}>
                  <Text style={[styles.rewardIcon, { color: roleColor }]}>🏆</Text>
                  <Text style={[styles.rewardText, { color: theme.textColor }]}>
                    {mission.badgeReward} Badge
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: theme.cardBackground }]}>
          {!isCompleted && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: isAccepted ? '#FF9800' : roleColor },
              ]}
              onPress={() => {
                onClose();
                isAccepted ? onComplete() : onAccept();
              }}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={isAccepted ? 'checkmark' : 'play'} 
                size={20} 
                color="white" 
              />
              <Text style={styles.actionButtonText}>
                {isAccepted ? 'Complete Mission' : 'Accept Mission'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const getUrgencyColor = (urgency: Mission['urgency']): string => {
  switch (urgency) {
    case 'urgent': return '#FF5722';
    case 'high': return '#FF9800';
    case 'medium': return '#FFC107';
    case 'low': return '#4CAF50';
    default: return '#9E9E9E';
  }
};

const getDifficultyColor = (difficulty: Mission['difficulty']): string => {
  switch (difficulty) {
    case 'easy': return '#4CAF50';
    case 'medium': return '#FF9800';
    case 'hard': return '#F44336';
    default: return '#9E9E9E';
  }
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
    paddingVertical: THEME.SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: THEME.SPACING.xs,
  },
  title: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: THEME.SPACING.md,
  },
  section: {
    borderRadius: THEME.BORDER_RADIUS.lg,
    padding: THEME.SPACING.md,
    marginBottom: THEME.SPACING.md,
  },
  missionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    marginBottom: THEME.SPACING.sm,
  },
  missionDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    lineHeight: 22,
    marginBottom: THEME.SPACING.md,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.SPACING.sm,
  },
  badge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.sm,
  },
  badgeText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginBottom: THEME.SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.sm,
    marginBottom: THEME.SPACING.sm,
  },
  infoText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    flex: 1,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: THEME.SPACING.sm,
    gap: THEME.SPACING.sm,
  },
  instructionNumber: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '700',
    minWidth: 20,
  },
  instructionText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    flex: 1,
    lineHeight: 20,
  },
  equipmentList: {
    gap: THEME.SPACING.sm,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.sm,
  },
  equipmentText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
  },
  rewardsList: {
    gap: THEME.SPACING.sm,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.sm,
  },
  rewardIcon: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
  },
  rewardText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
  },
  xpRewardItem: {
    backgroundColor: 'rgba(255, 215, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  xpRewardText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footer: {
    padding: THEME.SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    gap: THEME.SPACING.sm,
  },
  actionButtonText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
  },
});

export default MissionDetailsModal;
