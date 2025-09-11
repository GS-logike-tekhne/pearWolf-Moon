import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface PhotoUploadProps {
  onPhotosChange?: (photos: string[]) => void;
  maxPhotos?: number;
  initialPhotos?: string[];
  missionId?: string;
  disabled?: boolean;
}

interface PhotoItem {
  id: string;
  uri: string;
  type: 'camera' | 'library';
  timestamp: Date;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotosChange,
  maxPhotos = 5,
  initialPhotos = [],
  missionId,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [photos, setPhotos] = useState<PhotoItem[]>(
    initialPhotos.map((uri, index) => ({
      id: `initial_${index}`,
      uri,
      type: 'library',
      timestamp: new Date(),
    }))
  );
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and photo library access are required to upload mission photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    if (disabled) return;
    
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setIsLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const newPhoto: PhotoItem = {
          id: `photo_${Date.now()}`,
          uri: result.assets[0].uri,
          type: 'camera',
          timestamp: new Date(),
        };
        
        const updatedPhotos = [...photos, newPhoto];
        setPhotos(updatedPhotos);
        onPhotosChange?.(updatedPhotos.map(p => p.uri));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const pickFromLibrary = async () => {
    if (disabled) return;
    
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: maxPhotos - photos.length,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhotos: PhotoItem[] = result.assets.map((asset, index) => ({
          id: `library_${Date.now()}_${index}`,
          uri: asset.uri,
          type: 'library',
          timestamp: new Date(),
        }));
        
        const updatedPhotos = [...photos, ...newPhotos];
        setPhotos(updatedPhotos);
        onPhotosChange?.(updatedPhotos.map(p => p.uri));
      }
    } catch (error) {
      console.error('Error picking photos:', error);
      Alert.alert('Error', 'Failed to pick photos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removePhoto = (photoId: string) => {
    if (disabled) return;
    
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    setPhotos(updatedPhotos);
    onPhotosChange?.(updatedPhotos.map(p => p.uri));
  };

  const showPhotoOptions = () => {
    if (photos.length >= maxPhotos) {
      Alert.alert(
        'Photo Limit Reached',
        `You can only upload up to ${maxPhotos} photos. Remove some photos to add more.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Add Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickFromLibrary },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const PhotoItem = ({ photo }: { photo: PhotoItem }) => (
    <View style={[styles.photoItem, { backgroundColor: theme.cardBackground }]}>
      <Image source={{ uri: photo.uri }} style={styles.photoImage} />
      <TouchableOpacity
        style={[styles.removeButton, { backgroundColor: theme.error }]}
        onPress={() => removePhoto(photo.id)}
        disabled={disabled}
      >
        <Ionicons name="close" size={16} color="white" />
      </TouchableOpacity>
      <View style={styles.photoInfo}>
        <Ionicons 
          name={photo.type === 'camera' ? 'camera' : 'images'} 
          size={12} 
          color={theme.secondaryText} 
        />
        <Text style={[styles.photoType, { color: theme.secondaryText }]}>
          {photo.type === 'camera' ? 'Camera' : 'Library'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textColor }]}>Mission Photos</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          {photos.length}/{maxPhotos} photos
        </Text>
      </View>

      {/* Photo Grid */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.photoGrid}
        contentContainerStyle={styles.photoGridContent}
      >
        {photos.map((photo) => (
          <PhotoItem key={photo.id} photo={photo} />
        ))}
        
        {/* Add Photo Button */}
        {photos.length < maxPhotos && (
          <TouchableOpacity
            style={[styles.addPhotoButton, { borderColor: theme.borderColor }]}
            onPress={showPhotoOptions}
            disabled={disabled || isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <Ionicons name="hourglass" size={32} color={theme.secondaryText} />
            ) : (
              <>
                <Ionicons name="camera" size={32} color={theme.primary} />
                <Text style={[styles.addPhotoText, { color: theme.primary }]}>
                  Add Photo
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={showPhotoOptions}
          disabled={disabled || isLoading || photos.length >= maxPhotos}
        >
          <Ionicons name="camera" size={20} color="white" />
          <Text style={styles.actionButtonText}>Take Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.secondary }]}
          onPress={pickFromLibrary}
          disabled={disabled || isLoading || photos.length >= maxPhotos}
        >
          <Ionicons name="images" size={20} color="white" />
          <Text style={styles.actionButtonText}>Choose from Library</Text>
        </TouchableOpacity>
      </View>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Ionicons name="information-circle" size={16} color={theme.secondaryText} />
        <Text style={[styles.tipsText, { color: theme.secondaryText }]}>
          Photos help verify mission completion and show your impact to the community
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  photoGrid: {
    marginBottom: 16,
  },
  photoGridContent: {
    paddingRight: 16,
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
  photoInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  photoType: {
    fontSize: 10,
    fontWeight: '500',
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default PhotoUpload;
