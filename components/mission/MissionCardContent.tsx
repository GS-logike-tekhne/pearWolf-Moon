import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mission } from '../../types/missions';
import { useTheme } from '../../context/ThemeContext';
import { THEME } from '../../styles/theme';
import { getRoleColor } from '../../utils/roleColors';

interface MissionCardContentProps {
  mission: Mission;
}

const MissionCardContent: React.FC<MissionCardContentProps> = ({ mission }) => {
  const { theme } = useTheme();
  const roleColor = getRoleColor(mission.requiredRole);

  return (
    <View style={styles.content}>
      {/* Description */}
      <Text style={[styles.description, { color: theme.secondaryText }]}>
        {mission.description}
      </Text>

      {/* Details Row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={14} color={theme.secondaryText} />
          <Text style={[styles.detailText, { color: theme.secondaryText }]}>
            {mission.location.name}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="time" size={14} color={theme.secondaryText} />
          <Text style={[styles.detailText, { color: theme.secondaryText }]}>
            {formatDuration(mission.estimatedDuration)}
          </Text>
        </View>
      </View>

      {/* Rewards */}
      <View style={styles.rewardsContainer}>
        <View style={styles.rewardItem}>
          <Text style={[styles.rewardIcon, { color: roleColor }]}>⭐</Text>
          <Text style={[styles.rewardText, { color: theme.textColor }]}>
            {mission.xpReward} XP
          </Text>
        </View>
        
        <View style={styles.rewardItem}>
          <Text style={[styles.rewardIcon, { color: roleColor }]}>🍐</Text>
          <Text style={[styles.rewardText, { color: theme.textColor }]}>
            {mission.ecoPointsReward} Eco Points
          </Text>
        </View>
        
        {mission.badgeReward && (
          <View style={styles.rewardItem}>
            <Text style={[styles.rewardIcon, { color: roleColor }]}>🏆</Text>
            <Text style={[styles.rewardText, { color: theme.textColor }]}>
              {mission.badgeReward}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

const styles = StyleSheet.create({
  content: {
    marginBottom: THEME.SPACING.md,
  },
  description: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    lineHeight: 20,
    marginBottom: THEME.SPACING.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: THEME.SPACING.sm,
    gap: THEME.SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.xs,
  },
  detailText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
  },
  rewardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.SPACING.sm,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.xs,
  },
  rewardIcon: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
  },
  rewardText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
});

export default MissionCardContent;
