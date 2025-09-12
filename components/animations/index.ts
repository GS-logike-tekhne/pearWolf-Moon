/**
 * Animation Components Entry Point
 * XP animations, celebrations, and visual effects for PEAR
 */

// Core animation components
export { default as XPBar } from './XPBar';
export { default as StreakAnimation } from './StreakAnimation';
export { default as BadgeUnlock } from './BadgeUnlock';
export { default as MyCardLevelUp } from './MyCardLevelUp';

// Legacy components (for backward compatibility)
export { default as XPAnimation } from './XPAnimation';
export { default as Confetti } from './XPAnimation';

// Re-export animation service
export { default as XPAnimationService } from '../../services/animations/xpAnimationService';
export type { 
  XPAnimationConfig, 
  LevelUpAnimation, 
  CelebrationAnimation 
} from '../../services/animations/xpAnimationService';
