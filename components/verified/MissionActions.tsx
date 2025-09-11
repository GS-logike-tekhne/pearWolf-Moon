import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { sharedStyles } from '../../styles/shared';
import { THEME } from '../../styles/theme';
import LevelUpModal from '../LevelUpModal';
import { useVerifiedMissions } from '../../hooks/useVerifiedMissions';

interface MissionActionsProps {
  mission: {
    title: string;
  };
  isJoined: boolean;
  onJoin: () => void;
}

const MissionActions: React.FC<MissionActionsProps> = ({ 
  mission, 
  isJoined, 
  onJoin 
}) => {
  const { theme } = useTheme();
  const {
    showLevelUpModal,
    handleCompleteMission,
    closeLevelUpModal
  } = useVerifiedMissions();

  return (
    <>
      <View style={styles.actionButtons}>
        {!isJoined ? (
          <TouchableOpacity 
            style={[
              sharedStyles.button,
              sharedStyles.primaryButton,
              { backgroundColor: theme.primary }
            ]}
            onPress={onJoin}
          >
            <Ionicons name="people" size={20} color="white" />
            <Text style={[sharedStyles.buttonText, { color: 'white' }]}>
              Join This Mission
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.joinedState}>
            <TouchableOpacity 
              style={[
                sharedStyles.button,
                sharedStyles.successButton,
                { backgroundColor: theme.success }
              ]}
              onPress={handleCompleteMission}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={[sharedStyles.buttonText, { color: 'white' }]}>
                Mark Complete
              </Text>
            </TouchableOpacity>
            
            <View style={[
              sharedStyles.badge,
              { backgroundColor: theme.success },
              styles.joinedBadge
            ]}>
              <Ionicons name="checkmark" size={16} color="white" />
              <Text style={[sharedStyles.badgeText, { marginLeft: THEME.SPACING.xs }]}>
                Joined
              </Text>
            </View>
          </View>
        )}
      </View>

      <LevelUpModal
        visible={showLevelUpModal}
        onClose={closeLevelUpModal}
        newLevel={5} // This would come from XP context
        xpGained={250}
      />
    </>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    padding: THEME.SPACING.md,
  },
  joinedState: {
    alignItems: 'center',
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: THEME.BORDER_RADIUS.full,
    marginTop: THEME.SPACING.md,
  },
});

export default MissionActions;
