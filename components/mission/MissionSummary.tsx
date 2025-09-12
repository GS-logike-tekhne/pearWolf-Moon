import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mission } from '../../types/missions';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../../styles/theme';
import { getRoleColor } from '../../utils/roleColors';

interface MissionSummaryProps {
  mission: Mission;
  onStartVerification: () => void;
}

const MissionSummary: React.FC<MissionSummaryProps> = ({
  mission,
  onStartVerification,
}) => {
  const { theme } = useTheme();
  const roleColor = getRoleColor(mission.requiredRole);

  return (
    <View style={styles.container}>
      {/* Mission Summary */}
      <View style={styles.missionSummary}>
        <View style={styles.missionHeader}>
          <Ionicons name="checkmark-circle" size={24} color={theme.success} />
          <Text style={[styles.missionTitle, { color: theme.textColor }]}>
            Mission Completed!
          </Text>
        </View>
        
        <Text style={[styles.missionDescription, { color: theme.secondaryText }]}>
          {mission.description}
        </Text>

        <View style={styles.rewardsContainer}>
          <View style={[styles.rewardItem, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="star" size={20} color={theme.primary} />
            <Text style={[styles.rewardText, { color: theme.textColor }]}>
              {mission.xpReward} XP
            </Text>
          </View>
          
          <View style={[styles.rewardItem, { backgroundColor: roleColor + '20' }]}>
            <Ionicons name="leaf" size={20} color={roleColor} />
            <Text style={[styles.rewardText, { color: theme.textColor }]}>
              {mission.ecoPointsReward} Eco Points
            </Text>
          </View>
        </View>
      </View>

      {/* Next Steps */}
      <View style={styles.nextStepsContainer}>
        <Text style={[styles.nextStepsTitle, { color: theme.textColor }]}>
          Next Steps
        </Text>
        
        <View style={styles.stepItem}>
          <View style={[styles.stepIcon, { backgroundColor: roleColor }]}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <Text style={[styles.stepText, { color: theme.textColor }]}>
            Verify completion with photos
          </Text>
        </View>
        
        <View style={styles.stepItem}>
          <View style={[styles.stepIcon, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.stepNumber, { color: theme.secondaryText }]}>2</Text>
          </View>
          <Text style={[styles.stepText, { color: theme.secondaryText }]}>
            Receive XP and Eco Points
          </Text>
        </View>
        
        <View style={styles.stepItem}>
          <View style={[styles.stepIcon, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.stepNumber, { color: theme.secondaryText }]}>3</Text>
          </View>
          <Text style={[styles.stepText, { color: theme.secondaryText }]}>
            Track your impact
          </Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: roleColor }]}
        onPress={onStartVerification}
      >
        <Ionicons name="camera" size={20} color="white" />
        <Text style={styles.primaryButtonText}>Verify with Photos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  missionSummary: {
    marginBottom: 24,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  missionTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  missionDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  rewardsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextStepsContainer: {
    marginBottom: 24,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MissionSummary;
