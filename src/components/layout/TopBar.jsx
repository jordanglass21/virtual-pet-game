export default function TopBar({ petName, currency, onOpenShop, onOpenSettings, onOpenHelp }) {
  return (
    <div className="retro-titlebar">
      <span>{petName ? `${petName}'s House` : 'Virtual Pet'}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>${currency ?? 0}</span>
        <button
          type="button"
          className="btn-retro btn-icon"
          onClick={onOpenSettings}
          disabled={!onOpenSettings}
          aria-label="Settings"
          title="Settings"
        >
          ⚙
        </button>
        <button type="button" className="btn-retro btn-icon" onClick={onOpenHelp} aria-label="Help" title="Help">
          ?
        </button>
        <button type="button" className="btn-retro" onClick={onOpenShop} disabled={!onOpenShop}>
          Shop
        </button>
      </div>
    </div>
  );
}
