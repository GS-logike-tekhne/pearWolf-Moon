import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface StreakBadgeProps {
  streak: number;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ streak }) => {
  const glowAnimation = useSharedValue(0);
  const scaleAnimation = useSharedValue(1);

  useEffect(() => {
    // Continuous glow animation
    glowAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
    
    // Subtle scale animation
    scaleAnimation.value = withRepeat(
      withTiming(1.05, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(glowAnimation.value, [0, 1], [0.6, 1]);
    const shadowOpacity = interpolate(glowAnimation.value, [0, 1], [0.3, 0.6]);
    
    return {
      opacity,
      shadowOpacity,
      transform: [{ scale: scaleAnimation.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, glowStyle]}>
      <View style={styles.fireIcon}>
        <Ionicons name="flame" size={24} color="#FF6A00" />
        <Text style={styles.streakNumber}>{streak}</Text>
      </View>
      <Text style={styles.streakText}>
        <Text style={styles.streakNumber}>{streak} DAY</Text> STREAK!
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 106, 0, 0.1)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF6A00',
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  fireIcon: {
    position: 'relative',
    marginBottom: 4,
  },
  streakNumber: {
    position: 'absolute',
    top: -2,
    left: 6,
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  streakText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});

export default StreakBadge;
