import AppShell from './components/layout/AppShell.jsx';
import SpeciesSelect from './components/onboarding/SpeciesSelect.jsx';
import PetImage from './components/pet/PetImage.jsx';
import { GameProvider, useGameState } from './state/GameContext.jsx';

function GameScreen() {
  const state = useGameState();

  if (!state.pet) {
    return <SpeciesSelect />;
  }

  return (
    <div>
      <PetImage speciesId={state.pet.speciesId} stage={state.pet.stage} stats={state.pet.stats} />
      <p style={{ textAlign: 'center' }}>
        {state.pet.name} the {state.pet.stage}
      </p>
    </div>
  );
}

function AppShellWithState() {
  const state = useGameState();
  return (
    <AppShell petName={state.pet?.name} currency={state.currency}>
      <GameScreen />
    </AppShell>
  );
}

function App() {
  return (
    <GameProvider>
      <AppShellWithState />
    </GameProvider>
  );
}

export default App;
