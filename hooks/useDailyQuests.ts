import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Quest = {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  category: 'cleanup' | 'social' | 'reporting' | 'engagement';
  icon: string;
};

const STORAGE_KEY = 'DAILY_QUESTS_STATE';
const RESET_KEY = 'DAILY_QUESTS_RESET_TIME';
const XP_EARNED_KEY = 'DAILY_XP_EARNED';

const defaultQuests: Quest[] = [
  { 
    id: '1', 
    title: 'Clean up 2 trash bags', 
    description: 'Complete 2 cleanup missions today',
    xp: 100, 
    completed: false,
    category: 'cleanup',
    icon: 'trash'
  },
  { 
    id: '2', 
    title: 'Invite a friend to PEAR', 
    description: 'Share PEAR with someone new',
    xp: 75, 
    completed: false,
    category: 'social',
    icon: 'people'
  },
  { 
    id: '3', 
    title: 'Report illegal dump', 
    description: 'Report environmental violations',
    xp: 50, 
    completed: false,
    category: 'reporting',
    icon: 'warning'
  },
  { 
    id: '4', 
    title: 'Complete 3 missions', 
    description: 'Finish any 3 missions today',
    xp: 150, 
    completed: false,
    category: 'engagement',
    icon: 'checkmark-circle'
  },
  { 
    id: '5', 
    title: 'Earn $25+ today', 
    description: 'Make money through cleanup jobs',
    xp: 125, 
    completed: false,
    category: 'cleanup',
    icon: 'cash'
  },
];

export const useDailyQuests = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [xpEarnedToday, setXpEarnedToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const XP_DAILY_CAP = 300; // Increased cap for more quest variety

  // Reset if more than 24 hours have passed
  const checkReset = async () => {
    try {
      const lastReset = await AsyncStorage.getItem(RESET_KEY);
      const now = new Date().getTime();
      const oneDayInMs = 24 * 60 * 60 * 1000;

      if (!lastReset || now - parseInt(lastReset) > oneDayInMs) {
        await AsyncStorage.setItem(RESET_KEY, now.toString());
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultQuests));
        await AsyncStorage.setItem(XP_EARNED_KEY, '0');
        setXpEarnedToday(0);
        setQuests(defaultQuests);
        return true; // Reset occurred
      }
      return false; // No reset needed
    } catch (error) {
      console.error('Error checking quest reset:', error);
      return false;
    }
  };

  // Load quests from storage
  const loadQuests = async () => {
    try {
      setIsLoading(true);
      await checkReset();
      
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const storedXp = await AsyncStorage.getItem(XP_EARNED_KEY);
      
      const parsed = stored ? JSON.parse(stored) : defaultQuests;
      const parsedXp = storedXp ? parseInt(storedXp) : 0;
      
      setQuests(parsed);
      setXpEarnedToday(parsedXp);
    } catch (error) {
      console.error('Error loading quests:', error);
      setQuests(defaultQuests);
      setXpEarnedToday(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuests();
  }, []);

  const completeQuest = async (id: string): Promise<number> => {
    try {
      const quest = quests.find(q => q.id === id);
      if (!quest || quest.completed) return 0;

      // Prevent XP over daily cap
      if (xpEarnedToday + quest.xp > XP_DAILY_CAP) return 0;

      const updated = quests.map(q =>
        q.id === id ? { ...q, completed: true } : q
      );

      const newXpEarned = xpEarnedToday + quest.xp;

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      await AsyncStorage.setItem(XP_EARNED_KEY, newXpEarned.toString());
      
      setQuests(updated);
      setXpEarnedToday(newXpEarned);

      return quest.xp;
    } catch (error) {
      console.error('Error completing quest:', error);
      return 0;
    }
  };

  const resetQuestsManually = async () => {
    try {
      const now = new Date().getTime();
      await AsyncStorage.setItem(RESET_KEY, now.toString());
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultQuests));
      await AsyncStorage.setItem(XP_EARNED_KEY, '0');
      setXpEarnedToday(0);
      setQuests(defaultQuests);
    } catch (error) {
      console.error('Error resetting quests:', error);
    }
  };

  const getQuestProgress = () => {
    const completed = quests.filter(q => q.completed).length;
    const total = quests.length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  const getQuestsByCategory = (category: Quest['category']) => {
    return quests.filter(q => q.category === category);
  };

  const getRemainingXp = () => {
    return Math.max(0, XP_DAILY_CAP - xpEarnedToday);
  };

  return {
    quests,
    completeQuest,
    xpEarnedToday,
    XP_DAILY_CAP,
    resetQuestsManually,
    isLoading,
    getQuestProgress,
    getQuestsByCategory,
    getRemainingXp,
  };
};
