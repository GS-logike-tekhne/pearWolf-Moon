import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface LevelUpModalProps {
  visible: boolean;
  onClose: () => void;
  newLevel: number;
  role: 'TRASH_HERO' | 'VOLUNTEER' | 'BUSINESS';
  rewards?: string[];
  unlockedFeatures?: string[];
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({
  visible,
  onClose,
  newLevel,
  role,
  rewards = [],
  unlockedFeatures = []
}) => {
  const { theme } = useTheme();
  const [scaleAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [glowAnim] = useState(new Animated.Value(0));
  const [confettiAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      startLevelUpAnimation();
    } else {
      resetAnimations();
    }
  }, [visible]);

  const startLevelUpAnimation = () => {
    resetAnimations();
    
    // Main scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotation animation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Glow pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Confetti animation
    Animated.timing(confettiAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const resetAnimations = () => {
    scaleAnim.setValue(0);
    rotateAnim.setValue(0);
    glowAnim.setValue(0);
    confettiAnim.setValue(0);
  };

  const getRoleColor = () => {
    switch (role) {
      case 'TRASH_HERO': return '#28A745';
      case 'VOLUNTEER': return '#007bff';
      case 'BUSINESS': return '#8b5cf6';
      default: return theme.primary;
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'TRASH_HERO': return 'shield';
      case 'VOLUNTEER': return 'heart';
      case 'BUSINESS': return 'business';
      default: return 'star';
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'TRASH_HERO': return 'Trash Hero';
      case 'VOLUNTEER': return 'Impact Warrior';
      case 'BUSINESS': return 'Eco Defender';
      default: return 'User';
    }
  };

  const defaultRewards = role === 'TRASH_HERO' 
    ? ['Higher job priority', 'Bonus eco points', 'Exclusive missions']
    : role === 'VOLUNTEER'
    ? ['New badge unlocked', 'Community recognition', 'Special events access']
    : ['Advanced analytics', 'Priority support', 'Custom branding options'];

  const defaultFeatures = role === 'TRASH_HERO'
    ? ['Advanced job filtering', 'Team creation', 'Premium profile badge']
    : role === 'VOLUNTEER'
    ? ['Streak tracking', 'Achievement gallery', 'Impact calculator']
    : ['Detailed reporting', 'Bulk job posting', 'Analytics dashboard'];

  const displayRewards = rewards.length > 0 ? rewards : defaultRewards;
  const displayFeatures = unlockedFeatures.length > 0 ? unlockedFeatures : defaultFeatures;

  const renderConfetti = () => {
    const confettiPieces = Array.from({ length: 20 }, (_, i) => i);
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a0e7e5'];
    
    return (
      <View style={styles.confettiContainer}>
        {confettiPieces.map((_, index) => {
          const randomX = Math.random() * width;
          const randomDelay = Math.random() * 500;
          const randomColor = colors[index % colors.length];
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.confettiPiece,
                {
                  left: randomX,
                  backgroundColor: randomColor,
                  transform: [
                    {
                      translateY: confettiAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, height + 100],
                      })
                    },
                    {
                      rotate: confettiAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      })
                    }
                  ],
                  opacity: confettiAnim.interpolate({
                    inputRange: [0, 0.8, 1],
                    outputRange: [1, 1, 0],
                  })
                }
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {renderConfetti()}
        
        <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.textColor} />
          </TouchableOpacity>

          {/* Main Level Up Display */}
          <View style={styles.levelUpSection}>
            <Animated.View
              style={[
                styles.levelContainer,
                {
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <Animated.View
                style={[
                  styles.glowEffect,
                  {
                    backgroundColor: getRoleColor(),
                    opacity: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0.7],
                    })
                  }
                ]}
              />
              
              <Animated.View
                style={[
                  styles.levelIcon,
                  {
                    backgroundColor: getRoleColor(),
                    transform: [{
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      })
                    }]
                  }
                ]}
              >
                <Ionicons name={getRoleIcon() as any} size={48} color="white" />
              </Animated.View>
            </Animated.View>

            <Text style={[styles.congratsText, { color: theme.textColor }]}>
              Congratulations!
            </Text>
            
            <Text style={[styles.levelUpText, { color: getRoleColor() }]}>
              Level {newLevel} {getRoleTitle()}
            </Text>
            
            <Text style={[styles.achievementText, { color: theme.secondaryText }]}>
              You've reached a new milestone in your environmental journey!
            </Text>
          </View>

          {/* Rewards Section */}
          <View style={styles.rewardsSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              🎉 New Rewards Unlocked
            </Text>
            
            <View style={styles.rewardsList}>
              {displayRewards.map((reward, index) => (
                <View key={index} style={styles.rewardItem}>
                  <View style={[styles.rewardIcon, { backgroundColor: getRoleColor() }]}>
                    <Ionicons name="gift" size={16} color="white" />
                  </View>
                  <Text style={[styles.rewardText, { color: theme.textColor }]}>
                    {reward}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              ⚡ New Features Unlocked
            </Text>
            
            <View style={styles.featuresList}>
              {displayFeatures.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={[styles.featureIcon, { backgroundColor: theme.primary }]}>
                    <Ionicons name="sparkles" size={16} color="white" />
                  </View>
                  <Text style={[styles.featureText, { color: theme.textColor }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: getRoleColor() }]}
            onPress={onClose}
          >
            <Text style={styles.continueButtonText}>Continue Your Journey</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 3,
  },
  levelUpSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  levelContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  glowEffect: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    top: -10,
    left: -10,
  },
  levelIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  congratsText: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  levelUpText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  achievementText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  rewardsSection: {
    width: '100%',
    marginBottom: 24,
  },
  featuresSection: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  rewardsList: {
    gap: 12,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  rewardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rewardText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
    minWidth: 200,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default LevelUpModal;