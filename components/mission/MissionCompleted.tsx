import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mission } from '../../types/missions';
import { CleanupVerificationResult } from '../../services/verification';
import { useTheme } from '../../context/ThemeContext';
import { THEME } from '../../styles/theme';
import { getRoleColor } from '../../utils/roleColors';

interface MissionCompletedProps {
  mission: Mission;
  verificationResult: CleanupVerificationResult;
  isCompleting: boolean;
  onCompleteMission: () => void;
}

const MissionCompleted: React.FC<MissionCompletedProps> = ({
  mission,
  verificationResult,
  isCompleting,
  onCompleteMission,
}) => {
  const { theme } = useTheme();
  const roleColor = getRoleColor(mission.requiredRole);

  return (
    <View style={styles.container}>
      <View style={styles.completedContainer}>
        <View style={[styles.successIcon, { backgroundColor: theme.success }]}>
          <Ionicons name="checkmark" size={48} color="white" />
        </View>
        
        <Text style={[styles.completedTitle, { color: theme.textColor }]}>
          Verification Successful!
        </Text>
        
        <Text style={[styles.completedSubtitle, { color: theme.secondaryText }]}>
          Your mission completion has been verified with {verificationResult.confidence}% confidence.
        </Text>

        <View style={styles.finalRewardsContainer}>
          <View style={[styles.finalRewardItem, { backgroundColor: theme.primary }]}>
            <Ionicons name="star" size={24} color="white" />
            <Text style={styles.finalRewardText}>+{mission.xpReward} XP</Text>
          </View>
          
          <View style={[styles.finalRewardItem, { backgroundColor: roleColor }]}>
            <Ionicons name="leaf" size={24} color="white" />
            <Text style={styles.finalRewardText}>+{mission.ecoPointsReward} Eco Points</Text>
          </View>
        </View>

        {/* Suggestions */}
        {verificationResult.details.recommendations && verificationResult.details.recommendations.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={[styles.suggestionsTitle, { color: theme.textColor }]}>
              Suggestions for Next Time:
            </Text>
            {verificationResult.details.recommendations.map((suggestion: string, index: number) => (
              <Text key={index} style={[styles.suggestionText, { color: theme.secondaryText }]}>
                • {suggestion}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: roleColor }]}
        onPress={onCompleteMission}
        disabled={isCompleting}
      >
        {isCompleting ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Complete Mission</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  completedContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  completedSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  finalRewardsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  finalRewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  finalRewardText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
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

export default MissionCompleted;
