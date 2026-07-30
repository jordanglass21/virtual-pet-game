import AppShell from './components/layout/AppShell.jsx';
import SpeciesSelect from './components/onboarding/SpeciesSelect.jsx';
import PetImage from './components/pet/PetImage.jsx';
import StatBars from './components/pet/StatBars.jsx';
import ActionBar from './components/pet/ActionBar.jsx';
import GrowthBar from './components/pet/GrowthBar.jsx';
import EvolutionBanner from './components/common/EvolutionBanner.jsx';
import { GameProvider, useGameState } from './state/GameContext.jsx';
import { useGameTick } from './hooks/useGameTick.js';

function GameScreen() {
  const state = useGameState();
  useGameTick();

  if (!state.pet) {
    return <SpeciesSelect />;
  }

  return (
    <div>
      {state.pet.justEvolved && <EvolutionBanner petName={state.pet.name} />}
      <PetImage speciesId={state.pet.speciesId} stage={state.pet.stage} stats={state.pet.stats} />
      <p style={{ textAlign: 'center' }}>
        {state.pet.name} the {state.pet.stage}
      </p>
      {state.pet.stage === 'baby' && <GrowthBar growth={state.pet.growth} />}
      <StatBars stats={state.pet.stats} />
      <ActionBar cooldowns={state.pet.cooldowns} />
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
