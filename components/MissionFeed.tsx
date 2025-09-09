import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
// Separate RefreshControl import for better compatibility
const RefreshControl = require('react-native').RefreshControl;
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useMissions } from '../context/MissionContext';
import { useXP } from '../context/XPContext';
import { Mission, MissionType, MISSION_CATEGORIES } from '../types/missions';
import MissionCard from './MissionCard';

const { width } = Dimensions.get('window');

interface MissionFeedProps {
  userRole: 'TRASH_HERO' | 'VOLUNTEER' | 'BUSINESS';
  navigation?: any;
}

const MissionFeed: React.FC<MissionFeedProps> = ({ userRole, navigation }) => {
  const { theme } = useTheme();
  const { state: missionState, refreshMissions } = useMissions();
  const { state: xpState } = useXP();
  const [activeFilter, setActiveFilter] = useState<'all' | MissionType>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter missions based on user role and filters
  const getFilteredMissions = () => {
    let missions = [...missionState.availableMissions, ...missionState.activeMissions];
    
    // Filter by user role
    missions = missions.filter(mission => mission.role === userRole);
    
    // Filter by mission type
    if (activeFilter !== 'all') {
      missions = missions.filter(mission => mission.type === activeFilter);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      missions = missions.filter(mission => mission.category === selectedCategory);
    }
    
    // Sort by status (active first), then by difficulty, then by reward
    return missions.sort((a, b) => {
      // Active missions first
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (b.status === 'active' && a.status !== 'active') return 1;
      
      // Then by difficulty (easier missions first for new users)
      const difficultyOrder = ['Easy', 'Medium', 'Hard', 'Epic'];
      const aDiff = difficultyOrder.indexOf(a.difficulty);
      const bDiff = difficultyOrder.indexOf(b.difficulty);
      
      // Show appropriate difficulty based on user level
      const userLevel = xpState.currentLevel;
      if (userLevel <= 3) {
        // New users see easy missions first
        return aDiff - bDiff;
      } else {
        // Experienced users see higher rewards first
        return b.reward.xp - a.reward.xp;
      }
    });
  };

  const getAvailableCategories = () => {
    const missions = missionState.availableMissions.filter(mission => mission.role === userRole);
    const categories = new Set(missions.map(mission => mission.category));
    return Array.from(categories);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    refreshMissions();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleMissionPress = (mission: Mission) => {
    // Navigate to mission detail screen (to be implemented)
    console.log('Mission pressed:', mission.title);
  };

  const getRoleTitle = () => {
    switch (userRole) {
      case 'TRASH_HERO': return '🦸 Hero Missions';
      case 'VOLUNTEER': return '🌱 Impact Missions';
      case 'BUSINESS': return '🏢 Corporate Missions';
      default: return 'Eco Missions';
    }
  };

  const getRoleDescription = () => {
    switch (userRole) {
      case 'TRASH_HERO': 
        return 'Complete cleanup missions to earn XP and evolve your character';
      case 'VOLUNTEER': 
        return 'Join community efforts and make lasting environmental impact';
      case 'BUSINESS': 
        return 'Fund and sponsor large-scale environmental initiatives';
      default: 
        return 'Choose missions that match your environmental goals';
    }
  };

  const filteredMissions = getFilteredMissions();
  const categories = getAvailableCategories();

  const missionTypeFilters: Array<{ key: 'all' | MissionType; label: string; icon: string }> = [
    { key: 'all', label: 'All', icon: 'grid-outline' },
    { key: 'Quick Clean', label: 'Quick', icon: 'flash-outline' },
    { key: 'Timed Mission', label: 'Timed', icon: 'timer-outline' },
    { key: 'Community Quest', label: 'Community', icon: 'people-outline' },
    { key: 'Business Mission', label: 'Business', icon: 'business-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>
            {getRoleTitle()}
          </Text>
          <Text style={[styles.headerDescription, { color: theme.secondaryText }]}>
            {getRoleDescription()}
          </Text>
        </View>
        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {missionState.activeMissions.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              Active
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#22c55e' }]}>
              {missionState.completedMissions.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              Complete
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#f59e0b' }]}>
              {missionState.userEcoPoints}
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              Points
            </Text>
          </View>
        </View>
      </View>

      {/* Mission Type Filters */}
      <View style={styles.filterSection}>
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterContent}
        >
          {missionTypeFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                { borderColor: theme.borderColor },
                activeFilter === filter.key && { 
                  backgroundColor: theme.primary,
                  borderColor: theme.primary 
                }
              ]}
              onPress={() => setActiveFilter(filter.key)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={filter.icon} 
                size={16} 
                color={activeFilter === filter.key ? 'white' : theme.secondaryText}
              />
              <Text style={[
                styles.filterButtonText,
                { color: activeFilter === filter.key ? 'white' : theme.secondaryText }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Category Filters */}
      {categories.length > 0 && (
        <View style={styles.categorySection}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContent}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                { borderColor: theme.borderColor },
                selectedCategory === 'all' && { 
                  backgroundColor: theme.accent,
                  borderColor: theme.accent 
                }
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[
                styles.categoryChipText,
                { color: selectedCategory === 'all' ? theme.textColor : theme.secondaryText }
              ]}>
                All Categories
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  { borderColor: theme.borderColor },
                  selectedCategory === category && { 
                    backgroundColor: theme.accent,
                    borderColor: theme.accent 
                  }
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryChipText,
                  { color: selectedCategory === category ? theme.textColor : theme.secondaryText }
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Mission List */}
      <ScrollView
        style={styles.missionList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {filteredMissions.length > 0 ? (
          filteredMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              userRole={userRole}
              onMissionPress={handleMissionPress}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={64} color={theme.secondaryText} />
            <Text style={[styles.emptyTitle, { color: theme.textColor }]}>
              No missions available
            </Text>
            <Text style={[styles.emptyDescription, { color: theme.secondaryText }]}>
              Check back later for new environmental missions
            </Text>
            <TouchableOpacity
              style={[styles.refreshButton, { backgroundColor: theme.primary }]}
              onPress={handleRefresh}
            >
              <Ionicons name="refresh-outline" size={20} color="white" />
              <Text style={styles.refreshButtonText}>Refresh Missions</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Bottom padding for better scrolling */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  filterSection: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  filterScrollView: {
    flex: 1,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  categorySection: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '500',
  },
  missionList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 40,
  },
});

export default MissionFeed;