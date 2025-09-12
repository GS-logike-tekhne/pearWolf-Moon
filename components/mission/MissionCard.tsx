import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Mission } from '../../types/missions';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../../styles/theme';
import { getRoleColor } from '../../utils/roleColors';
import MissionCardHeader from './MissionCardHeader';
import MissionCardContent from './MissionCardContent';
import MissionCardActions from './MissionCardActions';
import MissionDetailsModal from './MissionDetailsModal';
import MissionCompletionModal from './MissionCompletionModal';
import CelebrationAnimation from '../animations/CelebrationAnimation';
import LevelUpModal from '../animations/LevelUpModal';
import { PhotoVerificationResult } from '../../services/photoVerificationService';
import { useGamification } from '../../hooks/useGamification';

interface MissionCardProps {
  mission: Mission;
  onAccept?: (mission: Mission) => void;
  onComplete?: (mission: Mission, verificationResult?: PhotoVerificationResult) => void;
  userRole?: string;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onAccept,
  onComplete,
  userRole = 'trash-hero',
}) => {
  const { theme } = useTheme();
  const { processMissionCompletion, showCelebration, showLevelUp, levelUpData, hideCelebration, hideLevelUpModal } = useGamification('current_user');
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(mission.status === 'completed');

  const roleColor = getRoleColor(mission.requiredRole);

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
    setShowCompletionModal(true);
  };

  const handleMissionCompleted = async (verificationResult: PhotoVerificationResult) => {
    try {
      const rewards = await processMissionCompletion(mission, verificationResult);
      setIsCompleted(true);
      onComplete?.(mission, verificationResult);
      
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
        onPress={() => setShowDetailsModal(true)}
        activeOpacity={0.7}
      >
        <MissionCardHeader mission={mission} isCompleted={isCompleted} />
        <MissionCardContent mission={mission} />
        <MissionCardActions
          mission={mission}
          isAccepted={isAccepted}
          isCompleted={isCompleted}
          onAccept={handleAccept}
          onComplete={handleComplete}
        />
      </TouchableOpacity>

      {/* Modals */}
      <MissionDetailsModal
        visible={showDetailsModal}
        mission={mission}
        onClose={() => setShowDetailsModal(false)}
        onAccept={handleAccept}
        onComplete={handleComplete}
        isAccepted={isAccepted}
        isCompleted={isCompleted}
      />

      <MissionCompletionModal
        visible={showCompletionModal}
        mission={mission}
        onClose={() => setShowCompletionModal(false)}
        onComplete={handleMissionCompleted}
        userRole={userRole}
      />

      <CelebrationAnimation
        visible={showCelebration}
        rewards={[]}
        userRole={userRole}
        onComplete={hideCelebration}
      />

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
});

export default MissionCard;
