# Virtual Pet Game

A simple browser-based Tamagotchi-style virtual pet game with a retro 90s/early-2000s web aesthetic. Built with React + Vite, no backend — all game state is saved to `localStorage`.

## Features

- Choose from 3 pet species, each with a baby and adult form
- Pet stats (hunger, happiness, energy, cleanliness) decay over time and are restored through care actions
- Pets evolve from baby to adult once their growth meter fills up from consistent care
- Earn currency through care actions and a mini-game
- Spend currency in a shop on clothes, furniture, and backgrounds

## Development

```
npm install
npm run dev
```

## Pet Artwork

Pet body images live in `src/assets/pets/<species>/{baby,adult}.png`. The repo ships placeholder graphics at those paths — replace them with your own artwork using the same filenames.
