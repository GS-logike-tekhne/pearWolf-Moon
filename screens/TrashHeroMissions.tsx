import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';

import { useAuth } from '../context/AuthContext';
import { useXP } from '../hooks/useXP';
import { useRoleManager } from '../hooks/useRoleManager';
import MenuModal from '../components/MenuModal';
import DailyQuests from '../components/DailyQuests';
import ScreenLayout from '../components/ScreenLayout';
import UnifiedHeader from '../components/UnifiedHeader';

const { width } = Dimensions.get('window');

const TrashHeroMissions = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { user, currentRole, logout } = useAuth();
  const { currentLevel, getXPSummary } = useXP();
  const { currentRole: roleFromManager } = useRoleManager();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const xpSummary = getXPSummary();
  const xpTotal = xpSummary.totalXP;
  
  // Use current role from role manager, fallback to trash-hero
  const userRole = roleFromManager || 'TRASH_HERO';
  
  // Start animations on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const missions = [
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
      status: 'available'
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
      status: 'available'
    },
    {
      id: 3,
      title: 'Coastal Plastic Collection',
      location: 'Venice Beach',
      date: 'Next Tuesday, 6:00 PM',
      payment: '$55',
      duration: '3 hours',
      type: 'paid',
      priority: 'medium',
      volunteers: 4,
      maxVolunteers: 8,
      description: 'Evening cleanup focusing on microplastics and debris removal.',
      sponsor: 'Clean Seas Initiative',
      distance: '3.1 miles',
      xpReward: 180,
      requirements: ['Headlamp or flashlight', 'Collection bags provided'],
      status: 'available'
    },
    {
      id: 4,
      title: 'Urban Park Restoration',
      location: 'Downtown Plaza',
      date: 'Next Friday, 10:00 AM',
      payment: '$40',
      duration: '4 hours',
      type: 'paid',
      priority: 'low',
      volunteers: 12,
      maxVolunteers: 20,
      description: 'Help restore urban green space by removing litter and maintaining trails.',
      sponsor: 'City Environmental Dept',
      distance: '0.9 miles',
      xpReward: 200,
      requirements: ['Work gloves', 'Sturdy shoes'],
      status: 'available'
    },
    {
      id: 5,
      title: 'Mountain Trail Cleanup',
      location: 'Griffith Park',
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
      requirements: ['Hiking boots', 'Water bottle', 'Sun protection'],
      status: 'available'
    },
    {
      id: 6,
      title: 'Community Garden Cleanup',
      location: 'Local Community Center',
      date: 'Tomorrow, 9:00 AM',
      payment: '$30',
      duration: '2.5 hours',
      type: 'paid',
      priority: 'medium',
      volunteers: 7,
      maxVolunteers: 15,
      description: 'Help maintain community garden spaces and remove invasive species.',
      sponsor: 'Green Thumb Foundation',
      distance: '1.2 miles',
      xpReward: 100,
      requirements: ['Gardening gloves', 'Knee pads recommended'],
      status: 'available'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mission.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || mission.priority === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { id: 'all', label: 'All Missions', icon: 'list' },
    { id: 'high', label: 'High Pay', icon: 'trending-up' },
    { id: 'medium', label: 'Medium Pay', icon: 'remove' },
    { id: 'low', label: 'Entry Level', icon: 'trending-down' }
  ];

  const MissionCard = ({ mission }: any) => {
    const handleAcceptMission = () => {
      // Add mission acceptance logic here
      console.log('Accepting mission:', mission.id);
      // You could add navigation to mission details or confirmation modal
    };

    const isFull = mission.volunteers >= mission.maxVolunteers;
    const spotsLeft = mission.maxVolunteers - mission.volunteers;

    return (
      <TouchableOpacity 
        style={[
          styles.missionCard, 
          { 
            backgroundColor: theme.cardBackground,
            borderColor: theme.borderColor,
            opacity: isFull ? 0.7 : 1
          }
        ]}
        onPress={handleAcceptMission}
        disabled={isFull}
      >
        <View style={styles.missionHeader}>
          <View style={styles.missionTitleSection}>
            <Text style={[styles.missionTitle, { color: theme.textColor }]}>
              {mission.title}
            </Text>
            <View style={styles.badgeContainer}>
              <View style={[styles.cashBadge, { backgroundColor: theme.success }]}>
                <Ionicons name="cash" size={12} color="white" />
                <Text style={styles.cashBadgeText}>PAID GIG</Text>
              </View>
              <View style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(mission.priority) }
              ]}>
                <Text style={styles.priorityBadgeText}>
                  {mission.priority.toUpperCase()}
                </Text>
              </View>
              {mission.xpReward && (
                <View style={[styles.xpBadge, { backgroundColor: theme.warning }]}>
                  <Ionicons name="star" size={12} color="white" />
                  <Text style={styles.xpBadgeText}>+{mission.xpReward} XP</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        
        <Text style={[styles.missionDescription, { color: theme.secondaryText }]}>
          {mission.description}
        </Text>
        
        <View style={styles.missionDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color={theme.secondaryText} />
            <Text style={[styles.detailText, { color: theme.secondaryText }]}>
              {mission.location} • {mission.distance}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={theme.secondaryText} />
            <Text style={[styles.detailText, { color: theme.secondaryText }]}>
              {mission.date} • {mission.duration}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={16} color={theme.secondaryText} />
            <Text style={[styles.detailText, { color: theme.secondaryText }]}>
              {mission.volunteers}/{mission.maxVolunteers} heroes • {spotsLeft} spots left
            </Text>
          </View>
        </View>

        {mission.requirements && mission.requirements.length > 0 && (
          <View style={styles.requirementsSection}>
            <Text style={[styles.requirementsLabel, { color: theme.secondaryText }]}>
              Requirements:
            </Text>
            <View style={styles.requirementsList}>
              {mission.requirements.map((req: string, index: number) => (
                <Text key={index} style={[styles.requirementItem, { color: theme.textColor }]}>
                  • {req}
                </Text>
              ))}
            </View>
          </View>
        )}

        <View style={styles.sponsorSection}>
          <Text style={[styles.sponsorLabel, { color: theme.secondaryText }]}>
            Sponsored by:
          </Text>
          <Text style={[styles.sponsorName, { color: theme.primary }]}>
            {mission.sponsor}
          </Text>
        </View>
        
        <View style={styles.missionFooter}>
          <View style={styles.paymentSection}>
            <Text style={[styles.missionPayment, { color: theme.primary }]}>
              {mission.payment}
            </Text>
            <Text style={[styles.missionDuration, { color: theme.secondaryText }]}>
              • {mission.duration}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            {isFull ? (
              <TouchableOpacity 
                style={[styles.fullButton, { backgroundColor: theme.secondaryText }]}
                disabled
              >
                <Text style={styles.fullButtonText}>Mission Full</Text>
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.acceptButton, { backgroundColor: theme.primary }]}
                onPress={handleAcceptMission}
              >
                <Text style={styles.acceptButtonText}>Accept Mission</Text>
                <Ionicons name="checkmark" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const FilterChip = ({ filter }: any) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        { borderColor: theme.borderColor },
        selectedFilter === filter.id && { 
          backgroundColor: theme.primary,
          borderColor: theme.primary, 
        }
      ]}
      onPress={() => setSelectedFilter(filter.id)}
    >
      <Ionicons 
        name={filter.icon} 
        size={16} 
        color={selectedFilter === filter.id ? 'white' : theme.primary} 
      />
      <Text style={[
        styles.filterText,
        { color: theme.secondaryText },
        selectedFilter === filter.id && { color: theme.background }
      ]}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout scrollable={true} padding={{ horizontal: 0, vertical: 0 }}>
      {/* Unified Header */}
      <UnifiedHeader
        onMenuPress={() => setShowMenu(true)}
        role={userRole}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onProfilePress={() => navigation.navigate('ProfileScreen', { 
          role: userRole,
          onSignOut: () => navigation.navigate('Login')
        })}
      />

      {/* Screen Title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.screenTitle, { color: theme.textColor }]}>
          Trash Hero Missions
        </Text>
        <Text style={[styles.screenSubtitle, { color: theme.secondaryText }]}>
          {missions.length} available missions
        </Text>
      </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.cardBackground }]}>
            <Ionicons name="search" size={20} color={theme.secondaryText} />
            <TextInput
              style={[styles.searchInput, { color: theme.textColor }]}
              placeholder="Search missions or locations..."
              placeholderTextColor={theme.secondaryText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close" size={20} color={theme.secondaryText} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          <ScrollView 
            {...({ horizontal: true } as any)} 
            showsHorizontalScrollIndicator={false}
          >
          {filters.map(filter => (
            <FilterChip key={filter.id} filter={filter} />
          ))}
          </ScrollView>
        </View>

        {/* Daily Quests */}
        <DailyQuests />

        {/* Enhanced Stats Banner */}
        <Animated.View 
          style={[
            styles.statsBannerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#9AE630', '#7BC832', '#5FAE34']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsBanner}
          >
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="list" size={20} color="white" />
              </View>
              <Text style={styles.statNumber}>
                {missions.length}
              </Text>
              <Text style={styles.statLabel}>
                Available
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="cash" size={20} color="white" />
              </View>
              <Text style={styles.statNumber}>
                ${Math.round(missions.reduce((sum, m) => sum + parseInt(m.payment.replace('$', '')), 0) / missions.length)}
              </Text>
              <Text style={styles.statLabel}>
                Avg. Pay
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="flash" size={20} color="white" />
              </View>
              <Text style={styles.statNumber}>
                {missions.filter(m => m.priority === 'high').length}
              </Text>
              <Text style={styles.statLabel}>
                High Priority
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Mission Cards */}
        <View style={styles.missionsContainer}>
          {filteredMissions.length > 0 ? (
            filteredMissions.map(mission => (
              <MissionCard key={mission.id} mission={mission} />
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="search" size={48} color={theme.secondaryText} />
              <Text style={[styles.emptyTitle, { color: theme.textColor }]}>
                No missions found
              </Text>
              <Text style={[styles.emptyDescription, { color: theme.secondaryText }]}>
                Try adjusting your search or filters to find available cleanup jobs.
              </Text>
              <TouchableOpacity 
                style={[styles.refreshButton, { backgroundColor: theme.primary }]}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
              >
                <Text style={styles.refreshButtonText}>Show All Jobs</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />

        {/* Floating Action Buttons */}
        <View style={styles.fabContainer}>
          <TouchableOpacity 
            style={[styles.fab, { backgroundColor: '#9AE630' }]}
            onPress={() => navigation.navigate('MapScreen')}
          >
            <Ionicons name="map" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.fab, { backgroundColor: '#FF6B6B' }]}
            onPress={() => navigation.navigate('SuggestCleanup')}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.fab, { backgroundColor: '#8B5CF6' }]}
            onPress={() => navigation.navigate('BadgeSystem')}
          >
            <Ionicons name="medal" size={24} color="white" />
          </TouchableOpacity>
        </View>

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={userRole}
        userName="TrashHero Pro"
        userLevel={typeof currentLevel === 'number' ? currentLevel : 1}
        onNavigate={(screen, params) => {
          navigation.navigate(screen, params);
        }}
        onSignOut={() => {
          navigation.navigate('Login');
        }}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    marginBottom: THEME.SPACING.sm,
  },
  screenTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize["2xl"],
    fontWeight: '700',
    marginBottom: THEME.SPACING.xs,
  },
  screenSubtitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
  },
  searchContainer: {
    paddingHorizontal: THEME.SPACING.md,
    marginBottom: THEME.SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: THEME.BORDER_RADIUS.lg,
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
  },
  filterContainer: {
    paddingHorizontal: THEME.SPACING.md,
    marginBottom: THEME.SPACING.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginRight: THEME.SPACING.sm + 4,
    gap: 6,
    borderWidth: 1,
  },
  filterText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  statsBannerContainer: {
    marginHorizontal: THEME.SPACING.md,
    marginBottom: THEME.SPACING.lg,
  },
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: THEME.SPACING.lg,
    paddingHorizontal: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.SPACING.xs,
  },
  statNumber: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: '800',
    color: 'white',
    marginBottom: THEME.SPACING.xs,
  },
  statLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  missionCard: {
    borderRadius: THEME.BORDER_RADIUS.xl,
    padding: THEME.SPACING.md + 4,
    marginBottom: THEME.SPACING.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  missionHeader: {
    marginBottom: THEME.SPACING.sm + 4,
  },
  missionTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  missionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    flex: 1,
    marginRight: THEME.SPACING.sm + 4,
  },
  badgeContainer: {
    gap: 6,
  },
  cashBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: 6,
    gap: 4,
  },
  cashBadgeText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: 'white',
  },
  priorityBadge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: 6,
    alignItems: 'center',
  },
  priorityBadgeText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: 'white',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: 6,
    gap: 4,
  },
  xpBadgeText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    color: 'white',
  },
  missionDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    lineHeight: 20,
    marginBottom: THEME.SPACING.md,
  },
  missionDetails: {
    gap: 8,
    marginBottom: THEME.SPACING.sm + 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
  },
  sponsorSection: {
    marginBottom: THEME.SPACING.md,
    paddingTop: THEME.SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  sponsorLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    marginBottom: 2,
  },
  sponsorName: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  requirementsSection: {
    marginBottom: THEME.SPACING.sm + 4,
    paddingTop: THEME.SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  requirementsLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    marginBottom: 4,
    fontWeight: '600',
  },
  requirementsList: {
    gap: 2,
  },
  requirementItem: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    lineHeight: 16,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionPayment: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  missionDuration: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  donateBtn: {
    paddingHorizontal: THEME.SPACING.sm + 4,
    paddingVertical: 6,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: THEME.BORDER_RADIUS.md,
    gap: 6,
  },
  acceptButtonText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: 'white',
  },
  fullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: THEME.BORDER_RADIUS.md,
    gap: 6,
  },
  fullButtonText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    marginTop: THEME.SPACING.md,
    marginBottom: THEME.SPACING.sm,
  },
  emptyText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  missionsContainer: {
    paddingHorizontal: THEME.SPACING.md,
  },
  emptyDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
    marginBottom: THEME.SPACING.md + 4,
  },
  refreshButton: {
    paddingHorizontal: THEME.SPACING.lg,
    paddingVertical: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS["2xl"],
  },
  refreshButtonText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
  fabContainer: {
    position: 'absolute' as const,
    bottom: 20,
    right: 20,
    flexDirection: 'column' as const,
    gap: 12,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default TrashHeroMissions;