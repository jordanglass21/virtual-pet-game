import PetImage from './PetImage.jsx';
import { SHOP_ITEMS_BY_ID } from '../../data/shopItems.js';

const BADGE_CLASS = {
  hat: 'clothing-badge-hat',
  outfit: 'clothing-badge-outfit',
  accessory: 'clothing-badge-accessory',
};

export default function PetSprite({ speciesId, stage, stats, equipped, isSleeping }) {
  return (
    <div className="pet-sprite">
      <PetImage speciesId={speciesId} stage={stage} stats={stats} isSleeping={isSleeping} />
      {Object.entries(equipped ?? {}).map(([slot, itemId]) => {
        if (!itemId) return null;
        const item = SHOP_ITEMS_BY_ID[itemId];
        if (!item) return null;
        return (
          <div key={slot} className={`clothing-badge ${BADGE_CLASS[slot]}`}>
            <item.Render />
          </div>
        );
      })}
    </div>
  );
}
