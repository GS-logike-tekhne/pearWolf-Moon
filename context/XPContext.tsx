import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// XP thresholds for each level
const XP_LEVELS: number[] = [
  0,     // Level 0
  100,   // Level 1
  250,   // Level 2
  450,   // Level 3
  700,   // Level 4
  1000,  // Level 5
  1350,  // Level 6
  1750,  // Level 7
  2200,  // Level 8
  2700,  // Level 9
  3250,  // Level 10
  3850,  // Level 11
  4500,  // Level 12
  5200,  // Level 13
  5950,  // Level 14
  6750,  // Level 15
  7600,  // Level 16
  8500,  // Level 17
  9450,  // Level 18
  10450, // Level 19
  11500, // Level 20
];

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
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  badges: Badge[];
  achievements: Achievement[];
  weeklyXP: number;
  monthlyXP: number;
  lastLoginDate: string;
  streak: number;
  showLevelUpModal: boolean;
  newLevel?: number;
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
      const newLevel = calculateLevel(newTotalXP);
      const showLevelUpModal = newLevel > state.currentLevel;
      
      return {
        ...state,
        totalXP: newTotalXP,
        currentLevel: newLevel,
        xpForNextLevel: calculateXPForNextLevel(newLevel),
        xpInCurrentLevel: calculateXPInCurrentLevel(newTotalXP, newLevel),
        weeklyXP: state.weeklyXP + action.payload.amount,
        monthlyXP: state.monthlyXP + action.payload.amount,
        showLevelUpModal,
        newLevel: showLevelUpModal ? newLevel : state.newLevel,
      };
    }
    
    case 'LEVEL_UP':
      return {
        ...state,
        currentLevel: action.payload.newLevel,
        showLevelUpModal: true,
        newLevel: action.payload.newLevel,
      };
    
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
      };
    
    case 'RESET_XP':
      return initialXPState;
    
    default:
      return state;
  }
};

const calculateLevel = (totalXP: number): number => {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_LEVELS[i]) {
      return i;
    }
  }
  return 0;
};

const calculateXPForNextLevel = (currentLevel: number): number => {
  if (currentLevel >= XP_LEVELS.length - 1) {
    return 0; // Max level reached
  }
  return XP_LEVELS[currentLevel + 1];
};

const calculateXPInCurrentLevel = (totalXP: number, currentLevel: number): number => {
  const currentLevelXP = XP_LEVELS[currentLevel];
  return totalXP - currentLevelXP;
};

const initialXPState: XPState = {
  totalXP: 0,
  currentLevel: 0,
  xpForNextLevel: XP_LEVELS[1],
  xpInCurrentLevel: 0,
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