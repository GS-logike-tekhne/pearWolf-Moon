import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getRoleColor } from '../utils/roleColors';

interface UnifiedHeaderProps {
  onMenuPress: () => void;
  role?: string;
  points?: number;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  onMenuPress,
  role,
  points = 2450,
  onNotificationPress,
  onProfilePress,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  // Get role-specific configuration
  const getRoleConfig = () => {
    const userRole = role || user?.role || 'admin';
    const normalizedRole = userRole.toUpperCase();
    
    switch (normalizedRole) {
      case 'TRASH_HERO':
      case 'TRASH-HERO':
        return { color: getRoleColor('trash-hero'), points: points };
      case 'VOLUNTEER':
      case 'IMPACT_WARRIOR':
      case 'IMPACT-WARRIOR':
        return { color: getRoleColor('impact-warrior'), points: points };
      case 'BUSINESS':
      case 'ECO_DEFENDER':
      case 'ECO-DEFENDER':
        return { color: getRoleColor('business'), points: points };
      case 'ADMIN':
        return { color: getRoleColor('admin'), points: points };
      default:
        return { color: getRoleColor('admin'), points: points };
    }
  };

  const roleConfig = getRoleConfig();

  return (
    <View style={[styles.header, { backgroundColor: theme.background }]}>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={onMenuPress}
      >
        <Ionicons name="menu" size={24} color={theme.textColor} />
      </TouchableOpacity>
      
      <View style={[styles.pearLogo, { backgroundColor: roleConfig.color }]}>
        <Text style={styles.pearText}>PEAR</Text>
      </View>
      
      <View style={styles.headerRight}>
        <View style={styles.pointsContainer}>
          <Ionicons name="star" size={16} color="#ffc107" />
          <Text style={[styles.pointsText, { color: theme.textColor }]}>
            {roleConfig.points.toLocaleString()}
          </Text>
          <Ionicons name="help-circle" size={16} color={theme.secondaryText} />
        </View>
        
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={onNotificationPress}
        >
          <Ionicons name="notifications" size={20} color={theme.textColor} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.profileButton, { backgroundColor: roleConfig.color }]}
          onPress={onProfilePress}
        >
          <Ionicons name="person" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuButton: {
    padding: 8,
  },
  pearLogo: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pearText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UnifiedHeader;