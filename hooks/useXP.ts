import { useState, useEffect, useCallback } from 'react';
import { getLevelProgress, Level } from '../data/levels';

export interface XPLevelData {
  currentLevel: Level;
  nextLevel: Level | null;
  xpToNext: number;
  progressPercent: number;
  isMaxLevel: boolean;
}

export interface XPReward {
  amount: number;
  source: string;
  timestamp: Date;
}

export const useXP = (initialXP: number = 0) => {
  const [currentXP, setCurrentXP] = useState(initialXP);
  const [levelData, setLevelData] = useState<XPLevelData>(() => getLevelProgress(initialXP));
  const [recentRewards, setRecentRewards] = useState<XPReward[]>([]);
  const [levelUpHistory, setLevelUpHistory] = useState<Level[]>([]);

  // Update level data when XP changes
  useEffect(() => {
    const newLevelData = getLevelProgress(currentXP);
    setLevelData(newLevelData);
    
    // Check for level up
    const previousLevel = levelData.currentLevel;
    if (newLevelData.currentLevel.level > previousLevel.level) {
      setLevelUpHistory(prev => [...prev, newLevelData.currentLevel]);
    }
  }, [currentXP]);

  // Add XP and track rewards
  const addXP = useCallback((amount: number, source: string) => {
    if (amount <= 0) return;

    setCurrentXP(prev => {
      const newXP = prev + amount;
      
      // Track recent rewards (keep last 10)
      setRecentRewards(prevRewards => [
        {
          amount,
          source,
          timestamp: new Date(),
        },
        ...prevRewards.slice(0, 9), // Keep last 10 rewards
      ]);
      
      return newXP;
    });
  }, []);

  // Subtract XP (for penalties or corrections)
  const subtractXP = useCallback((amount: number, source: string) => {
    if (amount <= 0) return;

    setCurrentXP(prev => Math.max(0, prev - amount));
  }, []);

  // Set XP directly (for loading from storage)
  const setXP = useCallback((xp: number) => {
    setCurrentXP(Math.max(0, xp));
  }, []);

  // Get XP history for analytics
  const getXPSummary = useCallback(() => {
    const totalEarned = recentRewards.reduce((sum, reward) => sum + reward.amount, 0);
    const sources = recentRewards.reduce((acc, reward) => {
      acc[reward.source] = (acc[reward.source] || 0) + reward.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalXP: currentXP,
      totalEarned,
      recentRewards: recentRewards.slice(0, 5), // Last 5 rewards
      sourceBreakdown: sources,
      levelUpCount: levelUpHistory.length,
      currentLevel: levelData.currentLevel,
    };
  }, [currentXP, recentRewards, levelUpHistory, levelData]);

  // Check if user can level up with given XP amount
  const canLevelUpWith = useCallback((xpAmount: number) => {
    const potentialXP = currentXP + xpAmount;
    const potentialLevelData = getLevelProgress(potentialXP);
    return potentialLevelData.currentLevel.level > levelData.currentLevel.level;
  }, [currentXP, levelData]);

  // Get next milestone (next level or major XP threshold)
  const getNextMilestone = useCallback(() => {
    if (levelData.isMaxLevel) {
      return {
        type: 'max_level',
        description: 'You\'ve reached the highest level!',
        xpNeeded: 0,
        progress: 100,
      };
    }

    return {
      type: 'level_up',
      description: `Reach ${levelData.nextLevel?.title} (Level ${levelData.nextLevel?.level})`,
      xpNeeded: levelData.xpToNext,
      progress: levelData.progressPercent,
    };
  }, [levelData]);

  // Calculate XP needed for specific level
  const getXPForLevel = useCallback((targetLevel: number) => {
    const level = levelData.currentLevel;
    if (targetLevel <= level.level) {
      return 0; // Already at or past this level
    }
    
    // Find the level data for target level
    const targetLevelData = getLevelProgress(0); // This would need to be updated with actual level lookup
    // For now, return a simple calculation
    return Math.max(0, (targetLevel - level.level) * 500); // Rough estimate
  }, [levelData]);

  // Reset XP (for testing or account reset)
  const resetXP = useCallback(() => {
    setCurrentXP(0);
    setRecentRewards([]);
    setLevelUpHistory([]);
  }, []);

  return {
    // Core XP data
    currentXP,
    levelData,
    
    // XP actions
    addXP,
    subtractXP,
    setXP,
    resetXP,
    
    // Level information
    currentLevel: levelData.currentLevel,
    nextLevel: levelData.nextLevel,
    xpToNext: levelData.xpToNext,
    progressPercent: levelData.progressPercent,
    isMaxLevel: levelData.isMaxLevel,
    
    // History and analytics
    recentRewards,
    levelUpHistory,
    getXPSummary,
    
    // Utility functions
    canLevelUpWith,
    getNextMilestone,
    getXPForLevel,
  };
};

// Export types for use in other components
export type { Level, XPLevelData, XPReward };