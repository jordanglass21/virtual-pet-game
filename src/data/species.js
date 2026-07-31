import blobBaby from '../assets/pets/blob/baby.svg';
import blobAdult from '../assets/pets/blob/adult.svg';
import catBaby from '../assets/pets/cat/baby.svg';
import catAdult from '../assets/pets/cat/adult.svg';
import dragonBaby from '../assets/pets/dragon/baby.png';
import dragonAdult from '../assets/pets/dragon/adult.png';

// Pet body art is a placeholder shipped with the project - replace the files
// under src/assets/pets/<speciesId>/{baby,adult}.(svg|png) with real artwork
// and these imports will pick it up automatically.
export const SPECIES = {
  blob: {
    id: 'blob',
    name: 'Blob',
    tagline: 'Cheerful and food-obsessed',
    decayPerMin: { hunger: 1.2, happiness: 0.6, energy: 0.4, cleanliness: 0.5 },
    images: { baby: blobBaby, adult: blobAdult },
  },
  cat: {
    id: 'cat',
    name: 'Kit',
    tagline: 'Aloof, but playful in bursts',
    decayPerMin: { hunger: 0.8, happiness: 0.9, energy: 0.6, cleanliness: 0.7 },
    images: { baby: catBaby, adult: catAdult },
  },
  dragon: {
    id: 'dragon',
    name: 'Wyrm',
    tagline: 'Sleepy and high-maintenance',
    decayPerMin: { hunger: 1.0, happiness: 0.7, energy: 0.9, cleanliness: 0.4 },
    images: { baby: dragonBaby, adult: dragonAdult },
  },
};

export const SPECIES_LIST = Object.values(SPECIES);
