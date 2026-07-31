// Three weapons for the Dogfight mini-game. "forward" weapons auto-aim at
// the opponent's current position (like a gun); "bomb" always drops
// straight down from the ship regardless of where the opponent is, so
// hitting with it means maneuvering above your target instead of aiming.
export const WEAPONS = {
  scatter: {
    id: 'scatter',
    name: 'Scatter Shot',
    description: 'A shotgun blast - wide spread, short range, but only deadly up close.',
    kind: 'forward',
    pelletCount: 5,
    spreadDeg: 55,
    damage: 7,
    range: 75,
    fireIntervalMs: 1000,
    projectileSpeed: 190,
    preferredDistance: 55,
  },
  assault: {
    id: 'assault',
    name: 'Assault Shot',
    description: 'A rifle round - single line of fire, long range, steady damage.',
    kind: 'forward',
    pelletCount: 1,
    spreadDeg: 0,
    damage: 8,
    range: 999,
    fireIntervalMs: 480,
    projectileSpeed: 260,
    preferredDistance: 130,
  },
  bomb: {
    id: 'bomb',
    name: 'Bomb',
    description: 'Drops straight down from your ship - a direct hit is an instant kill.',
    kind: 'bomb',
    damage: 100,
    fireIntervalMs: 2200,
    fallSpeed: 95,
    preferredDistance: 0,
  },
};

export const WEAPON_LIST = Object.values(WEAPONS);

export function pickAiWeaponId(playerWeaponId) {
  const options = WEAPON_LIST.filter((w) => w.id !== playerWeaponId);
  return options[Math.floor(Math.random() * options.length)].id;
}
