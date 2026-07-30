export function getPetMood(stats, isSleeping) {
  if (Object.values(stats).every((value) => value <= 10)) return 'critical';
  if (isSleeping) return 'sleepy';
  if (stats.hunger < 30 || stats.happiness < 30 || stats.cleanliness < 30) return 'sad';
  if (stats.happiness > 70) return 'happy';
  return 'neutral';
}
