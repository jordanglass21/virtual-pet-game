import { SHOP_CATEGORIES } from '../../data/shopItems.js';

export default function ShopCategoryTabs({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
      {SHOP_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className="btn-retro"
          style={{ flex: 1, fontWeight: cat.id === active ? 'bold' : 'normal' }}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
