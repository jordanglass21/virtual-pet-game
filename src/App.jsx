import { useState } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import SpeciesSelect from './components/onboarding/SpeciesSelect.jsx';
import PetStage from './components/pet/PetStage.jsx';
import StatBars from './components/pet/StatBars.jsx';
import ActionBar from './components/pet/ActionBar.jsx';
import GrowthBar from './components/pet/GrowthBar.jsx';
import EvolutionBanner from './components/common/EvolutionBanner.jsx';
import ShopModal from './components/shop/ShopModal.jsx';
import MiniGameModal from './components/minigame/MiniGameModal.jsx';
import { GameProvider, useGameState } from './state/GameContext.jsx';
import { useGameTick } from './hooks/useGameTick.js';
import { getPetMood } from './utils/petMood.js';

function GameScreen({ onOpenMiniGame }) {
  const state = useGameState();
  useGameTick();

  if (!state.pet) {
    return <SpeciesSelect />;
  }

  const isCritical = getPetMood(state.pet.stats) === 'critical';

  return (
    <div>
      {state.pet.justEvolved && <EvolutionBanner petName={state.pet.name} />}
      <PetStage pet={state.pet} room={state.room} />
      <p style={{ textAlign: 'center' }}>
        {state.pet.name} the {state.pet.stage}
      </p>
      {isCritical && <p className="critical-warning">⚠ {state.pet.name} urgently needs your help!</p>}
      {state.pet.stage === 'baby' && <GrowthBar growth={state.pet.growth} />}
      <StatBars stats={state.pet.stats} />
      <ActionBar cooldowns={state.pet.cooldowns} />
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <button type="button" className="btn-retro" onClick={onOpenMiniGame}>
          Play Treat Catch
        </button>
      </div>
    </div>
  );
}

function AppShellWithState({ onOpenShop, onOpenMiniGame }) {
  const state = useGameState();
  return (
    <AppShell petName={state.pet?.name} currency={state.currency} onOpenShop={state.pet ? onOpenShop : undefined}>
      <GameScreen onOpenMiniGame={onOpenMiniGame} />
    </AppShell>
  );
}

function App() {
  const [shopOpen, setShopOpen] = useState(false);
  const [miniGameOpen, setMiniGameOpen] = useState(false);

  return (
    <GameProvider>
      <AppShellWithState onOpenShop={() => setShopOpen(true)} onOpenMiniGame={() => setMiniGameOpen(true)} />
      {shopOpen && <ShopModal onClose={() => setShopOpen(false)} />}
      {miniGameOpen && <MiniGameModal onClose={() => setMiniGameOpen(false)} />}
    </GameProvider>
  );
}

export default App;
