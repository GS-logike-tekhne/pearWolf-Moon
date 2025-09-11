import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface LabProgressData {
  totalQuests: number;
  completedQuests: number;
  currentStreak: number;
  totalTreesPlanted: number;
  totalParksRestored: number;
  labLevel: number;
  nextLevelXP: number;
}

interface LabProgressCardProps {
  progress: LabProgressData;
  onPress?: () => void;
}

const LabProgressCard: React.FC<LabProgressCardProps> = ({ progress, onPress }) => {
  const { theme } = useTheme();

  const progressPercentage = (progress.completedQuests / progress.totalQuests) * 100;
  const xpToNextLevel = progress.nextLevelXP - (progress.completedQuests * 50);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: '#111827' }]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="flask" size={24} color="#f97316" />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.textColor }]}>
              Park Restoration Lab
            </Text>
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
              Level {progress.labLevel} • {progress.completedQuests}/{progress.totalQuests} quests
            </Text>
          </View>
        </View>
        
        {onPress && (
          <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={[styles.progressBar, { backgroundColor: '#374151' }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: '#f97316',
                width: `${progressPercentage}%`
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: theme.secondaryText }]}>
          {Math.round(progressPercentage)}% complete
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#f97316' }]}>
            <Ionicons name="flame" size={16} color="white" />
          </View>
          <Text style={[styles.statValue, { color: '#f97316' }]}>
            {progress.currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
            Day Streak
          </Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#22c55e' }]}>
            <Ionicons name="leaf" size={16} color="white" />
          </View>
          <Text style={[styles.statValue, { color: '#22c55e' }]}>
            {progress.totalTreesPlanted}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
            Trees Planted
          </Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#3b82f6' }]}>
            <Ionicons name="map" size={16} color="white" />
          </View>
          <Text style={[styles.statValue, { color: '#3b82f6' }]}>
            {progress.totalParksRestored}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
            Parks Restored
          </Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#8b5cf6' }]}>
            <Ionicons name="star" size={16} color="white" />
          </View>
          <Text style={[styles.statValue, { color: '#8b5cf6' }]}>
            {xpToNextLevel}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
            XP to Next
          </Text>
        </View>
      </View>

      {/* Recent Achievement */}
      <View style={styles.achievementSection}>
        <View style={styles.achievementIcon}>
          <Ionicons name="trophy" size={16} color="#fbbf24" />
        </View>
        <Text style={[styles.achievementText, { color: theme.textColor }]}>
          Recent: {progress.completedQuests > 0 ? 'Completed Central Park Cleanup' : 'Start your first quest!'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  achievementSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  achievementIcon: {
    marginRight: 8,
  },
  achievementText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
});

export default LabProgressCard;
