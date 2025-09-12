import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface PhotoMetadata {
  missionId: string;
  userId: string;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  compression: {
    originalSize: number;
    compressedSize: number;
    quality: number;
  };
  verification?: {
    required: boolean;
    status: 'pending' | 'verified' | 'rejected';
  };
}

export interface PhotoUploadResult {
  success: boolean;
  photoUri: string;
  metadata: PhotoMetadata;
  cloudUrl?: string;
  error?: string;
}

export interface CompressionOptions {
  quality: number; // 0.1 to 1.0
  maxWidth: number;
  maxHeight: number;
  format: 'jpeg' | 'png' | 'webp';
}

export class PhotoUploadService {
  private static instance: PhotoUploadService;
  private readonly COMPRESSION_OPTIONS: CompressionOptions = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'jpeg',
  };

  private constructor() {}

  public static getInstance(): PhotoUploadService {
    if (!PhotoUploadService.instance) {
      PhotoUploadService.instance = new PhotoUploadService();
    }
    return PhotoUploadService.instance;
  }

  /**
   * Take photo with camera and compress
   */
  async takeAndCompressPhoto(
    missionId: string,
    userId: string,
    options?: Partial<CompressionOptions>
  ): Promise<PhotoUploadResult> {
    try {
      // Request camera permissions
      const cameraPermission = await this.requestCameraPermission();
      if (!cameraPermission.granted) {
        return {
          success: false,
          photoUri: '',
          metadata: this.createEmptyMetadata(missionId, userId),
          error: 'Camera permission denied',
        };
      }

      // Request location permissions for metadata
      const locationPermission = await this.requestLocationPermission();
      let location: PhotoMetadata['location'];
      
      if (locationPermission.granted) {
        try {
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            maximumAge: 10000,
          });
          location = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            accuracy: currentLocation.coords.accuracy,
          };
        } catch (locationError) {
          console.warn('Failed to get location for photo:', locationError);
        }
      }

      // Take photo (this would integrate with camera component)
      // For now, we'll simulate with a placeholder
      const photoUri = await this.simulatePhotoCapture();
      
      // Compress the photo
      const compressionResult = await this.compressPhoto(photoUri, options);
      
      // Create metadata
      const metadata: PhotoMetadata = {
        missionId,
        userId,
        timestamp: new Date(),
        location,
        compression: compressionResult.compression,
        verification: {
          required: this.isVerificationRequired(missionId),
          status: 'pending',
        },
      };

      // Save to local storage
      const savedUri = await this.savePhotoLocally(compressionResult.uri, metadata);
      
      // Upload to cloud (mock implementation)
      const cloudUrl = await this.uploadToCloud(savedUri, metadata);

      return {
        success: true,
        photoUri: savedUri,
        metadata,
        cloudUrl,
      };
    } catch (error) {
      console.error('Error taking and compressing photo:', error);
      return {
        success: false,
        photoUri: '',
        metadata: this.createEmptyMetadata(missionId, userId),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Compress existing photo
   */
  async compressPhoto(
    photoUri: string,
    options?: Partial<CompressionOptions>
  ): Promise<{ uri: string; compression: PhotoMetadata['compression'] }> {
    try {
      const compressionOptions = { ...this.COMPRESSION_OPTIONS, ...options };
      
      // Get original file info
      const originalInfo = await FileSystem.getInfoAsync(photoUri);
      const originalSize = originalInfo.exists ? originalInfo.size || 0 : 0;

      // Compress the image
      const compressedImage = await ImageManipulator.manipulateAsync(
        photoUri,
        [
          {
            resize: {
              width: compressionOptions.maxWidth,
              height: compressionOptions.maxHeight,
            },
          },
        ],
        {
          compress: compressionOptions.quality,
          format: ImageManipulator.SaveFormat[compressionOptions.format.toUpperCase() as keyof typeof ImageManipulator.SaveFormat],
        }
      );

      // Get compressed file info
      const compressedInfo = await FileSystem.getInfoAsync(compressedImage.uri);
      const compressedSize = compressedInfo.exists ? compressedInfo.size || 0 : 0;

      return {
        uri: compressedImage.uri,
        compression: {
          originalSize,
          compressedSize,
          quality: compressionOptions.quality,
        },
      };
    } catch (error) {
      console.error('Error compressing photo:', error);
      throw error;
    }
  }

  /**
   * Save photo to local storage with metadata
   */
  async savePhotoLocally(photoUri: string, metadata: PhotoMetadata): Promise<string> {
    try {
      const fileName = `photo_${metadata.missionId}_${Date.now()}.jpg`;
      const localPath = `${FileSystem.documentDirectory}photos/${fileName}`;
      
      // Ensure photos directory exists
      const photosDir = `${FileSystem.documentDirectory}photos/`;
      const dirInfo = await FileSystem.getInfoAsync(photosDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
      }

      // Copy photo to local storage
      await FileSystem.copyAsync({
        from: photoUri,
        to: localPath,
      });

      // Save metadata
      const metadataPath = `${FileSystem.documentDirectory}photos/${fileName}.meta.json`;
      await FileSystem.writeAsStringAsync(
        metadataPath,
        JSON.stringify(metadata, null, 2)
      );

      return localPath;
    } catch (error) {
      console.error('Error saving photo locally:', error);
      throw error;
    }
  }

  /**
   * Upload photo to cloud storage (mock implementation)
   */
  async uploadToCloud(photoUri: string, metadata: PhotoMetadata): Promise<string> {
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock cloud URL
      const cloudUrl = `https://pear-cloud-storage.com/photos/${metadata.missionId}/${Date.now()}.jpg`;
      
      // In a real app, this would upload to AWS S3, Google Cloud, etc.
      console.log('Photo uploaded to cloud:', cloudUrl);
      
      return cloudUrl;
    } catch (error) {
      console.error('Error uploading to cloud:', error);
      throw error;
    }
  }

  /**
   * Get photos for a mission
   */
  async getMissionPhotos(missionId: string): Promise<{ uri: string; metadata: PhotoMetadata }[]> {
    try {
      const photosDir = `${FileSystem.documentDirectory}photos/`;
      const files = await FileSystem.readDirectoryAsync(photosDir);
      
      const missionPhotos = files
        .filter(file => file.startsWith(`photo_${missionId}_`))
        .map(async (file) => {
          const photoPath = `${photosDir}${file}`;
          const metadataPath = `${photosDir}${file}.meta.json`;
          
          const metadataInfo = await FileSystem.getInfoAsync(metadataPath);
          if (metadataInfo.exists) {
            const metadataContent = await FileSystem.readAsStringAsync(metadataPath);
            const metadata = JSON.parse(metadataContent) as PhotoMetadata;
            return { uri: photoPath, metadata };
          }
          return null;
        });

      const results = await Promise.all(missionPhotos);
      return results.filter(Boolean) as { uri: string; metadata: PhotoMetadata }[];
    } catch (error) {
      console.error('Error getting mission photos:', error);
      return [];
    }
  }

  /**
   * Delete photo and metadata
   */
  async deletePhoto(photoUri: string): Promise<boolean> {
    try {
      await FileSystem.deleteAsync(photoUri);
      
      // Also delete metadata file
      const metadataPath = `${photoUri}.meta.json`;
      const metadataInfo = await FileSystem.getInfoAsync(metadataPath);
      if (metadataInfo.exists) {
        await FileSystem.deleteAsync(metadataPath);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      return false;
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private async requestCameraPermission(): Promise<{ granted: boolean }> {
    // This would integrate with expo-camera permissions
    // For now, return mock permission
    return { granted: true };
  }

  private async requestLocationPermission(): Promise<{ granted: boolean }> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return { granted: status === 'granted' };
    } catch (error) {
      return { granted: false };
    }
  }

  private async simulatePhotoCapture(): Promise<string> {
    // In a real app, this would use expo-camera to take a photo
    // For now, return a placeholder URI
    return 'file://placeholder-photo.jpg';
  }

  private isVerificationRequired(missionId: string): boolean {
    // Check if mission requires photo verification
    // This would query the mission data
    return true; // Default to requiring verification
  }

  private createEmptyMetadata(missionId: string, userId: string): PhotoMetadata {
    return {
      missionId,
      userId,
      timestamp: new Date(),
      compression: {
        originalSize: 0,
        compressedSize: 0,
        quality: 0,
      },
      verification: {
        required: false,
        status: 'pending',
      },
    };
  }
}

export default PhotoUploadService.getInstance();
