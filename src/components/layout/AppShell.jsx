import TopBar from './TopBar.jsx';

export default function AppShell({ children, petName, currency, onOpenShop }) {
  return (
    <div className="retro-window">
      <TopBar petName={petName} currency={currency} onOpenShop={onOpenShop} />
      <div className="panel-sunken" style={{ margin: 8, padding: 12, minHeight: 320 }}>
        {children}
      </div>
    </div>
  );
}
