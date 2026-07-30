// Pet body art (baby/adult images) is wired up in a later milestone.
// Decay rates are in stat points per real-world minute.
export const SPECIES = {
  blob: {
    id: 'blob',
    name: 'Blob',
    tagline: 'Cheerful and food-obsessed',
    decayPerMin: { hunger: 1.2, happiness: 0.6, energy: 0.4, cleanliness: 0.5 },
  },
  cat: {
    id: 'cat',
    name: 'Kit',
    tagline: 'Aloof, but playful in bursts',
    decayPerMin: { hunger: 0.8, happiness: 0.9, energy: 0.6, cleanliness: 0.7 },
  },
  dragon: {
    id: 'dragon',
    name: 'Wyrm',
    tagline: 'Sleepy and high-maintenance',
    decayPerMin: { hunger: 1.0, happiness: 0.7, energy: 0.9, cleanliness: 0.4 },
  },
};

export const SPECIES_LIST = Object.values(SPECIES);
