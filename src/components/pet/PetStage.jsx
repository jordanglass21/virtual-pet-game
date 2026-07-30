import RoomBackground from '../room/RoomBackground.jsx';
import FurnitureItem from '../room/FurnitureItem.jsx';
import PetSprite from './PetSprite.jsx';
import ActivityOverlay from '../activity/ActivityOverlay.jsx';

export default function PetStage({ pet, room, activeActivity, onActivityComplete }) {
  return (
    <div className="pet-stage">
      <RoomBackground backgroundId={room.backgroundId} />
      <FurnitureItem slot="wall" itemId={room.furniture.wall} />
      <FurnitureItem slot="rug" itemId={room.furniture.rug} />
      <FurnitureItem slot="floorLeft" itemId={room.furniture.floorLeft} />
      <FurnitureItem slot="floorRight" itemId={room.furniture.floorRight} />
      <div className="pet-stage-sprite">
        <PetSprite
          speciesId={pet.speciesId}
          stage={pet.stage}
          stats={pet.stats}
          equipped={pet.equipped}
          isSleeping={Boolean(pet.sleep?.isSleeping)}
        />
      </div>
      {activeActivity && <ActivityOverlay activityId={activeActivity} onComplete={onActivityComplete} />}
    </div>
  );
}
