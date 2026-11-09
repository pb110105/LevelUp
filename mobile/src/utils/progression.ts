
export const XP_PER_LEVEL = 100;

export const calculateLevel = (xp: number): number => {
  return Math.floor(
    Math.max(0, xp) / XP_PER_LEVEL
  ) + 1;
};

export const calculateLevelXP = (xp: number): number => {
  return Math.max(0, xp) % XP_PER_LEVEL;
};

export const calculateLevelProgress = (
  xp: number
): number => {
  return (
    calculateLevelXP(xp) / XP_PER_LEVEL
  ) * 100;
};
