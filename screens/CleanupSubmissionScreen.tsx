import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import { useXP } from '../context/XPContext';
import { useNotifications } from '../context/NotificationsContext';
import { 
  verifyCleanup, 
  CleanupSubmission, 
  CleanupVerificationResult,
  isVerificationRequired,
  getVerificationRequirements 
} from '../utils/VerifyCleanup';
import ScreenLayout from '../components/ScreenLayout';

const { width } = Dimensions.get('window');

interface CleanupSubmissionScreenProps {
  navigation: any;
  route: {
    params: {
      mission: {
        id: string;
        title: string;
        description: string;
        reward: {
          ecoPoints: number;
          xp: number;
          cash?: number;
        };
        type: string;
      };
    };
  };
}

const CleanupSubmissionScreen: React.FC<CleanupSubmissionScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { addXP } = useXP();
  const { sendLevelUpNotification } = useNotifications();
  const { mission } = route.params;
  
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [notes, setNotes] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<CleanupVerificationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verificationRequired = isVerificationRequired(mission.type, mission.reward.ecoPoints);
  const requirements = getVerificationRequirements(mission.type);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location access to verify your cleanup location.',
          [{ text: 'OK' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const takePhoto = async (type: 'before' | 'after') => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access to take cleanup photos.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        if (type === 'before') {
          setBeforeImage(result.assets[0].uri);
        } else {
          setAfterImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickFromLibrary = async (type: 'before' | 'after') => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Photo Library Permission Required',
          'Please enable photo library access to select cleanup photos.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        if (type === 'before') {
          setBeforeImage(result.assets[0].uri);
        } else {
          setAfterImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Error picking photo:', error);
      Alert.alert('Error', 'Failed to pick photo. Please try again.');
    }
  };

  const showPhotoOptions = (type: 'before' | 'after') => {
    Alert.alert(
      `${type === 'before' ? 'Before' : 'After'} Photo`,
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: () => takePhoto(type) },
        { text: 'Photo Library', onPress: () => pickFromLibrary(type) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const verifyCleanupSubmission = async () => {
    if (!beforeImage || !afterImage) {
      Alert.alert(
        'Photos Required',
        'Please take both before and after photos to verify your cleanup.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!currentLocation) {
      Alert.alert(
        'Location Required',
        'Please enable location access to verify your cleanup location.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsVerifying(true);
      
      const submission: CleanupSubmission = {
        beforeImageUri: beforeImage,
        afterImageUri: afterImage,
        missionId: mission.id,
        location: currentLocation,
        timestamp: new Date(),
        notes: notes.trim(),
      };

      const result = await verifyCleanup(submission);
      setVerificationResult(result);
      
      if (result.verified) {
        Alert.alert(
          'Cleanup Verified! ✅',
          `AI verification successful with ${result.confidence}% confidence. Your cleanup has been approved!`,
          [{ text: 'Awesome!', onPress: () => submitMission(result) }]
        );
      } else {
        Alert.alert(
          'Verification Failed ❌',
          `AI verification failed with ${result.confidence}% confidence. ${result.details.recommendations[0] || 'Please try again.'}`,
          [
            { text: 'Retry', onPress: () => setVerificationResult(null) },
            { text: 'Submit for Review', onPress: () => submitMission(result) },
          ]
        );
      }
    } catch (error) {
      console.error('Error verifying cleanup:', error);
      Alert.alert(
        'Verification Error',
        'Failed to verify cleanup. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const submitMission = async (result: CleanupVerificationResult) => {
    try {
      setIsSubmitting(true);
      
      // Add XP reward
      addXP(mission.reward.xp, `mission-${mission.id}`);
      
      // Send level up notification if applicable
      // This would be handled by the XP context
      
      // Show success message
      Alert.alert(
        'Mission Completed! 🎉',
        `You earned ${mission.reward.xp} XP and ${mission.reward.ecoPoints} EcoPoints!`,
        [
          {
            text: 'Continue',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting mission:', error);
      Alert.alert(
        'Submission Error',
        'Failed to submit mission. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const PhotoUploadCard = ({ 
    type, 
    imageUri, 
    onPress 
  }: { 
    type: 'before' | 'after'; 
    imageUri: string | null; 
    onPress: () => void; 
  }) => (
    <View style={[styles.photoCard, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.photoCardTitle, { color: theme.textColor }]}>
        {type === 'before' ? 'Before Cleanup' : 'After Cleanup'}
      </Text>
      
      {imageUri ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: imageUri }} style={styles.photo} />
          <TouchableOpacity
            style={[styles.retakeButton, { backgroundColor: theme.primary }]}
            onPress={onPress}
          >
            <Ionicons name="camera" size={16} color="white" />
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.photoPlaceholder, { borderColor: theme.borderColor }]}
          onPress={onPress}
        >
          <Ionicons name="camera" size={32} color={theme.primary} />
          <Text style={[styles.photoPlaceholderText, { color: theme.primary }]}>
            Take {type} Photo
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const VerificationResultCard = ({ result }: { result: CleanupVerificationResult }) => (
    <View style={[styles.verificationCard, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.verificationHeader}>
        <Ionicons 
          name={result.verified ? "checkmark-circle" : "close-circle"} 
          size={24} 
          color={result.verified ? "#28A745" : "#dc3545"} 
        />
        <Text style={[styles.verificationTitle, { color: theme.textColor }]}>
          {result.verified ? 'Verification Passed' : 'Verification Failed'}
        </Text>
        <Text style={[styles.confidenceScore, { color: result.verified ? "#28A745" : "#dc3545" }]}>
          {result.confidence}% Confidence
        </Text>
      </View>
      
      <View style={styles.verificationDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="trash" size={16} color={theme.secondaryText} />
          <Text style={[styles.detailText, { color: theme.textColor }]}>
            Trash detected: {result.details.trashDetectedBefore ? 'Before' : 'No'} → {result.details.trashDetectedAfter ? 'After' : 'Cleaned'}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="location" size={16} color={theme.secondaryText} />
          <Text style={[styles.detailText, { color: theme.textColor }]}>
            Location: {result.details.locationVerified ? 'Verified' : 'Not verified'}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="time" size={16} color={theme.secondaryText} />
          <Text style={[styles.detailText, { color: theme.textColor }]}>
            Timestamp: {result.details.timestampValid ? 'Valid' : 'Invalid'}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="image" size={16} color={theme.secondaryText} />
          <Text style={[styles.detailText, { color: theme.textColor }]}>
            Image Quality: {result.details.imageQuality}
          </Text>
        </View>
      </View>
      
      {result.details.recommendations.length > 0 && (
        <View style={styles.recommendations}>
          <Text style={[styles.recommendationsTitle, { color: theme.textColor }]}>
            Recommendations:
          </Text>
          {result.details.recommendations.map((rec, index) => (
            <Text key={index} style={[styles.recommendation, { color: theme.secondaryText }]}>
              • {rec}
            </Text>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScreenLayout>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Verify Cleanup
        </Text>
        <View style={styles.headerSpacer} />
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
          </View>
        </View>

        {/* Photo Upload Cards */}
        <PhotoUploadCard
          type="before"
          imageUri={beforeImage}
          onPress={() => showPhotoOptions('before')}
        />
        
        <PhotoUploadCard
          type="after"
          imageUri={afterImage}
          onPress={() => showPhotoOptions('after')}
        />

        {/* Verification Result */}
        {verificationResult && (
          <VerificationResultCard result={verificationResult} />
        )}

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            { 
              backgroundColor: beforeImage && afterImage ? theme.primary : theme.borderColor,
              opacity: isVerifying ? 0.6 : 1,
            }
          ]}
          onPress={verifyCleanupSubmission}
          disabled={!beforeImage || !afterImage || isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.verifyButtonText}>
                {isVerifying ? 'Verifying...' : 'Verify Cleanup'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Submit Button */}
        {verificationResult && (
          <TouchableOpacity
            style={[
              styles.submitButton,
              { 
                backgroundColor: verificationResult.verified ? '#28A745' : '#ffc107',
                opacity: isSubmitting ? 0.6 : 1,
              }
            ]}
            onPress={() => submitMission(verificationResult)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="rocket" size={20} color="white" />
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Submitting...' : 'Complete Mission'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenLayout>
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
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    paddingTop: THEME.SPACING.sm,
  },
  backButton: {
    padding: THEME.SPACING.sm,
  },
  headerTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: THEME.SPACING.md,
  },
  missionCard: {
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginBottom: THEME.SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  missionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginBottom: THEME.SPACING.sm,
  },
  missionDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    lineHeight: 20,
    marginBottom: THEME.SPACING.md,
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
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  photoCard: {
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginBottom: THEME.SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoCardTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    marginBottom: THEME.SPACING.sm + 4,
  },
  photoContainer: {
    alignItems: 'center',
  },
  photo: {
    width: width - 64,
    height: (width - 64) * 0.75,
    borderRadius: THEME.BORDER_RADIUS.md,
    marginBottom: THEME.SPACING.sm + 4,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: THEME.BORDER_RADIUS.md,
    gap: 6,
  },
  retakeButtonText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  photoPlaceholder: {
    width: width - 64,
    height: (width - 64) * 0.75,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: THEME.BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
  },
  verificationCard: {
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginBottom: THEME.SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.SPACING.md,
    gap: 12,
  },
  verificationTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    flex: 1,
  },
  confidenceScore: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '700',
  },
  verificationDetails: {
    marginBottom: THEME.SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.SPACING.sm,
    gap: 8,
  },
  detailText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    flex: 1,
  },
  recommendations: {
    paddingTop: THEME.SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  recommendationsTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    marginBottom: THEME.SPACING.sm,
  },
  recommendation: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    marginBottom: THEME.SPACING.xs,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginBottom: THEME.SPACING.md,
    gap: 8,
  },
  verifyButtonText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '700',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    gap: 8,
  },
  submitButtonText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '700',
  },
});

export default CleanupSubmissionScreen;
