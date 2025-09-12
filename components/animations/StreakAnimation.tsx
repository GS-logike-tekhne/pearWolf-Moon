import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StreakAnimationProps {
  streak: number;
  maxStreak?: number;
  animated?: boolean;
  showFire?: boolean;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

const { width } = Dimensions.get('window');

export const StreakAnimation: React.FC<StreakAnimationProps> = ({
  streak,
  maxStreak = 7,
  animated = true,
  showFire = true,
  color = '#FF6B35',
  size = 'medium',
  style,
}) => {
  const fireAnim = useRef(new Animated.Value(0)).current;
  const streakAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const isNewStreak = streak > 0;
  const isMaxStreak = streak >= maxStreak;

  useEffect(() => {
    if (animated && isNewStreak) {
      // Fire animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(fireAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(fireAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Streak number animation
      Animated.spring(streakAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();

      // Glow effect for max streak
      if (isMaxStreak) {
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
          ])
        ).start();
      }
    }
  }, [streak, animated, isNewStreak, isMaxStreak]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { padding: 8 },
          icon: 16,
          text: 12,
          streakText: 14,
        };
      case 'large':
        return {
          container: { padding: 16 },
          icon: 32,
          text: 16,
          streakText: 20,
        };
      default: // medium
        return {
          container: { padding: 12 },
          icon: 24,
          text: 14,
          streakText: 18,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const fireRotation = fireAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });

  const fireScale = fireAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  const streakScale = streakAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  if (!isNewStreak) {
    return (
      <View style={[styles.container, styles.inactiveContainer, sizeStyles.container, style]}>
        <Ionicons name="flame-outline" size={sizeStyles.icon} color="#999" />
        <Text style={[styles.streakText, { fontSize: sizeStyles.streakText, color: '#999' }]}>
          {streak}
        </Text>
        <Text style={[styles.streakLabel, { fontSize: sizeStyles.text, color: '#999' }]}>
          Day Streak
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, sizeStyles.container, style]}>
      {/* Glow Effect for Max Streak */}
      {isMaxStreak && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              backgroundColor: color,
              opacity: glowOpacity,
            },
          ]}
        />
      )}

      {/* Fire Icon */}
      {showFire && (
        <Animated.View
          style={{
            transform: [
              { rotate: fireRotation },
              { scale: fireScale },
            ],
          }}
        >
          <Ionicons
            name={isMaxStreak ? "flame" : "flame-outline"}
            size={sizeStyles.icon}
            color={color}
          />
        </Animated.View>
      )}

      {/* Streak Number */}
      <Animated.View
        style={{
          transform: [{ scale: streakScale }],
        }}
      >
        <Text style={[styles.streakText, { fontSize: sizeStyles.streakText, color }]}>
          {streak}
        </Text>
      </Animated.View>

      {/* Streak Label */}
      <Text style={[styles.streakLabel, { fontSize: sizeStyles.text, color }]}>
        {streak === 1 ? 'Day Streak' : 'Day Streak'}
      </Text>

      {/* Max Streak Badge */}
      {isMaxStreak && (
        <View style={[styles.maxStreakBadge, { backgroundColor: color }]}>
          <Ionicons name="trophy" size={12} color="#fff" />
          <Text style={styles.maxStreakText}>MAX!</Text>
        </View>
      )}

      {/* Streak Progress */}
      <View style={styles.streakProgress}>
        <View
          style={[
            styles.streakProgressBar,
            {
              backgroundColor: color,
              width: `${Math.min((streak / maxStreak) * 100, 100)}%`,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  inactiveContainer: {
    backgroundColor: '#f5f5f5',
    shadowOpacity: 0.05,
  },
  glowEffect: {
    position: 'absolute' as const,
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 20,
  },
  streakText: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  streakLabel: {
    fontWeight: '500',
    marginTop: 2,
  },
  maxStreakBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  maxStreakText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  streakProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#E0E0E0',
  },
  streakProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
});

export default StreakAnimation;
