import { CherryIcon, BellIcon, StarIcon, SevenIcon } from './slotRenderers.jsx';

// Weighted so the jackpot symbol is rare. matchPayout is the multiplier on
// the bet when all 3 reels land on that symbol.
export const SLOT_SYMBOLS = [
  { id: 'cherry', weight: 40, matchPayout: 3, Icon: CherryIcon },
  { id: 'bell', weight: 28, matchPayout: 5, Icon: BellIcon },
  { id: 'star', weight: 18, matchPayout: 10, Icon: StarIcon },
  { id: 'seven', weight: 8, matchPayout: 20, Icon: SevenIcon },
];

const TOTAL_WEIGHT = SLOT_SYMBOLS.reduce((sum, s) => sum + s.weight, 0);

export function randomSymbol() {
  let roll = Math.random() * TOTAL_WEIGHT;
  for (const symbol of SLOT_SYMBOLS) {
    if (roll < symbol.weight) return symbol;
    roll -= symbol.weight;
  }
  return SLOT_SYMBOLS[0];
}

// Payout when exactly two of the three reels match (any symbol) - a "push",
// returning the bet rather than winning or losing.
export const PAIR_PAYOUT_MULTIPLIER = 1;

export const BET_OPTIONS = [5, 10, 25, 50];
