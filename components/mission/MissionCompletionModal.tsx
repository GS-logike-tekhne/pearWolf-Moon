import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mission } from '../../types/missions';
import { useTheme } from '../../context/ThemeContext';
import { THEME } from '../../styles/theme';
import { getRoleColor } from '../../utils/roleColors';
import { PhotoVerificationResult } from '../../services/photoVerificationService';
import MissionSummary from './MissionSummary';
import MissionVerification from './MissionVerification';
import MissionCompleted from './MissionCompleted';

const { width, height } = Dimensions.get('window');

interface MissionCompletionModalProps {
  visible: boolean;
  mission: Mission | null;
  onClose: () => void;
  onComplete: (missionId: string, verificationResult: PhotoVerificationResult) => void;
  userRole?: string;
}

const MissionCompletionModal: React.FC<MissionCompletionModalProps> = ({
  visible,
  mission,
  onClose,
  onComplete,
  userRole = 'trash-hero',
}) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState<'summary' | 'verification' | 'completed'>('summary');
  const [verificationResult, setVerificationResult] = useState<PhotoVerificationResult | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const roleColor = getRoleColor(userRole);

  const handleStartVerification = () => {
    setCurrentStep('verification');
  };

  const handleVerificationComplete = async (result: PhotoVerificationResult) => {
    setVerificationResult(result);
    
    // Auto-advance to completed step
    setTimeout(() => {
      setCurrentStep('completed');
    }, 1500);
  };

  const handleVerificationFailed = (error: string) => {
    Alert.alert(
      'Verification Failed',
      error,
      [
        { text: 'Try Again', onPress: () => setCurrentStep('verification') },
        { text: 'Cancel', onPress: () => setCurrentStep('summary') },
      ]
    );
  };

  const handleCompleteMission = async () => {
    if (!mission || !verificationResult) return;

    try {
      setIsCompleting(true);
      
      // Simulate mission completion process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onComplete(mission.id, verificationResult);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to complete mission. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('summary');
    setVerificationResult(null);
    setIsCompleting(false);
    onClose();
  };

  const renderCurrentStep = () => {
    if (!mission) return null;

    switch (currentStep) {
      case 'summary':
        return (
          <MissionSummary
            mission={mission}
            onStartVerification={handleStartVerification}
          />
        );
      case 'verification':
        return (
          <MissionVerification
            mission={mission}
            onBack={() => setCurrentStep('summary')}
            onVerificationComplete={handleVerificationComplete}
            onVerificationFailed={handleVerificationFailed}
            userRole={userRole}
          />
        );
      case 'completed':
        return (
          <MissionCompleted
            mission={mission}
            verificationResult={verificationResult!}
            isCompleting={isCompleting}
            onCompleteMission={handleCompleteMission}
          />
        );
      default:
        return (
          <MissionSummary
            mission={mission}
            onStartVerification={handleStartVerification}
          />
        );
    }
  };

  if (!mission) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Ionicons name="close" size={24} color={theme.textColor} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.textColor }]}>
              {mission.title}
            </Text>
            <Text style={[styles.headerLocation, { color: theme.secondaryText }]}>
              {mission.location.name}
            </Text>
          </View>
          
          <View style={[styles.roleBadge, { backgroundColor: roleColor }]}>
            <Text style={styles.roleBadgeText}>{userRole.replace('-', ' ')}</Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderCurrentStep()}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50, // Account for status bar
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerLocation: {
    fontSize: 14,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
  },
});

export default MissionCompletionModal;
