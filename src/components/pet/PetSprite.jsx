import { useRef } from 'react';
import Draggable from 'react-draggable';
import PetImage from './PetImage.jsx';
import { SHOP_ITEMS_BY_ID } from '../../data/shopItems.js';
import { useGameDispatch } from '../../state/GameContext.jsx';

const BADGE_CLASS = {
  hat: 'clothing-badge-hat',
  outfit: 'clothing-badge-outfit',
  accessory: 'clothing-badge-accessory',
};

function ClothingBadge({ slot, itemId, item, defaultPosition }) {
  const dispatch = useGameDispatch();
  const nodeRef = useRef(null);

  function handleStop(e, data) {
    dispatch({ type: 'SET_CLOTHING_POSITION', payload: { itemId, x: data.x, y: data.y } });
  }

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" defaultPosition={defaultPosition} onStop={handleStop}>
      <div ref={nodeRef} className={`clothing-badge ${BADGE_CLASS[slot]}`}>
        <item.Render />
      </div>
    </Draggable>
  );
}

export default function PetSprite({ speciesId, stage, stats, equipped, clothingPositions, isSleeping, isEvolving }) {
  return (
    <div className="pet-sprite">
      <PetImage
        speciesId={speciesId}
        stage={stage}
        stats={stats}
        isSleeping={isSleeping}
        isEvolving={isEvolving}
      />
      {Object.entries(equipped ?? {}).map(([slot, itemId]) => {
        if (!itemId) return null;
        const item = SHOP_ITEMS_BY_ID[itemId];
        if (!item) return null;
        const defaultPosition = clothingPositions?.[itemId] ?? { x: 0, y: 0 };
        return (
          <ClothingBadge
            // Keyed by item, not just slot, so swapping to a different item
            // in the same slot remounts with that item's own saved position.
            key={itemId}
            slot={slot}
            itemId={itemId}
            item={item}
            defaultPosition={defaultPosition}
          />
        );
      })}
    </div>
  );
}
