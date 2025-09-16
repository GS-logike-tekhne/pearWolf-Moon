import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../hooks/useXP';
import { UserRole } from '../types/roles';
import { THEME } from '../styles/theme';

const { width } = Dimensions.get('window');

interface UnifiedHeaderProps {
  onMenuPress: () => void;
  role: UserRole;
  onNotificationPress: () => void;
  onProfilePress: () => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  onMenuPress,
  role,
  onNotificationPress,
  onProfilePress,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { currentLevel } = useXP();

  // Get role-based colors
  const getRoleColor = (userRole: UserRole): string => {
    switch (userRole) {
      case 'TRASH_HERO':
        return '#4CAF50';
      case 'IMPACT_WARRIOR':
        return '#dc2626';
      case 'ECO_DEFENDER':
        return '#2196F3';
      case 'ADMIN':
        return '#9C27B0';
      default:
        return theme.primary;
    }
  };

  const roleColor = getRoleColor(role);
  const roleInitial = role.charAt(0);

  return (
    <View style={[styles.header, { backgroundColor: 'white' }]}>
      <View style={styles.headerContent}>
        {/* Left - Menu Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>

        {/* Center - PEAR Button (shifted right) */}
        <View style={styles.headerCenter}>
          <TouchableOpacity
            style={[styles.pearButton, { backgroundColor: roleColor }]}
            activeOpacity={0.7}
          >
            <Text style={styles.pearText}>PEAR</Text>
          </TouchableOpacity>
        </View>

        {/* Right - Notifications & Profile */}
        <View style={styles.headerRight}>
          {/* Notifications */}
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications" size={20} color="black" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
          
              {/* Profile */}
              <TouchableOpacity
                style={styles.profileButton}
                onPress={onProfilePress}
                activeOpacity={0.7}
              >
                <View style={[styles.profileIcon, { backgroundColor: roleColor }]}>
                  <Ionicons name="person" size={20} color="white" />
                </View>
              </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 50,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-end',
  },
  menuButton: {
    padding: 8,
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
      profileButton: {
        padding: 8,
      },
      profileIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
      },
      pearButton: {
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
      },
      pearText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
});

export default UnifiedHeader;
 