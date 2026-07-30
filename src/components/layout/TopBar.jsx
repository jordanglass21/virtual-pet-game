export default function TopBar({ petName, currency, onOpenShop }) {
  return (
    <div className="retro-titlebar">
      <span>{petName ? `${petName}'s House` : 'Virtual Pet'}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>${currency ?? 0}</span>
        <button type="button" className="btn-retro" onClick={onOpenShop} disabled={!onOpenShop}>
          Shop
        </button>
      </div>
    </div>
  );
}
