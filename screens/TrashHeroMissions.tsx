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
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import MenuModal from '../components/MenuModal';
import DailyQuests from '../components/DailyQuests';
import PEARScreen from '../components/PEARScreen';

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
          borderColor: theme.borderColor, 
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
    <PEARScreen
      title="Trash Hero Missions"
      role="TRASH_HERO"
      showHeader={true}
      showScroll={true}
      enableRefresh={true}
      onRefresh={() => {
        // Refresh missions data
        console.log('Refreshing missions...');
      }}
      refreshing={false}
    >
      {/* Menu Button */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => setShowMenu(true)}
      >
        <Ionicons name="menu" size={24} color={theme.textColor} />
      </TouchableOpacity>
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
    </PEARScreen>
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
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    paddingTop: THEME.SPACING.sm,
  },
  menuButton: {
    marginBottom: THEME.SPACING.sm,
  },
  pearLogo: {
    paddingHorizontal: THEME.SPACING.md + 4,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: 20,
  },
  pearText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
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
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  notificationButton: {
    position: 'relative',
    padding: THEME.SPACING.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: getRoleColor('impact-warrior'),
    borderRadius: THEME.BORDER_RADIUS.md,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  profileButton: {
    position: 'relative',
    width: 32,
    height: 32,
    borderRadius: THEME.BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#28a745',
    borderRadius: THEME.BORDER_RADIUS.md,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBadgeText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.md,
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
    fontSize: THEME.TYPOGRAPHY.fontSize["2xl"],
    fontWeight: '700',
    marginBottom: THEME.SPACING.xs,
  },
  subtitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: THEME.BORDER_RADIUS["2xl"],
    alignItems: 'center',
    justifyContent: 'center',
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
  statsBanner: {
    flexDirection: 'row',
    borderRadius: THEME.BORDER_RADIUS.lg,
    padding: THEME.SPACING.md,
    marginBottom: THEME.SPACING.md + 4,
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
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: '800',
    marginBottom: THEME.SPACING.xs,
  },
  statLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  missionsList: {
    paddingBottom: THEME.SPACING.md + 4,
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
    // color: theme.background,
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
    // color: theme.background,
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
    // color: theme.background,
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
});

export default TrashHeroMissions;