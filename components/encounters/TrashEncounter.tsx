import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { TrashEncounter as TrashEncounterType, TRASH_TYPES } from '../../hooks/useTrashEncounters';
import { THEME } from '../../styles/theme';

interface TrashEncounterProps {
  visible: boolean;
  encounter: TrashEncounterType | null;
  onComplete: (result: { xpEarned: number; ecoPointsEarned: number; badgeProgress?: string }) => void;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const TrashEncounter: React.FC<TrashEncounterProps> = ({
  visible,
  encounter,
  onComplete,
  onClose,
}) => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const progressAnim = new Animated.Value(0);

  const trashData = encounter ? TRASH_TYPES[encounter.type] : null;

  // Reset state when modal opens
  useEffect(() => {
    if (visible && encounter) {
      setProgress(0);
      setTimeLeft(10);
      setIsActive(true);
      setTapCount(0);
      progressAnim.setValue(0);
    }
  }, [visible, encounter]);

  // Countdown timer
  useEffect(() => {
    if (visible && isActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      onComplete({
        xpEarned: Math.floor(encounter!.xpReward * (progress / 100)),
        ecoPointsEarned: Math.floor(encounter!.ecoPointsReward * (progress / 100)),
        badgeProgress: progress >= 80 ? 'Speed Cleaner +1' : undefined,
      });
    }
  }, [visible, isActive, timeLeft, progress, encounter, onComplete]);

  const handleTap = () => {
    if (!isActive) return;

    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);
    
    // Progress increases by 8-12% per tap, with diminishing returns
    const progressIncrease = Math.max(8, 12 - Math.floor(newTapCount / 5));
    const newProgress = Math.min(100, progress + progressIncrease);
    setProgress(newProgress);

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: newProgress,
      duration: 200,
      useNativeDriver: false,
    }).start();

    // Complete if we hit 100%
    if (newProgress >= 100) {
      setIsActive(false);
      onComplete({
        xpEarned: encounter!.xpReward,
        ecoPointsEarned: encounter!.ecoPointsReward,
        badgeProgress: timeLeft >= 7 ? 'Speed Cleaner +1' : undefined,
      });
    }
  };

  const getRarityColor = () => {
    if (!encounter) return theme.primary;
    switch (encounter.rarity) {
      case 'common':
        return '#10b981';
      case 'uncommon':
        return '#f59e0b';
      case 'rare':
        return '#ef4444';
      default:
        return theme.primary;
    }
  };

  const getTrashIcon = () => {
    if (!trashData) return 'trash';
    return trashData.icon;
  };

  if (!visible || !encounter || !trashData) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor }]}>
              🗑️ Trash Encounter!
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>

          {/* Trash Info */}
          <View style={styles.trashInfo}>
            <View style={[styles.trashIcon, { backgroundColor: getRarityColor() }]}>
              <Ionicons name={getTrashIcon() as any} size={32} color="white" />
            </View>
            <Text style={[styles.trashName, { color: theme.textColor }]}>
              {trashData.name}
            </Text>
            <Text style={[styles.trashRarity, { color: getRarityColor() }]}>
              {encounter.rarity.toUpperCase()}
            </Text>
          </View>

          {/* Game Area */}
          <View style={styles.gameArea}>
            <Text style={[styles.instruction, { color: theme.secondaryText }]}>
              Tap rapidly to clean up the trash!
            </Text>
            
            {/* Timer */}
            <Text style={[styles.timer, { color: timeLeft <= 3 ? '#ef4444' : theme.textColor }]}>
              Time: {timeLeft}s
            </Text>

            {/* Progress Bar */}
            <View style={[styles.progressContainer, { backgroundColor: theme.borderColor }]}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: getRarityColor(),
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>

            <Text style={[styles.progressText, { color: theme.textColor }]}>
              Progress: {Math.round(progress)}%
            </Text>

            {/* Tap Area */}
            <TouchableOpacity
              style={[
                styles.tapArea,
                {
                  backgroundColor: isActive ? getRarityColor() : theme.borderColor,
                  opacity: isActive ? 1 : 0.5,
                },
              ]}
              onPress={handleTap}
              disabled={!isActive}
            >
              <Ionicons 
                name="hand-left" 
                size={40} 
                color={isActive ? "white" : theme.textColor} 
              />
              <Text style={[
                styles.tapText,
                { color: isActive ? "white" : theme.textColor }
              ]}>
                {isActive ? 'TAP!' : 'TIME UP!'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.tapCount, { color: theme.secondaryText }]}>
              Taps: {tapCount}
            </Text>
          </View>

          {/* Rewards Preview */}
          <View style={styles.rewardsPreview}>
            <Text style={[styles.rewardsTitle, { color: theme.textColor }]}>
              Rewards:
            </Text>
            <View style={styles.rewardsList}>
              <Text style={[styles.rewardItem, { color: theme.primary }]}>
                ⭐ {encounter.xpReward} XP
              </Text>
              <Text style={[styles.rewardItem, { color: '#10b981' }]}>
                🌱 {encounter.ecoPointsReward} Eco Points
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: THEME.BORDER_RADIUS.xl,
    padding: THEME.SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.lg,
  },
  title: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: THEME.SPACING.xs,
  },
  trashInfo: {
    alignItems: 'center',
    marginBottom: THEME.SPACING.lg,
  },
  trashIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.SPACING.sm,
  },
  trashName: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    marginBottom: THEME.SPACING.xs,
  },
  trashRarity: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  gameArea: {
    alignItems: 'center',
    marginBottom: THEME.SPACING.lg,
  },
  instruction: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
    marginBottom: THEME.SPACING.md,
  },
  timer: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.sm,
  },
  progressContainer: {
    width: '100%',
    height: 20,
    borderRadius: 10,
    marginBottom: THEME.SPACING.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: 20,
    borderRadius: 10,
  },
  progressText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    marginBottom: THEME.SPACING.md,
  },
  tapArea: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.SPACING.sm,
  },
  tapText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: 'bold',
    marginTop: THEME.SPACING.xs,
  },
  tapCount: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
  },
  rewardsPreview: {
    alignItems: 'center',
  },
  rewardsTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    marginBottom: THEME.SPACING.sm,
  },
  rewardsList: {
    flexDirection: 'row',
    gap: THEME.SPACING.md,
  },
  rewardItem: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '500',
  },
});

export default TrashEncounter;
