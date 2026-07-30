import { useEffect, useState } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import SpeciesSelect from './components/onboarding/SpeciesSelect.jsx';
import PetStage from './components/pet/PetStage.jsx';
import StatBars from './components/pet/StatBars.jsx';
import ActionBar from './components/pet/ActionBar.jsx';
import GrowthBar from './components/pet/GrowthBar.jsx';
import EvolutionBanner from './components/common/EvolutionBanner.jsx';
import ShopModal from './components/shop/ShopModal.jsx';
import MiniGameModal from './components/minigame/MiniGameModal.jsx';
import { GameProvider, useGameDispatch, useGameState } from './state/GameContext.jsx';
import { useGameTick } from './hooks/useGameTick.js';
import { getPetMood } from './utils/petMood.js';

function GameScreen({ onOpenMiniGame }) {
  const state = useGameState();
  const dispatch = useGameDispatch();
  useGameTick();
  const [activeActivity, setActiveActivity] = useState(null);

  const pet = state.pet;

  useEffect(() => {
    if (!pet?.justWokeRested) return undefined;
    const timeout = setTimeout(() => dispatch({ type: 'CLEAR_SLEEP_BONUS_FLAG' }), 4000);
    return () => clearTimeout(timeout);
  }, [pet?.justWokeRested, dispatch]);

  if (!pet) {
    return <SpeciesSelect />;
  }

  const isSleeping = Boolean(pet.sleep?.isSleeping);
  const mood = getPetMood(pet.stats, isSleeping);

  function handleStartActivity(actionId) {
    setActiveActivity(actionId);
  }

  function handleActivityComplete() {
    dispatch({ type: 'CARE_ACTION', payload: { actionId: activeActivity, now: Date.now() } });
    setActiveActivity(null);
  }

  function handleWake() {
    dispatch({ type: 'WAKE_PET' });
  }

  return (
    <div>
      {pet.justEvolved && <EvolutionBanner petName={pet.name} />}
      <PetStage
        pet={pet}
        room={state.room}
        activeActivity={activeActivity}
        onActivityComplete={handleActivityComplete}
      />
      <p style={{ textAlign: 'center' }}>
        {pet.name} the {pet.stage}
      </p>
      {pet.justWokeRested && <p className="sleep-bonus-indicator">✨ {pet.name} had a great nap! +happiness</p>}
      {mood === 'critical' && <p className="critical-warning">⚠ {pet.name} urgently needs your help!</p>}
      {pet.stage === 'baby' && <GrowthBar growth={pet.growth} />}
      <StatBars stats={pet.stats} />
      <ActionBar
        cooldowns={pet.cooldowns}
        isSleeping={isSleeping}
        activeActivity={activeActivity}
        onStartActivity={handleStartActivity}
        onWake={handleWake}
      />
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <button type="button" className="btn-retro" onClick={onOpenMiniGame}>
          Games
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
