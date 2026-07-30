import { useState } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import SpeciesSelect from './components/onboarding/SpeciesSelect.jsx';
import PetStage from './components/pet/PetStage.jsx';
import StatBars from './components/pet/StatBars.jsx';
import ActionBar from './components/pet/ActionBar.jsx';
import GrowthBar from './components/pet/GrowthBar.jsx';
import EvolutionBanner from './components/common/EvolutionBanner.jsx';
import ShopModal from './components/shop/ShopModal.jsx';
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
      <PetStage pet={state.pet} room={state.room} />
      <p style={{ textAlign: 'center' }}>
        {state.pet.name} the {state.pet.stage}
      </p>
      {state.pet.stage === 'baby' && <GrowthBar growth={state.pet.growth} />}
      <StatBars stats={state.pet.stats} />
      <ActionBar cooldowns={state.pet.cooldowns} />
    </div>
  );
}

function AppShellWithState({ onOpenShop }) {
  const state = useGameState();
  return (
    <AppShell petName={state.pet?.name} currency={state.currency} onOpenShop={state.pet ? onOpenShop : undefined}>
      <GameScreen />
    </AppShell>
  );
}

function App() {
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <GameProvider>
      <AppShellWithState onOpenShop={() => setShopOpen(true)} />
      {shopOpen && <ShopModal onClose={() => setShopOpen(false)} />}
    </GameProvider>
  );
}

export default App;
