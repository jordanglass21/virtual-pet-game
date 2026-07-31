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
    miniGames: {
      treatCatch: { highScore: 0 },
      dogfight: { winStreak: 0, maxWinStreak: 0 },
      petRun: { highScore: 0 },
      slotMachine: { highScore: 0 },
    },
    lastCheckInDate: null,
    onboardingComplete: false,
    // { [itemId]: { x, y } } drag offset from an item's default badge spot -
    // keyed by item, not by pet, so it's remembered wherever that item is worn.
    clothingPositions: {},
    // Same idea, for furniture placed in the room.
    furniturePositions: {},
    memoriam: [], // { name, speciesId, score } for every past pet, survives resets
    lastDeath: null, // set when the current pet just died, to show a Game Over modal
  };
}
