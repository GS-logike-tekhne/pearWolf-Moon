import React from 'react';
import ScreenLayout from '../components/ScreenLayout';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Reward = {
  id: number;
  title: string;
  points: number;
  icon: string;
  category: string;
};

type Achievement = {
  title: string;
  description: string;
  icon: string;
  earned: boolean;
};

type RewardsScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const RewardsScreen: React.FC<RewardsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  
  const rewards = [
    { id: 1, title: 'Coffee Shop Voucher', points: 250, icon: 'cafe', category: 'food' },
    { id: 2, title: 'Eco-Friendly Water Bottle', points: 500, icon: 'water', category: 'gear' },
    { id: 3, title: 'Tree Planting Kit', points: 750, icon: 'leaf', category: 'environment' },
    { id: 4, title: 'Bike Rental Credit', points: 400, icon: 'bicycle', category: 'transport' },
  ];

  const achievements = [
    { title: 'First Cleanup', description: 'Completed your first cleanup job', icon: 'trophy', earned: true },
    { title: 'Environmental Hero', description: 'Completed 10 cleanup jobs', icon: 'medal', earned: true },
    { title: 'Community Leader', description: 'Inspired 5 new volunteers', icon: 'people', earned: false },
    { title: 'Eco Champion', description: 'Collected 1000kg of trash', icon: 'star', earned: false },
  ];

  const RewardCard: React.FC<{ reward: Reward }> = ({ reward }) => (
    <TouchableOpacity style={[styles.rewardCard, { backgroundColor: theme.cardBackground }]}>
      <View style={[styles.rewardIcon, { backgroundColor: theme.primary + '20' }]}>
        <Ionicons name={reward.icon} size={24} color={theme.primary} />
      </View>
      <View style={styles.rewardInfo}>
        <Text style={[styles.rewardTitle, { color: theme.textColor }]}>{reward.title}</Text>
        <Text style={[styles.rewardPoints, { color: theme.secondaryText }]}>{reward.points} points</Text>
      </View>
      <View style={[styles.redeemButton, { backgroundColor: theme.primary }]}>
        <Text style={[styles.redeemButtonText, { color: theme.background }]}>Redeem</Text>
      </View>
    </TouchableOpacity>
  );

  const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
    <View style={[
      styles.achievementCard, 
      { backgroundColor: theme.cardBackground },
      !achievement.earned && styles.achievementLocked
    ]}>
      <View style={[
        styles.achievementIcon, 
        { backgroundColor: achievement.earned ? theme.warning + '20' : theme.background },
        !achievement.earned && styles.achievementIconLocked
      ]}>
        <Ionicons 
          name={achievement.icon} 
          size={24} 
          color={achievement.earned ? theme.warning : theme.secondaryText} 
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={[
          styles.achievementTitle, 
          { color: theme.textColor },
          !achievement.earned && styles.achievementTitleLocked
        ]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDescription, { color: theme.secondaryText }]}>
          {achievement.description}
        </Text>
      </View>
      {achievement.earned && (
        <Ionicons name="checkmark-circle" size={20} color={theme.success} />
      )}
    </View>
  );

  return (
    <ScreenLayout>
      {/* Points Header */}
      <View style={[styles.pointsHeader, { backgroundColor: theme.background }]}>
        <Text style={[styles.pointsLabel, { color: theme.secondaryText }]}>Available Points</Text>
        <Text style={[styles.pointsAmount, { color: theme.primary }]}>1,240</Text>
        <Text style={[styles.pointsSubtext, { color: theme.secondaryText }]}>Keep cleaning to earn more!</Text>
      </View>

      {/* Rewards Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Redeem Rewards</Text>
        {rewards.map((reward) => (
          <RewardCard key={reward.id} reward={reward} />
        ))}
      </View>

      {/* Achievements Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Achievements</Text>
        {achievements.map((achievement, index) => (
          <AchievementCard key={index} achievement={achievement} />
        ))}
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  pointsHeader: {
    alignItems: 'center',
    padding: THEME.SPACING.lg,
    marginBottom: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    ...THEME.SHADOWS.md,
  },
  pointsLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: THEME.TYPOGRAPHY.fontWeight.medium,
  },
  pointsAmount: {
    fontSize: THEME.TYPOGRAPHY.fontSize["4xl"],
    fontWeight: THEME.TYPOGRAPHY.fontWeight.bold,
    marginTop: THEME.SPACING.sm,
  },
  pointsSubtext: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    marginTop: THEME.SPACING.xs,
  },
  section: {
    marginBottom: THEME.SPACING.lg,
  },
  sectionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: THEME.TYPOGRAPHY.fontWeight.bold,
    marginBottom: THEME.SPACING.md,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginBottom: THEME.SPACING.sm,
    ...THEME.SHADOWS.md,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: THEME.BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.SPACING.md,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: THEME.TYPOGRAPHY.fontWeight.semibold,
  },
  rewardPoints: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    marginTop: THEME.SPACING.xs,
  },
  redeemButton: {
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: THEME.BORDER_RADIUS.md,
  },
  redeemButtonText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: THEME.TYPOGRAPHY.fontWeight.semibold,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginBottom: THEME.SPACING.sm,
    ...THEME.SHADOWS.md,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: THEME.BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.SPACING.md,
  },
  achievementIconLocked: {
    // Will be overridden by theme colors
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: THEME.TYPOGRAPHY.fontWeight.semibold,
  },
  achievementTitleLocked: {
    // Will be overridden by theme colors
  },
  achievementDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    marginTop: THEME.SPACING.xs,
  },
});

export default RewardsScreen;