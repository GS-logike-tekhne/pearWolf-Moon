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
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface Quest {
  id: string; 
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  reward: string;
  icon: string;
}

interface Station {
  id: string;
  title: string;
  icon: string;
  gradient: string[];
  progress: number;
  maxQuests: number;
  completedQuests: number;
  quests: Quest[];
  unlocked: boolean;
}

interface EcoStationsProps {
  role: 'TRASH_HERO' | 'VOLUNTEER' | 'BUSINESS';
}

const EcoStations: React.FC<EcoStationsProps> = ({ role }) => {
  const { theme } = useTheme();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  // Role-based station data
  const getStationsForRole = (): Station[] => {
    const baseStations = [
      {
        id: 'city-cleanup',
        title: '🏙️ City Cleanup HQ',
        icon: 'business-outline',
        gradient: role === 'TRASH_HERO' ? ['#28a745', '#20c997'] : 
                  role === 'VOLUNTEER' ? ['#dc2626', '#f87171'] : 
                  ['#3b82f6', '#60a5fa'],
        progress: 2,
        maxQuests: 3,
        completedQuests: 2,
        unlocked: true,
        quests: [
          {
            id: 'collect-trash',
            title: 'Collect Street Litter',
            description: 'Pick up 2 bags of trash from downtown area',
            progress: 2,
            maxProgress: 2,
            completed: true,
            reward: '50 XP + $15',
            icon: 'trash-outline'
          },
          {
            id: 'photo-before-after',
            title: 'Document Impact',
            description: 'Take before and after photos of cleaned area',
            progress: 1,
            maxProgress: 1,
            completed: true,
            reward: '25 XP',
            icon: 'camera-outline'
          },
          {
            id: 'recruit-volunteer',
            title: 'Invite Eco Warriors',
            description: 'Invite 2 friends to join PEAR community',
            progress: 0,
            maxProgress: 2,
            completed: false,
            reward: '75 XP + Badge',
            icon: 'people-outline'
          }
        ]
      },
      {
        id: 'recycling-depot',
        title: '♻️ Recycling Depot',
        icon: 'leaf-outline',
        gradient: role === 'TRASH_HERO' ? ['#17a2b8', '#20c997'] : 
                  role === 'VOLUNTEER' ? ['#e74c3c', '#f39c12'] : 
                  ['#6610f2', '#6f42c1'],
        progress: 0,
        maxQuests: 3,
        completedQuests: 0,
        unlocked: true,
        quests: [
          {
            id: 'sort-materials',
            title: 'Sort Recyclables',
            description: 'Properly categorize 50 items for recycling',
            progress: 0,
            maxProgress: 50,
            completed: false,
            reward: '60 XP + $20',
            icon: 'git-compare-outline'
          },
          {
            id: 'educate-public',
            title: 'Teach Recycling',
            description: 'Share 3 eco-tips with community',
            progress: 0,
            maxProgress: 3,
            completed: false,
            reward: '40 XP',
            icon: 'school-outline'
          },
          {
            id: 'recycle-challenge',
            title: 'Weekly Challenge',
            description: 'Complete daily recycling for 7 days',
            progress: 0,
            maxProgress: 7,
            completed: false,
            reward: '100 XP + Badge',
            icon: 'trophy-outline'
          }
        ]
      },
      {
        id: 'park-restoration',
        title: '🌳 Park Restoration Lab',
        icon: 'flower-outline',
        gradient: role === 'TRASH_HERO' ? ['#28a745', '#6f42c1'] : 
                  role === 'VOLUNTEER' ? ['#dc2626', '#28a745'] : 
                  ['#3b82f6', '#10b981'],
        progress: 1,
        maxQuests: 3,
        completedQuests: 1,
        unlocked: false,
        quests: [
          {
            id: 'plant-trees',
            title: 'Tree Planting Drive',
            description: 'Plant 5 native trees in designated area',
            progress: 5,
            maxProgress: 5,
            completed: true,
            reward: '80 XP + $25',
            icon: 'leaf-outline'
          },
          {
            id: 'remove-invasives',
            title: 'Clear Invasive Species',
            description: 'Remove harmful plants from 100 sq meters',
            progress: 0,
            maxProgress: 100,
            completed: false,
            reward: '70 XP + $20',
            icon: 'cut-outline'
          },
          {
            id: 'maintain-garden',
            title: 'Garden Maintenance',
            description: 'Water and maintain community garden for 2 weeks',
            progress: 0,
            maxProgress: 14,
            completed: false,
            reward: '90 XP + Special Badge',
            icon: 'water-outline'
          }
        ]
      }
    ];

    return baseStations;
  };

  const stations = getStationsForRole();

  const StationCard = ({ station }: { station: Station }) => (
    <TouchableOpacity
      style={[styles.stationCard, { backgroundColor: theme.cardBackground }]}
      onPress={() => setSelectedStation(station)}
      activeOpacity={0.85}
    >
      {/* Gradient Header */}
      <View style={[styles.stationHeader, { backgroundColor: station.gradient[0] }]}>
        <View style={styles.stationTitleRow}>
          <Ionicons name={station.icon} size={24} color="white" />
          <Text style={styles.stationTitle}>{station.title}</Text>
          {!station.unlocked && (
            <Ionicons name="lock-closed-outline" size={16} color="rgba(255,255,255,0.8)" />
          )}
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.stationContent}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressText, { color: theme.textColor }]}>
            {station.completedQuests}/{station.maxQuests} Quests Complete
          </Text>
          <Text style={[styles.progressPercent, { color: station.gradient[0] }]}>
            {Math.round((station.completedQuests / station.maxQuests) * 100)}%
          </Text>
        </View>
        
        <View style={[styles.progressTrack, { backgroundColor: theme.accent }]}>
          <View
            style={[
              styles.progressFill,
              { 
                width: `${(station.completedQuests / station.maxQuests) * 100}%`,
                backgroundColor: station.gradient[0]
              }
            ]}
          />
        </View>

        {/* Quest Preview */}
        <View style={styles.questPreview}>
          {station.quests.slice(0, 2).map((quest) => (
            <View key={quest.id} style={styles.questPreviewItem}>
              <View style={[styles.questIcon, { backgroundColor: quest.completed ? '#28a745' : theme.accent }]}>
                <Ionicons 
                  name={quest.completed ? 'checkmark' : quest.icon} 
                  size={12} 
                  color={quest.completed ? 'white' : theme.secondaryText} 
                />
              </View>
              <Text style={[
                styles.questPreviewText, 
                { 
                  color: quest.completed ? theme.secondaryText : theme.textColor,
                  textDecorationLine: quest.completed ? 'line-through' : 'none'
                }
              ]}>
                {quest.title}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuestDetail = ({ quest }: { quest: Quest }) => (
    <View style={[styles.questCard, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.questHeader}>
        <View style={[styles.questIconLarge, { 
          backgroundColor: quest.completed ? '#28a745' : theme.primary 
        }]}>
          <Ionicons 
            name={quest.completed ? 'checkmark-circle' : quest.icon} 
            size={20} 
            color="white" 
          />
        </View>
        <View style={styles.questInfo}>
          <Text style={[styles.questTitle, { color: theme.textColor }]}>
            {quest.title}
          </Text>
          <Text style={[styles.questDescription, { color: theme.secondaryText }]}>
            {quest.description}
          </Text>
        </View>
        {quest.completed && (
          <View style={styles.completedTag}>
            <Text style={styles.completedText}>✅ DONE</Text>
          </View>
        )}
      </View>

      {/* Progress Bar */}
      {!quest.completed && (
        <View style={styles.questProgress}>
          <View style={[styles.questProgressTrack, { backgroundColor: theme.accent }]}>
            <View
              style={[
                styles.questProgressFill,
                { 
                  width: `${(quest.progress / quest.maxProgress) * 100}%`,
                  backgroundColor: theme.primary
                }
              ]}
            />
          </View>
          <Text style={[styles.questProgressText, { color: theme.secondaryText }]}>
            {quest.progress}/{quest.maxProgress}
          </Text>
        </View>
      )}

      {/* Reward */}
      <View style={styles.questReward}>
        <Ionicons name="gift-outline" size={16} color={theme.primary} />
        <Text style={[styles.questRewardText, { color: theme.primary }]}>
          {quest.reward}
        </Text>
      </View>
    </View>
  );

  if (selectedStation) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.detailHeader}>
          <TouchableOpacity 
            onPress={() => setSelectedStation(null)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.detailTitle, { color: theme.textColor }]}>
            {selectedStation.title}
          </Text>
        </View>
        
        <ScrollView style={styles.questList}>
          {selectedStation.quests.map((quest) => (
            <QuestDetail key={quest.id} quest={quest} />
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Eco Stations
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}>
          Complete missions to unlock rewards
        </Text>
      </View>

      <ScrollView style={styles.stationList} showsVerticalScrollIndicator={false}>
        {stations.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107, 114, 128, 0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  stationList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stationCard: {
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  stationHeader: {
    padding: 16,
  },
  stationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    marginLeft: 12,
  },
  stationContent: {
    padding: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  questPreview: {
    gap: 8,
  },
  questPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  questPreviewText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  // Detail View Styles
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107, 114, 128, 0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  questList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  questCard: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questIconLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  questDescription: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  completedTag: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  questProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  questProgressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  questProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  questProgressText: {
    fontSize: 11,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'right',
  },
  questReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questRewardText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default EcoStations;