import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useXP } from '../context/XPContext';
import { formatMaterialWeight } from '../utils/weightUtils';

const { width } = Dimensions.get('window');

interface DepotQuest {
  id: string;
  title: string;
  description: string;
  type: 'curbside' | 'sorting' | 'ewaste' | 'compost';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  ecoPointsReward: number;
  isCompleted: boolean;
  isLocked: boolean;
  requirements?: string[];
  location: string;
  estimatedTime: string;
  materialWeight?: number; // in pounds
}

interface DepotProgress {
  totalQuests: number;
  completedQuests: number;
  currentStreak: number;
  totalMaterialDiverted: number; // in pounds
  totalCleanupsCompleted: number;
  depotLevel: number;
  nextLevelXP: number;
}

const RecyclingDepot: React.FC = () => {
  const { theme } = useTheme();
  const { addXP } = useXP();
  const [selectedQuest, setSelectedQuest] = useState<DepotQuest | null>(null);
  const [depotProgress, setDepotProgress] = useState<DepotProgress>({
    totalQuests: 15,
    completedQuests: 5,
    currentStreak: 8,
    totalMaterialDiverted: 1250,
    totalCleanupsCompleted: 12,
    depotLevel: 3,
    nextLevelXP: 400,
  });

  // Depot-themed quests
  const depotQuests: DepotQuest[] = [
    {
      id: 'curbside_pickup_1',
      title: 'Neighborhood Curbside Collection',
      description: 'Collect recyclables from residential curbside bins',
      type: 'curbside',
      difficulty: 'Easy',
      xpReward: 60,
      ecoPointsReward: 30,
      isCompleted: true,
      isLocked: false,
      location: 'Downtown District',
      estimatedTime: '2.5 hours',
      materialWeight: 150,
    },
    {
      id: 'sorting_recyclables',
      title: 'Material Sorting Station',
      description: 'Sort and categorize recyclable materials at the depot',
      type: 'sorting',
      difficulty: 'Medium',
      xpReward: 80,
      ecoPointsReward: 40,
      isCompleted: true,
      isLocked: false,
      location: 'Recycling Depot',
      estimatedTime: '3 hours',
      materialWeight: 200,
    },
    {
      id: 'ewaste_collection',
      title: 'E-Waste Collection Drive',
      description: 'Organize and collect electronic waste from community',
      type: 'ewaste',
      difficulty: 'Hard',
      xpReward: 120,
      ecoPointsReward: 60,
      isCompleted: false,
      isLocked: false,
      location: 'Community Center',
      estimatedTime: '4 hours',
      materialWeight: 300,
    },
    {
      id: 'compost_collection',
      title: 'Organic Waste Composting',
      description: 'Collect and process organic waste for composting',
      type: 'compost',
      difficulty: 'Medium',
      xpReward: 70,
      ecoPointsReward: 35,
      isCompleted: false,
      isLocked: false,
      location: 'Green Waste Facility',
      estimatedTime: '2.5 hours',
      materialWeight: 180,
    },
    {
      id: 'bulk_collection',
      title: 'Bulk Material Collection',
      description: 'Collect large items like furniture and appliances',
      type: 'curbside',
      difficulty: 'Hard',
      xpReward: 100,
      ecoPointsReward: 50,
      isCompleted: false,
      isLocked: true,
      location: 'Industrial Zone',
      estimatedTime: '5 hours',
      materialWeight: 500,
    },
  ];

  const getQuestTypeIcon = (type: string) => {
    switch (type) {
      case 'curbside': return 'home';
      case 'sorting': return 'list';
      case 'ewaste': return 'phone-portrait';
      case 'compost': return 'leaf';
      default: return 'help-circle';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getQuestTypeColor = (type: string) => {
    switch (type) {
      case 'curbside': return '#4CAF50';
      case 'sorting': return '#22c55e';
      case 'ewaste': return '#6b7280';
      case 'compost': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const handleQuestPress = (quest: DepotQuest) => {
    if (!quest.isLocked) {
      setSelectedQuest(quest);
    }
  };

  const handleStartQuest = (quest: DepotQuest) => {
    // Simulate quest completion
    addXP(quest.xpReward, 'depot_quest');
    setDepotProgress(prev => ({
      ...prev,
      completedQuests: prev.completedQuests + 1,
      totalMaterialDiverted: prev.totalMaterialDiverted + (quest.materialWeight || 0),
      totalCleanupsCompleted: prev.totalCleanupsCompleted + 1,
    }));
    setSelectedQuest(null);
  };

  const QuestCard = ({ quest }: { quest: DepotQuest }) => (
    <TouchableOpacity
      style={[
        styles.questCard,
        {
          backgroundColor: quest.isLocked ? '#f0f9ff' : '#ffffff',
          borderColor: quest.isCompleted ? '#22c55e' : quest.isLocked ? '#e5e7eb' : '#4CAF50',
          opacity: quest.isLocked ? 0.6 : 1,
        }
      ]}
      onPress={() => handleQuestPress(quest)}
      disabled={quest.isLocked}
      activeOpacity={0.8}
    >
      <View style={styles.questHeader}>
        <View style={[
          styles.questTypeIcon,
          { backgroundColor: getQuestTypeColor(quest.type) }
        ]}>
          <Ionicons name={getQuestTypeIcon(quest.type) as any} size={20} color="white" />
        </View>
        
        <View style={styles.questInfo}>
          <Text style={[styles.questTitle, { color: '#1f2937' }]}>
            {quest.title}
          </Text>
          <Text style={[styles.questDescription, { color: '#6b7280' }]}>
            {quest.description}
          </Text>
        </View>
        
        {quest.isCompleted && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
          </View>
        )}
        
        {quest.isLocked && (
          <View style={styles.lockedBadge}>
            <Ionicons name="lock-closed" size={20} color="#6b7280" />
          </View>
        )}
      </View>
      
      <View style={styles.questMeta}>
        <View style={[
          styles.difficultyBadge,
          { backgroundColor: getDifficultyColor(quest.difficulty) }
        ]}>
          <Text style={styles.difficultyText}>{quest.difficulty}</Text>
        </View>
        
        <View style={styles.rewardInfo}>
          <View style={styles.rewardItem}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={[styles.rewardText, { color: '#fbbf24' }]}>
              {quest.xpReward} XP
            </Text>
          </View>
          <View style={styles.rewardItem}>
            <Ionicons name="leaf" size={14} color="#22c55e" />
            <Text style={[styles.rewardText, { color: '#22c55e' }]}>
              {quest.ecoPointsReward} EP
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.questFooter}>
        <View style={styles.locationInfo}>
          <Ionicons name="location" size={14} color="#4CAF50" />
          <Text style={[styles.locationText, { color: '#6b7280' }]}>
            {quest.location}
          </Text>
        </View>
        <View style={styles.timeInfo}>
          <Ionicons name="time" size={14} color="#4CAF50" />
          <Text style={[styles.timeText, { color: '#6b7280' }]}>
            {quest.estimatedTime}
          </Text>
        </View>
      </View>
      
      {quest.materialWeight && (
        <View style={styles.materialInfo}>
          <Ionicons name="scale" size={14} color="#4CAF50" />
          <Text style={[styles.materialText, { color: '#4CAF50' }]}>
            {formatMaterialWeight(quest.materialWeight || 0)} diverted
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const ProgressSection = () => (
    <View style={[styles.progressSection, { backgroundColor: '#ffffff' }]}>
      <View style={styles.progressHeader}>
        <Ionicons name="recycle" size={24} color="#4CAF50" />
        <Text style={[styles.progressTitle, { color: '#1f2937' }]}>
          Depot Progress
        </Text>
      </View>
      
      <View style={styles.progressStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#4CAF50' }]}>
            {depotProgress.completedQuests}/{depotProgress.totalQuests}
          </Text>
          <Text style={[styles.statLabel, { color: '#6b7280' }]}>
            Quests
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#22c55e' }]}>
            {depotProgress.totalMaterialDiverted.toLocaleString()}
          </Text>
          <Text style={[styles.statLabel, { color: '#6b7280' }]}>
            Lbs Diverted
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#3b82f6' }]}>
            {depotProgress.totalCleanupsCompleted}
          </Text>
          <Text style={[styles.statLabel, { color: '#6b7280' }]}>
            Cleanups
          </Text>
        </View>
      </View>
      
      <View style={styles.levelProgress}>
        <Text style={[styles.levelText, { color: '#1f2937' }]}>
          Depot Level {depotProgress.depotLevel}
        </Text>
        <View style={[styles.progressBar, { backgroundColor: '#e5e7eb' }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: '#4CAF50',
                width: `${(depotProgress.completedQuests / depotProgress.totalQuests) * 100}%`
              }
            ]} 
          />
        </View>
        <Text style={[styles.nextLevelText, { color: '#6b7280' }]}>
          {depotProgress.nextLevelXP - (depotProgress.completedQuests * 50)} XP to next level
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#f8fafc' }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#ffffff' }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="recycle" size={32} color="#4CAF50" />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: '#1f2937' }]}>
              Recycling Depot
            </Text>
            <Text style={[styles.headerSubtitle, { color: '#6b7280' }]}>
              Professional waste diversion and recycling missions
            </Text>
          </View>
        </View>
        
        <View style={styles.headerStats}>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color="#4CAF50" />
            <Text style={[styles.streakText, { color: '#4CAF50' }]}>
              {depotProgress.currentStreak} day streak
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProgressSection />
        
        <View style={styles.questsSection}>
          <Text style={[styles.sectionTitle, { color: '#1f2937' }]}>
            Available Quests
          </Text>
          
          {depotQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </View>
      </ScrollView>

      {/* Quest Detail Modal */}
      {selectedQuest && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#1f2937' }]}>
                {selectedQuest.title}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedQuest(null)}
              >
                <Ionicons name="close" size={24} color="#1f2937" />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalDescription, { color: '#6b7280' }]}>
              {selectedQuest.description}
            </Text>
            
            <View style={styles.modalMeta}>
              <View style={styles.modalMetaItem}>
                <Ionicons name="location" size={16} color="#4CAF50" />
                <Text style={[styles.modalMetaText, { color: '#1f2937' }]}>
                  {selectedQuest.location}
                </Text>
              </View>
              <View style={styles.modalMetaItem}>
                <Ionicons name="time" size={16} color="#4CAF50" />
                <Text style={[styles.modalMetaText, { color: '#1f2937' }]}>
                  {selectedQuest.estimatedTime}
                </Text>
              </View>
              {selectedQuest.materialWeight && (
                <View style={styles.modalMetaItem}>
                  <Ionicons name="scale" size={16} color="#4CAF50" />
                  <Text style={[styles.modalMetaText, { color: '#1f2937' }]}>
                    {formatMaterialWeight(selectedQuest.materialWeight || 0)} material
                  </Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => handleStartQuest(selectedQuest)}
            >
              <Text style={styles.startButtonText}>Start Quest</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
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
  headerStats: {
    alignItems: 'flex-end',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  progressSection: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  levelProgress: {
    gap: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  nextLevelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  questsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  questCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questTypeIcon: {
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
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  questDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  completedBadge: {
    marginLeft: 8,
  },
  lockedBadge: {
    marginLeft: 8,
  },
  questMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  rewardInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  materialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  materialText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  modalMeta: {
    gap: 12,
    marginBottom: 24,
  },
  modalMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalMetaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default RecyclingDepot;
