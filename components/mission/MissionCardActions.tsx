import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mission } from '../../types/missions';
import { useTheme } from '../../context/ThemeContext';
import { THEME } from '../../styles/theme';
import { getRoleColor } from '../../utils/roleColors';

interface MissionCardActionsProps {
  mission: Mission;
  isAccepted: boolean;
  isCompleted: boolean;
  onAccept: () => void;
  onComplete: () => void;
  disabled?: boolean;
}

const MissionCardActions: React.FC<MissionCardActionsProps> = ({
  mission,
  isAccepted,
  isCompleted,
  onAccept,
  onComplete,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const roleColor = getRoleColor(mission.requiredRole);

  if (isCompleted) {
    return (
      <View style={[styles.completedBadge, { backgroundColor: '#4CAF50' }]}>
        <Ionicons name="checkmark-circle" size={16} color="white" />
        <Text style={styles.completedText}>Mission Complete!</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        { 
          backgroundColor: isAccepted ? '#FF9800' : roleColor,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={isAccepted ? onComplete : onAccept}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Ionicons 
        name={isAccepted ? 'checkmark' : 'play'} 
        size={16} 
        color="white" 
      />
      <Text style={styles.actionButtonText}>
        {isAccepted ? 'Complete Mission' : 'Accept Mission'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.SPACING.sm,
    paddingHorizontal: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.md,
    gap: THEME.SPACING.xs,
  },
  actionButtonText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.SPACING.sm,
    paddingHorizontal: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.md,
    gap: THEME.SPACING.xs,
  },
  completedText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
});

export default MissionCardActions;
