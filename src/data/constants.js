export const SAVE_KEY = 'tamagotchi:save:v1';
export const SAVE_VERSION = 1;

export const TICK_INTERVAL_MS = 5000;

export const STAT_MIN = 0;
export const STAT_MAX = 100;

export const ACTION_COOLDOWN_MS = 20000;

export const CARE_ACTIONS = {
  feed: { stat: 'hunger', amount: 30, growth: 5, reward: 3 },
  play: { stat: 'happiness', amount: 25, growth: 5, reward: 3 },
  sleep: { stat: 'energy', amount: 35, growth: 5, reward: 3 },
  clean: { stat: 'cleanliness', amount: 30, growth: 5, reward: 3 },
};

// A care action only pays out currency if the stat was below this
// threshold beforehand, to prevent spam-clicking for free coins.
export const REWARD_ELIGIBLE_BELOW = 90;

export const DAILY_CHECKIN_BONUS = 10;

export const EVOLVE_THRESHOLD = 100;

export const MINIGAME_DURATION_MS = 30000;
export const MINIGAME_PAYOUT_MULTIPLIER = 3;
