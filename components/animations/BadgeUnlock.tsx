import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

interface BadgeUnlockProps {
  badge: Badge;
  visible: boolean;
  onClose: () => void;
  onClaim?: (badge: Badge) => void;
}

const { width, height } = Dimensions.get('window');

export const BadgeUnlock: React.FC<BadgeUnlockProps> = ({
  badge,
  visible,
  onClose,
  onClaim,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Badge appearance animation
      Animated.sequence([
        // Scale in with bounce
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        // Rotation
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ]),
        { iterations: 3 }
      ).start();

      // Text animation
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
      }).start();

      // Confetti animation
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      rotationAnim.setValue(0);
      glowAnim.setValue(0);
      textAnim.setValue(0);
      confettiAnim.setValue(0);
    }
  }, [visible]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#4CAF50';
      case 'rare': return '#2196F3';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FFD700';
      default: return '#4CAF50';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#4CAF5020';
      case 'rare': return '#2196F320';
      case 'epic': return '#9C27B020';
      case 'legendary': return '#FFD70020';
      default: return '#4CAF5020';
    }
  };

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const textOpacity = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const confettiOpacity = confettiAnim.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Confetti Effect */}
        <Animated.View
          style={[
            styles.confettiContainer,
            { opacity: confettiOpacity },
          ]}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.confettiPiece,
                {
                  backgroundColor: getRarityColor(badge.rarity),
                  left: Math.random() * width,
                  top: Math.random() * height,
                  transform: [
                    {
                      rotate: `${Math.random() * 360}deg`,
                    },
                    {
                      scale: confettiAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 1, 0],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Main Content */}
        <View style={styles.container}>
          {/* Glow Effect */}
          <Animated.View
            style={[
              styles.glowEffect,
              {
                backgroundColor: getRarityGlow(badge.rarity),
                opacity: glowOpacity,
              },
            ]}
          />

          {/* Badge Icon */}
          <Animated.View
            style={[
              styles.badgeContainer,
              {
                backgroundColor: badge.color,
                transform: [
                  { scale: scaleAnim },
                  { rotate: rotation },
                ],
              },
            ]}
          >
            <Ionicons name={badge.icon as any} size={48} color="#fff" />
          </Animated.View>

          {/* Badge Info */}
          <Animated.View
            style={[
              styles.badgeInfo,
              { opacity: textOpacity },
            ]}
          >
            <Text style={[styles.badgeName, { color: badge.color }]}>
              {badge.name}
            </Text>
            <Text style={styles.badgeDescription}>
              {badge.description}
            </Text>
            <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(badge.rarity) }]}>
              <Text style={styles.rarityText}>
                {badge.rarity.toUpperCase()}
              </Text>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            style={[
              styles.actionButtons,
              { opacity: textOpacity },
            ]}
          >
            <TouchableOpacity
              style={[styles.claimButton, { backgroundColor: badge.color }]}
              onPress={() => {
                onClaim?.(badge);
                onClose();
              }}
            >
              <Ionicons name="trophy" size={20} color="#fff" />
              <Text style={styles.claimButtonText}>Claim Badge</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
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
  },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  container: {
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
    position: 'relative',
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 40,
  },
  badgeContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  badgeInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  badgeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  rarityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rarityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default BadgeUnlock;
