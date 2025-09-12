import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { THEME } from '../../styles/theme';
import { getRoleColor } from '../../utils/roleColors';
import { PhotoVerificationResult } from '../../services/photoVerificationService';
import MissionPhotoVerification from './MissionPhotoVerification';

const { width, height } = Dimensions.get('window');

interface Mission {
  id: string;
  title: string;
  description: string;
  location: string;
  xpReward: number;
  ecoPointsReward: number;
  role: string;
}

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

  const renderSummaryStep = () => (
    <View style={styles.stepContainer}>
      {/* Mission Summary */}
      <View style={styles.missionSummary}>
        <View style={styles.missionHeader}>
          <Ionicons name="checkmark-circle" size={24} color={theme.success} />
          <Text style={[styles.missionTitle, { color: theme.textColor }]}>
            Mission Completed!
          </Text>
        </View>
        
        <Text style={[styles.missionDescription, { color: theme.secondaryText }]}>
          {mission?.description}
        </Text>

        <View style={styles.rewardsContainer}>
          <View style={[styles.rewardItem, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="star" size={20} color={theme.primary} />
            <Text style={[styles.rewardText, { color: theme.textColor }]}>
              {mission?.xpReward} XP
            </Text>
          </View>
          
          <View style={[styles.rewardItem, { backgroundColor: roleColor + '20' }]}>
            <Ionicons name="leaf" size={20} color={roleColor} />
            <Text style={[styles.rewardText, { color: theme.textColor }]}>
              {mission?.ecoPointsReward} Eco Points
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
        onPress={handleStartVerification}
      >
        <Ionicons name="camera" size={20} color="white" />
        <Text style={styles.primaryButtonText}>Verify with Photos</Text>
      </TouchableOpacity>
    </View>
  );

  const renderVerificationStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.verificationHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentStep('summary')}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.verificationTitle, { color: theme.textColor }]}>
          Photo Verification
        </Text>
      </View>

      <ScrollView style={styles.verificationContent}>
        <MissionPhotoVerification
          missionId={mission?.id || ''}
          userId="current_user" // This would come from auth context
          onVerificationComplete={handleVerificationComplete}
          onVerificationFailed={handleVerificationFailed}
          role={userRole}
        />
      </ScrollView>
    </View>
  );

  const renderCompletedStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.completedContainer}>
        <View style={[styles.successIcon, { backgroundColor: theme.success }]}>
          <Ionicons name="checkmark" size={48} color="white" />
        </View>
        
        <Text style={[styles.completedTitle, { color: theme.textColor }]}>
          Verification Successful!
        </Text>
        
        <Text style={[styles.completedSubtitle, { color: theme.secondaryText }]}>
          Your mission completion has been verified with {verificationResult?.confidence}% confidence.
        </Text>

        <View style={styles.finalRewardsContainer}>
          <View style={[styles.finalRewardItem, { backgroundColor: theme.primary }]}>
            <Ionicons name="star" size={24} color="white" />
            <Text style={styles.finalRewardText}>+{mission?.xpReward} XP</Text>
          </View>
          
          <View style={[styles.finalRewardItem, { backgroundColor: roleColor }]}>
            <Ionicons name="leaf" size={24} color="white" />
            <Text style={styles.finalRewardText}>+{mission?.ecoPointsReward} Eco Points</Text>
          </View>
        </View>

        {/* Suggestions */}
        {verificationResult?.suggestions && verificationResult.suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={[styles.suggestionsTitle, { color: theme.textColor }]}>
              Suggestions for Next Time:
            </Text>
            {verificationResult.suggestions.map((suggestion, index) => (
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
        onPress={handleCompleteMission}
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'summary':
        return renderSummaryStep();
      case 'verification':
        return renderVerificationStep();
      case 'completed':
        return renderCompletedStep();
      default:
        return renderSummaryStep();
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
              {mission.location}
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
  stepContainer: {
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
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
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
});

export default MissionCompletionModal;
