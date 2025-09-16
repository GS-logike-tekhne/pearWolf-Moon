export interface Level {
  level: number;
  title: string;
  xp: number;
  color: string;
  description: string;
}

export const PEAR_LEVELS: Level[] = [
  { level: 1, title: 'Sprouting Hero', xp: 0, color: '#4CAF50', description: 'Just getting started on your eco journey' },
  { level: 2, title: 'Green Seedling', xp: 250, color: '#66BB6A', description: 'Growing your environmental impact' },
  { level: 3, title: 'Eco Sprout', xp: 500, color: '#81C784', description: 'Making your first real difference' },
  { level: 4, title: 'Nature Nurturer', xp: 750, color: '#A5D6A7', description: 'Caring for the environment' },
  { level: 5, title: 'Cleanup Champion', xp: 1000, color: '#C8E6C9', description: 'Leading by example' },
  { level: 6, title: 'Eco Warrior', xp: 1500, color: '#4CAF50', description: 'Fighting for a cleaner world' },
  { level: 7, title: 'Green Guardian', xp: 2000, color: '#66BB6A', description: 'Protecting our planet' },
  { level: 8, title: 'Environmental Hero', xp: 2500, color: '#81C784', description: 'Making a significant impact' },
  { level: 9, title: 'Eco Legend', xp: 3000, color: '#A5D6A7', description: 'Inspiring others to act' },
  { level: 10, title: 'Planet Protector', xp: 4000, color: '#4CAF50', description: 'The ultimate environmental champion' },
];

export const getLevelProgress = (totalXP: number) => {
  // Find current level
  let currentLevel = PEAR_LEVELS[0];
  let nextLevel = PEAR_LEVELS[1];
  
  for (let i = 0; i < PEAR_LEVELS.length; i++) {
    if (totalXP >= PEAR_LEVELS[i].xp) {
      currentLevel = PEAR_LEVELS[i];
      nextLevel = PEAR_LEVELS[i + 1] || PEAR_LEVELS[i];
    } else {
      break;
    }
  }
  
  const xpInCurrentLevel = totalXP - currentLevel.xp;
  const xpToNext = nextLevel.xp - currentLevel.xp;
  const progressPercent = nextLevel.level > currentLevel.level 
    ? (xpInCurrentLevel / xpToNext) * 100 
    : 100;
  
  return {
    currentLevel,
    nextLevel,
    xpInCurrentLevel,
    xpToNext,
    progressPercent: Math.min(progressPercent, 100),
  };
};
