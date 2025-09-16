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

const JobListings = ({ navigation, route, onSignOut }: { navigation: any; route: any; onSignOut: any }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showMenu, setShowMenu] = useState(false);
  
  const userRole = route?.params?.role || 'business';
  
  const jobs = [
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
      description: 'Join us for a comprehensive beach cleanup to protect marine life and preserve our coastline.'
    },
    {
      id: 2,
      title: 'Community Park Restoration',
      location: 'Central Park',
      date: 'Tomorrow, 9:00 AM',
      payment: '120 points',
      duration: '4 hours',
      type: 'volunteer',
      priority: 'medium',
      volunteers: 12,
      description: 'Help restore our local park by removing litter and planting native vegetation.'
    },
    {
      id: 3,
      title: 'River Cleanup Drive',
      location: 'Mill Creek Trail',
      date: 'This Weekend',
      payment: '$35',
      duration: '2 hours',
      type: 'paid',
      priority: 'high',
      volunteers: 6,
      description: 'Critical cleanup needed to protect local watershed and wildlife habitat.'
    },
    {
      id: 4,
      title: 'Urban Forest Conservation',
      location: 'Griffith Park',
      date: 'Next Monday, 8:00 AM',
      payment: '95 points',
      duration: '5 hours',
      type: 'volunteer',
      priority: 'low',
      volunteers: 15,
      description: 'Participate in trail maintenance and invasive species removal.'
    },
    {
      id: 5,
      title: 'Coastal Plastic Collection',
      location: 'Venice Beach',
      date: 'Next Tuesday, 6:00 PM',
      payment: '$55',
      duration: '3 hours',
      type: 'paid',
      priority: 'high',
      volunteers: 4,
      description: 'Evening cleanup focusing on microplastics and debris removal.'
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

  const getTypeColor = (type: string) => {
    return type === 'paid' ? theme.primary : '#7c3aed';
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || job.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { id: 'all', label: 'All Jobs', icon: 'list' },
    { id: 'paid', label: 'Paid Gigs', icon: 'card' },
    { id: 'volunteer', label: 'Volunteer', icon: 'heart' }
  ];

  const JobCard = ({ job }: { job: any }) => (
    <TouchableOpacity 
      style={[
        styles.jobCard, 
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.borderColor,
          borderLeftColor: getRoleColor(userRole),
        }
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleSection}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <View style={styles.badgeContainer}>
            <View style={[
              styles.typeBadge, 
              { backgroundColor: getTypeColor(job.type) }
            ]}>
              <Text style={styles.typeBadgeText}>
                {job.type === 'paid' ? 'PAID' : 'VOLUNTEER'}
              </Text>
            </View>
            <View style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(job.priority) }
            ]}>
              <Text style={styles.priorityBadgeText}>
                {job.priority.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <Text style={[styles.jobDescription, { color: theme.secondaryText }]}>{job.description}</Text>
      
      <View style={styles.jobDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color={theme.secondaryText} />
          <Text style={[styles.detailText, { color: theme.secondaryText }]}>{job.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={theme.secondaryText} />
          <Text style={[styles.detailText, { color: theme.secondaryText }]}>{job.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color={theme.secondaryText} />
          <Text style={[styles.detailText, { color: theme.secondaryText }]}>{job.volunteers} joined</Text>
        </View>
      </View>
      
      <View style={styles.jobFooter}>
        <View style={styles.paymentSection}>
          <Text style={[styles.jobPayment, { color: getRoleColor(userRole) }]}>
            {job.payment}
          </Text>
          <Text style={[styles.jobDuration, { color: theme.secondaryText }]}> • {job.duration}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.applyButton, { backgroundColor: getRoleColor(userRole) }]}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>
            {userRole === 'business' ? 'Manage' : 'Apply'}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const FilterChip = ({ filter }: { filter: any }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        {
          backgroundColor: selectedFilter === filter.id ? getRoleColor(userRole) : theme.cardBackground,
          borderColor: selectedFilter === filter.id ? getRoleColor(userRole) : theme.borderColor,
        }
      ]}
      onPress={() => setSelectedFilter(filter.id)}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={filter.icon} 
        size={16} 
        color={selectedFilter === filter.id ? 'white' : getRoleColor(userRole)} 
      />
      <Text style={[
        styles.filterText,
        {
          color: selectedFilter === filter.id ? 'white' : theme.textColor
        }
      ]}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      <ScrollView 
        style={styles.scrollContainer}
        {...({ contentContainerStyle: styles.contentContainer, showsVerticalScrollIndicator: false } as any)}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={getRoleColor(userRole)} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>
            {userRole === 'business' ? 'Manage Jobs' : 
             userRole === 'trash-hero' ? 'Available Gigs' : 
             userRole === 'impact-warrior' ? 'Volunteer Opportunities' : 'All Jobs'}
          </Text>
          
          <View style={[styles.opportunitiesBadge, { backgroundColor: getRoleColor(userRole) }]}>
            <Text style={styles.opportunitiesText}>{filteredJobs.length}</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[
            styles.searchBar,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.borderColor,
            }
          ]}>
            <Ionicons name="search" size={20} color={theme.secondaryText} />
            <TextInput
              style={[styles.searchInput, { color: theme.textColor }]}
              placeholder="Search jobs or locations..."
              placeholderTextColor={theme.secondaryText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                <Ionicons name="close" size={20} color={theme.secondaryText} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView 
          {...({ horizontal: true, showsHorizontalScrollIndicator: false } as any)}
          style={styles.filterContainer}
        >
          {filters.map(filter => (
            <FilterChip key={filter.id} filter={filter} />
          ))}
        </ScrollView>

        {/* Stats Banner */}
        <View style={[
          styles.statsBanner,
          {
            backgroundColor: theme.cardBackground,
            borderColor: theme.borderColor,
          }
        ]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: getRoleColor(userRole) }]}>
              {jobs.filter(j => j.type === 'paid').length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Paid Gigs</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.borderColor }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#22c55e' }]}>
              {jobs.filter(j => j.type === 'volunteer').length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Volunteer</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.borderColor }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#f59e0b' }]}>
              {jobs.filter(j => j.priority === 'high').length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Urgent</Text>
          </View>
        </View>

        {/* Jobs List */}
        <View style={styles.jobsList}>
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          
          {filteredJobs.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={64} color="#e2e8f0" />
              <Text style={styles.emptyTitle}>No jobs found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your search or filters to find more opportunities.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={userRole === 'business' ? 'ECO_DEFENDER' : userRole === 'admin' ? 'ADMIN' : userRole === 'trash-hero' ? 'TRASH_HERO' : 'IMPACT_WARRIOR'}
        onNavigate={(screen, params) => navigation.navigate(screen, params)}
        onSignOut={route?.params?.onSignOut || onSignOut}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: THEME.SPACING.md,
    paddingBottom: THEME.SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    paddingTop: THEME.SPACING.sm,
  },
  backButton: {},
  headerTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginRight: THEME.SPACING.xl, // Compensate for opportunities badge
  },
  opportunitiesBadge: {
    width: 32,
    height: 32,
    borderRadius: THEME.BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opportunitiesText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
  },
  searchContainer: {
    marginBottom: THEME.SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: THEME.BORDER_RADIUS.lg,
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    gap: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '400',
  },
  filterContainer: {
    marginBottom: THEME.SPACING.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: 20,
    marginRight: THEME.SPACING.sm + 4,
    gap: 6,
    borderWidth: 1,
    minHeight: 44,
  },
  filterText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  statsBanner: {
    flexDirection: 'row',
    borderRadius: THEME.BORDER_RADIUS.xl,
    padding: THEME.SPACING.md,
    marginBottom: THEME.SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: THEME.TYPOGRAPHY.fontSize["2xl"],
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  jobsList: {
    paddingBottom: THEME.SPACING.md + 4,
  },
  jobCard: {
    borderRadius: THEME.BORDER_RADIUS.xl,
    padding: THEME.SPACING.md,
    marginBottom: THEME.SPACING.md,
    borderWidth: 1,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  jobHeader: {
    marginBottom: THEME.SPACING.md,
  },
  jobTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    flex: 1,
    marginRight: THEME.SPACING.sm + 4,
  },
  badgeContainer: {
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: 6,
    alignItems: 'center',
  },
  typeBadgeText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
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
  },
  jobDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: THEME.SPACING.md,
  },
  jobDetails: {
    gap: 8,
    marginBottom: THEME.SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '400',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobPayment: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  jobDuration: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '400',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: THEME.BORDER_RADIUS.md,
    gap: 6,
  },
  applyButtonText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    color: '#64748b',
    marginTop: THEME.SPACING.md,
    marginBottom: THEME.SPACING.sm,
  },
  emptyText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});

export default JobListings;