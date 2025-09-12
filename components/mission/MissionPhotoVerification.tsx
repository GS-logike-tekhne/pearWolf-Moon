import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useTheme } from '../../context/ThemeContext';
import { THEME } from '../../styles/theme';
import { getRoleColor } from '../../utils/roleColors';
import PhotoVerificationService, { MissionPhotoData, PhotoVerificationResult } from '../../services/photoVerificationService';

const { width } = Dimensions.get('window');

interface MissionPhotoVerificationProps {
  missionId: string;
  userId: string;
  onVerificationComplete: (result: PhotoVerificationResult) => void;
  onVerificationFailed: (error: string) => void;
  disabled?: boolean;
  role?: string;
}

interface PhotoItem {
  id: string;
  uri: string;
  type: 'before' | 'after' | 'progress';
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
}

const MissionPhotoVerification: React.FC<MissionPhotoVerificationProps> = ({
  missionId,
  userId,
  onVerificationComplete,
  onVerificationFailed,
  disabled = false,
  role = 'trash-hero',
}) => {
  const { theme } = useTheme();
  const [beforePhotos, setBeforePhotos] = useState<PhotoItem[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<PhotoItem[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<PhotoVerificationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');

  const roleColor = getRoleColor(role);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and photo library access are required to verify mission completion.',
        [{ text: 'OK' }]
      );
      return false;
    }

    if (locationStatus !== 'granted') {
      Alert.alert(
        'Location Required',
        'Location access is required to verify you\'re at the mission site.',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    return true;
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  const takePhoto = async (type: 'before' | 'after') => {
    if (disabled) return;
    
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const location = await getCurrentLocation();
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const newPhoto: PhotoItem = {
          id: `${type}_${Date.now()}`,
          uri: result.assets[0].uri,
          type,
          timestamp: new Date(),
          location: location || undefined,
        };
        
        if (type === 'before') {
          setBeforePhotos(prev => [...prev, newPhoto]);
        } else {
          setAfterPhotos(prev => [...prev, newPhoto]);
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickFromLibrary = async (type: 'before' | 'after') => {
    if (disabled) return;
    
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const location = await getCurrentLocation();
        
        const newPhotos: PhotoItem[] = result.assets.map((asset, index) => ({
          id: `${type}_${Date.now()}_${index}`,
          uri: asset.uri,
          type,
          timestamp: new Date(),
          location: location || undefined,
        }));
        
        if (type === 'before') {
          setBeforePhotos(prev => [...prev, ...newPhotos]);
        } else {
          setAfterPhotos(prev => [...prev, ...newPhotos]);
        }
      }
    } catch (error) {
      console.error('Error picking photos:', error);
      Alert.alert('Error', 'Failed to pick photos. Please try again.');
    }
  };

  const removePhoto = (photoId: string, type: 'before' | 'after') => {
    if (disabled) return;
    
    if (type === 'before') {
      setBeforePhotos(prev => prev.filter(photo => photo.id !== photoId));
    } else {
      setAfterPhotos(prev => prev.filter(photo => photo.id !== photoId));
    }
  };

  const showPhotoOptions = (type: 'before' | 'after') => {
    Alert.alert(
      `Add ${type === 'before' ? 'Before' : 'After'} Photo`,
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: () => takePhoto(type) },
        { text: 'Photo Library', onPress: () => pickFromLibrary(type) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const verifyPhotos = async () => {
    if (beforePhotos.length === 0 && afterPhotos.length === 0) {
      Alert.alert('No Photos', 'Please add at least one photo to verify mission completion.');
      return;
    }

    try {
      setIsVerifying(true);
      
      const currentLocation = await getCurrentLocation();
      if (!currentLocation) {
        throw new Error('Unable to get current location. Please ensure location services are enabled.');
      }

      const photoData: MissionPhotoData = {
        missionId,
        userId,
        photos: [...beforePhotos, ...afterPhotos].map(p => p.uri),
        location: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        timestamp: new Date(),
        beforePhotos: beforePhotos.map(p => p.uri),
        afterPhotos: afterPhotos.map(p => p.uri),
      };

      const result = await PhotoVerificationService.verifyMissionPhotos(photoData);
      
      setVerificationResult(result);
      
      if (result.isVerified) {
        onVerificationComplete(result);
      } else {
        onVerificationFailed('Photos did not pass verification. Please check suggestions and try again.');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      onVerificationFailed(error instanceof Error ? error.message : 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const PhotoItem = ({ photo }: { photo: PhotoItem }) => (
    <View style={[styles.photoItem, { backgroundColor: theme.cardBackground }]}>
      <Image source={{ uri: photo.uri }} style={styles.photoImage} />
      <TouchableOpacity
        style={[styles.removeButton, { backgroundColor: theme.error }]}
        onPress={() => removePhoto(photo.id, photo.type)}
        disabled={disabled}
      >
        <Ionicons name="close" size={16} color="white" />
      </TouchableOpacity>
      
      {/* Photo type indicator */}
      <View style={[styles.photoTypeBadge, { backgroundColor: roleColor }]}>
        <Ionicons 
          name={photo.type === 'before' ? 'camera' : 'checkmark-circle'} 
          size={12} 
          color="white" 
        />
        <Text style={styles.photoTypeText}>
          {photo.type === 'before' ? 'Before' : 'After'}
        </Text>
      </View>

      {/* Location indicator */}
      {photo.location && (
        <View style={styles.locationIndicator}>
          <Ionicons name="location" size={10} color="white" />
        </View>
      )}
    </View>
  );

  const TabButton = ({ type, label }: { type: 'before' | 'after', label: string }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        { 
          backgroundColor: activeTab === type ? roleColor : theme.cardBackground,
          borderColor: roleColor,
        }
      ]}
      onPress={() => setActiveTab(type)}
    >
      <Text style={[
        styles.tabButtonText,
        { color: activeTab === type ? 'white' : theme.textColor }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const currentPhotos = activeTab === 'before' ? beforePhotos : afterPhotos;
  const maxPhotos = 3;

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="camera" size={24} color={roleColor} />
          <Text style={[styles.title, { color: theme.textColor }]}>Mission Verification</Text>
        </View>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Take photos to verify completion
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton type="before" label="Before Photos" />
        <TabButton type="after" label="After Photos" />
      </View>

      {/* Photo Grid */}
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.photoGrid}
      >
        {currentPhotos.map((photo) => (
          <PhotoItem key={photo.id} photo={photo} />
        ))}
        
        {/* Add Photo Button */}
        {currentPhotos.length < maxPhotos && (
          <TouchableOpacity
            style={[styles.addPhotoButton, { borderColor: roleColor }]}
            onPress={() => showPhotoOptions(activeTab)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Ionicons name="camera" size={32} color={roleColor} />
            <Text style={[styles.addPhotoText, { color: roleColor }]}>
              Add {activeTab === 'before' ? 'Before' : 'After'} Photo
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Verification Status */}
      {verificationResult && (
        <View style={[
          styles.verificationStatus,
          { 
            backgroundColor: verificationResult.isVerified ? theme.success + '20' : theme.error + '20',
            borderColor: verificationResult.isVerified ? theme.success : theme.error,
          }
        ]}>
          <Ionicons 
            name={verificationResult.isVerified ? 'checkmark-circle' : 'alert-circle'} 
            size={20} 
            color={verificationResult.isVerified ? theme.success : theme.error} 
          />
          <View style={styles.verificationInfo}>
            <Text style={[
              styles.verificationTitle,
              { color: verificationResult.isVerified ? theme.success : theme.error }
            ]}>
              {verificationResult.isVerified ? 'Verification Successful!' : 'Verification Failed'}
            </Text>
            <Text style={[styles.verificationSubtitle, { color: theme.secondaryText }]}>
              Confidence: {verificationResult.confidence}%
            </Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.verifyButton,
            { 
              backgroundColor: roleColor,
              opacity: (beforePhotos.length === 0 && afterPhotos.length === 0) || isVerifying ? 0.5 : 1
            }
          ]}
          onPress={verifyPhotos}
          disabled={disabled || isVerifying || (beforePhotos.length === 0 && afterPhotos.length === 0)}
        >
          {isVerifying ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="shield-checkmark" size={20} color="white" />
              <Text style={styles.verifyButtonText}>Verify Mission</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Ionicons name="information-circle" size={16} color={theme.secondaryText} />
        <Text style={[styles.tipsText, { color: theme.secondaryText }]}>
          • Take photos showing the area before and after cleanup{'\n'}
          • Ensure photos include visible trash or cleaned areas{'\n'}
          • Photos are automatically tagged with location and timestamp
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  photoGrid: {
    marginBottom: 16,
  },
  photoItem: {
    position: 'relative',
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoTypeBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  photoTypeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  locationIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  verificationSubtitle: {
    fontSize: 12,
  },
  actionButtons: {
    marginBottom: 16,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  tipsText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
});

export default MissionPhotoVerification;
