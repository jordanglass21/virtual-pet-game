import { SPECIES } from '../data/species.js';
import {
  CARE_ACTIONS,
  ACTION_COOLDOWN_MS,
  REWARD_ELIGIBLE_BELOW,
  EVOLVE_THRESHOLD,
  DAILY_CHECKIN_BONUS,
  STAT_MIN,
  STAT_MAX,
} from '../data/constants.js';
import { clamp, isSameCalendarDay } from '../utils/time.js';

function applyDecay(pet, atTime) {
  const species = SPECIES[pet.speciesId];
  const elapsedMin = Math.max(0, (atTime - pet.lastUpdatedAt) / 60000);
  if (elapsedMin === 0) return pet;

  const stats = { ...pet.stats };
  for (const key of Object.keys(stats)) {
    const rate = species.decayPerMin[key] ?? 0;
    stats[key] = clamp(stats[key] - rate * elapsedMin, STAT_MIN, STAT_MAX);
  }

  return { ...pet, stats, lastUpdatedAt: atTime };
}

function withEvolutionCheck(pet) {
  if (pet.stage !== 'baby' || pet.growth < EVOLVE_THRESHOLD) return pet;
  return { ...pet, stage: 'adult', justEvolved: true };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      return action.payload;
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
          justEvolved: false,
          stats: { hunger: 80, happiness: 80, energy: 80, cleanliness: 80 },
          lastUpdatedAt: at,
          equipped: { hat: null, outfit: null, accessory: null },
          cooldowns: {},
        },
      };
    }

    case 'TICK': {
      if (!state.pet) return state;
      const pet = applyDecay(state.pet, action.payload.now);
      return { ...state, pet };
    }

    case 'CLEAR_EVOLUTION_FLAG': {
      if (!state.pet) return state;
      return { ...state, pet: { ...state.pet, justEvolved: false } };
    }

    case 'CARE_ACTION': {
      if (!state.pet) return state;
      const { actionId, now: at } = action.payload;
      const config = CARE_ACTIONS[actionId];
      if (!config) return state;

      const readyAt = state.pet.cooldowns[actionId] ?? 0;
      if (at < readyAt) return state;

      let pet = applyDecay(state.pet, at);

      const statBefore = pet.stats[config.stat];
      const statAfter = clamp(statBefore + config.amount, STAT_MIN, STAT_MAX);
      const earnedReward = statBefore < REWARD_ELIGIBLE_BELOW;

      pet = {
        ...pet,
        stats: { ...pet.stats, [config.stat]: statAfter },
        growth: pet.growth + config.growth,
        cooldowns: { ...pet.cooldowns, [actionId]: at + ACTION_COOLDOWN_MS },
      };
      pet = withEvolutionCheck(pet);

      return {
        ...state,
        pet,
        currency: state.currency + (earnedReward ? config.reward : 0),
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
        lastCheckInDate: at,
      };
    }

    case 'BUY_ITEM': {
      const { id, price } = action.payload;
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
      return {
        ...state,
        currency: state.currency + payout,
        miniGames: {
          ...state.miniGames,
          [game]: { highScore: Math.max(prevHighScore, score) },
        },
      };
    }

    default:
      return state;
  }
}
