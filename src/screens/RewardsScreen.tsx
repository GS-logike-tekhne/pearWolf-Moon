import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useXP } from '../contexts/XPContext';
import { Text, Card, ProgressBar } from '../components/ui';

const RewardsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { xpData } = useXP();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text variant="h1" color="primary">
            Rewards & Achievements
          </Text>
        </View>

        {/* Level Progress */}
        <Card style={styles.levelCard}>
          <Text variant="h3" style={styles.cardTitle}>
            Current Level
          </Text>
          <Text variant="h2" color="primary" style={styles.levelTitle}>
            {xpData.levelTitle}
          </Text>
          <Text variant="caption" color="textSecondary" style={styles.levelSubtitle}>
            Level {xpData.currentLevel}
          </Text>
          
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={xpData.progressPercent}
              height={12}
            />
            <View style={styles.progressText}>
              <Text variant="caption" color="textSecondary">
                {xpData.xpInCurrentLevel} / {xpData.xpForNextLevel} XP
              </Text>
              <Text variant="caption" color="textSecondary">
                {xpData.totalXP} total XP
              </Text>
            </View>
          </View>
        </Card>

        {/* Badges */}
        <Card style={styles.badgesCard}>
          <Text variant="h3" style={styles.cardTitle}>
            Badges
          </Text>
          <View style={styles.badgesGrid}>
            {xpData.badges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <Text variant="h1" style={styles.badgeIcon}>
                  {badge.icon}
                </Text>
                <Text variant="caption" align="center" style={styles.badgeName}>
                  {badge.name}
                </Text>
                <Text variant="caption" color="textSecondary" align="center" style={styles.badgeDescription}>
                  {badge.description}
                </Text>
                {badge.earnedAt && (
                  <Text variant="caption" color="success" align="center" style={styles.earnedText}>
                    ✓ Earned
                  </Text>
                )}
              </View>
            ))}
          </View>
        </Card>

        {/* Achievements */}
        <Card style={styles.achievementsCard}>
          <Text variant="h3" style={styles.cardTitle}>
            Achievements
          </Text>
          <View style={styles.achievementsList}>
            {xpData.achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <Text variant="h2" style={styles.achievementIcon}>
                  {achievement.icon}
                </Text>
                <View style={styles.achievementContent}>
                  <Text variant="body" weight="semibold">
                    {achievement.title}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    {achievement.description}
                  </Text>
                  <Text variant="caption" color="primary">
                    +{achievement.xpReward} XP
                  </Text>
                </View>
                <View style={styles.achievementStatus}>
                  {achievement.completed ? (
                    <Text variant="caption" color="success">
                      ✓ Complete
                    </Text>
                  ) : (
                    <Text variant="caption" color="textSecondary">
                      In Progress
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </Card>
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
  levelCard: {
    margin: 16,
    marginTop: 0,
  },
  cardTitle: {
    marginBottom: 12,
  },
  levelTitle: {
    marginBottom: 4,
  },
  levelSubtitle: {
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  badgesCard: {
    margin: 16,
    marginTop: 0,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeIcon: {
    marginBottom: 8,
  },
  badgeName: {
    marginBottom: 4,
    fontWeight: '600',
  },
  badgeDescription: {
    fontSize: 10,
    lineHeight: 12,
  },
  earnedText: {
    marginTop: 4,
    fontWeight: '600',
  },
  achievementsCard: {
    margin: 16,
    marginTop: 0,
    marginBottom: 20,
  },
  achievementsList: {
    marginTop: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  achievementIcon: {
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementStatus: {
    alignItems: 'flex-end',
  },
});

export default RewardsScreen;
