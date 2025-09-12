import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import { getRoleColor } from '../../utils/roleColors';
import { normalizeRole } from '../../types/roles';

interface NotificationBadgeProps {
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
  animated?: boolean;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  onPress,
  size = 'medium',
  showCount = true,
  animated = true,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const userRole = normalizeRole(user?.role || 'trash-hero');
  const roleColor = getRoleColor(userRole);
  
  const [unreadCount, setUnreadCount] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  const { analytics, isInitialized } = useNotifications();

  useEffect(() => {
    if (isInitialized && analytics) {
      // Calculate unread notifications based on analytics
      // In a real app, you'd get this from your backend
      const mockUnreadCount = Math.floor(Math.random() * 5); // Mock data
      setUnreadCount(mockUnreadCount);
    }
  }, [analytics, isInitialized]);

  useEffect(() => {
    if (animated && unreadCount > 0) {
      // Pulse animation for new notifications
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
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
  }, [unreadCount, animated, pulseAnim]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          icon: styles.smallIcon,
          badge: styles.smallBadge,
          badgeText: styles.smallBadgeText,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          icon: styles.largeIcon,
          badge: styles.largeBadge,
          badgeText: styles.largeBadgeText,
        };
      default:
        return {
          container: styles.mediumContainer,
          icon: styles.mediumIcon,
          badge: styles.mediumBadge,
          badgeText: styles.mediumBadgeText,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const renderBadge = () => {
    if (!showCount || unreadCount === 0) return null;

    return (
      <View style={[sizeStyles.badge, { backgroundColor: theme.error }]}>
        <Text style={[sizeStyles.badgeText, { color: 'white' }]}>
          {unreadCount > 99 ? '99+' : unreadCount.toString()}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[sizeStyles.container, { backgroundColor: 'transparent' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: animated ? pulseAnim : 1 }],
          },
        ] as any}
      >
        <Ionicons
          name="notifications"
          size={size === 'small' ? 20 : size === 'large' ? 32 : 24}
          color={theme.textColor}
          style={sizeStyles.icon}
        />
        {renderBadge()}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  smallContainer: {
    width: 32,
    height: 32,
  },
  mediumContainer: {
    width: 40,
    height: 40,
  },
  largeContainer: {
    width: 48,
    height: 48,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallIcon: {
    // Icon styles handled by Ionicons component
  },
  mediumIcon: {
    // Icon styles handled by Ionicons component
  },
  largeIcon: {
    // Icon styles handled by Ionicons component
  },
  smallBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  mediumBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  largeBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  smallBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  mediumBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  largeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default NotificationBadge;
