export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'level' | 'missions' | 'cleanup' | 'community' | 'streak' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedDate?: Date;
  progress?: number;
  maxProgress?: number;
  requirements?: {
    missions?: number;
    xp?: number;
    level?: number;
    streak?: number;
    special?: string;
  };
}

export interface BadgeCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  badges: Badge[];
}

export interface BadgeUnlockEvent {
  badge: Badge;
  timestamp: Date;
  source: string;
  celebrationShown: boolean;
}
