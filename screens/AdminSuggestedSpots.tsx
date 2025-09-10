import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';

interface SuggestedSpot {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  suggestedBy: string;
  suggestedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedTrash: string;
  imageUrl?: string;
  votes: number;
}

interface AdminSuggestedSpotsProps {
  navigation: any;
}

const AdminSuggestedSpots: React.FC<AdminSuggestedSpotsProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [spots, setSpots] = useState<SuggestedSpot[]>([
    {
      id: '1',
      title: 'Riverside Park Cleanup',
      description: 'Heavy accumulation of plastic bottles and food containers near the river bank. Area frequented by families and joggers.',
      location: 'Riverside Park, Main Street',
      coordinates: { latitude: 40.7128, longitude: -74.0060 },
      suggestedBy: 'Sarah Johnson',
      suggestedDate: '2024-03-01',
      status: 'pending',
      priority: 'high',
      estimatedTrash: '50-100 lbs',
      votes: 12,
    },
    {
      id: '2',
      title: 'Beach Access Trail',
      description: 'Trail to beach has accumulated significant litter from beachgoers. Affects local wildlife habitat.',
      location: 'Sunset Beach Trail',
      coordinates: { latitude: 40.7589, longitude: -73.9851 },
      suggestedBy: 'Mike Wilson',
      suggestedDate: '2024-03-02',
      status: 'approved',
      priority: 'medium',
      estimatedTrash: '20-50 lbs',
      votes: 8,
    },
    {
      id: '3',
      title: 'Highway Underpass',
      description: 'Homeless encampment area with significant trash accumulation. Needs sensitive approach.',
      location: 'I-95 Underpass, Oak Street',
      coordinates: { latitude: 40.7282, longitude: -74.0776 },
      suggestedBy: 'Alex Chen',
      suggestedDate: '2024-03-03',
      status: 'pending',
      priority: 'urgent',
      estimatedTrash: '100+ lbs',
      votes: 15,
    },
    {
      id: '4',
      title: 'School Playground',
      description: 'Elementary school playground with scattered litter after weekend events.',
      location: 'Lincoln Elementary School',
      coordinates: { latitude: 40.7505, longitude: -73.9934 },
      suggestedBy: 'Jennifer Davis',
      suggestedDate: '2024-03-04',
      status: 'rejected',
      priority: 'low',
      estimatedTrash: '10-20 lbs',
      votes: 3,
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return getRoleColor('admin');
      case 'urgent': return getRoleColor('impact-warrior');
      default: return theme.primary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return getRoleColor('impact-warrior');
      default: return theme.secondaryText;
    }
  };

  const handleSpotAction = (spot: SuggestedSpot, action: 'approve' | 'reject') => {
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Spot`,
      `Are you sure you want to ${action} "${spot.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          onPress: () => {
            setSpots(spots.map(s => 
              s.id === spot.id ? { ...s, status: action === 'approve' ? 'approved' : 'rejected' } : s
            ));
            Alert.alert('Success', `Spot ${action}d successfully`);
          },
        },
      ]
    );
  };

  const handleCreateJob = (spot: SuggestedSpot) => {
    Alert.alert(
      'Create Cleanup Job',
      `Create a cleanup job for "${spot.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create Job',
          onPress: () => {
            navigation.navigate('PostJob', { 
              suggestedSpot: spot,
              prefilledData: {
                title: spot.title,
                description: spot.description,
                location: spot.location,
                coordinates: spot.coordinates,
              }
            });
          },
        },
      ]
    );
  };

  const filteredSpots = spots.filter(spot => {
    if (selectedFilter === 'all') return true;
    return spot.status === selectedFilter || spot.priority === selectedFilter;
  });

  const SpotCard = ({ spot }: { spot: SuggestedSpot }) => (
    <View style={[styles.spotCard, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.spotHeader}>
        <View style={styles.spotInfo}>
          <Text style={[styles.spotTitle, { color: theme.textColor }]}>{spot.title}</Text>
          <Text style={[styles.spotLocation, { color: theme.secondaryText }]}>
            <Ionicons name="location" size={14} color={theme.secondaryText} /> {spot.location}
          </Text>
        </View>
        <View style={styles.badges}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(spot.priority) }]}>
            <Text style={styles.badgeText}>{spot.priority}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(spot.status) }]}>
            <Text style={styles.badgeText}>{spot.status}</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.spotDescription, { color: theme.secondaryText }]}>
        {spot.description}
      </Text>

      <View style={styles.spotMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="person" size={16} color={theme.secondaryText} />
          <Text style={[styles.metaText, { color: theme.secondaryText }]}>
            Suggested by {spot.suggestedBy}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="calendar" size={16} color={theme.secondaryText} />
          <Text style={[styles.metaText, { color: theme.secondaryText }]}>
            {new Date(spot.suggestedDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="scale" size={16} color={theme.secondaryText} />
          <Text style={[styles.metaText, { color: theme.secondaryText }]}>
            Est. {spot.estimatedTrash}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="thumbs-up" size={16} color={theme.secondaryText} />
          <Text style={[styles.metaText, { color: theme.secondaryText }]}>
            {spot.votes} votes
          </Text>
        </View>
      </View>

      <View style={styles.spotActions}>
        {spot.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#28a745' }]}
              onPress={() => handleSpotAction(spot, 'approve')}
            >
              <Ionicons name="checkmark" size={16} color="white" />
              <Text style={styles.actionButtonText}>Approve</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: getRoleColor('impact-warrior') }]}
              onPress={() => handleSpotAction(spot, 'reject')}
            >
              <Ionicons name="close" size={16} color="white" />
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
          </>
        )}
        
        {spot.status === 'approved' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: getRoleColor('business') }]}
            onPress={() => handleCreateJob(spot)}
          >
            <Ionicons name="add-circle" size={16} color="white" />
            <Text style={styles.actionButtonText}>Create Job</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#6c757d' }]}
          onPress={() => navigation.navigate('MapScreen', { 
            initialLocation: spot.coordinates,
            selectedSpot: spot 
          })}
        >
          <Ionicons name="map" size={16} color="white" />
          <Text style={styles.actionButtonText}>View Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#17a2b8' }]}
          onPress={() => navigation.navigate('SpotDetails', { spotId: spot.id })}
        >
          <Ionicons name="eye" size={16} color="white" />
          <Text style={styles.actionButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={getRoleColor('admin')} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Suggested Cleanup Spots
        </Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {['all', 'pending', 'approved', 'rejected', 'urgent', 'high', 'medium', 'low'].map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                { backgroundColor: selectedFilter === filter ? theme.primary : theme.cardBackground }
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                { color: selectedFilter === filter ? 'white' : theme.textColor }
              ]}>
                {filter.replace('_', ' ').toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statValue, { color: theme.textColor }]}>
            {spots.filter(s => s.status === 'pending').length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Pending</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statValue, { color: theme.textColor }]}>
            {spots.filter(s => s.status === 'approved').length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Approved</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statValue, { color: theme.textColor }]}>
            {spots.filter(s => s.priority === 'urgent').length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Urgent</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statValue, { color: theme.textColor }]}>
            {spots.reduce((sum, s) => sum + s.votes, 0)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Total Votes</Text>
        </View>
      </View>

      {/* Spots List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.spotsContainer}>
          {filteredSpots.map(spot => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {},
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  filterButton: {
    padding: 8,
  },
  filtersSection: {
    paddingVertical: 12,
  },
  filtersContainer: {
    paddingHorizontal: 16,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  spotsContainer: {
    paddingHorizontal: 16,
  },
  spotCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  spotInfo: {
    flex: 1,
    marginRight: 12,
  },
  spotTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  spotLocation: {
    fontSize: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  spotDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  spotMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  spotActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
    minWidth: 80,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default AdminSuggestedSpots;