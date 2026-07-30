import TopBar from './TopBar.jsx';

export default function AppShell({ children }) {
  return (
    <div className="retro-window">
      <TopBar />
      <div className="panel-sunken" style={{ margin: 8, padding: 12, minHeight: 320 }}>
        {children}
      </div>
    </div>
  );
}
