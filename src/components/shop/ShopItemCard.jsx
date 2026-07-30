import { useGameDispatch, useGameState } from '../../state/GameContext.jsx';

export default function ShopItemCard({ item }) {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const owned = state.inventory.includes(item.id);
  const affordable = state.currency >= item.price;
  const locked = item.minStage === 'adult' && state.pet?.stage !== 'adult';

  function buy() {
    dispatch({ type: 'BUY_ITEM', payload: { id: item.id, price: item.price } });
  }

  let isActive = false;
  let activeLabel = '';
  let inactiveLabel = '';
  let onToggle = () => {};

  if (item.category === 'clothes') {
    isActive = state.pet?.equipped[item.slot] === item.id;
    activeLabel = 'Unequip';
    inactiveLabel = 'Equip';
    onToggle = () =>
      dispatch({ type: 'EQUIP_ITEM', payload: { slot: item.slot, id: isActive ? null : item.id } });
  } else if (item.category === 'furniture') {
    isActive = state.room.furniture[item.slot] === item.id;
    activeLabel = 'Remove';
    inactiveLabel = 'Place';
    onToggle = () =>
      dispatch({ type: 'PLACE_FURNITURE', payload: { slot: item.slot, id: isActive ? null : item.id } });
  } else if (item.category === 'background') {
    isActive = state.room.backgroundId === item.id;
    activeLabel = 'Active';
    inactiveLabel = 'Set';
    onToggle = () => {
      if (!isActive) dispatch({ type: 'SET_BACKGROUND', payload: { id: item.id } });
    };
  }

  return (
    <div className="shop-item-card">
      <div className="shop-item-preview" style={locked ? { opacity: 0.35 } : undefined}>
        <item.Render />
      </div>
      <div className="shop-item-name">{item.name}</div>
      {locked ? (
        <button type="button" className="btn-retro" disabled>
          Adult only
        </button>
      ) : owned ? (
        <button
          type="button"
          className="btn-retro"
          onClick={onToggle}
          disabled={item.category === 'background' && isActive}
        >
          {isActive ? activeLabel : inactiveLabel}
        </button>
      ) : (
        <button type="button" className="btn-retro" onClick={buy} disabled={!affordable}>
          Buy ${item.price}
        </button>
      )}
    </div>
  );
}
