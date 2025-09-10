import { useState } from 'react';

export type XPData = {
  level: number;
  xp: number;
  progress: number; // between 0 and 1
  nextXP: number;
};

export const useXP = (initialXP = 0): XPData & { gainXP: (amount: number) => void } => {
  const [xp, setXP] = useState(initialXP);

  const getLevel = (xp: number): { level: number; xpForLevel: number } => {
    let level = 1;
    let threshold = 100;

    while (xp >= threshold) {
      xp -= threshold;
      level++;
      threshold = Math.floor(threshold * 1.25); // Level curve
    }

    return { level, xpForLevel: threshold };
  };

  const { level, xpForLevel } = getLevel(xp);
  const progress = xp / xpForLevel;

  const gainXP = (amount: number) => {
    setXP(prev => prev + amount);
  };

  return { level, xp, progress, nextXP: xpForLevel, gainXP };
};
