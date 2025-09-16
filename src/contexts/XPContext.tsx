import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { XPData, Badge, Achievement } from '../types';
import { getLevelProgress } from '../constants/levels';
import { XP_REWARDS } from '../constants/theme';

interface XPContextType {
  xpData: XPData;
  addXP: (amount: number, source: string) => void;
  earnBadge: (badgeId: string) => void;
  completeAchievement: (achievementId: string) => void;
  resetXP: () => void;
  getXPSummary: () => XPData;
}

type XPAction = 
  | { type: 'LOAD_XP_DATA'; payload: Partial<XPData> }
  | { type: 'ADD_XP'; payload: { amount: number; source: string } }
  | { type: 'EARN_BADGE'; payload: { badgeId: string } }
  | { type: 'COMPLETE_ACHIEVEMENT'; payload: { achievementId: string } }
  | { type: 'RESET_XP' };

const XPContext = createContext<XPContextType | undefined>(undefined);

const initialBadges: Badge[] = [
  {
    id: 'first-cleanup',
    name: 'First Step',
    description: 'Complete your first cleanup',
    icon: '🌱',
  },
  {
    id: 'community-contributor',
    name: 'Community Hero',
    description: 'Suggest 5 cleanup spots',
    icon: '🏆',
  },
  {
    id: 'eco-champion',
    name: 'Eco Champion',
    description: 'Reach level 10',
    icon: '🌍',
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Complete 7 days in a row',
    icon: '🔥',
  },
  {
    id: 'photo-documentarian',
    name: 'Photo Documentarian',
    description: 'Upload 10 cleanup photos',
    icon: '📸',
  },
];

const initialAchievements: Achievement[] = [
  {
    id: 'weekly-warrior',
    title: 'Weekly Warrior',
    description: 'Complete 3 cleanups in a week',
    icon: '⚡',
    xpReward: 100,
    completed: false,
  },
  {
    id: 'photo-documentarian',
    title: 'Photo Documentarian',
    description: 'Upload 10 cleanup photos',
    icon: '📸',
    xpReward: 75,
    completed: false,
  },
  {
    id: 'community-builder',
    title: 'Community Builder',
    description: 'Suggest 5 cleanup locations',
    icon: '🏘️',
    xpReward: 150,
    completed: false,
  },
];

const initialXPState: XPData = {
  totalXP: 0,
  currentLevel: 1,
  levelTitle: 'Sprouting Hero',
  xpForNextLevel: 250,
  xpInCurrentLevel: 0,
  progressPercent: 0,
  badges: initialBadges,
  achievements: initialAchievements,
  weeklyXP: 0,
  monthlyXP: 0,
  streak: 1,
};

const xpReducer = (state: XPData, action: XPAction): XPData => {
  switch (action.type) {
    case 'LOAD_XP_DATA':
      return {
        ...state,
        ...action.payload,
      };
    
    case 'ADD_XP': {
      const newTotalXP = state.totalXP + action.payload.amount;
      const levelProgress = getLevelProgress(newTotalXP);
      
      return {
        ...state,
        totalXP: newTotalXP,
        currentLevel: levelProgress.currentLevel.level,
        levelTitle: levelProgress.currentLevel.title,
        xpForNextLevel: levelProgress.xpToNext,
        xpInCurrentLevel: levelProgress.xpInCurrentLevel,
        progressPercent: levelProgress.progressPercent,
        weeklyXP: state.weeklyXP + action.payload.amount,
        monthlyXP: state.monthlyXP + action.payload.amount,
      };
    }
    
    case 'EARN_BADGE': {
      const updatedBadges = state.badges.map(badge =>
        badge.id === action.payload.badgeId
          ? { ...badge, earnedAt: new Date() }
          : badge
      );
      
      return {
        ...state,
        badges: updatedBadges,
      };
    }
    
    case 'COMPLETE_ACHIEVEMENT': {
      const updatedAchievements = state.achievements.map(achievement =>
        achievement.id === action.payload.achievementId
          ? { ...achievement, completed: true, completedAt: new Date() }
          : achievement
      );
      
      return {
        ...state,
        achievements: updatedAchievements,
      };
    }
    
    case 'RESET_XP':
      return initialXPState;
    
    default:
      return state;
  }
};

interface XPProviderProps {
  children: ReactNode;
}

export const XPProvider: React.FC<XPProviderProps> = ({ children }) => {
  const [xpData, dispatch] = useReducer(xpReducer, initialXPState);

  useEffect(() => {
    loadXPData();
  }, []);

  useEffect(() => {
    saveXPData();
  }, [xpData]);

  const loadXPData = async (): Promise<void> => {
    try {
      const savedData = await AsyncStorage.getItem('xp_data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_XP_DATA', payload: parsedData });
      }
    } catch (error) {
      console.error('Error loading XP data:', error);
    }
  };

  const saveXPData = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem('xp_data', JSON.stringify(xpData));
    } catch (error) {
      console.error('Error saving XP data:', error);
    }
  };

  const addXP = (amount: number, source: string): void => {
    dispatch({ type: 'ADD_XP', payload: { amount, source } });
  };

  const earnBadge = (badgeId: string): void => {
    dispatch({ type: 'EARN_BADGE', payload: { badgeId } });
  };

  const completeAchievement = (achievementId: string): void => {
    dispatch({ type: 'COMPLETE_ACHIEVEMENT', payload: { achievementId } });
  };

  const resetXP = (): void => {
    dispatch({ type: 'RESET_XP' });
  };

  const getXPSummary = (): XPData => {
    return xpData;
  };

  const value: XPContextType = {
    xpData,
    addXP,
    earnBadge,
    completeAchievement,
    resetXP,
    getXPSummary,
  };

  return (
    <XPContext.Provider value={value}>
      {children}
    </XPContext.Provider>
  );
};

export const useXP = (): XPContextType => {
  const context = useContext(XPContext);
  if (!context) {
    throw new Error('useXP must be used within an XPProvider');
  }
  return context;
};
