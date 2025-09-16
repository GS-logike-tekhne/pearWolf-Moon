import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LiveUser } from '../../services/realTimeUserService';
import { useTheme } from '../../context/ThemeContext';
import { getRoleColor } from '../../utils/roleColors';

interface LiveUserMarkerProps {
  user: LiveUser;
  onPress?: (user: LiveUser) => void;
  showStatus?: boolean;
  showMission?: boolean;
}

const LiveUserMarker: React.FC<LiveUserMarkerProps> = ({
  user,
  onPress,
  showStatus = true,
  showMission = true,
}) => {
  const { theme } = useTheme();
  const roleColor = getRoleColor(user.role);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for active users
    if (user.status === 'working' || user.status === 'traveling') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Bounce animation for status changes
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [user.status, pulseAnim, bounceAnim]);

  const getStatusColor = (): string => {
    switch (user.status) {
      case 'working':
        return '#4CAF50';
      case 'traveling':
        return '#FF9800';
      case 'completed':
        return '#2196F3';
      case 'idle':
        return '#9E9E9E';
      case 'offline':
        return '#757575';
      default:
        return roleColor;
    }
  };

  const getStatusIcon = (): string => {
    switch (user.status) {
      case 'working':
        return 'hammer';
      case 'traveling':
        return 'walk';
      case 'completed':
        return 'checkmark-circle';
      case 'idle':
        return 'pause-circle';
      case 'offline':
        return 'radio-button-off';
      default:
        return 'person';
    }
  };

  const getStatusText = (): string => {
    switch (user.status) {
      case 'working':
        return 'Working';
      case 'traveling':
        return 'Traveling';
      case 'completed':
        return 'Completed';
      case 'idle':
        return 'Idle';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const formatLastSeen = (): string => {
    const now = new Date();
    const diff = now.getTime() - user.lastSeen.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const renderUserAvatar = () => (
    <Animated.View
      style={[
        styles.avatarContainer,
        {
          backgroundColor: roleColor,
          transform: [
            { scale: pulseAnim },
            { 
              translateY: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -5],
              }),
            },
          ],
        },
      ]}
    >
      <Ionicons
        name="person"
        size={16}
        color="white"
      />
    </Animated.View>
  );

  const renderStatusIndicator = () => {
    if (!showStatus) return null;

    return (
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}>
        <Ionicons
          name={getStatusIcon() as any}
          size={10}
          color="white"
        />
      </View>
    );
  };

  const renderMissionProgress = () => {
    if (!showMission || !user.currentMission) return null;

    return (
      <View style={[styles.missionContainer, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.missionTitle, { color: theme.textColor }]} numberOfLines={1}>
          {user.currentMission.title}
        </Text>
        <View style={[styles.progressBar, { backgroundColor: theme.borderColor }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: getStatusColor(),
                width: `${user.currentMission.progress}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.secondaryText }]}>
          {user.currentMission.progress}%
        </Text>
      </View>
    );
  };

  const renderUserInfo = () => (
    <View style={[styles.userInfoContainer, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.userHeader}>
        <Text style={[styles.username, { color: theme.textColor }]}>
          {user.username}
        </Text>
        {user.level && (
          <View style={[styles.levelBadge, { backgroundColor: roleColor }]}>
            <Text style={styles.levelText}>Lv.{user.level}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.userDetails}>
        <Text style={[styles.roleText, { color: roleColor }]}>
          {user.role.replace('-', ' ').toUpperCase()}
        </Text>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>

      {user.xp && (
        <View style={styles.xpContainer}>
          <Ionicons name="star" size={12} color={theme.primary} />
          <Text style={[styles.xpText, { color: theme.textColor }]}>
            {user.xp.toLocaleString()} XP
          </Text>
        </View>
      )}

      <Text style={[styles.lastSeenText, { color: theme.secondaryText }]}>
        {formatLastSeen()}
      </Text>

      {renderMissionProgress()}
    </View>
  );

  return (
    <Marker
      coordinate={{
        latitude: user.location.latitude,
        longitude: user.location.longitude,
      }}
      onPress={() => onPress?.(user)}
      tracksViewChanges={false} // Optimize performance
    >
      <View style={styles.markerContainer}>
        {renderUserAvatar()}
        {renderStatusIndicator()}
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  statusIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfoContainer: {
    position: 'absolute',
    bottom: 40,
    left: -100,
    width: 200,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  levelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lastSeenText: {
    fontSize: 10,
    marginBottom: 8,
  },
  missionContainer: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  missionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    textAlign: 'center',
  },
});

export default LiveUserMarker;
