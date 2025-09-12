import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProximityAlert } from '../../services/liveMapService';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

interface ProximityNotificationProps {
  alert: ProximityAlert;
  onPress: () => void;
  onDismiss: () => void;
}

const ProximityNotification: React.FC<ProximityNotificationProps> = ({
  alert,
  onPress,
  onDismiss,
}) => {
  const { theme } = useTheme();
  
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Slide in animation
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    // Pulse animation for nearby missions
    if (alert.type === 'mission_nearby') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  const getNotificationConfig = () => {
    switch (alert.type) {
      case 'mission_nearby':
        return {
          icon: 'location',
          title: 'Mission Nearby!',
          message: `You're ${Math.round(alert.distance)}m from a cleanup mission`,
          color: theme.success,
          backgroundColor: theme.success + '20',
        };
      case 'mission_entered':
        return {
          icon: 'checkmark-circle',
          title: 'Mission Zone Entered',
          message: 'You\'ve entered a mission area!',
          color: theme.primary,
          backgroundColor: theme.primary + '20',
        };
      case 'mission_exited':
        return {
          icon: 'exit',
          title: 'Mission Zone Exited',
          message: 'You\'ve left the mission area',
          color: theme.secondaryText,
          backgroundColor: theme.secondaryText + '20',
        };
      default:
        return {
          icon: 'information-circle',
          title: 'Notification',
          message: 'You have a new notification',
          color: theme.primary,
          backgroundColor: theme.primary + '20',
        };
    }
  };

  const config = getNotificationConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBackground,
          borderLeftColor: config.color,
          transform: [
            { translateY: slideAnim },
            { scale: pulseAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: config.backgroundColor }]}>
          <Ionicons
            name={config.icon as any}
            size={24}
            color={config.color}
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.textColor }]}>
            {config.title}
          </Text>
          <Text style={[styles.message, { color: theme.secondaryText }]}>
            {config.message}
          </Text>
        </View>

        {/* Distance Badge */}
        <View style={[styles.distanceBadge, { backgroundColor: config.color }]}>
          <Text style={styles.distanceText}>
            {Math.round(alert.distance)}m
          </Text>
        </View>
      </TouchableOpacity>

      {/* Dismiss Button */}
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={handleDismiss}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={16} color={theme.secondaryText} />
      </TouchableOpacity>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor: config.color,
              width: slideAnim.interpolate({
                inputRange: [-100, 0],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  distanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  distanceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  dismissButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});

export default ProximityNotification;
