import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mission } from '../../types/missions';
import { useTheme } from '../../context/ThemeContext';
import { THEME } from '../../styles/theme';
import { getRoleColor } from '../../utils/roleColors';

interface MissionCardHeaderProps {
  mission: Mission;
  isCompleted?: boolean;
}

const MissionCardHeader: React.FC<MissionCardHeaderProps> = ({
  mission,
  isCompleted = false,
}) => {
  const { theme } = useTheme();
  const roleColor = getRoleColor(mission.requiredRole);
  const urgencyColor = getUrgencyColor(mission.urgency);
  const difficultyColor = getDifficultyColor(mission.difficulty);

  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.textColor }]}>
          {mission.title}
        </Text>
        <View style={[styles.roleBadge, { backgroundColor: roleColor }]}>
          <Text style={styles.roleText}>
            {mission.requiredRole.replace('-', ' ').toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.statusContainer}>
        <View style={[styles.urgencyBadge, { backgroundColor: urgencyColor }]}>
          <Ionicons 
            name={getUrgencyIcon(mission.urgency)} 
            size={12} 
            color="white" 
          />
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
          <Ionicons 
            name={getDifficultyIcon(mission.difficulty)} 
            size={12} 
            color="white" 
          />
        </View>
      </View>
    </View>
  );
};

const getUrgencyColor = (urgency: Mission['urgency']): string => {
  switch (urgency) {
    case 'urgent': return '#FF5722';
    case 'high': return '#FF9800';
    case 'medium': return '#FFC107';
    case 'low': return '#4CAF50';
    default: return '#9E9E9E';
  }
};

const getDifficultyColor = (difficulty: Mission['difficulty']): string => {
  switch (difficulty) {
    case 'easy': return '#4CAF50';
    case 'medium': return '#FF9800';
    case 'hard': return '#F44336';
    default: return '#9E9E9E';
  }
};

const getUrgencyIcon = (urgency: Mission['urgency']): string => {
  switch (urgency) {
    case 'urgent': return 'flash';
    case 'high': return 'trending-up';
    case 'medium': return 'time';
    case 'low': return 'leaf';
    default: return 'help';
  }
};

const getDifficultyIcon = (difficulty: Mission['difficulty']): string => {
  switch (difficulty) {
    case 'easy': return 'checkmark-circle';
    case 'medium': return 'help-circle';
    case 'hard': return 'warning';
    default: return 'help';
  }
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.SPACING.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: THEME.SPACING.sm,
  },
  title: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginBottom: THEME.SPACING.xs,
  },
  roleBadge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: THEME.SPACING.xs,
  },
  urgencyBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MissionCardHeader;
