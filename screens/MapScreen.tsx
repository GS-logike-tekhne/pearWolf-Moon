import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';

const MapScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const role = route?.params?.role || 'business';

  const handleBack = () => {
    navigation.goBack();
  };
  const nearbyJobs = [
    { id: 1, title: 'Beach Cleanup', distance: '0.5 miles', type: 'cleanup' },
    { id: 2, title: 'Park Restoration', distance: '1.2 miles', type: 'restoration' },
    { id: 3, title: 'River Cleanup', distance: '2.1 miles', type: 'cleanup' },
  ];

  const JobPin = ({ job }) => (
    <TouchableOpacity style={styles.jobPin}>
      <Ionicons 
        name={job.type === 'cleanup' ? 'trash' : 'leaf'} 
        size={16} 
        color="white" 
      />
      <Text style={styles.jobPinText}>{job.title}</Text>
      <Text style={styles.jobDistance}>{job.distance}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Role-based Header with Back Button */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: 'white' }]}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={getRoleColor(role)} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Cleanup Locations</Text>
          <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}>Find nearby environmental missions</Text>
        </View>
      </View>
      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={64} color="#9ca3af" />
          <Text style={styles.mapText}>Interactive map would appear here</Text>
          <Text style={styles.mapSubtext}>Showing cleanup locations and opportunities</Text>
        </View>
        
        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="locate" size={20} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="layers" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHandle} />
        <Text style={styles.bottomSheetTitle}>Nearby Opportunities</Text>
        
        <ScrollView style={styles.jobsList}>
          {nearbyJobs.map((job) => (
            <JobPin key={job.id} job={job} />
          ))}
        </ScrollView>
      </View>
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
  },
  mapText: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 16,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  mapControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    gap: 8,
  },
  controlButton: {
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    maxHeight: 300,
  },
  bottomSheetHandle: {
    width: 32,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  jobsList: {
    flex: 1,
  },
  jobPin: {
    backgroundColor: '#1e40af',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  jobPinText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  jobDistance: {
    color: '#bfdbfe',
    fontSize: 12,
  },
});

export default MapScreen;