import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PhotoUploadService, { PhotoUploadResult, CompressionOptions } from '../../services/photo/photoUploadService';

interface PhotoUploaderProps {
  missionId: string;
  userId: string;
  onPhotoUploaded: (result: PhotoUploadResult) => void;
  onPhotoDeleted?: (photoUri: string) => void;
  maxPhotos?: number;
  compressionOptions?: Partial<CompressionOptions>;
  style?: any;
}

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 60) / 3; // 3 photos per row with margins

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  missionId,
  userId,
  onPhotoUploaded,
  onPhotoDeleted,
  maxPhotos = 6,
  compressionOptions,
  style,
}) => {
  const [photos, setPhotos] = useState<PhotoUploadResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const photoService = PhotoUploadService;

  const handleTakePhoto = useCallback(async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert(
        'Photo Limit Reached',
        `You can only upload up to ${maxPhotos} photos for this mission.`
      );
      return;
    }

    setUploading(true);
    try {
      const result = await photoService.takeAndCompressPhoto(
        missionId,
        userId,
        compressionOptions
      );

      if (result.success) {
        setPhotos(prev => [...prev, result]);
        onPhotoUploaded(result);
        
        // Show success message
        Alert.alert(
          'Photo Uploaded!',
          `Photo compressed from ${formatFileSize(result.metadata.compression.originalSize)} to ${formatFileSize(result.metadata.compression.compressedSize)}`
        );
      } else {
        Alert.alert('Upload Failed', result.error || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [photos.length, maxPhotos, missionId, userId, compressionOptions, onPhotoUploaded]);

  const handleDeletePhoto = useCallback(async (photoUri: string, index: number) => {
    setDeleting(photoUri);
    try {
      const success = await photoService.deletePhoto(photoUri);
      if (success) {
        setPhotos(prev => prev.filter((_, i) => i !== index));
        onPhotoDeleted?.(photoUri);
        Alert.alert('Photo Deleted', 'Photo has been removed successfully.');
      } else {
        Alert.alert('Delete Failed', 'Failed to delete photo. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      Alert.alert('Error', 'Failed to delete photo. Please try again.');
    } finally {
      setDeleting(null);
    }
  }, [onPhotoDeleted]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getCompressionRatio = (original: number, compressed: number): number => {
    if (original === 0) return 0;
    return Math.round(((original - compressed) / original) * 100);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Mission Photos</Text>
      <Text style={styles.subtitle}>
        {photos.length}/{maxPhotos} photos uploaded
      </Text>

      <View style={styles.photosGrid}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image
              source={{ uri: photo.photoUri }}
              style={styles.photo}
              resizeMode="cover"
            />
            
            {/* Photo Info Overlay */}
            <View style={styles.photoInfo}>
              <Text style={styles.compressionText}>
                {getCompressionRatio(
                  photo.metadata.compression.originalSize,
                  photo.metadata.compression.compressedSize
                )}% smaller
              </Text>
            </View>

            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeletePhoto(photo.photoUri, index)}
              disabled={deleting === photo.photoUri}
            >
              {deleting === photo.photoUri ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="close-circle" size={20} color="#fff" />
              )}
            </TouchableOpacity>

            {/* Verification Status */}
            {photo.metadata.verification?.required && (
              <View style={[
                styles.verificationBadge,
                { backgroundColor: getVerificationColor(photo.metadata.verification.status) }
              ]}>
                <Ionicons
                  name={getVerificationIcon(photo.metadata.verification.status)}
                  size={12}
                  color="#fff"
                />
              </View>
            )}
          </View>
        ))}

        {/* Add Photo Button */}
        {photos.length < maxPhotos && (
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={handleTakePhoto}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
              <>
                <Ionicons name="camera" size={32} color="#4CAF50" />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Photo Stats */}
      {photos.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Upload Summary</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>
              Total Photos: {photos.length}
            </Text>
            <Text style={styles.statsText}>
              Avg. Compression: {Math.round(
                photos.reduce((acc, photo) => 
                  acc + getCompressionRatio(
                    photo.metadata.compression.originalSize,
                    photo.metadata.compression.compressedSize
                  ), 0
                ) / photos.length
              )}%
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

// Helper functions
const getVerificationColor = (status: string): string => {
  switch (status) {
    case 'verified': return '#4CAF50';
    case 'rejected': return '#F44336';
    case 'pending': return '#FF9800';
    default: return '#9E9E9E';
  }
};

const getVerificationIcon = (status: string): string => {
  switch (status) {
    case 'verified': return 'checkmark-circle';
    case 'rejected': return 'close-circle';
    case 'pending': return 'time';
    default: return 'help-circle';
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    marginBottom: 12,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  photoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  compressionText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#F44336',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  addPhotoText: {
    color: '#4CAF50',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  statsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 12,
    color: '#666',
  },
});

export default PhotoUploader;
