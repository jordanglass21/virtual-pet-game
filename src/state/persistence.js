import { SAVE_KEY, SAVE_VERSION } from '../data/constants.js';
import { createInitialState } from './initialState.js';

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    if (parsed?.meta?.saveVersion !== SAVE_VERSION) return createInitialState();
    return parsed;
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
