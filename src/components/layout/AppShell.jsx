import TopBar from './TopBar.jsx';

export default function AppShell({ children, petName, currency, onOpenShop, onOpenSettings, onOpenHelp }) {
  return (
    <div className="retro-window">
      <TopBar
        petName={petName}
        currency={currency}
        onOpenShop={onOpenShop}
        onOpenSettings={onOpenSettings}
        onOpenHelp={onOpenHelp}
      />
      <div className="panel-sunken" style={{ margin: 8, padding: 12, minHeight: 320 }}>
        {children}
      </div>
    </div>
  );
}
