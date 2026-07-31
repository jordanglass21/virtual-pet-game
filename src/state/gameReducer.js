import { SPECIES } from '../data/species.js';
import { SHOP_ITEMS_BY_ID, MCGUFFIN_ID, RITUAL_GROUNDS_ID } from '../data/shopItems.js';
import { createInitialState } from './initialState.js';
import { computePetScore } from '../utils/score.js';
import {
  CARE_ACTIONS,
  ACTION_COOLDOWN_MS,
  REWARD_ELIGIBLE_BELOW,
  EVOLVE_THRESHOLD,
  DAILY_CHECKIN_BONUS,
  STAT_MIN,
  STAT_MAX,
  SLEEP_TRIGGER_THRESHOLD,
  SLEEP_DURATION_MS,
  ENERGY_REGEN_PER_MIN,
  SLEEP_DECAY_MULTIPLIER,
  SLEEP_BONUS_HAPPINESS,
  SLEEP_BONUS_GROWTH,
  ADULT_DECAY_MULTIPLIER,
  MINIGAME_HAPPINESS_BONUS,
  MINIGAME_GROWTH_BONUS,
} from '../data/constants.js';
import { clamp, isSameCalendarDay } from '../utils/time.js';

// Babies are fragile - a single stat bottoming out is fatal. Adults are
// hardier and can survive one stat hitting zero, dying only once a second
// one joins it.
const BABY_DEATH_ZERO_STAT_COUNT = 1;
const ADULT_DEATH_ZERO_STAT_COUNT = 2;

function applyDecay(pet, atTime) {
  const species = SPECIES[pet.speciesId];
  const elapsedMin = Math.max(0, (atTime - pet.lastUpdatedAt) / 60000);
  if (elapsedMin === 0) return pet;

  const stats = { ...pet.stats };
  const isSleeping = Boolean(pet.sleep?.isSleeping);
  const decayMultiplier = (pet.stage === 'adult' ? ADULT_DECAY_MULTIPLIER : 1) * (isSleeping ? SLEEP_DECAY_MULTIPLIER : 1);

  for (const key of Object.keys(stats)) {
    if (key === 'energy' && isSleeping) {
      stats.energy = clamp(stats.energy + ENERGY_REGEN_PER_MIN * elapsedMin, STAT_MIN, STAT_MAX);
      continue;
    }
    const rate = (species.decayPerMin[key] ?? 0) * decayMultiplier;
    stats[key] = clamp(stats[key] - rate * elapsedMin, STAT_MIN, STAT_MAX);
  }

  return { ...pet, stats, lastUpdatedAt: atTime };
}

function applySleepTransition(pet, atTime) {
  const sleep = pet.sleep ?? { isSleeping: false, startedAt: null };

  if (!sleep.isSleeping) {
    if (pet.stats.energy < SLEEP_TRIGGER_THRESHOLD) {
      return { ...pet, sleep: { isSleeping: true, startedAt: atTime } };
    }
    return pet;
  }

  const napElapsed = atTime - sleep.startedAt;
  const restedEnough = pet.stats.energy >= STAT_MAX;
  if (napElapsed >= SLEEP_DURATION_MS || restedEnough) {
    return {
      ...pet,
      sleep: { isSleeping: false, startedAt: null },
      stats: { ...pet.stats, happiness: clamp(pet.stats.happiness + SLEEP_BONUS_HAPPINESS, STAT_MIN, STAT_MAX) },
      growth: pet.growth + SLEEP_BONUS_GROWTH,
      justWokeRested: true,
    };
  }
  return pet;
}

function isDead(pet) {
  const zeroCount = Object.values(pet.stats).filter((v) => v <= STAT_MIN).length;
  const threshold = pet.stage === 'adult' ? ADULT_DEATH_ZERO_STAT_COUNT : BABY_DEATH_ZERO_STAT_COUNT;
  return zeroCount >= threshold;
}

function buildMemoriamEntry(pet, now) {
  return { name: pet.name, speciesId: pet.speciesId, score: computePetScore(pet, now) };
}

