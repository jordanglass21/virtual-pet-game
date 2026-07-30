import AppShell from './components/layout/AppShell.jsx';
import { GameProvider, useGameDispatch, useGameState } from './state/GameContext.jsx';

function DebugGameView() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  if (!state.pet) {
    return (
      <div>
        <p>No pet yet. (Species selection UI arrives next milestone.)</p>
        <button
          type="button"
          className="btn-retro"
          onClick={() =>
            dispatch({ type: 'SELECT_SPECIES', payload: { speciesId: 'blob', name: 'Chomp', now: Date.now() } })
          }
        >
          Debug: create a Blob named Chomp
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>State foundation check — this raw view is replaced by real pet UI in later milestones.</p>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppShellWithState />
    </GameProvider>
  );
}

function AppShellWithState() {
  const state = useGameState();
  return (
    <AppShell petName={state.pet?.name} currency={state.currency}>
      <DebugGameView />
    </AppShell>
  );
}

export default App;
