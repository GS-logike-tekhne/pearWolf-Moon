import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RewardsScreen = ({ navigation }) => {
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

  const RewardCard = ({ reward }) => (
    <TouchableOpacity style={styles.rewardCard}>
      <View style={styles.rewardIcon}>
        <Ionicons name={reward.icon} size={24} color="#10b981" />
      </View>
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardTitle}>{reward.title}</Text>
        <Text style={styles.rewardPoints}>{reward.points} points</Text>
      </View>
      <TouchableOpacity style={styles.redeemButton}>
        <Text style={styles.redeemButtonText}>Redeem</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const AchievementCard = ({ achievement }) => (
    <View style={[styles.achievementCard, !achievement.earned && styles.achievementLocked]}>
      <View style={[styles.achievementIcon, !achievement.earned && styles.achievementIconLocked]}>
        <Ionicons 
          name={achievement.icon} 
          size={24} 
          color={achievement.earned ? "#f59e0b" : "#9ca3af"} 
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={[styles.achievementTitle, !achievement.earned && styles.achievementTitleLocked]}>
          {achievement.title}
        </Text>
        <Text style={styles.achievementDescription}>{achievement.description}</Text>
      </View>
      {achievement.earned && (
        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Points Header */}
      <View style={styles.pointsHeader}>
        <Text style={styles.pointsLabel}>Available Points</Text>
        <Text style={styles.pointsAmount}>1,240</Text>
        <Text style={styles.pointsSubtext}>Keep cleaning to earn more!</Text>
      </View>

      {/* Rewards Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Redeem Rewards</Text>
        {rewards.map((reward) => (
          <RewardCard key={reward.id} reward={reward} />
        ))}
      </View>

      {/* Achievements Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements.map((achievement, index) => (
          <AchievementCard key={index} achievement={achievement} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  pointsHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
  },
  pointsLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  pointsAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 8,
  },
  pointsSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  rewardCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  rewardPoints: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  redeemButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  redeemButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  achievementCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementIconLocked: {
    backgroundColor: '#f3f4f6',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  achievementTitleLocked: {
    color: '#9ca3af',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
});

export default RewardsScreen;