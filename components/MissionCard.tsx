import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mission } from '../types/missions';
import { useTheme } from '../context/ThemeContext';
import { useXP } from '../context/XPContext';
import { THEME } from '../styles/theme';
import { getRoleColor } from '../utils/roleColors';
import MissionCompletionModal from './mission/MissionCompletionModal';
import { PhotoVerificationResult } from '../services/photoVerificationService';
import { useGamification } from '../hooks/useGamification';
import CelebrationAnimation from './animations/CelebrationAnimation';
import LevelUpModal from './animations/LevelUpModal';

interface MissionCardProps {
  mission: Mission;
  onAccept?: (mission: Mission) => void;
  onComplete?: (mission: Mission, verificationResult?: PhotoVerificationResult) => void;
  showDetails?: boolean;
  userRole?: string;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission, 
  onAccept,
  onComplete,
  showDetails = true,
  userRole = 'trash-hero',
}) => {
  const { theme } = useTheme();
  const { addXP } = useXP();
  const { processMissionCompletion, showCelebration, showLevelUp, levelUpData, hideCelebration, hideLevelUpModal } = useGamification('current_user');
  const [showModal, setShowModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(mission.status === 'completed');

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

  const roleColor = getRoleColor(mission.requiredRole);
  const urgencyColor = getUrgencyColor(mission.urgency);
  const difficultyColor = getDifficultyColor(mission.difficulty);

  const handleAccept = () => {
    setIsAccepted(true);
    onAccept?.(mission);
    Alert.alert(
      'Mission Accepted! 🎯',
      `You've joined ${mission.title}. Good luck, ${mission.requiredRole}!`,
      [{ text: 'Let\'s Go!', style: 'default' }]
    );
  };

  const handleComplete = () => {
    if (!isAccepted) {
      Alert.alert('Mission Not Started', 'Please accept the mission first!');
      return;
    }

    // Show photo verification modal
    setShowCompletionModal(true);
  };

  const handleMissionCompleted = async (verificationResult: PhotoVerificationResult) => {
    try {
      // Process mission completion with gamification
      const rewards = await processMissionCompletion(mission, verificationResult);
      
      setIsCompleted(true);
      onComplete?.(mission, verificationResult);
      
      // Show success message
      Alert.alert(
        'Mission Complete! 🎉',
        `Great work! Your mission was verified with ${verificationResult.confidence}% confidence. You earned ${rewards.find(r => r.type === 'xp')?.value || mission.xpReward} XP and ${rewards.find(r => r.type === 'eco_points')?.value || mission.ecoPointsReward} Eco Points!`,
        [{ text: 'Awesome!', style: 'default' }]
      );
    } catch (error) {
      console.error('Failed to process mission completion:', error);
      Alert.alert('Error', 'Failed to process mission rewards. Please try again.');
    }
  };

  const getUrgencyIcon = (urgency: Mission['urgency']): string => {
    switch (urgency) {
      case 'urgent': return 'flash';
      case 'high': return 'trending-up';
      case 'medium': return 'time';
      case 'low': return 'leaf';
      default: return 'help';
    }
  };

  const getDifficultyIcon = (difficulty: Mission['difficulty']): string => {
    switch (difficulty) {
      case 'easy': return 'checkmark-circle';
      case 'medium': return 'help-circle';
      case 'hard': return 'warning';
      default: return 'help';
    }
  };

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
    <>
    <TouchableOpacity
      style={[
        styles.card,
        { 
          backgroundColor: theme.cardBackground,
            borderLeftColor: roleColor,
          },
          isCompleted && styles.completedCard,
        ]}
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.textColor }]}>
              {mission.title}
            </Text>
            <View style={[styles.roleBadge, { backgroundColor: roleColor }]}>
              <Text style={styles.roleText}>
                {mission.requiredRole.replace('-', ' ').toUpperCase()}
          </Text>
            </View>
        </View>
        
          <View style={styles.statusContainer}>
            <View style={[styles.urgencyBadge, { backgroundColor: urgencyColor }]}>
              <Ionicons 
                name={getUrgencyIcon(mission.urgency)} 
                size={12} 
                color="white" 
              />
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
              <Ionicons 
                name={getDifficultyIcon(mission.difficulty)} 
                size={12} 
                color="white" 
              />
            </View>
          </View>
      </View>

        {/* Description */}
        <Text style={[styles.description, { color: theme.secondaryText }]}>
          {mission.description}
        </Text>

        {/* Details Row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="location" size={14} color={theme.secondaryText} />
            <Text style={[styles.detailText, { color: theme.secondaryText }]}>
              {mission.location.name}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time" size={14} color={theme.secondaryText} />
            <Text style={[styles.detailText, { color: theme.secondaryText }]}>
              {formatDuration(mission.estimatedDuration)}
            </Text>
        </View>
        </View>

        {/* Rewards */}
        <View style={styles.rewardsContainer}>
        <View style={[styles.rewardItem, styles.xpRewardItem]}>
            <Text style={[styles.rewardIcon, { color: '#FFD700' }]}>⭐</Text>
          <Text style={[styles.rewardText, styles.xpRewardText]}>
              {mission.xpReward} XP
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
                {mission.badgeReward}
            </Text>
          </View>
        )}
      </View>

        {/* Action Button */}
        {!isCompleted ? (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isAccepted ? '#FF9800' : roleColor },
            ]}
            onPress={isAccepted ? handleComplete : handleAccept}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isAccepted ? 'checkmark' : 'play'} 
              size={16} 
              color="white" 
            />
            <Text style={styles.actionButtonText}>
              {isAccepted ? 'Complete Mission' : 'Accept Mission'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.completedBadge, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="checkmark-circle" size={16} color="white" />
            <Text style={styles.completedText}>Mission Complete!</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Mission Details Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.cardBackground }]}>
          <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>
              Mission Details
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Mission Header */}
            <View style={[styles.modalMissionHeader, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.modalMissionTitle, { color: theme.textColor }]}>
                {mission.title}
              </Text>
              <Text style={[styles.modalMissionDescription, { color: theme.secondaryText }]}>
                {mission.description}
              </Text>
              
              <View style={styles.modalBadges}>
                <View style={[styles.modalBadge, { backgroundColor: roleColor }]}>
                  <Text style={styles.modalBadgeText}>
                    {mission.requiredRole.replace('-', ' ').toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.modalBadge, { backgroundColor: difficultyColor }]}>
                  <Text style={styles.modalBadgeText}>
                    {mission.difficulty.toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.modalBadge, { backgroundColor: urgencyColor }]}>
                  <Text style={styles.modalBadgeText}>
                    {mission.urgency.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Mission Info */}
            <View style={[styles.modalSection, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.modalSectionTitle, { color: theme.textColor }]}>
                Mission Information
              </Text>
              
              <View style={styles.modalInfoRow}>
                <Ionicons name="location" size={16} color={theme.secondaryText} />
                <Text style={[styles.modalInfoText, { color: theme.secondaryText }]}>
                  {mission.location.address}
                </Text>
              </View>
              
              <View style={styles.modalInfoRow}>
                <Ionicons name="time" size={16} color={theme.secondaryText} />
                <Text style={[styles.modalInfoText, { color: theme.secondaryText }]}>
                  Estimated Duration: {formatDuration(mission.estimatedDuration)}
                </Text>
              </View>
              
              <View style={styles.modalInfoRow}>
                <Ionicons name="people" size={16} color={theme.secondaryText} />
                <Text style={[styles.modalInfoText, { color: theme.secondaryText }]}>
                  Participants: {mission.currentParticipants}/{mission.maxParticipants}
                </Text>
              </View>
              
              <View style={styles.modalInfoRow}>
                <Ionicons name="calendar" size={16} color={theme.secondaryText} />
                <Text style={[styles.modalInfoText, { color: theme.secondaryText }]}>
                  Available until: {formatDate(mission.endDate)}
                </Text>
              </View>
            </View>

            {/* Instructions */}
            <View style={[styles.modalSection, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.modalSectionTitle, { color: theme.textColor }]}>
                Instructions
              </Text>
              {mission.instructions.map((instruction, index) => (
                <View key={index} style={styles.modalInstructionItem}>
                  <Text style={[styles.modalInstructionNumber, { color: roleColor }]}>
                    {index + 1}.
                  </Text>
                  <Text style={[styles.modalInstructionText, { color: theme.textColor }]}>
                    {instruction}
                  </Text>
                </View>
              ))}
            </View>

            {/* Equipment */}
            <View style={[styles.modalSection, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.modalSectionTitle, { color: theme.textColor }]}>
                Required Equipment
              </Text>
              <View style={styles.modalEquipmentList}>
                {mission.equipment?.map((item, index) => (
                  <View key={index} style={styles.modalEquipmentItem}>
                    <Ionicons name="checkmark-circle" size={16} color={roleColor} />
                    <Text style={[styles.modalEquipmentText, { color: theme.textColor }]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Rewards */}
            <View style={[styles.modalSection, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.modalSectionTitle, { color: theme.textColor }]}>
                Rewards
              </Text>
              <View style={styles.modalRewardsList}>
                <View style={styles.modalRewardItem}>
                  <Text style={[styles.modalRewardIcon, { color: roleColor }]}>⭐</Text>
                  <Text style={[styles.modalRewardText, { color: theme.textColor }]}>
                    {mission.xpReward} XP Points
                  </Text>
                </View>
                <View style={styles.modalRewardItem}>
                  <Text style={[styles.modalRewardIcon, { color: roleColor }]}>🍐</Text>
                  <Text style={[styles.modalRewardText, { color: theme.textColor }]}>
                    {mission.ecoPointsReward} Eco Points
                  </Text>
                </View>
                {mission.badgeReward && (
                  <View style={styles.modalRewardItem}>
                    <Text style={[styles.modalRewardIcon, { color: roleColor }]}>🏆</Text>
                    <Text style={[styles.modalRewardText, { color: theme.textColor }]}>
                      {mission.badgeReward} Badge
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Modal Action Button */}
          <View style={[styles.modalFooter, { backgroundColor: theme.cardBackground }]}>
            {!isCompleted && (
          <TouchableOpacity
                style={[
                  styles.modalActionButton,
                  { backgroundColor: isAccepted ? '#FF9800' : roleColor },
                ]}
                onPress={() => {
                  setShowModal(false);
                  isAccepted ? handleComplete() : handleAccept();
                }}
            activeOpacity={0.8}
          >
                <Ionicons 
                  name={isAccepted ? 'checkmark' : 'play'} 
                  size={20} 
                  color="white" 
                />
                <Text style={styles.modalActionButtonText}>
                  {isAccepted ? 'Complete Mission' : 'Accept Mission'}
                </Text>
          </TouchableOpacity>
        )}
          </View>
      </View>
      </Modal>

      {/* Mission Completion Modal with Photo Verification */}
      <MissionCompletionModal
        visible={showCompletionModal}
        mission={mission}
        onClose={() => setShowCompletionModal(false)}
        onComplete={(missionId, verificationResult) => handleMissionCompleted(verificationResult)}
        userRole={userRole}
      />

      {/* Celebration Animation */}
      <CelebrationAnimation
        visible={showCelebration}
        rewards={[]} // Will be populated by the gamification hook
        userRole={userRole}
        onComplete={hideCelebration}
      />

      {/* Level Up Modal */}
      <LevelUpModal
        visible={showLevelUp}
        oldLevel={levelUpData?.oldLevel || { level: 1, xp: 0, title: 'Level 1' }}
        newLevel={levelUpData?.newLevel || { level: 2, xp: 250, title: 'Level 2' }}
        userRole={userRole}
        onClose={hideLevelUpModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: THEME.BORDER_RADIUS.lg,
    padding: THEME.SPACING.md,
    marginBottom: THEME.SPACING.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    backgroundColor: '#E8F5E8',
    borderLeftColor: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.SPACING.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: THEME.SPACING.sm,
  },
  title: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginBottom: THEME.SPACING.xs,
  },
  roleBadge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: THEME.SPACING.xs,
  },
  urgencyBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    lineHeight: 20,
    marginBottom: THEME.SPACING.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: THEME.SPACING.sm,
    gap: THEME.SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.xs,
  },
  detailText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
  },
  rewardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.SPACING.sm,
    marginBottom: THEME.SPACING.md,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.xs,
  },
  rewardIcon: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
  },
  rewardText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  xpRewardItem: {
    backgroundColor: 'rgba(255, 215, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpRewardText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.SPACING.sm,
    paddingHorizontal: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.md,
    gap: THEME.SPACING.xs,
  },
  actionButtonText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.SPACING.sm,
    paddingHorizontal: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.md,
    gap: THEME.SPACING.xs,
  },
  completedText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
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
  modalTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    padding: THEME.SPACING.md,
  },
  modalMissionHeader: {
    borderRadius: THEME.BORDER_RADIUS.lg,
    padding: THEME.SPACING.md,
    marginBottom: THEME.SPACING.md,
  },
  modalMissionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    marginBottom: THEME.SPACING.sm,
  },
  modalMissionDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    lineHeight: 22,
    marginBottom: THEME.SPACING.md,
  },
  modalBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.SPACING.sm,
  },
  modalBadge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.sm,
  },
  modalBadgeText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  modalSection: {
    borderRadius: THEME.BORDER_RADIUS.lg,
    padding: THEME.SPACING.md,
    marginBottom: THEME.SPACING.md,
  },
  modalSectionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginBottom: THEME.SPACING.sm,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.sm,
    marginBottom: THEME.SPACING.sm,
  },
  modalInfoText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    flex: 1,
  },
  modalInstructionItem: {
    flexDirection: 'row',
    marginBottom: THEME.SPACING.sm,
    gap: THEME.SPACING.sm,
  },
  modalInstructionNumber: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '700',
    minWidth: 20,
  },
  modalInstructionText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    flex: 1,
    lineHeight: 20,
  },
  modalEquipmentList: {
    gap: THEME.SPACING.sm,
  },
  modalEquipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.sm,
  },
  modalEquipmentText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
  },
  modalRewardsList: {
    gap: THEME.SPACING.sm,
  },
  modalRewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.sm,
  },
  modalRewardIcon: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
  },
  modalRewardText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
  },
  modalFooter: {
    padding: THEME.SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    gap: THEME.SPACING.sm,
  },
  modalActionButtonText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
  },
});

export default MissionCard;