import golgarBaby from '../assets/pets/golgar/baby.png';
import golgarAdult from '../assets/pets/golgar/adult.png';
import catBaby from '../assets/pets/cat/baby.svg';
import catAdult from '../assets/pets/cat/adult.svg';
import wormBaby from '../assets/pets/worm/baby.png';
import wormAdult from '../assets/pets/worm/adult.png';

// Pet body art is a placeholder shipped with the project - replace the files
// under src/assets/pets/<speciesId>/{baby,adult}.(svg|png) with real artwork
// and these imports will pick it up automatically.
export const SPECIES = {
  golgar: {
    id: 'golgar',
    name: "Gol'gar",
    tagline: 'Cheerful and food-obsessed',
    decayPerMin: { hunger: 1.2, happiness: 0.6, energy: 0.4, cleanliness: 0.5 },
    images: { baby: golgarBaby, adult: golgarAdult },
  },
  cat: {
    id: 'cat',
    name: 'Kit',
    tagline: 'Aloof, but playful in bursts',
    decayPerMin: { hunger: 0.8, happiness: 0.9, energy: 0.6, cleanliness: 0.7 },
    images: { baby: catBaby, adult: catAdult },
  },
  worm: {
    id: 'worm',
    name: 'Worm',
    tagline: 'Sleepy and high-maintenance',
    decayPerMin: { hunger: 1.0, happiness: 0.7, energy: 0.9, cleanliness: 0.4 },
    images: { baby: wormBaby, adult: wormAdult },
  },
};

export const SPECIES_LIST = Object.values(SPECIES);
