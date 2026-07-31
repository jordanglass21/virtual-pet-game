import { SAVE_KEY, SAVE_VERSION } from '../data/constants.js';
import { createInitialState } from './initialState.js';

// One-time remap for the species ids renamed when their real artwork
// replaced the placeholders (blob -> golgar, dragon -> worm), so existing
// saves keep pointing at a species that still exists.
const SPECIES_ID_MIGRATIONS = { blob: 'golgar', dragon: 'worm' };

function migrateSpeciesId(id) {
  return SPECIES_ID_MIGRATIONS[id] ?? id;
}

function migrateSpeciesIds(state) {
  return {
    ...state,
    pet: state.pet ? { ...state.pet, speciesId: migrateSpeciesId(state.pet.speciesId) } : state.pet,
    memoriam: state.memoriam.map((entry) => ({ ...entry, speciesId: migrateSpeciesId(entry.speciesId) })),
    lastDeath: state.lastDeath ? { ...state.lastDeath, speciesId: migrateSpeciesId(state.lastDeath.speciesId) } : state.lastDeath,
  };
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    if (parsed?.meta?.saveVersion !== SAVE_VERSION) return createInitialState();
    // Shallow-merge over fresh defaults so top-level fields added after this
    // save was created (e.g. memoriam, lastDeath) don't come back undefined.
    return migrateSpeciesIds({ ...createInitialState(), ...parsed });
  } catch {
    return createInitialState();
  }
}

export function saveGame(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) - fail silently.
  }
}
