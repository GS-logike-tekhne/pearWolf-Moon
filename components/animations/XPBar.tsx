import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  animated?: boolean;
  showLevel?: boolean;
  showXP?: boolean;
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: any;
}

const { width } = Dimensions.get('window');

export const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  maxXP,
  level,
  animated = true,
  showLevel = true,
  showXP = true,
  color = '#4CAF50',
  backgroundColor = '#E0E0E0',
  height = 12,
  style,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const levelUpAnim = useRef(new Animated.Value(1)).current;

  const progress = Math.min(currentXP / maxXP, 1);
  const isLevelUp = currentXP >= maxXP;

  useEffect(() => {
    if (animated) {
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      // Level up animation
      if (isLevelUp) {
        Animated.sequence([
          Animated.timing(levelUpAnim, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(levelUpAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        // Glow effect
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: false,
            }),
          ]),
          { iterations: 3 }
        ).start();
      }
    } else {
      progressAnim.setValue(progress);
    }
  }, [currentXP, maxXP, animated, progress, isLevelUp]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Level Display */}
      {showLevel && (
        <View style={styles.levelContainer}>
          <Animated.View style={{ transform: [{ scale: levelUpAnim }] }}>
            <View style={[styles.levelBadge, { backgroundColor: color }]}>
              <Ionicons name="trophy" size={16} color="#fff" />
              <Text style={styles.levelText}>{level}</Text>
            </View>
          </Animated.View>
        </View>
      )}

      {/* XP Bar Container */}
      <View style={[styles.xpBarContainer, { height }]}>
        {/* Background */}
        <View style={[styles.xpBarBackground, { backgroundColor, height }]} />
        
        {/* Progress Bar */}
        <Animated.View
          style={[
            styles.xpBarProgress,
            {
              backgroundColor: color,
              height,
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />

        {/* Glow Effect */}
        {isLevelUp && (
          <Animated.View
            style={[
              styles.xpBarGlow,
              {
                backgroundColor: color,
                height,
                opacity: glowOpacity,
              },
            ]}
          />
        )}

        {/* XP Text Overlay */}
        {showXP && (
          <View style={styles.xpTextContainer}>
            <Text style={[styles.xpText, { color: progress > 0.5 ? '#fff' : '#333' }]}>
              {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
            </Text>
          </View>
        )}
      </View>

      {/* Level Up Indicator */}
      {isLevelUp && (
        <View style={styles.levelUpIndicator}>
          <Ionicons name="flash" size={16} color="#FFD700" />
          <Text style={styles.levelUpText}>LEVEL UP!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  levelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  xpBarContainer: {
    position: 'relative',
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  xpBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderRadius: 6,
  },
  xpBarProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 6,
  },
  xpBarGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderRadius: 6,
  },
  xpTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xpText: {
    fontSize: 10,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  levelUpIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  levelUpText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default XPBar;
