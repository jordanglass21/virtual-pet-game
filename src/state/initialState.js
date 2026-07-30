import { now } from '../utils/time.js';

export function createInitialState() {
  return {
    meta: { saveVersion: 1, lastSavedAt: now() },
    pet: null, // set on species selection: { speciesId, name, createdAt, stage, growth, stats, lastUpdatedAt, equipped }
    currency: 0,
    inventory: [],
    room: {
      backgroundId: 'bg_default',
      furniture: { floorLeft: null, floorRight: null, wall: null, rug: null },
    },
    miniGames: { treatCatch: { highScore: 0 }, whackAMole: { highScore: 0 } },
    lastCheckInDate: null,
    onboardingComplete: false,
  };
}
