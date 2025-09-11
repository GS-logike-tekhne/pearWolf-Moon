import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PostJobProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params?: {
      role?: string;
    };
  };
};

const PostJob: React.FC<PostJobProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const role = route?.params?.role || 'business';
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    duration: '',
    budget: '',
    category: 'beach-cleanup',
    urgency: 'medium',
    maxVolunteers: '',
    equipment: 'provided',
    type: 'paid', // 'paid' or 'volunteer'
  });

  const [selectedCategory, setSelectedCategory] = useState('beach-cleanup');
  const [selectedUrgency, setSelectedUrgency] = useState('medium');

  const missionCategories = [
    { id: 'beach-cleanup', label: 'Beach Cleanup', icon: 'water' },
    { id: 'park-restoration', label: 'Park Restoration', icon: 'leaf' },
    { id: 'urban-cleanup', label: 'Urban Cleanup', icon: 'business' },
    { id: 'river-cleanup', label: 'River Cleanup', icon: 'boat' },
    { id: 'forest-restoration', label: 'Forest Restoration', icon: 'tree' },
    { id: 'recycling-drive', label: 'Recycling Drive', icon: 'refresh' },
  ];

  const urgencyLevels = [
    { id: 'low', label: 'Low Priority', color: theme.success },
    { id: 'medium', label: 'Medium Priority', color: theme.warning },
    { id: 'high', label: 'High Priority', color: theme.error },
    { id: 'urgent', label: 'Urgent', color: '#dc2626' },
  ];

  const handleSubmit = () => {
    if (!jobData.title || !jobData.description || !jobData.location || !jobData.budget) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    Alert.alert('Success', 'Environmental mission posted successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenLayout>
      {/* Role-based Header with Back Button */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.background }]}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={getRoleColor('business')} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Create Environmental Mission</Text>
          <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}>
            Post cleanup opportunities for eco warriors
          </Text>
        </View>
      </View>
      
      <ScrollView style={styles.scrollContent}>

      <View style={styles.form}>
        {/* Mission Category Selection */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textColor }]}>Mission Category *</Text>
          <ScrollView {...({ horizontal: true, showsHorizontalScrollIndicator: false } as any)} style={styles.categoryScroll}>
            {missionCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && { backgroundColor: theme.primary },
                  { borderColor: theme.borderColor }
                ]}
                onPress={() => {
                  setSelectedCategory(category.id);
                  setJobData({ ...jobData, category: category.id });
                }}
              >
                <Ionicons 
                  name={category.icon} 
                  size={20} 
                  color={selectedCategory === category.id ? 'white' : theme.primary} 
                />
                <Text style={[
                  styles.categoryLabel,
                  { color: selectedCategory === category.id ? 'white' : theme.textColor }
                ]}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textColor }]}>Mission Title *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor, color: theme.textColor }]}
            value={jobData.title}
            onChangeText={(text) => setJobData({ ...jobData, title: text })}
            placeholder="e.g., Beach Cleanup Initiative"
            placeholderTextColor={theme.secondaryText}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textColor }]}>Mission Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor, color: theme.textColor }]}
            value={jobData.description}
            onChangeText={(text) =>
              setJobData({ ...jobData, description: text })
            }
            placeholder="Describe the environmental mission objectives, scope, and expected outcomes..."
            placeholderTextColor={theme.secondaryText}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textColor }]}>Mission Location *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor, color: theme.textColor }]}
            value={jobData.location}
            onChangeText={(text) => setJobData({ ...jobData, location: text })}
            placeholder="e.g., Santa Monica Beach, Los Angeles"
            placeholderTextColor={theme.secondaryText}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: theme.textColor }]}>Start Date</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor, color: theme.textColor }]}
              value={jobData.date}
              onChangeText={(text) => setJobData({ ...jobData, date: text })}
              placeholder="MM/DD/YYYY"
              placeholderTextColor={theme.secondaryText}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: theme.textColor }]}>Duration</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor, color: theme.textColor }]}
              value={jobData.duration}
              onChangeText={(text) =>
                setJobData({ ...jobData, duration: text })
              }
              placeholder="e.g., 3 hours"
              placeholderTextColor={theme.secondaryText}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: theme.textColor }]}>Mission Budget *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor, color: theme.textColor }]}
              value={jobData.budget}
              onChangeText={(text) => setJobData({ ...jobData, budget: text })}
              placeholder="e.g., $450"
              placeholderTextColor={theme.secondaryText}
              {...({ keyboardType: "numeric" } as any)}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: theme.textColor }]}>Max Volunteers</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor, color: theme.textColor }]}
              value={jobData.maxVolunteers}
              onChangeText={(text) => setJobData({ ...jobData, maxVolunteers: text })}
              placeholder="e.g., 12"
              placeholderTextColor={theme.secondaryText}
              {...({ keyboardType: "numeric" } as any)}
            />
          </View>
        </View>

        {/* Mission Priority Selection */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textColor }]}>Mission Priority</Text>
          <View style={styles.urgencyContainer}>
            {urgencyLevels.map((urgency) => (
              <TouchableOpacity
                key={urgency.id}
                style={[
                  styles.urgencyButton,
                  selectedUrgency === urgency.id && { backgroundColor: urgency.color },
                  { borderColor: urgency.color }
                ]}
                onPress={() => {
                  setSelectedUrgency(urgency.id);
                  setJobData({ ...jobData, urgency: urgency.id });
                }}
              >
                <Text style={[
                  styles.urgencyText,
                  { color: selectedUrgency === urgency.id ? 'white' : urgency.color }
                ]}>{urgency.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: theme.primary }]} 
          onPress={handleSubmit}
        >
          <Ionicons name="rocket" size={20} color="white" />
          <Text style={styles.submitButtonText}>Launch Environmental Mission</Text>
        </TouchableOpacity>
      </View>
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
    padding: THEME.SPACING.md + 4,
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
    marginRight: THEME.SPACING.md,
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
    fontSize: THEME.TYPOGRAPHY.fontSize["2xl"],
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    marginTop: THEME.SPACING.xs,
  },
  scrollContent: {
    flex: 1,
  },
  form: {
    padding: THEME.SPACING.md + 4,
  },
  inputGroup: {
    marginBottom: THEME.SPACING.lg,
  },
  label: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    marginBottom: THEME.SPACING.sm + 4,
  },
  input: {
    borderRadius: THEME.BORDER_RADIUS.lg,
    padding: THEME.SPACING.md,
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryScroll: {
    marginTop: THEME.SPACING.sm,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.lg,
    borderWidth: 2,
    marginRight: THEME.SPACING.sm + 4,
    gap: 8,
  },
  categoryLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  urgencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: THEME.SPACING.sm,
  },
  urgencyButton: {
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  urgencyText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: THEME.BORDER_RADIUS.xl,
    marginTop: THEME.SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginLeft: THEME.SPACING.sm,
  },
});

export default PostJob;
