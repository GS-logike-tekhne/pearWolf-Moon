import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useXP } from '../context/XPContext';
import PhotoUpload from './PhotoUpload';
import { isVerificationRequired } from '../utils/VerifyCleanup';

interface MissionCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  mission: {
    id: string;
    title: string;
    description: string;
    type: string;
    reward: {
      ecoPoints: number;
      xp: number;
      cash?: number;
    };
  };
  onComplete: (completionData: {
    photos: string[];
    notes: string;
    actualDuration?: number;
  }) => Promise<void>;
}

const MissionCompletionModal: React.FC<MissionCompletionModalProps> = ({
  visible,
  onClose,
  mission,
  onComplete,
}) => {
  const { theme } = useTheme();
  const { addXP } = useXP();
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [actualDuration, setActualDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const verificationRequired = isVerificationRequired(mission.type, mission.reward.ecoPoints);

  const handleComplete = async () => {
    if (verificationRequired && photos.length < 2) {
      Alert.alert(
        'Verification Required',
        'This mission requires before and after photos for AI verification. Please add both photos.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (photos.length === 0) {
      Alert.alert(
        'Photos Required',
        'Please add at least one photo to verify mission completion.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsSubmitting(true);
      
      const completionData = {
        photos,
        notes: notes.trim(),
        actualDuration: actualDuration ? parseInt(actualDuration) : undefined,
      };

      await onComplete(completionData);
      
      // Add XP reward
      addXP(mission.reward.xp, `mission-${mission.id}`);
      
      // Show success message
      Alert.alert(
        'Mission Completed! 🎉',
        `You earned ${mission.reward.xp} XP and ${mission.reward.ecoPoints} EcoPoints!`,
        [
          {
            text: 'Awesome!',
            onPress: () => {
              handleClose();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error completing mission:', error);
      Alert.alert(
        'Error',
        'Failed to complete mission. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPhotos([]);
    setNotes('');
    setActualDuration('');
    onClose();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

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
          <TouchableOpacity onPress={handleClose} disabled={isSubmitting}>
            <Ionicons name="close" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>
            Complete Mission
          </Text>
          <TouchableOpacity
            onPress={handleComplete}
            disabled={isSubmitting || photos.length === 0}
            style={[
              styles.completeButton,
              { 
                backgroundColor: photos.length > 0 ? theme.primary : theme.borderColor,
                opacity: isSubmitting ? 0.6 : 1,
              }
            ]}
          >
            <Text style={styles.completeButtonText}>
              {isSubmitting ? 'Submitting...' : 'Complete'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Mission Info */}
          <View style={[styles.missionCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.missionTitle, { color: theme.textColor }]}>
              {mission.title}
            </Text>
            <Text style={[styles.missionDescription, { color: theme.secondaryText }]}>
              {mission.description}
            </Text>
            
            <View style={styles.rewardsContainer}>
              <View style={styles.rewardItem}>
                <Ionicons name="star" size={16} color="#007bff" />
                <Text style={[styles.rewardText, { color: theme.textColor }]}>
                  +{mission.reward.xp} XP
                </Text>
              </View>
              <View style={styles.rewardItem}>
                <Ionicons name="leaf" size={16} color="#28A745" />
                <Text style={[styles.rewardText, { color: theme.textColor }]}>
                  +{mission.reward.ecoPoints} EcoPoints
                </Text>
              </View>
              {mission.reward.cash && (
                <View style={styles.rewardItem}>
                  <Ionicons name="cash" size={16} color="#ffc107" />
                  <Text style={[styles.rewardText, { color: theme.textColor }]}>
                    +${mission.reward.cash}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Photo Upload */}
          <PhotoUpload
            onPhotosChange={setPhotos}
            maxPhotos={verificationRequired ? 2 : 5}
            missionId={mission.id}
            disabled={isSubmitting}
          />
          
          {verificationRequired && (
            <View style={[styles.verificationNotice, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="shield-checkmark" size={20} color={theme.primary} />
              <Text style={[styles.verificationNoticeText, { color: theme.primary }]}>
                AI verification required: Please take before and after photos
              </Text>
            </View>
          )}

          {/* Notes Section */}
          <View style={[styles.notesCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Mission Notes (Optional)
            </Text>
            <TextInput
              style={[
                styles.notesInput,
                {
                  backgroundColor: theme.background,
                  color: theme.textColor,
                  borderColor: theme.borderColor,
                }
              ]}
              placeholder="Share details about your cleanup experience..."
              placeholderTextColor={theme.secondaryText}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Duration Section */}
          <View style={[styles.durationCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Actual Duration (Optional)
            </Text>
            <View style={styles.durationInputContainer}>
              <TextInput
                style={[
                  styles.durationInput,
                  {
                    backgroundColor: theme.background,
                    color: theme.textColor,
                    borderColor: theme.borderColor,
                  }
                ]}
                placeholder="120"
                placeholderTextColor={theme.secondaryText}
                value={actualDuration}
                onChangeText={setActualDuration}
              />
              <Text style={[styles.durationLabel, { color: theme.secondaryText }]}>
                minutes
              </Text>
            </View>
            <Text style={[styles.durationHelp, { color: theme.secondaryText }]}>
              How long did the mission actually take you?
            </Text>
          </View>

          {/* Completion Requirements */}
          <View style={[styles.requirementsCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Completion Requirements
            </Text>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={photos.length > 0 ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={photos.length > 0 ? "#28A745" : theme.secondaryText} 
              />
              <Text style={[
                styles.requirementText,
                { 
                  color: photos.length > 0 ? "#28A745" : theme.textColor,
                  fontWeight: photos.length > 0 ? "600" : "400"
                }
              ]}>
                Upload at least 1 photo
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color="#28A745" 
              />
              <Text style={[styles.requirementText, { color: theme.textColor }]}>
                Complete the cleanup task
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color="#28A745" 
              />
              <Text style={[styles.requirementText, { color: theme.textColor }]}>
                Follow safety guidelines
              </Text>
            </View>
          </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 8,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  completeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  missionCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  missionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  rewardsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notesCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
  },
  durationCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  durationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  durationInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: 100,
    textAlign: 'center',
  },
  durationLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  durationHelp: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  requirementsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    flex: 1,
  },
  verificationNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    margin: 16,
    marginTop: 0,
    gap: 8,
  },
  verificationNoticeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MissionCompletionModal;
