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
import { Level } from '../data/levels';
import { THEME } from '../styles/theme';

const { width, height } = Dimensions.get('window');

interface EvolutionAnimationProps {
  visible: boolean;
  currentLevel: Level;
  newLevel: Level;
  onComplete: () => void;
  roleColor?: string;
}

export const EvolutionAnimation: React.FC<EvolutionAnimationProps> = ({
  visible,
  currentLevel,
  newLevel,
  onComplete,
  roleColor = '#4CAF50',
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      startAnimation();
    } else {
      resetAnimations();
    }
  }, [visible]);

  const startAnimation = () => {
    // Reset animations
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.5);
    rotateAnim.setValue(0);
    progressAnim.setValue(0);
    textAnim.setValue(0);

    // Start animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Rotate animation
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // Progress bar animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }).start();

      // Text animation
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    });
  };

  const resetAnimations = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.5);
    rotateAnim.setValue(0);
    progressAnim.setValue(0);
    textAnim.setValue(0);
  };

  const handleComplete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onComplete();
    });
  };

  if (!visible) return null;

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const textTranslateY = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
        },
      ] as any}
    >
      <View style={styles.container}>
        {/* Background Blur Effect */}
        <View style={[styles.blurBackground, { backgroundColor: roleColor }]} />

        {/* Evolution Card */}
        <Animated.View
          style={[
            styles.evolutionCard,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: rotation },
              ],
            },
          ] as any}
        >
          {/* Current Level */}
          <View style={styles.levelSection}>
            <View style={[styles.levelBadge, { backgroundColor: roleColor }]}>
              <Text style={styles.levelNumber}>{currentLevel.level}</Text>
            </View>
            <Animated.Text
              style={[
                styles.levelTitle,
                {
                  opacity: textAnim,
                  transform: [{ translateY: textTranslateY }],
                },
              ] as any}
            >
              {currentLevel.title}
            </Animated.Text>
          </View>

          {/* Evolution Arrow */}
          <View style={styles.arrowContainer}>
            <Animated.View
              style={[
                styles.evolutionArrow,
                {
                  backgroundColor: roleColor,
                  transform: [{ scale: scaleAnim }],
                },
              ] as any}
            >
              <Ionicons name="arrow-down" size={24} color="white" />
            </Animated.View>
          </View>

          {/* New Level */}
          <View style={styles.levelSection}>
            <View style={[styles.levelBadge, { backgroundColor: roleColor }]}>
              <Text style={styles.levelNumber}>{newLevel.level}</Text>
            </View>
            <Animated.Text
              style={[
                styles.levelTitle,
                {
                  opacity: textAnim,
                  transform: [{ translateY: textTranslateY }],
                  color: roleColor,
                  fontWeight: '700',
                },
              ] as any}
            >
              {newLevel.title}
            </Animated.Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressWidth,
                    backgroundColor: roleColor,
                  },
                ] as any}
              />
            </View>
            <Animated.Text
              style={[
                styles.progressText,
                {
                  opacity: textAnim,
                  color: roleColor,
                },
              ] as any}
            >
              LEVEL UP COMPLETE!
            </Animated.Text>
          </View>

          {/* Description */}
          <Animated.Text
            style={[
              styles.description,
              {
                opacity: textAnim,
                transform: [{ translateY: textTranslateY }],
              },
            ] as any}
          >
            {newLevel.description}
          </Animated.Text>

          {/* Complete Button */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: textAnim,
                transform: [{ translateY: textTranslateY }],
              },
            ] as any}
          >
            <TouchableOpacity
              style={[styles.completeButton, { backgroundColor: roleColor }]}
              onPress={handleComplete}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.completeButtonText}>Awesome!</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,
    alignItems: 'center',
    position: 'relative',
  },
  blurBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    opacity: 0.1,
  },
  evolutionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    minHeight: 400,
    justifyContent: 'space-between',
  },
  levelSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  arrowContainer: {
    marginVertical: 20,
  },
  evolutionArrow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  progressBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
