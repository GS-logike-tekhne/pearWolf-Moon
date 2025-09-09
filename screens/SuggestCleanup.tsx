import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';

const SuggestCleanup = ({ navigation, route }) => {
  const { theme } = useTheme();
  const role = route?.params?.role || 'impact-warrior';
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    urgency: 'medium',
    category: 'general',
  });
  const [photo, setPhoto] = useState(null);

  const urgencyLevels = [
    { id: 'low', label: 'Low Priority', color: '#10b981', icon: 'leaf-outline' },
    { id: 'medium', label: 'Medium Priority', color: '#f59e0b', icon: 'warning-outline' },
    { id: 'high', label: 'High Priority', color: '#ef4444', icon: 'alert-circle-outline' },
  ];

  const categories = [
    { id: 'general', label: 'General Cleanup', icon: 'trash-outline' },
    { id: 'beach', label: 'Beach/Waterway', icon: 'water-outline' },
    { id: 'park', label: 'Park/Green Space', icon: 'leaf-outline' },
    { id: 'urban', label: 'Urban Area', icon: 'business-outline' },
    { id: 'trail', label: 'Trail/Path', icon: 'trail-sign-outline' },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // Simulate submission
    Alert.alert(
      'Submission Successful!',
      'Your cleanup spot suggestion has been sent to administrators for review. You\'ll be notified once it\'s approved.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handlePhotoUpload = async () => {
    // Request permission first
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera roll permission is required to upload photos.');
      return;
    }

    // Show action sheet for camera/gallery selection
    Alert.alert(
      'Select Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Photo Library', onPress: () => openImageLibrary() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setPhoto(result.assets[0]);
    }
  };

  const openImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setPhoto(result.assets[0]);
    }
  };

  const UrgencySelector = () => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Priority Level</Text>
      <View style={styles.urgencyContainer}>
        {urgencyLevels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.urgencyOption,
              { backgroundColor: formData.urgency === level.id ? level.color : 'white' },
              formData.urgency === level.id && styles.urgencySelected
            ]}
            onPress={() => setFormData(prev => ({ ...prev, urgency: level.id }))}
          >
            <Ionicons 
              name={level.icon} 
              size={20} 
              color={formData.urgency === level.id ? 'white' : level.color} 
            />
            <Text style={[
              styles.urgencyText,
              { color: formData.urgency === level.id ? 'white' : level.color }
            ]}>
              {level.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const CategorySelector = () => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Cleanup Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryOption,
              { 
                backgroundColor: formData.category === cat.id ? theme.primary : 'white',
                borderColor: theme.primary 
              }
            ]}
            onPress={() => setFormData(prev => ({ ...prev, category: cat.id }))}
          >
            <Ionicons 
              name={cat.icon} 
              size={18} 
              color={formData.category === cat.id ? 'white' : theme.primary} 
            />
            <Text style={[
              styles.categoryText,
              { color: formData.category === cat.id ? 'white' : theme.primary }
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with Back Button */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: 'white' }]}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={getRoleColor(role)} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Suggest Cleanup Spot</Text>
          <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}>
            Help expand our community cleanup network
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={[styles.introContainer, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.introHeader}>
            <Ionicons name="people-outline" size={24} color={theme.primary} />
            <Text style={[styles.introTitle, { color: theme.textColor }]}>
              Community-Driven Impact
            </Text>
          </View>
          <Text style={[styles.introText, { color: theme.secondaryText }]}>
            Spotted an area that needs attention? Submit it here and help build our network of cleanup locations. 
            Your suggestion will be reviewed by our admin team and made available to Eco Defenders for sponsorship.
          </Text>
        </View>

        {/* Basic Information */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Basic Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textColor }]}>Cleanup Spot Title *</Text>
            <TextInput
              style={[styles.textInput, { borderColor: theme.borderColor, color: theme.textColor }]}
              placeholder="e.g., Riverside Park Trail Cleanup"
              placeholderTextColor={theme.secondaryText}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textColor }]}>Location *</Text>
            <TextInput
              style={[styles.textInput, { borderColor: theme.borderColor, color: theme.textColor }]}
              placeholder="Street address or landmark"
              placeholderTextColor={theme.secondaryText}
              value={formData.location}
              onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textColor }]}>Description *</Text>
            <TextInput
              style={[styles.textArea, { borderColor: theme.borderColor, color: theme.textColor }]}
              placeholder="Describe the area, type of cleanup needed, and any relevant details..."
              placeholderTextColor={theme.secondaryText}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Photo Upload */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Photo (Optional)</Text>
          <TouchableOpacity 
            style={[styles.photoUploadButton, { borderColor: theme.primary }]}
            onPress={handlePhotoUpload}
          >
            <Ionicons name="camera-outline" size={32} color={theme.primary} />
            <Text style={[styles.photoUploadText, { color: theme.primary }]}>
              Add Photo of Area
            </Text>
            <Text style={[styles.photoUploadSubtext, { color: theme.secondaryText }]}>
              Help admins assess the cleanup needs
            </Text>
          </TouchableOpacity>
          
          {/* Photo Preview */}
          {photo && (
            <View style={styles.photoPreviewContainer}>
              <Image 
                source={{ uri: photo.uri }} 
                style={styles.photoPreview} 
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removePhotoButton}
                onPress={() => setPhoto(null)}
              >
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <UrgencySelector />
        <CategorySelector />

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
        >
          <Ionicons name="send-outline" size={20} color="white" />
          <Text style={styles.submitButtonText}>Submit for Review</Text>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  introContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 100,
  },
  photoUploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  photoUploadText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  photoUploadSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  urgencyContainer: {
    gap: 12,
  },
  urgencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  urgencySelected: {
    borderColor: 'transparent',
  },
  urgencyText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: '45%',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
  photoPreviewContainer: {
    marginTop: 16,
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default SuggestCleanup;