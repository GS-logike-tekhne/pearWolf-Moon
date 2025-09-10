import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

type Props = {
  progress: number; // between 0 and 1
  level: number;
  nextXP: number;
  color?: string;
  showLabel?: boolean;
  showXPText?: boolean;
};

export const XPProgressBar = ({ 
  progress, 
  level, 
  nextXP, 
  color = '#4CAF50',
  showLabel = true,
  showXPText = true 
}: Props) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const barWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={styles.label}>Level {level}</Text>
      )}
      <View style={styles.barBackground}>
        <Animated.View 
          style={[
            styles.barFill, 
            { 
              width: barWidth,
              backgroundColor: color 
            }
          ]} 
        />
      </View>
      {showXPText && (
        <Text style={styles.xpText}>
          {Math.floor(progress * nextXP)} / {nextXP} XP
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  barBackground: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: 10,
    borderRadius: 6,
  },
  xpText: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
});
