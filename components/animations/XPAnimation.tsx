import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import XPAnimationService, { LevelUpAnimation, CelebrationAnimation } from '../../services/animations/xpAnimationService';

interface XPAnimationProps {
  type: 'xp_gain' | 'level_up' | 'badge_earned' | 'mission_complete';
  value: number;
  message: string;
  color: string;
  icon: string;
  position?: { x: number; y: number };
  onComplete?: () => void;
  autoHide?: boolean;
  duration?: number;
}

interface LevelUpModalProps {
  animation: LevelUpAnimation;
  visible: boolean;
  onClose: () => void;
}

interface ConfettiProps {
  visible: boolean;
  onComplete?: () => void;
}

const { width, height } = Dimensions.get('window');

export const XPAnimation: React.FC<XPAnimationProps> = ({
  type,
  value,
  message,
  color,
  icon,
  position = { x: width / 2, y: height / 2 },
  onComplete,
  autoHide = true,
  duration = 2000,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = XPAnimationService.createXPGainAnimation(value, position);
    
    animation.start(() => {
      onComplete?.();
    });

    return () => {
      animation.stop();
    };
  }, [value, position, onComplete]);

  const getAnimationStyle = () => {
    switch (type) {
      case 'xp_gain':
        return {
          opacity,
          transform: [
            { scale },
            { translateY },
          ],
        };
      case 'level_up':
        return {
          opacity,
          transform: [{ scale }],
        };
      case 'badge_earned':
        return {
          opacity,
          transform: [{ scale }],
        };
      case 'mission_complete':
        return {
          opacity,
          transform: [{ scale }],
        };
      default:
        return { opacity, transform: [{ scale }] };
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: position.x - 50,
          top: position.y - 25,
        },
        getAnimationStyle(),
      ]}
    >
      <View style={[styles.animationBox, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={24} color="#fff" />
        <Text style={styles.valueText}>+{value}</Text>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  animation,
  visible,
  onClose,
}) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const levelUpAnimation = XPAnimationService.createLevelUpAnimation(animation);
      levelUpAnimation.start();
    }
  }, [visible, animation]);

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <Animated.View
        style={[
          styles.levelUpModal,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        {/* Glow Effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glow,
              transform: [{ scale: glow }],
            },
          ]}
        />

        {/* Level Up Content */}
        <View style={styles.levelUpContent}>
          <Text style={styles.levelUpTitle}>LEVEL UP!</Text>
          <Text style={styles.levelText}>
            Level {animation.previousLevel} → {animation.newLevel}
          </Text>
          <Text style={styles.xpText}>+{animation.xpGained} XP</Text>
          
          {animation.badgesEarned.length > 0 && (
            <View style={styles.badgesContainer}>
              <Text style={styles.badgesTitle}>New Badges:</Text>
              {animation.badgesEarned.map((badge, index) => (
                <View key={index} style={styles.badgeItem}>
                  <Ionicons name="trophy" size={20} color="#FFD700" />
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Awesome!</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export const Confetti: React.FC<ConfettiProps> = ({ visible, onComplete }) => {
  const confettiPieces = useRef<Animated.Value[]>([]);

  useEffect(() => {
    if (visible) {
      // Initialize confetti pieces
      confettiPieces.current = Array.from({ length: 20 }, () => new Animated.Value(0));
      
      const animations = XPAnimationService.createConfettiAnimation();
      animations.forEach((animation, index) => {
        animation.start(() => {
          if (index === animations.length - 1) {
            onComplete?.();
          }
        });
      });
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <View style={styles.confettiContainer}>
      {confettiPieces.current.map((piece, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confettiPiece,
            {
              backgroundColor: getRandomColor(),
              left: Math.random() * width,
              transform: [
                { translateY: piece },
                { rotate: `${Math.random() * 360}deg` },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

// Helper function for random colors
const getRandomColor = (): string => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  animationBox: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  valueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  levelUpModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  glowEffect: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 40,
    backgroundColor: '#FFD700',
    opacity: 0.3,
  },
  levelUpContent: {
    alignItems: 'center',
  },
  levelUpTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 10,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  xpText: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  badgesContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badgesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  badgeText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1500,
  },
  confettiPiece: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default XPAnimation;
