export interface Level {
  level: number;
  xp: number;
  title: string;
  description?: string;
  badgeUnlock?: string;
  color?: string;
}

export const PEAR_LEVELS: Level[] = [
  {
    level: 1,
    xp: 0,
    title: 'Sprouting Hero',
    description: 'Just getting started on your eco journey!',
    color: '#4CAF50',
  },
  {
    level: 2,
    xp: 250,
    title: 'Rising Hero',
    description: 'Making your first impact on the environment!',
    color: '#8BC34A',
  },
  {
    level: 3,
    xp: 500,
    title: 'Eco Beast',
    description: 'You\'re becoming a force for environmental change!',
    color: '#FF9800',
  },
  {
    level: 4,
    xp: 1000,
    title: 'Urban Guardian',
    description: 'Protecting your city, one cleanup at a time!',
    color: '#2196F3',
  },
  {
    level: 5,
    xp: 2000,
    title: 'Planet Champion',
    description: 'A true champion for Earth!',
    color: '#9C27B0',
  },
  {
    level: 6,
    xp: 3500,
    title: 'Eco Legend',
    description: 'Your environmental impact is legendary!',
    color: '#E91E63',
  },
  {
    level: 7,
    xp: 5500,
    title: 'Climate Warrior',
    description: 'Leading the fight against climate change!',
    color: '#FF5722',
  },
  {
    level: 8,
    xp: 8000,
    title: 'Earth Protector',
    description: 'Guardian of our beautiful planet!',
    color: '#795548',
  },
  {
    level: 9,
    xp: 12000,
    title: 'Nature\'s Champion',
    description: 'Nature itself recognizes your dedication!',
    color: '#607D8B',
  },
  {
    level: 10,
    xp: 18000,
    title: 'PEAR Master',
    description: 'The ultimate environmental hero!',
    color: '#FFD700',
  },
];

// Helper functions
export const getLevelByXP = (xp: number): Level => {
  // Find the highest level the user has achieved
  let currentLevel = PEAR_LEVELS[0];
  
  for (const level of PEAR_LEVELS) {
    if (xp >= level.xp) {
      currentLevel = level;
    } else {
      break;
    }
  }
  
  return currentLevel;
};

export const getNextLevel = (currentXP: number): Level | null => {
  const currentLevel = getLevelByXP(currentXP);
  const currentIndex = PEAR_LEVELS.findIndex(l => l.level === currentLevel.level);
  
  if (currentIndex < PEAR_LEVELS.length - 1) {
    return PEAR_LEVELS[currentIndex + 1];
  }
  
  return null; // User is at max level
};

export const getXPToNextLevel = (currentXP: number): number => {
  const nextLevel = getNextLevel(currentXP);
  if (!nextLevel) return 0; // Max level reached
  
  return nextLevel.xp - currentXP;
};

export const getProgressToNextLevel = (currentXP: number): number => {
  const currentLevel = getLevelByXP(currentXP);
  const nextLevel = getNextLevel(currentXP);
  
  if (!nextLevel) return 100; // Max level reached
  
  const currentLevelXP = currentLevel.xp;
  const nextLevelXP = nextLevel.xp;
  const progressXP = currentXP - currentLevelXP;
  const totalXPNeeded = nextLevelXP - currentLevelXP;
  
  return Math.round((progressXP / totalXPNeeded) * 100);
};

export const getLevelProgress = (currentXP: number) => {
  const currentLevel = getLevelByXP(currentXP);
  const nextLevel = getNextLevel(currentXP);
  const xpToNext = getXPToNextLevel(currentXP);
  const progressPercent = getProgressToNextLevel(currentXP);
  
  return {
    currentLevel,
    nextLevel,
    xpToNext,
    progressPercent,
    isMaxLevel: !nextLevel,
  };
};
