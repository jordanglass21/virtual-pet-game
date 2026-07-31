import { useRef } from 'react';
import Draggable from 'react-draggable';
import { SHOP_ITEMS_BY_ID } from '../../data/shopItems.js';
import { useGameDispatch } from '../../state/GameContext.jsx';

const SLOT_CLASS = {
  floorLeft: 'furniture-floor-left',
  floorRight: 'furniture-floor-right',
  wall: 'furniture-wall',
  rug: 'furniture-rug',
};

export default function FurnitureItem({ slot, itemId, position }) {
  const dispatch = useGameDispatch();
  const nodeRef = useRef(null);

  if (!itemId) return null;
  const item = SHOP_ITEMS_BY_ID[itemId];
  if (!item) return null;

  function handleStop(e, data) {
    dispatch({ type: 'SET_FURNITURE_POSITION', payload: { itemId, x: data.x, y: data.y } });
  }

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" defaultPosition={position ?? { x: 0, y: 0 }} onStop={handleStop}>
      <div ref={nodeRef} className={`furniture-item ${SLOT_CLASS[slot]}`}>
        <item.Render />
      </div>
    </Draggable>
  );
}
