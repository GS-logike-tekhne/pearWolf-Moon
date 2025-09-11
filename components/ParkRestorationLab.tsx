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

const { width } = Dimensions.get('window');

interface LabQuest {
  id: string;
  title: string;
  description: string;
  type: 'cleanup' | 'planting' | 'maintenance' | 'research';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  ecoPointsReward: number;
  isCompleted: boolean;
  isLocked: boolean;
  requirements?: string[];
  location: string;
  estimatedTime: string;
}

interface LabProgress {
  totalQuests: number;
  completedQuests: number;
  currentStreak: number;
  totalTreesPlanted: number;
  totalParksRestored: number;
  labLevel: number;
  nextLevelXP: number;
}

const ParkRestorationLab: React.FC = () => {
  const { theme } = useTheme();
  const { addXP } = useXP();
  const [selectedQuest, setSelectedQuest] = useState<LabQuest | null>(null);
  const [labProgress, setLabProgress] = useState<LabProgress>({
    totalQuests: 12,
    completedQuests: 3,
    currentStreak: 5,
    totalTreesPlanted: 15,
    totalParksRestored: 2,
    labLevel: 2,
    nextLevelXP: 250,
  });

  // Lab-themed quests
  const labQuests: LabQuest[] = [
    {
      id: 'park_cleanup_1',
      title: 'Central Park Cleanup',
      description: 'Remove litter and debris from Central Park walking trails',
      type: 'cleanup',
      difficulty: 'Easy',
      xpReward: 50,
      ecoPointsReward: 25,
      isCompleted: true,
      isLocked: false,
      location: 'Central Park',
      estimatedTime: '2 hours',
    },
    {
      id: 'tree_planting_1',
      title: 'Oak Tree Planting',
      description: 'Plant 5 native oak trees in designated restoration areas',
      type: 'planting',
      difficulty: 'Medium',
      xpReward: 100,
      ecoPointsReward: 50,
      isCompleted: true,
      isLocked: false,
      location: 'Riverside Park',
      estimatedTime: '3 hours',
    },
    {
      id: 'wildlife_research',
      title: 'Wildlife Habitat Survey',
      description: 'Document local wildlife and assess habitat restoration needs',
      type: 'research',
      difficulty: 'Hard',
      xpReward: 150,
      ecoPointsReward: 75,
      isCompleted: false,
      isLocked: false,
      location: 'Forest Preserve',
      estimatedTime: '4 hours',
    },
    {
      id: 'trail_maintenance',
      title: 'Trail Maintenance',
      description: 'Repair and maintain hiking trails in the restoration zone',
      type: 'maintenance',
      difficulty: 'Medium',
      xpReward: 80,
      ecoPointsReward: 40,
      isCompleted: false,
      isLocked: false,
      location: 'Mountain Trail',
      estimatedTime: '2.5 hours',
    },
    {
      id: 'native_planting',
      title: 'Native Plant Restoration',
      description: 'Plant native wildflowers to restore local ecosystem',
      type: 'planting',
      difficulty: 'Easy',
      xpReward: 60,
      ecoPointsReward: 30,
      isCompleted: false,
      isLocked: true,
      location: 'Meadow Restoration',
      estimatedTime: '2 hours',
    },
  ];

  const getQuestTypeIcon = (type: string) => {
    switch (type) {
      case 'cleanup': return 'trash';
      case 'planting': return 'leaf';
      case 'maintenance': return 'construct';
      case 'research': return 'search';
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
      case 'cleanup': return '#f97316';
      case 'planting': return '#22c55e';
      case 'maintenance': return '#3b82f6';
      case 'research': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const handleQuestPress = (quest: LabQuest) => {
    if (!quest.isLocked) {
      setSelectedQuest(quest);
    }
  };

  const handleStartQuest = (quest: LabQuest) => {
    // Simulate quest completion
    addXP(quest.xpReward, 'lab_quest');
    setLabProgress(prev => ({
      ...prev,
      completedQuests: prev.completedQuests + 1,
      totalTreesPlanted: quest.type === 'planting' ? prev.totalTreesPlanted + 5 : prev.totalTreesPlanted,
      totalParksRestored: quest.type === 'cleanup' ? prev.totalParksRestored + 1 : prev.totalParksRestored,
    }));
    setSelectedQuest(null);
  };

  const QuestCard = ({ quest }: { quest: LabQuest }) => (
    <TouchableOpacity
      style={[
        styles.questCard,
        {
          backgroundColor: quest.isLocked ? '#1f2937' : '#111827',
          borderColor: quest.isCompleted ? '#22c55e' : quest.isLocked ? '#374151' : '#f97316',
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
          <Text style={[styles.questTitle, { color: theme.textColor }]}>
            {quest.title}
          </Text>
          <Text style={[styles.questDescription, { color: theme.secondaryText }]}>
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
          <Ionicons name="location" size={14} color="#f97316" />
          <Text style={[styles.locationText, { color: theme.secondaryText }]}>
            {quest.location}
          </Text>
        </View>
        <View style={styles.timeInfo}>
          <Ionicons name="time" size={14} color="#f97316" />
          <Text style={[styles.timeText, { color: theme.secondaryText }]}>
            {quest.estimatedTime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ProgressSection = () => (
    <View style={[styles.progressSection, { backgroundColor: '#111827' }]}>
      <View style={styles.progressHeader}>
        <Ionicons name="flask" size={24} color="#f97316" />
        <Text style={[styles.progressTitle, { color: theme.textColor }]}>
          Lab Progress
        </Text>
      </View>
      
      <View style={styles.progressStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#f97316' }]}>
            {labProgress.completedQuests}/{labProgress.totalQuests}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
            Quests
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#22c55e' }]}>
            {labProgress.totalTreesPlanted}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
            Trees Planted
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#3b82f6' }]}>
            {labProgress.totalParksRestored}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
            Parks Restored
          </Text>
        </View>
      </View>
      
      <View style={styles.levelProgress}>
        <Text style={[styles.levelText, { color: theme.textColor }]}>
          Lab Level {labProgress.labLevel}
        </Text>
        <View style={[styles.progressBar, { backgroundColor: '#374151' }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: '#f97316',
                width: `${(labProgress.completedQuests / labProgress.totalQuests) * 100}%`
              }
            ]} 
          />
        </View>
        <Text style={[styles.nextLevelText, { color: theme.secondaryText }]}>
          {labProgress.nextLevelXP - (labProgress.completedQuests * 50)} XP to next level
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#0f172a' }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#111827' }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="flask" size={32} color="#f97316" />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: theme.textColor }]}>
              Park Restoration Lab
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}>
              Advanced environmental restoration missions
            </Text>
          </View>
        </View>
        
        <View style={styles.headerStats}>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color="#f97316" />
            <Text style={[styles.streakText, { color: '#f97316' }]}>
              {labProgress.currentStreak} day streak
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProgressSection />
        
        <View style={styles.questsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Available Quests
          </Text>
          
          {labQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </View>
      </ScrollView>

      {/* Quest Detail Modal */}
      {selectedQuest && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#111827' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textColor }]}>
                {selectedQuest.title}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedQuest(null)}
              >
                <Ionicons name="close" size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalDescription, { color: theme.secondaryText }]}>
              {selectedQuest.description}
            </Text>
            
            <View style={styles.modalMeta}>
              <View style={styles.modalMetaItem}>
                <Ionicons name="location" size={16} color="#f97316" />
                <Text style={[styles.modalMetaText, { color: theme.textColor }]}>
                  {selectedQuest.location}
                </Text>
              </View>
              <View style={styles.modalMetaItem}>
                <Ionicons name="time" size={16} color="#f97316" />
                <Text style={[styles.modalMetaText, { color: theme.textColor }]}>
                  {selectedQuest.estimatedTime}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: '#f97316' }]}
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
    borderBottomColor: '#374151',
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
    backgroundColor: '#1f2937',
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
    backgroundColor: '#1f2937',
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
    borderColor: '#374151',
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
    borderColor: '#374151',
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

export default ParkRestorationLab;
