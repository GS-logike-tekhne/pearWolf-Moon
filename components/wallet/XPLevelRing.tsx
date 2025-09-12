import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface XPLevelRingProps {
  level: number;
  progress: number; // 0-1
  size?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const XPLevelRing: React.FC<XPLevelRingProps> = ({ 
  level, 
  progress, 
  size = 80 
}) => {
  const animatedProgress = useSharedValue(0);
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeWidth = 6;

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 1500 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const strokeDashoffset = interpolate(
      animatedProgress.value,
      [0, 1],
      [circumference, 0]
    );

    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2D5A3D"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={animatedStyle}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4C542" />
            <stop offset="100%" stopColor="#FF6A00" />
          </linearGradient>
        </defs>
      </Svg>
      
      {/* Level text */}
      <View style={styles.textContainer}>
        <Text style={styles.levelLabel}>Level</Text>
        <Text style={styles.levelNumber}>{level}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: '#0C3F1A',
    borderRadius: 50,
    padding: 8,
    minWidth: 60,
    minHeight: 60,
    justifyContent: 'center',
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginBottom: -2,
  },
  levelNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
});

export default XPLevelRing;