function resetWithMemoriam(state, entry) {
  const fresh = createInitialState();
  return { ...fresh, memoriam: [...state.memoriam, entry] };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      return action.payload;
    }

    case 'RESET_GAME': {
      if (!state.pet) return createInitialState();
      const entry = buildMemoriamEntry(state.pet, Date.now());
      return resetWithMemoriam(state, entry);
    }

    case 'SELECT_SPECIES': {
      const { speciesId, name } = action.payload;
      const at = action.payload.now;
      return {
        ...state,
        onboardingComplete: true,
        pet: {
          speciesId,
          name,
          createdAt: at,
          stage: 'baby',
          growth: 0,
          totalEarned: 0,
          justEvolved: false,
          justWokeRested: false,
          stats: { hunger: 80, happiness: 80, energy: 80, cleanliness: 80 },
          lastUpdatedAt: at,
          equipped: { hat: null, outfit: null, accessory: null },
          cooldowns: {},
          sleep: { isSleeping: false, startedAt: null },
        },
      };
    }

    case 'TICK': {
      if (!state.pet) return state;
      let pet = applyDecay(state.pet, action.payload.now);
      pet = applySleepTransition(pet, action.payload.now);

      if (isDead(pet)) {
        const entry = buildMemoriamEntry(pet, action.payload.now);
        return { ...resetWithMemoriam(state, entry), lastDeath: entry };
      }

      return { ...state, pet };
    }

    case 'CLEAR_EVOLUTION_FLAG': {
      if (!state.pet) return state;
      return { ...state, pet: { ...state.pet, justEvolved: false } };
    }

    case 'CLEAR_LAST_DEATH': {
      return { ...state, lastDeath: null };
    }

    case 'EVOLVE_PET': {
      const pet = state.pet;
      if (!pet || pet.stage !== 'baby') return state;
      if (pet.growth < EVOLVE_THRESHOLD) return state;
      if (pet.equipped.accessory !== MCGUFFIN_ID) return state;
      if (state.room.backgroundId !== RITUAL_GROUNDS_ID) return state;
      return { ...state, pet: { ...pet, stage: 'adult', justEvolved: true } };
    }

    case 'CLEAR_SLEEP_BONUS_FLAG': {
      if (!state.pet) return state;
      return { ...state, pet: { ...state.pet, justWokeRested: false } };
    }

    case 'WAKE_PET': {
      if (!state.pet?.sleep?.isSleeping) return state;
      return { ...state, pet: { ...state.pet, sleep: { isSleeping: false, startedAt: null } } };
    }

    case 'CARE_ACTION': {
      if (!state.pet || state.pet.sleep?.isSleeping) return state;
      const { actionId, now: at } = action.payload;
      const config = CARE_ACTIONS[actionId];
      if (!config) return state;

      const readyAt = state.pet.cooldowns[actionId] ?? 0;
      if (at < readyAt) return state;

      let pet = applyDecay(state.pet, at);

      const statBefore = pet.stats[config.stat];
      const statAfter = clamp(statBefore + config.amount, STAT_MIN, STAT_MAX);
      const earnedReward = statBefore < REWARD_ELIGIBLE_BELOW;
      const reward = earnedReward ? config.reward : 0;

      pet = {
        ...pet,
        stats: { ...pet.stats, [config.stat]: statAfter },
        growth: pet.growth + config.growth,
        totalEarned: pet.totalEarned + reward,
        cooldowns: { ...pet.cooldowns, [actionId]: at + ACTION_COOLDOWN_MS },
      };

      return {
        ...state,
        pet,
        currency: state.currency + reward,
      };
    }

    case 'CHECK_DAILY_BONUS': {
      const at = action.payload.now;
      if (state.lastCheckInDate && isSameCalendarDay(state.lastCheckInDate, at)) {
        return state;
      }
      return {
        ...state,
        currency: state.currency + DAILY_CHECKIN_BONUS,
        pet: state.pet ? { ...state.pet, totalEarned: state.pet.totalEarned + DAILY_CHECKIN_BONUS } : state.pet,
        lastCheckInDate: at,
      };
    }

    case 'BUY_ITEM': {
      const { id, price } = action.payload;
      const item = SHOP_ITEMS_BY_ID[id];
      if (item?.minStage === 'adult' && state.pet?.stage !== 'adult') return state;
      if (state.inventory.includes(id) || state.currency < price) return state;
      return {
        ...state,
        currency: state.currency - price,
        inventory: [...state.inventory, id],
      };
    }

    case 'EQUIP_ITEM': {
      if (!state.pet) return state;
      const { slot, id } = action.payload;
      if (id !== null && !state.inventory.includes(id)) return state;
      return { ...state, pet: { ...state.pet, equipped: { ...state.pet.equipped, [slot]: id } } };
    }

    case 'PLACE_FURNITURE': {
      const { slot, id } = action.payload;
      if (id !== null && !state.inventory.includes(id)) return state;
      return {
        ...state,
        room: { ...state.room, furniture: { ...state.room.furniture, [slot]: id } },
      };
    }

    case 'SET_BACKGROUND': {
      const { id } = action.payload;
      if (!state.inventory.includes(id)) return state;
      return { ...state, room: { ...state.room, backgroundId: id } };
    }

    case 'RECORD_MINIGAME_RESULT': {
      const { game, score, payout } = action.payload;
      const prevHighScore = state.miniGames[game]?.highScore ?? 0;

      let pet = state.pet;
      if (pet) {
        pet = {
          ...pet,
          stats: {
            ...pet.stats,
            happiness: clamp(pet.stats.happiness + MINIGAME_HAPPINESS_BONUS, STAT_MIN, STAT_MAX),
          },
          growth: pet.growth + MINIGAME_GROWTH_BONUS,
          totalEarned: pet.totalEarned + payout,
        };
      }

      return {
        ...state,
        pet,
        currency: state.currency + payout,
        miniGames: {
          ...state.miniGames,
          [game]: { highScore: Math.max(prevHighScore, score) },
        },
      };
    }

    case 'SLOT_SPIN': {
      const { bet, payout } = action.payload;
      if (bet > state.currency) return state;
      const prevBiggestWin = state.miniGames.slotMachine?.highScore ?? 0;
      return {
        ...state,
        currency: state.currency - bet + payout,
        pet: state.pet ? { ...state.pet, totalEarned: state.pet.totalEarned + payout } : state.pet,
        miniGames: {
          ...state.miniGames,
          slotMachine: { highScore: Math.max(prevBiggestWin, payout) },
        },
      };
    }

    default:
      return state;
  }
}
