import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MissionPin as MissionPinType } from '../../services/liveMapService';
import { useTheme } from '../../context/ThemeContext';
import { getRoleColor } from '../../utils/roleColors';

interface MissionPinProps {
  mission: MissionPinType;
  onPress: (mission: MissionPinType) => void;
  size?: 'small' | 'medium' | 'large';
}

const MissionPin: React.FC<MissionPinProps> = ({
  mission,
  onPress,
  size = 'medium',
}) => {
  const { theme } = useTheme();
  const roleColor = getRoleColor(mission.role);

  const getStatusColor = () => {
    switch (mission.status) {
      case 'available':
        return roleColor;
      case 'in_progress':
        return '#FF9800';
      case 'completed':
        return '#4CAF50';
      case 'expired':
        return '#9E9E9E';
      default:
        return roleColor;
    }
  };

  const getStatusIcon = () => {
    switch (mission.status) {
      case 'available':
        return 'play-circle';
      case 'in_progress':
        return 'hourglass';
      case 'completed':
        return 'checkmark-circle';
      case 'expired':
        return 'close-circle';
      default:
        return 'play-circle';
    }
  };

  const getPriorityIcon = () => {
    switch (mission.priority) {
      case 'urgent':
        return 'flash';
      case 'high':
        return 'trending-up';
      case 'medium':
        return 'time';
      case 'low':
        return 'leaf';
      default:
        return 'time';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          icon: styles.smallIcon,
          text: styles.smallText,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          icon: styles.largeIcon,
          text: styles.largeText,
        };
      default:
        return {
          container: styles.mediumContainer,
          icon: styles.mediumIcon,
          text: styles.mediumText,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const statusColor = getStatusColor();

  return (
    <TouchableOpacity
      style={[
        styles.pinContainer,
        sizeStyles.container,
        { backgroundColor: statusColor },
      ]}
      onPress={() => onPress(mission)}
      activeOpacity={0.8}
    >
      {/* Status Icon */}
      <Ionicons
        name={getStatusIcon() as any}
        size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
        color="white"
        style={sizeStyles.icon}
      />

      {/* Priority Indicator */}
      {mission.priority === 'urgent' && (
        <View style={styles.priorityIndicator}>
          <Ionicons
            name={getPriorityIcon() as any}
            size={12}
            color="white"
          />
        </View>
      )}

      {/* Participant Count */}
      {mission.participants > 0 && (
        <View style={styles.participantBadge}>
          <Text style={styles.participantText}>{mission.participants}</Text>
        </View>
      )}

      {/* Distance Indicator */}
      {mission.distance && (
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>
            {mission.distance < 1000 
              ? `${Math.round(mission.distance)}m` 
              : `${(mission.distance / 1000).toFixed(1)}km`
            }
          </Text>
        </View>
      )}

      {/* Pulse Animation for Available Missions */}
      {mission.status === 'available' && (
        <View style={[styles.pulseRing, { borderColor: statusColor }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pinContainer: {
    position: 'relative',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  smallContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  mediumContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  largeContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  smallIcon: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  mediumIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  largeIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  smallText: {
    fontSize: 8,
  },
  mediumText: {
    fontSize: 10,
  },
  largeText: {
    fontSize: 12,
  },
  priorityIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF5722',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  participantText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: -8,
    left: -8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  distanceText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '600',
  },
  pulseRing: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 28,
    borderWidth: 2,
    opacity: 0.6,
  },
});

export default MissionPin;
