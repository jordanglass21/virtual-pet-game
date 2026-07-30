import { SHOP_ITEMS_BY_ID } from '../../data/shopItems.js';
import { DefaultBackground } from '../../data/shopRenderers.jsx';

export default function RoomBackground({ backgroundId }) {
  const item = SHOP_ITEMS_BY_ID[backgroundId];
  const Render = item ? item.Render : DefaultBackground;
  return (
    <div className="room-background">
      <Render />
    </div>
  );
}
