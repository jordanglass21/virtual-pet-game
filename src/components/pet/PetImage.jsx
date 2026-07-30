import { SPECIES } from '../../data/species.js';
import { getPetMood } from '../../utils/petMood.js';

export default function PetImage({ speciesId, stage, stats }) {
  const species = SPECIES[speciesId];
  const mood = stats ? getPetMood(stats) : 'neutral';

  return (
    <div className="pet-image-frame">
      <img src={species.images[stage]} alt={`${species.name} (${stage})`} className={`pet-image mood-${mood}`} />
    </div>
  );
}
