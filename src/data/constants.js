export const SAVE_KEY = 'tamagotchi:save:v1';
export const SAVE_VERSION = 1;

export const TICK_INTERVAL_MS = 5000;

export const STAT_MIN = 0;
export const STAT_MAX = 100;

export const ACTION_COOLDOWN_MS = 20000;

// There is no manual "Play" action - playing a mini-game in the Games hub
// fills that role instead (see MINIGAME_HAPPINESS_BONUS below).
export const CARE_ACTIONS = {
  feed: { stat: 'hunger', amount: 30, growth: 5, reward: 3 },
  clean: { stat: 'cleanliness', amount: 30, growth: 5, reward: 3 },
};

// A care action only pays out currency if the stat was below this
// threshold beforehand, to prevent spam-clicking for free coins.
export const REWARD_ELIGIBLE_BELOW = 90;

export const DAILY_CHECKIN_BONUS = 10;

export const EVOLVE_THRESHOLD = 100;
// How long the pet image flashes before revealing the adult form.
export const EVOLVE_FLASH_DURATION_MS = 1500;

export const MINIGAME_DURATION_MS = 30000;
export const MINIGAME_PAYOUT_MULTIPLIER = 3;
// Playing a mini-game round (win or lose) is the pet's "play" activity.
export const MINIGAME_HAPPINESS_BONUS = 20;
export const MINIGAME_GROWTH_BONUS = 5;

// Sleep is automatic, not a manual action: the pet naps once energy drops
// below the trigger, regenerating energy (and decaying other stats more
// slowly) until the nap duration elapses or energy is full again.
export const SLEEP_TRIGGER_THRESHOLD = 25;
export const SLEEP_DURATION_MS = 45000;
export const ENERGY_REGEN_PER_MIN = 12;
export const SLEEP_DECAY_MULTIPLIER = 0.4;
export const SLEEP_BONUS_HAPPINESS = 15;
export const SLEEP_BONUS_GROWTH = 5;

// Adults are lower-maintenance: stats decay slower once a pet is grown.
export const ADULT_DECAY_MULTIPLIER = 0.7;

// Interactive care activities.
export const FEED_TARGET_COUNT = 4;
export const CLEAN_TARGET_COUNT = 5;
// Cumulative pointer-travel distance (in % of the activity area) needed to
// scrub away one dirt spot.
export const SCRUB_DISTANCE_REQUIRED = 60;
