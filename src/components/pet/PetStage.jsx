import { useRef } from 'react';
import RoomBackground from '../room/RoomBackground.jsx';
import FurnitureItem from '../room/FurnitureItem.jsx';
import PetSprite from './PetSprite.jsx';
import ActivityOverlay from '../activity/ActivityOverlay.jsx';

export default function PetStage({
  pet,
  room,
  clothingPositions,
  furniturePositions,
  activeActivity,
  onActivityComplete,
  isEvolving,
}) {
  const petTargetRef = useRef(null);

  // Keyed by item, not just slot, so swapping to a different item in the
  // same slot remounts with that item's own saved position.
  function furnitureKey(slot, itemId) {
    return `${slot}-${itemId ?? 'empty'}`;
  }

  return (
    <div className="pet-stage">
      <RoomBackground backgroundId={room.backgroundId} />
      <FurnitureItem
        key={furnitureKey('wall', room.furniture.wall)}
        slot="wall"
        itemId={room.furniture.wall}
        position={furniturePositions?.[room.furniture.wall]}
      />
      <FurnitureItem
        key={furnitureKey('rug', room.furniture.rug)}
        slot="rug"
        itemId={room.furniture.rug}
        position={furniturePositions?.[room.furniture.rug]}
      />
      <FurnitureItem
        key={furnitureKey('floorLeft', room.furniture.floorLeft)}
        slot="floorLeft"
        itemId={room.furniture.floorLeft}
        position={furniturePositions?.[room.furniture.floorLeft]}
      />
      <FurnitureItem
        key={furnitureKey('floorRight', room.furniture.floorRight)}
        slot="floorRight"
        itemId={room.furniture.floorRight}
        position={furniturePositions?.[room.furniture.floorRight]}
      />
      <div className="pet-stage-sprite" ref={petTargetRef}>
        <PetSprite
          speciesId={pet.speciesId}
          stage={pet.stage}
          stats={pet.stats}
          equipped={pet.equipped}
          clothingPositions={clothingPositions}
          isSleeping={Boolean(pet.sleep?.isSleeping)}
          isEvolving={isEvolving}
        />
      </div>
      {activeActivity && (
        <ActivityOverlay activityId={activeActivity} onComplete={onActivityComplete} petTargetRef={petTargetRef} />
      )}
    </div>
  );
}
