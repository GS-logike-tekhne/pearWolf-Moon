import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { GamificationReward, StreakData, AchievementData, LeaderboardEntry } from '../services/gamificationService';
import { Badge, BadgeUnlockEvent } from '../types/badges';
import { XPData } from '../types/xp';
import GamificationService from '../services/gamificationService';
import { useXP } from './useXP';

interface GamificationData {
  rewards: GamificationReward[];
  badges: Badge[];
  streak: StreakData;
  achievements: AchievementData[];
  leaderboard: LeaderboardEntry[];
  showCelebration: boolean;
  showLevelUp: boolean;
  levelUpData?: {
    oldLevel: any;
    newLevel: any;
  };
  recentBadgeUnlocks: BadgeUnlockEvent[];
}

export const useGamification = (userId: string, initialXP: number = 0) => {
  const xpData = useXP(initialXP);
  const { addXP, currentLevel, nextLevel, xpToNext, progressPercent, levelUpHistory } = xpData;
  
  const [gamificationData, setGamificationData] = useState<GamificationData>({
    rewards: [],
    badges: [],
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date(),
      streakRewards: [],
    },
    achievements: [],
    leaderboard: [],
    showCelebration: false,
    showLevelUp: false,
    recentBadgeUnlocks: [],
  });

  // Load initial data
  useEffect(() => {
    loadGamificationData();
  }, [userId]);

  // Check for level ups
  useEffect(() => {
    if (levelUpHistory.length > 0) {
      const latestLevelUp = levelUpHistory[levelUpHistory.length - 1];
      showLevelUpModal(latestLevelUp);
    }
  }, [levelUpHistory]);

  const loadGamificationData = async () => {
    try {
      const [achievements, leaderboard] = await Promise.all([
        GamificationService.getUserAchievements(userId),
        GamificationService.getLeaderboard('xp', 10),
      ]);

      setGamificationData(prev => ({
        ...prev,
        achievements,
        leaderboard,
      }));
    } catch (error) {
      console.error('Failed to load gamification data:', error);
    }
  };

  const processMissionCompletion = useCallback(async (
    mission: any,
    verificationResult?: any
  ) => {
    try {
      // Calculate rewards
      const rewards = await GamificationService.processMissionRewards(
        userId,
        mission,
        verificationResult,
        xpData
      );

      // Add XP
      const xpReward = rewards.find(r => r.type === 'xp');
      if (xpReward) {
        addXP(xpReward.value, xpReward.source);
      }

      // Check for badge unlocks
      const missionData = { totalMissions: 1 }; // Mock data
      const unlockedBadges = await GamificationService.checkBadgeUnlocks(
        userId,
        xpData,
        missionData
      );

      // Update state
      setGamificationData(prev => ({
        ...prev,
        rewards: [...prev.rewards, ...rewards],
        badges: [...prev.badges, ...unlockedBadges],
        recentBadgeUnlocks: unlockedBadges.map(badge => ({
          badge,
          timestamp: new Date(),
          source: 'mission_completion',
          celebrationShown: false,
        })),
        showCelebration: true,
      }));

      // Show celebration
      if (rewards.length > 0 || unlockedBadges.length > 0) {
        showCelebration(rewards, unlockedBadges);
      }

      return rewards;
    } catch (error) {
      console.error('Failed to process mission rewards:', error);
      throw error;
    }
  }, [userId, addXP, currentLevel, nextLevel, xpToNext, progressPercent]);

  const showCelebration = (rewards: GamificationReward[], badges: Badge[]) => {
    const message = GamificationService.getCelebrationMessage(rewards);
    
    // Show celebration modal
    setGamificationData(prev => ({
      ...prev,
      showCelebration: true,
    }));

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setGamificationData(prev => ({
        ...prev,
        showCelebration: false,
      }));
    }, 3000);
  };

  const showLevelUpModal = (newLevel: any) => {
    setGamificationData(prev => ({
      ...prev,
      showLevelUp: true,
      levelUpData: {
        oldLevel: { level: newLevel.level - 1, title: `Level ${newLevel.level - 1}` },
        newLevel,
      },
    }));
  };

  const hideLevelUpModal = () => {
    setGamificationData(prev => ({
      ...prev,
      showLevelUp: false,
      levelUpData: undefined,
    }));
  };

  const hideCelebration = () => {
    setGamificationData(prev => ({
      ...prev,
      showCelebration: false,
    }));
  };

  const getStreakData = useCallback(async () => {
    try {
      const streakData = await GamificationService.updateStreak(userId);
      setGamificationData(prev => ({
        ...prev,
        streak: streakData,
      }));
      return streakData;
    } catch (error) {
      console.error('Failed to get streak data:', error);
      return gamificationData.streak;
    }
  }, [userId, gamificationData.streak]);

  const getLeaderboard = useCallback(async (category: 'xp' | 'missions' | 'eco_points' | 'streak' = 'xp') => {
    try {
      const leaderboard = await GamificationService.getLeaderboard(category, 10);
      setGamificationData(prev => ({
        ...prev,
        leaderboard,
      }));
      return leaderboard;
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
      return gamificationData.leaderboard;
    }
  }, [gamificationData.leaderboard]);

  const getAchievements = useCallback(async () => {
    try {
      const achievements = await GamificationService.getUserAchievements(userId);
      setGamificationData(prev => ({
        ...prev,
        achievements,
      }));
      return achievements;
    } catch (error) {
      console.error('Failed to get achievements:', error);
      return gamificationData.achievements;
    }
  }, [userId, gamificationData.achievements]);

  const calculateMissionXP = useCallback((mission: any, verificationResult?: any) => {
    return GamificationService.calculateMissionXP(mission, verificationResult);
  }, []);

  const calculateEcoPoints = useCallback((mission: any, verificationResult?: any) => {
    return GamificationService.calculateEcoPoints(mission, verificationResult);
  }, []);

  return {
    // Data
    rewards: gamificationData.rewards,
    badges: gamificationData.badges,
    streak: gamificationData.streak,
    achievements: gamificationData.achievements,
    leaderboard: gamificationData.leaderboard,
    recentBadgeUnlocks: gamificationData.recentBadgeUnlocks,
    
    // UI State
    showCelebration: gamificationData.showCelebration,
    showLevelUp: gamificationData.showLevelUp,
    levelUpData: gamificationData.levelUpData,
    
    // Actions
    processMissionCompletion,
    hideCelebration,
    hideLevelUpModal,
    getStreakData,
    getLeaderboard,
    getAchievements,
    calculateMissionXP,
    calculateEcoPoints,
    
    // XP Integration
    currentLevel,
    nextLevel,
    xpToNext,
    progressPercent,
    addXP,
  };
};
