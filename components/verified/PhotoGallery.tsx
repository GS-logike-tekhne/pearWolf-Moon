import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { sharedStyles } from '../../styles/shared';
import { THEME } from '../../styles/theme';

interface PhotoGalleryProps {
  mission: {
    beforePhotos?: string[];
    afterPhotos?: string[];
  };
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ mission }) => {
  const { theme } = useTheme();

  return (
    <View style={[
      sharedStyles.card,
      { 
        backgroundColor: theme.cardBackground,
        borderColor: theme.borderColor,
      }
    ]}>
      <Text style={[sharedStyles.sectionTitle, { color: theme.textColor }]}>
        Mission Photos
      </Text>
      
      <View style={styles.photoPlaceholder}>
        <Ionicons name="camera-outline" size={48} color={theme.secondaryText} />
        <Text style={[styles.placeholderText, { color: theme.secondaryText }]}>
          Before and after photos will appear here once the mission begins
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  photoPlaceholder: {
    alignItems: 'center',
    padding: THEME.SPACING.xl,
  },
  placeholderText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
    marginTop: THEME.SPACING.sm,
  },
});

export default PhotoGallery;
