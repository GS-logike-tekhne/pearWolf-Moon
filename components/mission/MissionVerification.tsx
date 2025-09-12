import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mission } from '../../types/missions';
import { useTheme } from '../../context/ThemeContext';
import { THEME } from '../../styles/theme';
import { CleanupVerificationResult } from '../../services/verification';
import MissionPhotoVerification from './MissionPhotoVerification';

interface MissionVerificationProps {
  mission: Mission;
  onBack: () => void;
  onVerificationComplete: (result: CleanupVerificationResult) => void;
  onVerificationFailed: (error: string) => void;
  userRole: string;
}

const MissionVerification: React.FC<MissionVerificationProps> = ({
  mission,
  onBack,
  onVerificationComplete,
  onVerificationFailed,
  userRole,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.verificationHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.verificationTitle, { color: theme.textColor }]}>
          Photo Verification
        </Text>
      </View>

      <ScrollView style={styles.verificationContent}>
        <MissionPhotoVerification
          missionId={mission.id}
          userId="current_user" // This would come from auth context
          onVerificationComplete={onVerificationComplete}
          onVerificationFailed={onVerificationFailed}
          role={userRole}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  verificationTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  verificationContent: {
    flex: 1,
  },
});

export default MissionVerification;
