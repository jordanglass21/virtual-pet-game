import { SHOP_ITEMS } from '../../data/shopItems.js';
import ShopItemCard from './ShopItemCard.jsx';

export default function ShopItemGrid({ category }) {
  const items = SHOP_ITEMS.filter((item) => item.category === category);
  return (
    <div className="shop-item-grid">
      {items.map((item) => (
        <ShopItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
