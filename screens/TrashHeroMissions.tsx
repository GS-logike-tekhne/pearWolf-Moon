import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import MenuModal from '../components/MenuModal';

const { width } = Dimensions.get('window');

const TrashHeroMissions = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
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
      description: 'Join us for a comprehensive beach cleanup to protect marine life and preserve our coastline.',
      sponsor: 'Ocean Conservation Corp'
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
      description: 'Critical cleanup needed to protect local watershed and wildlife habitat.',
      sponsor: 'EcoTech Solutions'
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
      description: 'Evening cleanup focusing on microplastics and debris removal.',
      sponsor: 'Clean Seas Initiative'
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
      description: 'Help restore urban green space by removing litter and maintaining trails.',
      sponsor: 'City Environmental Dept'
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

  const MissionCard = ({ mission }: any) => (
    <TouchableOpacity 
      style={[
        styles.missionCard, 
        { 
          backgroundColor: theme.cardBackground,
          borderColor: theme.borderColor 
        }
      ]}
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
            {mission.location}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={theme.secondaryText} />
          <Text style={[styles.detailText, { color: theme.secondaryText }]}>
            {mission.date}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color={theme.secondaryText} />
          <Text style={[styles.detailText, { color: theme.secondaryText }]}>
            {mission.volunteers} heroes joined
          </Text>
        </View>
      </View>

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
          <TouchableOpacity 
            style={[styles.acceptButton, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.acceptButtonText}>Accept Mission</Text>
            <Ionicons name="checkmark" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const FilterChip = ({ filter }: any) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        { borderColor: theme.borderColor },
        selectedFilter === filter.id && { 
          backgroundColor: theme.primary,
          borderColor: theme.primary 
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
        selectedFilter === filter.id && { color: 'white' }
      ]}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Unified Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
        >
          <Ionicons name="menu" size={24} color={theme.textColor} />
        </TouchableOpacity>
        
        <View style={[styles.pearLogo, { backgroundColor: theme.primary }]}>
          <Text style={styles.pearText}>PEAR</Text>
        </View>
        
        <View style={styles.headerRight}>
          <View style={styles.pointsContainer}>
            <Ionicons name="star" size={16} color="#ffc107" />
            <Text style={[styles.pointsText, { color: theme.textColor }]}>2,450</Text>
            <Ionicons name="help-circle" size={16} color={theme.secondaryText} />
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={20} color={theme.textColor} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>5</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.profileButton, { backgroundColor: theme.primary }]}>
            <Ionicons name="person" size={20} color="white" />
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.cardBackground }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={getRoleColor('trash-hero')} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.primary }]}>
              Trash Hero Missions
            </Text>
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
              {filteredMissions.length} paid cleanup jobs available
            </Text>
          </View>
          <View style={[styles.heroIcon, { backgroundColor: theme.primary }]}>
            <Ionicons name="briefcase" size={24} color="white" />
          </View>
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
            horizontal 
            showsHorizontalScrollIndicator={false}
          >
          {filters.map(filter => (
            <FilterChip key={filter.id} filter={filter} />
          ))}
          </ScrollView>
        </View>

        {/* Stats Banner */}
        <View style={[styles.statsBanner, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {missions.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              Available
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.borderColor }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.success }]}>
              $175
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              Avg. Daily
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.borderColor }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.warning }]}>
              {missions.filter(m => m.priority === 'high').length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              Urgent
            </Text>
          </View>
        </View>

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
      </ScrollView>

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole="TRASH_HERO"
        userName="TrashHero Pro"
        userLevel={6}
        onNavigate={(screen, params) => {
          navigation.navigate(screen, params);
        }}
        onSignOut={() => {
          navigation.navigate('Login');
        }}
      />
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
  },
  menuButton: {
    padding: 8,
  },
  pearLogo: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pearText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: getRoleColor('impact-warrior'),
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  profileButton: {
    position: 'relative',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#28a745',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginRight: 12,
    gap: 6,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsBanner: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  missionsList: {
    paddingBottom: 20,
  },
  missionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  missionHeader: {
    marginBottom: 12,
  },
  missionTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  badgeContainer: {
    gap: 6,
  },
  cashBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  cashBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  missionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  missionDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  sponsorSection: {
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  sponsorLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  sponsorName: {
    fontSize: 14,
    fontWeight: '600',
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
    fontSize: 18,
    fontWeight: '700',
  },
  missionDuration: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  donateBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  missionsContainer: {
    paddingHorizontal: 16,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default TrashHeroMissions;