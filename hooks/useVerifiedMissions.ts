import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useXP } from '../context/XPContext';
import { useAuth } from '../context/AuthContext';

interface UseVerifiedMissionsReturn {
  // State
  isJoined: boolean;
  showJoinModal: boolean;
  showLevelUpModal: boolean;
  
  // Actions
  handleJoin: () => void;
  handleCompleteMission: () => void;
  confirmJoinMission: () => void;
  closeJoinModal: () => void;
  closeLevelUpModal: () => void;
  
  // Constants
  XP_REWARD: number;
  ECO_POINTS_REWARD: number;
}

export const useVerifiedMissions = (): UseVerifiedMissionsReturn => {
  const { addXP, level } = useXP();
  const { currentUser } = useAuth();
  
  const [isJoined, setIsJoined] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(level);

  // Constants
  const XP_REWARD = 250;
  const ECO_POINTS_REWARD = 150;

  const handleJoin = useCallback(() => {
    setShowJoinModal(true);
  }, []);

  const confirmJoinMission = useCallback(() => {
    setIsJoined(true);
    setShowJoinModal(false);
    
    Alert.alert(
      'Mission Joined! 🍐',
      'You\'ve successfully joined this verified mission. You\'ll receive notifications about updates and can track your participation in the mission feed.',
      [{ text: 'Great!', style: 'default' }]
    );
  }, []);

  const closeJoinModal = useCallback(() => {
    setShowJoinModal(false);
  }, []);

  const closeLevelUpModal = useCallback(() => {
    setShowLevelUpModal(false);
  }, []);

  const handleCompleteMission = useCallback(() => {
    if (!isJoined) {
      Alert.alert(
        'Join Mission First',
        'You need to join this mission before you can mark it as complete.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Complete Mission',
      'Are you ready to mark this mission as complete? You\'ll receive XP and Eco Points for your participation.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete', 
          style: 'default',
          onPress: () => {
            // Award XP and Eco Points
            setPreviousLevel(level);
            addXP(XP_REWARD, ECO_POINTS_REWARD);
            
            // Award PEAR Verified Cleanup Badge
            if (currentUser) {
              // In a real app, this would update the user's badge collection
              // For now, we'll just show a notification
              console.log('PEAR Verified Cleanup Badge awarded!');
            }
            
            // Check if user leveled up
            if (level !== previousLevel) {
              setShowLevelUpModal(true);
            }
            
            Alert.alert(
              'Mission Complete! 🌟',
              `Congratulations! You've earned ${XP_REWARD} XP, ${ECO_POINTS_REWARD} Eco Points, and the PEAR Verified Cleanup Badge for completing this verified mission!`,
              [{ text: 'Awesome!', style: 'default' }]
            );
          }
        }
      ]
    );
  }, [isJoined, level, previousLevel, addXP, currentUser, XP_REWARD, ECO_POINTS_REWARD]);

  return {
    // State
    isJoined,
    showJoinModal,
    showLevelUpModal,
    
    // Actions
    handleJoin,
    handleCompleteMission,
    confirmJoinMission,
    closeJoinModal,
    closeLevelUpModal,
    
    // Constants
    XP_REWARD,
    ECO_POINTS_REWARD,
  };
};
