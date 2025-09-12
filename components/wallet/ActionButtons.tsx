import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface ActionButtonsProps {
  onEarnMore: () => void;
  onRedeem: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEarnMore, onRedeem }) => {
  const redeemGlow = useSharedValue(0);
  const redeemScale = useSharedValue(1);

  React.useEffect(() => {
    // Continuous glow animation for redeem button
    redeemGlow.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
    
    // Subtle scale animation
    redeemScale.value = withRepeat(
      withTiming(1.02, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const redeemAnimatedStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(redeemGlow.value, [0, 1], [0.3, 0.6]);
    
    return {
      shadowOpacity,
      transform: [{ scale: redeemScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Earn More Button */}
      <TouchableOpacity style={styles.earnButton} onPress={onEarnMore}>
        <Ionicons name="add" size={16} color="white" />
        <Text style={styles.buttonText}>Earn More</Text>
      </TouchableOpacity>

      {/* Redeem Button with Glow */}
      <Animated.View style={redeemAnimatedStyle}>
        <TouchableOpacity style={styles.redeemButton} onPress={onRedeem}>
          <View style={styles.confettiContainer}>
            {/* Confetti particles */}
            <View style={[styles.confetti, styles.confetti1]} />
            <View style={[styles.confetti, styles.confetti2]} />
            <View style={[styles.confetti, styles.confetti3]} />
            <View style={[styles.confetti, styles.confetti4]} />
          </View>
          
          <View style={styles.redeemContent}>
            <Ionicons name="leaf" size={16} color="white" />
            <Text style={styles.buttonText}>Redeem</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  earnButton: {
    flex: 1,
    backgroundColor: '#35B87F',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#35B87F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    maxWidth: 160,
  },
  redeemButton: {
    flex: 1,
    backgroundColor: '#35B87F',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#F4C542',
    shadowColor: '#F4C542',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
    maxWidth: 160,
  },
  redeemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
  },
  confetti: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  confetti1: {
    backgroundColor: '#FFD700',
    top: 5,
    right: 8,
  },
  confetti2: {
    backgroundColor: '#FF6B6B',
    top: 8,
    right: 5,
  },
  confetti3: {
    backgroundColor: '#4ECDC4',
    top: 12,
    right: 12,
  },
  confetti4: {
    backgroundColor: '#45B7D1',
    top: 15,
    right: 6,
  },
});

export default ActionButtons;
