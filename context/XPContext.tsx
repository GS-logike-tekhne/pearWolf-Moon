import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PEAR_LEVELS, getLevelProgress, Level } from '../data/levels';
import { useXP as useNewXP } from '../hooks/useXP';

// XP rewards for different actions
export const XP_REWARDS = {
  completeJob: 50,
  suggestCleanupSpot: 25,
  joinCommunityEvent: 30,
  firstCleanup: 100,
  weeklyStreak: 75,
  monthlyStreak: 200,
  referUser: 150,
  completeBadge: 100,
  donateToFund: 20,
  shareCleanup: 15,
  leaveReview: 10,
  uploadPhoto: 15,
} as const;

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  completed: boolean;
  completedAt?: Date;
}

interface XPState {
  totalXP: number;
  currentLevel: number;
  levelTitle: string;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  progressPercent: number;
  badges: Badge[];
  achievements: Achievement[];
  weeklyXP: number;
  monthlyXP: number;
  lastLoginDate: string;
  streak: number;
  showLevelUpModal: boolean;
  newLevel?: number;
  newLevelTitle?: string;
}

interface XPContextType {
  state: XPState;
  addXP: (amount: number, source: string) => void;
  earnBadge: (badgeId: string) => void;
  completeAchievement: (achievementId: string) => void;
  dismissLevelUpModal: () => void;
  resetXP: () => void;
}

type XPAction = 
  | { type: 'LOAD_XP_DATA'; payload: Partial<XPState> }
  | { type: 'ADD_XP'; payload: { amount: number; source: string } }
  | { type: 'LEVEL_UP'; payload: { newLevel: number } }
  | { type: 'EARN_BADGE'; payload: { badgeId: string } }
  | { type: 'COMPLETE_ACHIEVEMENT'; payload: { achievementId: string } }
  | { type: 'DISMISS_LEVEL_UP_MODAL' }
  | { type: 'RESET_XP' };

const XPContext = createContext<XPContextType | undefined>(undefined);

const xpReducer = (state: XPState, action: XPAction): XPState => {
  switch (action.type) {
    case 'LOAD_XP_DATA':
      return {
        ...state,
        ...action.payload,
      };
    
    case 'ADD_XP': {
      const newTotalXP = state.totalXP + action.payload.amount;
      const levelProgress = getLevelProgress(newTotalXP);
      const showLevelUpModal = levelProgress.currentLevel.level > state.currentLevel;
      
      return {
        ...state,
        totalXP: newTotalXP,
        currentLevel: levelProgress.currentLevel.level,
        levelTitle: levelProgress.currentLevel.title,
        xpForNextLevel: levelProgress.xpToNext,
        xpInCurrentLevel: newTotalXP - levelProgress.currentLevel.xp,
        progressPercent: levelProgress.progressPercent,
        weeklyXP: state.weeklyXP + action.payload.amount,
        monthlyXP: state.monthlyXP + action.payload.amount,
        showLevelUpModal,
        newLevel: showLevelUpModal ? levelProgress.currentLevel.level : state.newLevel,
        newLevelTitle: showLevelUpModal ? levelProgress.currentLevel.title : state.newLevelTitle,
      };
    }
    
    case 'LEVEL_UP': {
      const levelProgress = getLevelProgress(state.totalXP);
      return {
        ...state,
        currentLevel: levelProgress.currentLevel.level,
        levelTitle: levelProgress.currentLevel.title,
        showLevelUpModal: true,
        newLevel: levelProgress.currentLevel.level,
        newLevelTitle: levelProgress.currentLevel.title,
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
    
    case 'DISMISS_LEVEL_UP_MODAL':
      return {
        ...state,
        showLevelUpModal: false,
        newLevel: undefined,
        newLevelTitle: undefined,
      };
    
    case 'RESET_XP':
      return initialXPState;
    
    default:
      return state;
  }
};

// Helper functions now use the new leveling system
const getLevelData = (totalXP: number) => {
  return getLevelProgress(totalXP);
};

const initialXPState: XPState = {
  totalXP: 0,
  currentLevel: 1,
  levelTitle: 'Sprouting Hero',
  xpForNextLevel: 250,
  xpInCurrentLevel: 0,
  progressPercent: 0,
  badges: [
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
  ],
  achievements: [
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
  ],
  weeklyXP: 0,
  monthlyXP: 0,
  lastLoginDate: new Date().toISOString(),
  streak: 1,
  showLevelUpModal: false,
};

interface XPProviderProps {
  children: ReactNode;
}

export const XPProvider: React.FC<XPProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(xpReducer, initialXPState);

  // Load XP data from storage on app start
  useEffect(() => {
    loadXPData();
  }, []);

  // Save XP data whenever state changes
  useEffect(() => {
    saveXPData();
  }, [state]);

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
      await AsyncStorage.setItem('xp_data', JSON.stringify(state));
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

  const dismissLevelUpModal = (): void => {
    dispatch({ type: 'DISMISS_LEVEL_UP_MODAL' });
  };

  const resetXP = (): void => {
    dispatch({ type: 'RESET_XP' });
  };

  const value: XPContextType = {
    state,
    addXP,
    earnBadge,
    completeAchievement,
    dismissLevelUpModal,
    resetXP,
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