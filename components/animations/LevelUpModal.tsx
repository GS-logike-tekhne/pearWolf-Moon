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
import { useTheme } from '../../context/ThemeContext';
import { getRoleColor } from '../../utils/roleColors';
import { Level } from '../../data/levels';

const { width, height } = Dimensions.get('window');

interface LevelUpModalProps {
  visible: boolean;
  oldLevel: Level;
  newLevel: Level;
  userRole: string;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({
  visible,
  oldLevel,
  newLevel,
  userRole,
  onClose,
}) => {
  const { theme } = useTheme();
  const roleColor = getRoleColor(userRole);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const levelNumberAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      levelNumberAnim.setValue(0);
      titleAnim.setValue(0);
      glowAnim.setValue(0);

      // Start animation sequence
      Animated.sequence([
        // Initial entrance
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
        ]),
        
        // Level number animation
        Animated.spring(levelNumberAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 3,
        }),
        
        // Title animation
        Animated.spring(titleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 3,
        }),
        
        // Glow effect
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim, levelNumberAnim, titleAnim, glowAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const levelNumberScale = levelNumberAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const titleScale = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.cardBackground,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Glow effect */}
          <Animated.View
            style={[
              styles.glowEffect,
              {
                backgroundColor: roleColor,
                opacity: glowOpacity,
              },
            ]}
          />

          {/* Level number */}
          <Animated.View
            style={[
              styles.levelNumberContainer,
              {
                backgroundColor: roleColor,
                transform: [{ scale: levelNumberScale }],
              },
            ]}
          >
            <Text style={styles.levelNumber}>{newLevel.level}</Text>
          </Animated.View>

          {/* Level up text */}
          <Animated.View
            style={[
              styles.titleContainer,
              {
                transform: [{ scale: titleScale }],
              },
            ]}
          >
            <Text style={[styles.levelUpText, { color: theme.textColor }]}>
              LEVEL UP!
            </Text>
            <Text style={[styles.levelTitle, { color: roleColor }]}>
              {newLevel.title}
            </Text>
          </Animated.View>

          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: theme.secondaryText }]}>
                Previous Level
              </Text>
              <Text style={[styles.progressValue, { color: theme.textColor }]}>
                {oldLevel.title} (Lv. {oldLevel.level})
              </Text>
            </View>
            
            <View style={[styles.progressBar, { backgroundColor: theme.borderColor }]}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: roleColor },
                ]}
              />
            </View>
            
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: theme.secondaryText }]}>
                New Level
              </Text>
              <Text style={[styles.progressValue, { color: roleColor }]}>
                {newLevel.title} (Lv. {newLevel.level})
              </Text>
            </View>
          </View>

          {/* Rewards preview */}
          <View style={styles.rewardsContainer}>
            <Text style={[styles.rewardsTitle, { color: theme.textColor }]}>
              New Level Benefits
            </Text>
            
            <View style={styles.rewardItem}>
              <Ionicons name="star" size={20} color={theme.primary} />
              <Text style={[styles.rewardText, { color: theme.textColor }]}>
                Higher XP rewards for missions
              </Text>
            </View>
            
            <View style={styles.rewardItem}>
              <Ionicons name="shield" size={20} color={roleColor} />
              <Text style={[styles.rewardText, { color: theme.textColor }]}>
                Unlock new mission types
              </Text>
            </View>
            
            <View style={styles.rewardItem}>
              <Ionicons name="trophy" size={20} color="#FFD700" />
              <Text style={[styles.rewardText, { color: theme.textColor }]}>
                Access to exclusive badges
              </Text>
            </View>
          </View>

          {/* Close button */}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: roleColor }]}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark" size={24} color="white" />
            <Text style={styles.closeButtonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    borderRadius: 50,
    blur: 20,
  },
  levelNumberContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  levelNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  levelUpText: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 12,
  },
  progressFill: {
    height: '100%',
    width: '100%',
    borderRadius: 4,
  },
  rewardsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  rewardText: {
    fontSize: 16,
    flex: 1,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LevelUpModal;
