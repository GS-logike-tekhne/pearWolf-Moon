import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface PhotoVerification {
  id: string;
  missionId: string;
  photoUri: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  timestamp: string;
  metadata?: {
    fileSize: number;
    width: number;
    height: number;
    format: string;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export interface VerificationRequest {
  missionId: string;
  missionType: 'cleanup' | 'restoration' | 'data-collection' | 'community-event';
  requiredPhotos: number;
  description: string;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // meters
  };
}

class PhotoVerificationService {
  private verifications: Map<string, PhotoVerification[]> = new Map();

  // Request camera permissions
  async requestCameraPermissions(): Promise<boolean> {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert(
          'Camera Permission',
          'PEAR needs camera access to verify your environmental missions. This helps ensure real impact and prevents fraud.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => ImagePicker.requestCameraPermissionsAsync() }
          ]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  }

  // Take photo for verification
  async takeVerificationPhoto(missionId: string): Promise<PhotoVerification | null> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      if (!hasPermission) return null;

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Take photo
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: true, // Include metadata
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      const asset = result.assets[0];
      
      // Create verification object
      const verification: PhotoVerification = {
        id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        missionId,
        photoUri: asset.uri,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        },
        timestamp: new Date().toISOString(),
        metadata: {
          fileSize: asset.fileSize || 0,
          width: asset.width,
          height: asset.height,
          format: asset.type || 'jpeg',
        },
        verificationStatus: 'pending',
      };

      // Store verification
      if (!this.verifications.has(missionId)) {
        this.verifications.set(missionId, []);
      }
      this.verifications.get(missionId)!.push(verification);

      return verification;
    } catch (error) {
      console.error('Error taking verification photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      return null;
    }
  }

  // Select photo from library
  async selectVerificationPhoto(missionId: string): Promise<PhotoVerification | null> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      if (!hasPermission) return null;

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Select photo
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: true,
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      const asset = result.assets[0];
      
      // Create verification object
      const verification: PhotoVerification = {
        id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        missionId,
        photoUri: asset.uri,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        },
        timestamp: new Date().toISOString(),
        metadata: {
          fileSize: asset.fileSize || 0,
          width: asset.width,
          height: asset.height,
          format: asset.type || 'jpeg',
        },
        verificationStatus: 'pending',
      };

      // Store verification
      if (!this.verifications.has(missionId)) {
        this.verifications.set(missionId, []);
      }
      this.verifications.get(missionId)!.push(verification);

      return verification;
    } catch (error) {
      console.error('Error selecting verification photo:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
      return null;
    }
  }

  // Get verification photos for a mission
  getMissionVerifications(missionId: string): PhotoVerification[] {
    return this.verifications.get(missionId) || [];
  }

  // Verify if location is within mission area
  verifyLocation(
    photoLocation: { latitude: number; longitude: number },
    missionLocation: { latitude: number; longitude: number; radius: number }
  ): boolean {
    const distance = this.calculateDistance(
      photoLocation.latitude,
      photoLocation.longitude,
      missionLocation.latitude,
      missionLocation.longitude
    );

    return distance <= missionLocation.radius;
  }

  // Calculate distance between two points
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Validate photo quality
  validatePhotoQuality(verification: PhotoVerification): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check file size (max 10MB)
    if (verification.metadata && verification.metadata.fileSize > 10 * 1024 * 1024) {
      issues.push('Photo file size too large');
    }

    // Check dimensions (min 800x600)
    if (verification.metadata) {
      if (verification.metadata.width < 800 || verification.metadata.height < 600) {
        issues.push('Photo resolution too low');
      }
    }

    // Check location accuracy (max 50m uncertainty)
    if (verification.location.accuracy && verification.location.accuracy > 50) {
      issues.push('Location accuracy too low');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  // Submit verification for review
  async submitVerification(missionId: string, description?: string): Promise<boolean> {
    try {
      const verifications = this.getMissionVerifications(missionId);
      
      if (verifications.length === 0) {
        Alert.alert('No Photos', 'Please take at least one photo for verification.');
        return false;
      }

      // Validate all photos
      const validationResults = verifications.map(v => this.validatePhotoQuality(v));
      const invalidPhotos = validationResults.filter(r => !r.isValid);
      
      if (invalidPhotos.length > 0) {
        const issues = invalidPhotos.flatMap(r => r.issues);
        Alert.alert(
          'Photo Quality Issues',
          `Please retake photos with these issues: ${issues.join(', ')}`
        );
        return false;
      }

      // In a real app, upload photos to backend
      console.log('Submitting verification:', {
        missionId,
        verifications: verifications.length,
        description,
      });

      // Mock successful submission
      Alert.alert(
        'Verification Submitted!',
        `Your ${verifications.length} photo(s) have been submitted for review. You'll receive XP once verified.`,
        [{ text: 'Great!' }]
      );

      return true;
    } catch (error) {
      console.error('Error submitting verification:', error);
      Alert.alert('Error', 'Failed to submit verification. Please try again.');
      return false;
    }
  }

  // Delete verification photo
  deleteVerification(missionId: string, verificationId: string): boolean {
    const verifications = this.verifications.get(missionId);
    if (!verifications) return false;

    const index = verifications.findIndex(v => v.id === verificationId);
    if (index === -1) return false;

    verifications.splice(index, 1);
    return true;
  }

  // Get all verifications
  getAllVerifications(): Map<string, PhotoVerification[]> {
    return new Map(this.verifications);
  }

  // Clear verification data
  clearVerifications(): void {
    this.verifications.clear();
  }

  // Get verification statistics
  getVerificationStats(): {
    totalPhotos: number;
    verifiedPhotos: number;
    pendingPhotos: number;
    rejectedPhotos: number;
  } {
    let totalPhotos = 0;
    let verifiedPhotos = 0;
    let pendingPhotos = 0;
    let rejectedPhotos = 0;

    this.verifications.forEach(verifications => {
      verifications.forEach(verification => {
        totalPhotos++;
        switch (verification.verificationStatus) {
          case 'verified':
            verifiedPhotos++;
            break;
          case 'pending':
            pendingPhotos++;
            break;
          case 'rejected':
            rejectedPhotos++;
            break;
        }
      });
    });

    return {
      totalPhotos,
      verifiedPhotos,
      pendingPhotos,
      rejectedPhotos,
    };
  }
}

// Export singleton instance
export const photoVerificationService = new PhotoVerificationService();
