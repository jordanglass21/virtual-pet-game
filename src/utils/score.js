export function computePetScore(pet, now) {
  const minutesAlive = Math.max(0, (now - pet.createdAt) / 60000);
  return Math.round((pet.totalEarned || 0) + minutesAlive);
}
