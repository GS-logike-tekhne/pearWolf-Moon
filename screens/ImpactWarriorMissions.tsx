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
import ScreenLayout from '../components/ScreenLayout';
import MenuModal from '../components/MenuModal';

const { width } = Dimensions.get('window');

const ImpactWarriorMissions = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const missions = [
    {
      id: 1,
      title: 'Community Beach Day',
      location: 'Venice Beach',
      date: 'Saturday, 9:00 AM',
      ecoPoints: '120 points',
      duration: '4 hours',
      type: 'community',
      impact: 'high',
      volunteers: 24,
      description: 'Join fellow warriors for a massive community cleanup to protect our marine ecosystem.',
      organizer: 'Ocean Guardians Coalition',
      category: 'Marine Conservation'
    },
    {
      id: 2,
      title: 'Urban Forest Restoration',
      location: 'Griffith Park',
      date: 'Sunday, 8:00 AM',
      ecoPoints: '95 points',
      duration: '5 hours',
      type: 'conservation',
      impact: 'high',
      volunteers: 18,
      description: 'Help restore native habitat by removing invasive species and planting native trees.',
      organizer: 'City Conservation Team',
      category: 'Forest Restoration'
    },
    {
      id: 3,
      title: 'Neighborhood Cleanup Drive',
      location: 'Westwood Village',
      date: 'Next Monday, 3:00 PM',
      ecoPoints: '75 points',
      duration: '2 hours',
      type: 'community',
      impact: 'medium',
      volunteers: 12,
      description: 'Quick neighborhood cleanup to maintain our community spaces.',
      organizer: 'Westwood Residents Assoc.',
      category: 'Community Care'
    },
    {
      id: 4,
      title: 'River Trail Restoration',
      location: 'LA River Trail',
      date: 'Next Wednesday, 7:00 AM',
      ecoPoints: '85 points',
      duration: '3 hours',
      type: 'conservation',
      impact: 'high',
      volunteers: 8,
      description: 'Early morning mission to restore critical river ecosystem pathways.',
      organizer: 'River Restoration Alliance',
      category: 'Water Conservation'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Marine Conservation': return '#3b82f6';
      case 'Forest Restoration': return '#10b981';
      case 'Community Care': return '#8b5cf6';
      case 'Water Conservation': return '#06b6d4';
      default: return '#64748b';
    }
  };

  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mission.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || mission.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { id: 'all', label: 'All Missions', icon: 'list' },
    { id: 'community', label: 'Community', icon: 'people' },
    { id: 'conservation', label: 'Conservation', icon: 'leaf' }
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
            <View style={[styles.volunteerBadge, { backgroundColor: theme.primary }]}>
              <Ionicons name="heart" size={12} color="white" />
              <Text style={styles.volunteerBadgeText}>VOLUNTEER</Text>
            </View>
            <View style={[
              styles.impactBadge,
              { backgroundColor: getImpactColor(mission.impact) }
            ]}>
              <Text style={styles.impactBadgeText}>
                {mission.impact.toUpperCase()} IMPACT
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(mission.category) }]}>
        <Text style={styles.categoryBadgeText}>{mission.category}</Text>
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
            {mission.volunteers} warriors joined
          </Text>
        </View>
      </View>

      <View style={styles.organizerSection}>
        <Text style={[styles.organizerLabel, { color: theme.secondaryText }]}>
          Organized by:
        </Text>
        <Text style={[styles.organizerName, { color: theme.primary }]}>
          {mission.organizer}
        </Text>
      </View>
      
      <View style={styles.missionFooter}>
        <View style={styles.pointsSection}>
          <Ionicons name="trophy" size={18} color={theme.warning} />
          <Text style={[styles.missionPoints, { color: theme.primary }]}>
            {mission.ecoPoints}
          </Text>
          <Text style={[styles.missionDuration, { color: theme.secondaryText }]}>
            • {mission.duration}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.joinButton, { backgroundColor: theme.primary }]}
          onPress={() => {
            // Navigate to mission details or confirmation
            navigation.navigate('JobDetails', { mission });
          }}
        >
          <Text style={styles.joinButtonText}>Join Mission</Text>
          <Ionicons name="add" size={16} color="white" />
        </TouchableOpacity>
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
    <ScreenLayout>
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
            <Text style={[styles.pointsText, { color: theme.textColor }]}>850</Text>
            <Ionicons name="help-circle" size={16} color={theme.secondaryText} />
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={20} color={theme.textColor} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
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
            <Ionicons name="arrow-back" size={24} color={getRoleColor('impact-warrior')} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.primary }]}>
              Community Missions
            </Text>
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
              {filteredMissions.length} volunteer opportunities available
            </Text>
          </View>
          <View style={[styles.heroIcon, { backgroundColor: theme.primary }]}>
            <Ionicons name="heart" size={24} color="white" />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.cardBackground }]}>
            <Ionicons name="search" size={20} color={theme.secondaryText} />
            <TextInput
              style={[styles.searchInput, { color: theme.textColor }]}
              placeholder="Search missions or causes..."
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
            style={styles.horizontalScroll}
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
            <Text style={[styles.statNumber, { color: theme.warning }]}>
              375
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              Avg. Points
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.borderColor }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.error }]}>
              {missions.filter(m => m.impact === 'high').length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              High Impact
            </Text>
          </View>
        </View>

        {/* Mission Introduction */}
        <View style={[styles.introSection, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.introIcon, { backgroundColor: theme.primary }]}>
            <Ionicons name="earth" size={20} color="white" />
          </View>
          <View style={styles.introText}>
            <Text style={[styles.introTitle, { color: theme.textColor }]}>
              Make a Real Impact
            </Text>
            <Text style={[styles.introSubtitle, { color: theme.secondaryText }]}>
              Join community-driven missions and earn eco points while protecting our planet
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
              <Ionicons name="heart-outline" size={48} color={theme.secondaryText} />
              <Text style={[styles.emptyTitle, { color: theme.textColor }]}>
                No missions found
              </Text>
              <Text style={[styles.emptyDescription, { color: theme.secondaryText }]}>
                Try adjusting your search or filters to find volunteer opportunities.
              </Text>
              <TouchableOpacity 
                style={[styles.refreshButton, { backgroundColor: theme.primary }]}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
              >
                <Text style={styles.refreshButtonText}>Show All Missions</Text>
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
        userRole="VOLUNTEER"
        userName="Impact Warrior"
        userLevel={3}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    paddingTop: THEME.SPACING.sm,
  },
  menuButton: {
    padding: THEME.SPACING.sm,
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
    marginBottom: THEME.SPACING.md,
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
  introSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginBottom: THEME.SPACING.md + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  introIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.sm + 4,
  },
  introText: {
    flex: 1,
  },
  introTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    marginBottom: THEME.SPACING.xs,
  },
  introSubtitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    lineHeight: 16,
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
  volunteerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: 6,
    gap: 4,
  },
  volunteerBadgeText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    // color: theme.background,
  },
  impactBadge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: 6,
    alignItems: 'center',
  },
  impactBadgeText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
    // color: theme.background,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginBottom: THEME.SPACING.sm + 4,
  },
  categoryBadgeText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
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
  organizerSection: {
    marginBottom: THEME.SPACING.md,
    paddingTop: THEME.SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  organizerLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    marginBottom: 2,
  },
  organizerName: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  missionPoints: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
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
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: THEME.BORDER_RADIUS.md,
    gap: 6,
  },
  joinButtonText: {
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
  filterContainer: {
    paddingHorizontal: THEME.SPACING.md,
    marginBottom: THEME.SPACING.md,
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
  horizontalScroll: {
    flexGrow: 0,
  },
});

export default ImpactWarriorMissions;