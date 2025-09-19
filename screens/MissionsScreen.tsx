import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../hooks/useXP';
import { useRoleManager } from '../hooks/useRoleManager';
import { getRoleColor } from '../types/roles';
import MenuModal from '../components/MenuModal';
import UnifiedHeader from '../components/UnifiedHeader';

const { width } = Dimensions.get('window');

interface Mission {
  id: number;
  title: string;
  location: string;
  date: string;
  payment: string;
  duration: string;
  type: 'paid' | 'volunteer';
  priority: 'high' | 'medium' | 'low';
  volunteers: number;
  maxVolunteers: number;
  description: string;
  sponsor: string;
  distance: string;
  xpReward: number;
  requirements: string[];
  status: 'available' | 'full' | 'completed';
  category: string;
}

const MissionsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { currentLevel } = useXP();
  const { currentRole } = useRoleManager();
  const [showMenu, setShowMenu] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const userRole = currentRole || 'TRASH_HERO';

  const missions: Mission[] = [
    {
      id: 1,
      title: 'Beach Cleanup Initiative',
      location: 'Santa Monica Beach',
      date: 'Today, 2:00 PM',
      payment: '$45',
      duration: '3 hours',
      type: 'paid',
      priority: 'high',
      volunteers: 8,
      maxVolunteers: 15,
      description: 'Join us for a comprehensive beach cleanup to protect marine life and preserve our coastline.',
      sponsor: 'Ocean Conservation Corp',
      distance: '2.3 miles',
      xpReward: 150,
      requirements: ['Basic cleanup equipment', 'Comfortable walking shoes'],
      status: 'available',
      category: 'cleanup'
    },
    {
      id: 2,
      title: 'River Cleanup Drive',
      location: 'Mill Creek Trail',
      date: 'This Weekend',
      payment: '$35',
      duration: '2 hours',
      type: 'paid',
      priority: 'high',
      volunteers: 6,
      maxVolunteers: 10,
      description: 'Critical cleanup needed to protect local watershed and wildlife habitat.',
      sponsor: 'EcoTech Solutions',
      distance: '1.8 miles',
      xpReward: 120,
      requirements: ['Waterproof boots', 'Gloves provided'],
      status: 'available',
      category: 'cleanup'
    },
    {
      id: 3,
      title: 'Tree Planting Event',
      location: 'Griffith Park',
      date: 'Next Tuesday, 9:00 AM',
      payment: '$50',
      duration: '4 hours',
      type: 'paid',
      priority: 'medium',
      volunteers: 12,
      maxVolunteers: 20,
      description: 'Help restore urban forest by planting native trees and shrubs.',
      sponsor: 'Green Earth Foundation',
      distance: '4.2 miles',
      xpReward: 200,
      requirements: ['Work gloves', 'Water bottle', 'Sun hat'],
      status: 'available',
      category: 'restoration'
    },
    {
      id: 4,
      title: 'Community Garden Maintenance',
      location: 'Downtown Community Center',
      date: 'Next Friday, 10:00 AM',
      payment: '$30',
      duration: '3 hours',
      type: 'volunteer',
      priority: 'low',
      volunteers: 5,
      maxVolunteers: 8,
      description: 'Help maintain community garden and teach sustainable gardening practices.',
      sponsor: 'Local Community Center',
      distance: '1.2 miles',
      xpReward: 100,
      requirements: ['Garden gloves', 'Comfortable clothes'],
      status: 'available',
      category: 'gardening'
    },
    {
      id: 5,
      title: 'Mountain Trail Cleanup',
      location: 'Runyon Canyon',
      date: 'Next Sunday, 8:00 AM',
      payment: '$60',
      duration: '5 hours',
      type: 'paid',
      priority: 'high',
      volunteers: 3,
      maxVolunteers: 12,
      description: 'Challenging mountain trail cleanup with scenic views and wildlife encounters.',
      sponsor: 'Mountain Conservation Alliance',
      distance: '5.2 miles',
      xpReward: 250,
      requirements: ['Hiking boots', 'Backpack', 'Water bottles'],
      status: 'available',
      category: 'cleanup'
    }
  ];

  const filters = [
    { key: 'all', label: 'All Missions' },
    { key: 'paid', label: 'Paid' },
    { key: 'volunteer', label: 'Volunteer' },
    { key: 'high', label: 'High Priority' }
  ];

  const categories = [
    { key: 'all', label: 'All Categories', icon: 'grid-outline' },
    { key: 'cleanup', label: 'Cleanup', icon: 'trash-outline' },
    { key: 'restoration', label: 'Restoration', icon: 'leaf-outline' },
    { key: 'gardening', label: 'Gardening', icon: 'flower-outline' }
  ];

  const getFilteredMissions = () => {
    return missions.filter(mission => {
      const filterMatch = selectedFilter === 'all' || 
        mission.type === selectedFilter || 
        mission.priority === selectedFilter;
      
      const categoryMatch = selectedCategory === 'all' || 
        mission.category === selectedCategory;
      
      return filterMatch && categoryMatch;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF4444';
      case 'medium': return '#FF9800';
      case 'low': return '#90E31C';
      default: return '#666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#90E31C';
      case 'full': return '#FF4444';
      case 'completed': return '#007bff';
      default: return '#666';
    }
  };

  const MissionCard: React.FC<{ mission: Mission }> = ({ mission }) => (
    <View style={styles.missionCard}>
      {/* Mission Header */}
      <View style={styles.missionHeader}>
        <View style={styles.missionTitleSection}>
          <Text style={styles.missionTitle}>{mission.title}</Text>
          <View style={styles.missionMeta}>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.locationText}>{mission.location}</Text>
            </View>
            <Text style={styles.distanceText}>{mission.distance}</Text>
          </View>
        </View>
        <View style={styles.priorityBadge}>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(mission.priority) }]} />
          <Text style={styles.priorityText}>{mission.priority.toUpperCase()}</Text>
        </View>
      </View>

      {/* Mission Details */}
      <View style={styles.missionDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{mission.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{mission.duration}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{mission.sponsor}</Text>
        </View>
      </View>

      {/* Mission Description */}
      <Text style={styles.missionDescription}>{mission.description}</Text>

      {/* Rewards and Stats */}
      <View style={styles.rewardsSection}>
        <View style={styles.rewardItem}>
          <Text style={styles.rewardLabel}>Payment</Text>
          <Text style={[styles.rewardValue, { color: getRoleColor(userRole) }]}>
            {mission.payment}
          </Text>
        </View>
        <View style={styles.rewardItem}>
          <Text style={styles.rewardLabel}>XP Reward</Text>
          <Text style={[styles.rewardValue, { color: '#FF9800' }]}>
            +{mission.xpReward} XP
          </Text>
        </View>
        <View style={styles.rewardItem}>
          <Text style={styles.rewardLabel}>Volunteers</Text>
          <Text style={[styles.rewardValue, { color: '#007bff' }]}>
            {mission.volunteers}/{mission.maxVolunteers}
          </Text>
        </View>
      </View>

      {/* Requirements */}
      <View style={styles.requirementsSection}>
        <Text style={styles.requirementsTitle}>Requirements:</Text>
        {mission.requirements.map((req, index) => (
          <View key={index} style={styles.requirementItem}>
            <Ionicons name="checkmark-circle-outline" size={14} color="#90E31C" />
            <Text style={styles.requirementText}>{req}</Text>
          </View>
        ))}
      </View>

      {/* Action Button */}
      <TouchableOpacity 
        style={[
          styles.actionButton, 
          { backgroundColor: getRoleColor(userRole) },
          mission.status !== 'available' && styles.disabledButton
        ]}
        disabled={mission.status !== 'available'}
      >
        <Text style={styles.actionButtonText}>
          {mission.status === 'available' ? 'Join Mission' : 
           mission.status === 'full' ? 'Mission Full' : 'Completed'}
        </Text>
        <Ionicons name="arrow-forward" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <UnifiedHeader
          onMenuPress={() => setShowMenu(true)}
          role={userRole}
          onNotificationPress={() => navigation.navigate('Notifications')}
          onProfilePress={() => navigation.navigate('ProfileScreen', { 
            role: userRole,
            onSignOut: () => navigation.navigate('Login')
          })}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollableContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Missions</Text>
          <Text style={styles.screenSubtitle}>Find and join environmental missions</Text>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.key && styles.activeFilterButton
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === filter.key && styles.activeFilterButtonText
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category Buttons */}
        <View style={styles.categorySection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.key && styles.activeCategoryButton
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={18} 
                  color={selectedCategory === category.key ? 'white' : '#666'} 
                />
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category.key && styles.activeCategoryButtonText
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Mission Cards */}
        <View style={styles.missionsSection}>
          {getFilteredMissions().map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </View>

        {/* Empty State */}
        {getFilteredMissions().length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No missions found</Text>
            <Text style={styles.emptyStateSubtitle}>
              Try adjusting your filters to see more missions
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={userRole}
        userName={user?.name || 'TrashHero Pro'}
        userLevel={currentLevel.level}
        onNavigate={(screen, params) => {
          console.log('Navigating to:', screen, params);
          navigation.navigate(screen, params);
        }}
        onSignOut={async () => {
          console.log('Sign out pressed');
          try {
            await logout();
            navigation.getParent()?.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (error) {
            console.error('Logout failed:', error);
            navigation.getParent()?.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'white',
  },
  scrollableContent: {
    flex: 1,
    paddingTop: 120,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  // Header Section
  headerSection: {
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },

  // Filter Section
  filterSection: {
    marginBottom: 16,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#1f2937',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: 'white',
  },

  // Category Section
  categorySection: {
    marginBottom: 20,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeCategoryButton: {
    backgroundColor: '#1f2937',
    borderColor: '#1f2937',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  activeCategoryButtonText: {
    color: 'white',
  },

  // Mission Cards
  missionsSection: {
    gap: 16,
  },
  missionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },

  // Mission Header
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  missionTitleSection: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  missionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  distanceText: {
    fontSize: 14,
    color: '#6b7280',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },

  // Mission Details
  missionDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },

  // Mission Description
  missionDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },

  // Rewards Section
  rewardsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  rewardItem: {
    alignItems: 'center',
  },
  rewardLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  rewardValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Requirements Section
  requirementsSection: {
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 6,
  },

  // Action Button
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginRight: 8,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default MissionsScreen;
