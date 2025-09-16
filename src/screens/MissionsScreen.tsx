import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Text, Card, Button } from '../components/ui';
import { Mission, MissionType, Difficulty } from '../types';

// Mock missions data
const mockMissions: Mission[] = [
  {
    id: '1',
    title: 'Beach Cleanup at Sunset Point',
    description: 'Help clean up plastic waste and debris from the popular beach area.',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: 'Sunset Point Beach, San Francisco, CA',
    },
    type: 'cleanup',
    difficulty: 'easy',
    reward: 25,
    xpReward: 50,
    status: 'available',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Park Recycling Education',
    description: 'Educate visitors about proper recycling practices in Golden Gate Park.',
    location: {
      latitude: 37.7694,
      longitude: -122.4862,
      address: 'Golden Gate Park, San Francisco, CA',
    },
    type: 'education',
    difficulty: 'medium',
    reward: 40,
    xpReward: 75,
    status: 'available',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Community Garden Setup',
    description: 'Help establish a new community garden in the Mission District.',
    location: {
      latitude: 37.7599,
      longitude: -122.4148,
      address: 'Mission District, San Francisco, CA',
    },
    type: 'community',
    difficulty: 'hard',
    reward: 75,
    xpReward: 150,
    status: 'available',
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const MissionsScreen: React.FC = () => {
  const { currentRole } = useAuth();
  const { theme } = useTheme();
  const [missions] = useState<Mission[]>(mockMissions);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getDifficultyColor = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case 'easy':
        return theme.colors.success;
      case 'medium':
        return theme.colors.warning;
      case 'hard':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getTypeIcon = (type: MissionType): string => {
    switch (type) {
      case 'cleanup':
        return '🧹';
      case 'recycling':
        return '♻️';
      case 'education':
        return '📚';
      case 'community':
        return '🤝';
      default:
        return '📋';
    }
  };

  const handleAcceptMission = (missionId: string) => {
    // Handle mission acceptance
    console.log('Accepting mission:', missionId);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text variant="h1" color="primary">
            Available Missions
          </Text>
          <Text variant="body" color="textSecondary">
            {missions.length} missions available for {currentRole.replace('_', ' ')}
          </Text>
        </View>

        {missions.map((mission) => (
          <Card key={mission.id} style={styles.missionCard}>
            <View style={styles.missionHeader}>
              <View style={styles.missionTitleContainer}>
                <Text variant="h3" style={styles.missionTitle}>
                  {getTypeIcon(mission.type)} {mission.title}
                </Text>
                <View style={styles.missionMeta}>
                  <Text variant="caption" color="textSecondary">
                    {mission.location.address}
                  </Text>
                </View>
              </View>
              <View style={styles.rewardContainer}>
                <Text variant="h3" color="primary">
                  ${mission.reward}
                </Text>
                <Text variant="caption" color="textSecondary">
                  +{mission.xpReward} XP
                </Text>
              </View>
            </View>

            <Text variant="body" style={styles.missionDescription}>
              {mission.description}
            </Text>

            <View style={styles.missionFooter}>
              <View style={styles.difficultyContainer}>
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(mission.difficulty) },
                  ]}
                >
                  <Text variant="caption" color="primary" style={styles.difficultyText}>
                    {mission.difficulty.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Button
                title="Accept Mission"
                onPress={() => handleAcceptMission(mission.id)}
                size="small"
                style={styles.acceptButton}
              />
            </View>
          </Card>
        ))}

        {missions.length === 0 && (
          <Card style={styles.emptyCard}>
            <Text variant="h3" align="center" color="textSecondary">
              No missions available
            </Text>
            <Text variant="body" align="center" color="textSecondary" style={styles.emptyText}>
              Check back later for new missions in your area
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  missionCard: {
    margin: 16,
    marginTop: 0,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  missionTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  missionTitle: {
    marginBottom: 4,
  },
  missionMeta: {
    marginTop: 4,
  },
  rewardContainer: {
    alignItems: 'flex-end',
  },
  missionDescription: {
    marginBottom: 16,
    lineHeight: 20,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyContainer: {
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    color: 'white',
    fontWeight: '600',
  },
  acceptButton: {
    marginLeft: 12,
  },
  emptyCard: {
    margin: 16,
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 8,
  },
});

export default MissionsScreen;
