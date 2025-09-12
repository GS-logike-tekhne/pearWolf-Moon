import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getRoleColor } from '../../utils/roleColors';
import { GamificationReward } from '../../services/gamificationService';

const { width, height } = Dimensions.get('window');

interface CelebrationAnimationProps {
  visible: boolean;
  rewards: GamificationReward[];
  userRole: string;
  onComplete: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
}

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  visible,
  rewards,
  userRole,
  onComplete,
}) => {
  const { theme } = useTheme();
  const roleColor = getRoleColor(userRole);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const confettiAnimations = useRef<Animated.Value[]>([]).current;
  const confettiPieces = useRef<ConfettiPiece[]>([]).current;
  
  // Generate confetti pieces
  useEffect(() => {
    if (visible) {
      confettiPieces.length = 0; // Clear previous confetti
      confettiAnimations.length = 0; // Clear previous animations
      
      const colors = [roleColor, theme.primary, theme.success, '#FFD700', '#FF6B6B', '#4ECDC4'];
      
      for (let i = 0; i < 50; i++) {
        const piece: ConfettiPiece = {
          id: i,
          x: Math.random() * width,
          y: -50 - Math.random() * 100,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.random() * 8,
        };
        
        confettiPieces.push(piece);
        confettiAnimations.push(new Animated.Value(0));
      }
    }
  }, [visible, roleColor, theme.primary, theme.success]);

  useEffect(() => {
    if (visible) {
      // Start main animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Start confetti animation
      confettiAnimations.forEach((anim, index) => {
        const piece = confettiPieces[index];
        
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000 + Math.random() * 1000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      });

      // Auto-close after animation
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onComplete();
        });
      }, 3000);
    }
  }, [visible, scaleAnim, opacityAnim, onComplete]);

  const renderConfetti = () => {
    return confettiPieces.map((piece, index) => {
      const animatedValue = confettiAnimations[index];
      if (!animatedValue) return null;

      const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [piece.y, height + 100],
      });

      const rotate = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [`${piece.rotation}deg`, `${piece.rotation + 720}deg`],
      });

      const opacity = animatedValue.interpolate({
        inputRange: [0, 0.1, 0.9, 1],
        outputRange: [0, 1, 1, 0],
      });

      return (
        <Animated.View
          key={piece.id}
          style={[
            styles.confettiPiece,
            {
              left: piece.x,
              backgroundColor: piece.color,
              width: piece.size,
              height: piece.size,
              transform: [
                { translateY },
                { rotate },
              ],
              opacity,
            },
          ] as any}
        />
      );
    });
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'xp':
        return 'star';
      case 'eco_points':
        return 'leaf';
      case 'level_up':
        return 'trophy';
      case 'badge':
        return 'medal';
      case 'streak':
        return 'flame';
      default:
        return 'gift';
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'xp':
        return theme.primary;
      case 'eco_points':
        return roleColor;
      case 'level_up':
        return '#FFD700';
      case 'badge':
        return theme.success;
      case 'streak':
        return '#FF6B6B';
      default:
        return theme.textColor;
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onComplete}
    >
      <View style={styles.container}>
        {/* Confetti */}
        {renderConfetti()}
        
        {/* Main celebration content */}
        <Animated.View
          style={[
            styles.celebrationContainer,
            {
              backgroundColor: theme.cardBackground,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ] as any}
        >
          {/* Celebration header */}
          <View style={styles.header}>
            <Ionicons 
              name="sparkles" 
              size={32} 
              color={roleColor} 
              style={styles.sparkleIcon}
            />
            <Text style={[styles.celebrationTitle, { color: theme.textColor }]}>
              🎉 Amazing Work! 🎉
            </Text>
            <Ionicons 
              name="sparkles" 
              size={32} 
              color={roleColor} 
              style={styles.sparkleIcon}
            />
          </View>

          {/* Rewards display */}
          <View style={styles.rewardsContainer}>
            {rewards.map((reward, index) => (
              <Animated.View
                key={`${reward.type}-${index}`}
                style={[
                  styles.rewardItem,
                  {
                    backgroundColor: getRewardColor(reward.type) + '20',
                    borderColor: getRewardColor(reward.type),
                    transform: [
                      {
                        scale: scaleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                  },
                ] as any}
              >
                <Ionicons
                  name={getRewardIcon(reward.type) as any}
                  size={24}
                  color={getRewardColor(reward.type)}
                />
                <Text style={[styles.rewardText, { color: getRewardColor(reward.type) }]}>
                  {reward.type === 'level_up' 
                    ? `Level ${reward.value}!` 
                    : `+${reward.value} ${reward.type.replace('_', ' ')}`
                  }
                </Text>
              </Animated.View>
            ))}
          </View>

          {/* Encouragement message */}
          <Text style={[styles.encouragementText, { color: theme.secondaryText }]}>
            Keep up the amazing work, {userRole.replace('-', ' ')}! 🌍
          </Text>

          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.borderColor }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: roleColor,
                    width: scaleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ] as any}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.secondaryText }]}>
              Making the world cleaner, one mission at a time!
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiPiece: {
    position: 'absolute',
    borderRadius: 2,
  },
  celebrationContainer: {
    width: width * 0.85,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sparkleIcon: {
    marginHorizontal: 8,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  rewardsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    gap: 12,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  encouragementText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default CelebrationAnimation;
