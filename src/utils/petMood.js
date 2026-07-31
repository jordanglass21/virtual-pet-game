// Mirrors the death rule in gameReducer.js (baby dies at 1 zero stat, adult
// at 2) but with a warning buffer above zero, so the critical mood gives the
// player a chance to react before an actual death.
const CRITICAL_WARNING_THRESHOLD = 15;

export function getPetMood(stats, isSleeping, stage) {
  const lowCount = Object.values(stats).filter((value) => value <= CRITICAL_WARNING_THRESHOLD).length;
  const criticalAt = stage === 'adult' ? 2 : 1;
  if (lowCount >= criticalAt) return 'critical';
  if (isSleeping) return 'sleepy';
  if (stats.hunger < 30 || stats.happiness < 30 || stats.cleanliness < 30) return 'sad';
  if (stats.happiness > 70) return 'happy';
  return 'neutral';
}
