import React, { useEffect, useRef } from 'react';
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
import { THEME } from '../../styles/theme';

interface EncounterRewardsProps {
  visible: boolean;
  xpEarned: number;
  ecoPointsEarned: number;
  trashType: string;
  rarity: string;
  badgeProgress?: string;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const EncounterRewards: React.FC<EncounterRewardsProps> = ({
  visible,
  xpEarned,
  ecoPointsEarned,
  trashType,
  rarity,
  badgeProgress,
  onClose,
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const xpAnim = useRef(new Animated.Value(0)).current;
  const ecoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      slideAnim.setValue(50);
      xpAnim.setValue(0);
      ecoAnim.setValue(0);

      // Animate modal entrance
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate rewards counting up
      setTimeout(() => {
        Animated.timing(xpAnim, {
          toValue: xpEarned,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }, 300);

      setTimeout(() => {
        Animated.timing(ecoAnim, {
          toValue: ecoPointsEarned,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }, 600);
    }
  }, [visible, xpEarned, ecoPointsEarned]);

  const getRarityColor = () => {
    switch (rarity) {
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

  const getRarityIcon = () => {
    switch (rarity) {
      case 'common':
        return 'star';
      case 'uncommon':
        return 'star-half';
      case 'rare':
        return 'diamond';
      default:
        return 'star';
    }
  };

  const getSuccessMessage = () => {
    const percentage = Math.round((xpEarned / 50) * 100); // Assuming max XP is 50 for perfect score
    
    if (percentage >= 100) return "Perfect Cleanup! 🌟";
    if (percentage >= 80) return "Excellent Work! 🎉";
    if (percentage >= 60) return "Good Job! 👍";
    if (percentage >= 40) return "Nice Try! 💪";
    return "Keep Practicing! 🌱";
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: theme.cardBackground,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.successIcon, { backgroundColor: getRarityColor() }]}>
              <Ionicons name="checkmark" size={32} color="white" />
            </View>
            <Text style={[styles.title, { color: theme.textColor }]}>
              Cleanup Complete!
            </Text>
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
              {getSuccessMessage()}
            </Text>
          </View>

          {/* Trash Type & Rarity */}
          <View style={styles.trashInfo}>
            <View style={styles.trashDetails}>
              <Text style={[styles.trashType, { color: theme.textColor }]}>
                {trashType}
              </Text>
              <View style={styles.rarityContainer}>
                <Ionicons 
                  name={getRarityIcon() as any} 
                  size={16} 
                  color={getRarityColor()} 
                />
                <Text style={[styles.rarity, { color: getRarityColor() }]}>
                  {rarity.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          {/* Rewards */}
          <View style={styles.rewardsSection}>
            <Text style={[styles.rewardsTitle, { color: theme.textColor }]}>
              Rewards Earned
            </Text>
            
            <View style={styles.rewardsList}>
              {/* XP Reward */}
              <View style={styles.rewardItem}>
                <View style={[styles.rewardIcon, { backgroundColor: theme.primary }]}>
                  <Ionicons name="star" size={24} color="white" />
                </View>
                <View style={styles.rewardDetails}>
                  <Text style={[styles.rewardLabel, { color: theme.textColor }]}>
                    Experience Points
                  </Text>
                  <Text style={[styles.rewardValue, { color: theme.primary }]}>
                    {xpEarned} XP
                  </Text>
                </View>
              </View>

              {/* Eco Points Reward */}
              <View style={styles.rewardItem}>
                <View style={[styles.rewardIcon, { backgroundColor: '#10b981' }]}>
                  <Ionicons name="leaf" size={24} color="white" />
                </View>
                <View style={styles.rewardDetails}>
                  <Text style={[styles.rewardLabel, { color: theme.textColor }]}>
                    Eco Points
                  </Text>
                  <Text style={[styles.rewardValue, { color: '#10b981' }]}>
                    {ecoPointsEarned} Eco Points
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Badge Progress */}
          {badgeProgress && (
            <View style={styles.badgeSection}>
              <View style={[styles.badgeContainer, { backgroundColor: getRarityColor() }]}>
                <Ionicons name="medal" size={20} color="white" />
                <Text style={styles.badgeText}>
                  {badgeProgress}
                </Text>
              </View>
            </View>
          )}

          {/* Impact Message */}
          <View style={styles.impactSection}>
            <Text style={[styles.impactTitle, { color: theme.textColor }]}>
              Environmental Impact
            </Text>
            <Text style={[styles.impactText, { color: theme.secondaryText }]}>
              You've made a real difference! Every piece of trash cleaned up helps protect our environment. 🌍
            </Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.primary }]}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>
              Awesome! 🍐
            </Text>
          </TouchableOpacity>
        </Animated.View>
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
    alignItems: 'center',
    marginBottom: THEME.SPACING.lg,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.SPACING.md,
  },
  title: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.xs,
  },
  subtitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
  },
  trashInfo: {
    alignItems: 'center',
    marginBottom: THEME.SPACING.lg,
  },
  trashDetails: {
    alignItems: 'center',
  },
  trashType: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    marginBottom: THEME.SPACING.xs,
  },
  rarityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.xs,
  },
  rarity: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: 'bold',
  },
  rewardsSection: {
    marginBottom: THEME.SPACING.lg,
  },
  rewardsTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    marginBottom: THEME.SPACING.md,
    textAlign: 'center',
  },
  rewardsList: {
    gap: THEME.SPACING.md,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.md,
  },
  rewardDetails: {
    flex: 1,
  },
  rewardLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    marginBottom: THEME.SPACING.xs,
  },
  rewardValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
  },
  badgeSection: {
    alignItems: 'center',
    marginBottom: THEME.SPACING.lg,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: THEME.BORDER_RADIUS.full,
    gap: THEME.SPACING.xs,
  },
  badgeText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  impactSection: {
    marginBottom: THEME.SPACING.lg,
  },
  impactTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    marginBottom: THEME.SPACING.sm,
    textAlign: 'center',
  },
  impactText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  closeButton: {
    paddingVertical: THEME.SPACING.md,
    paddingHorizontal: THEME.SPACING.lg,
    borderRadius: THEME.BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
  },
});

export default EncounterRewards;
