import { SHOP_ITEMS_BY_ID } from '../../data/shopItems.js';

const SLOT_CLASS = {
  floorLeft: 'furniture-floor-left',
  floorRight: 'furniture-floor-right',
  wall: 'furniture-wall',
  rug: 'furniture-rug',
};

export default function FurnitureItem({ slot, itemId }) {
  if (!itemId) return null;
  const item = SHOP_ITEMS_BY_ID[itemId];
  if (!item) return null;

  return (
    <div className={`furniture-item ${SLOT_CLASS[slot]}`}>
      <item.Render />
    </div>
  );
}
