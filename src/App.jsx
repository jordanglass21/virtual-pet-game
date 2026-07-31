import { useEffect, useState } from 'react';
import AppShell from './components/layout/AppShell.jsx';
import SpeciesSelect from './components/onboarding/SpeciesSelect.jsx';
import PetStage from './components/pet/PetStage.jsx';
import StatBars from './components/pet/StatBars.jsx';
import ActionBar from './components/pet/ActionBar.jsx';
import GrowthBar from './components/pet/GrowthBar.jsx';
import EvolutionBanner from './components/common/EvolutionBanner.jsx';
import EvolveRequirementsModal from './components/common/EvolveRequirementsModal.jsx';
import GameOverModal from './components/common/GameOverModal.jsx';
import ShopModal from './components/shop/ShopModal.jsx';
import GamesHubModal from './components/minigame/GamesHubModal.jsx';
import SettingsModal from './components/settings/SettingsModal.jsx';
import HelpModal from './components/help/HelpModal.jsx';
import { GameProvider, useGameDispatch, useGameState } from './state/GameContext.jsx';
import { useGameTick } from './hooks/useGameTick.js';
import { getPetMood } from './utils/petMood.js';
import { computePetScore } from './utils/score.js';
import { EVOLVE_THRESHOLD, EVOLVE_FLASH_DURATION_MS } from './data/constants.js';
import { MCGUFFIN_ID, RITUAL_GROUNDS_ID } from './data/shopItems.js';

function GameScreen({ onOpenMiniGame }) {
  const state = useGameState();
  const dispatch = useGameDispatch();
  useGameTick();
  const [activeActivity, setActiveActivity] = useState(null);
  const [evolving, setEvolving] = useState(false);
  const [showEvolveRequirements, setShowEvolveRequirements] = useState(false);

  const pet = state.pet;

  useEffect(() => {
    if (!pet?.justWokeRested) return undefined;
    const timeout = setTimeout(() => dispatch({ type: 'CLEAR_SLEEP_BONUS_FLAG' }), 4000);
    return () => clearTimeout(timeout);
  }, [pet?.justWokeRested, dispatch]);

  if (!pet) {
    return (
      <>
        {state.lastDeath && <GameOverModal entry={state.lastDeath} />}
        <SpeciesSelect />
      </>
    );
  }

  const isSleeping = Boolean(pet.sleep?.isSleeping);
  const mood = getPetMood(pet.stats, isSleeping);
  const readyToEvolve = pet.stage === 'baby' && pet.growth >= EVOLVE_THRESHOLD;
  const hasMcGuffin = pet.equipped.accessory === MCGUFFIN_ID;
  const hasRitualGrounds = state.room.backgroundId === RITUAL_GROUNDS_ID;

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

  function handleEvolveClick() {
    if (!hasMcGuffin || !hasRitualGrounds) {
      setShowEvolveRequirements(true);
      return;
    }
    setEvolving(true);
    setTimeout(() => {
      dispatch({ type: 'EVOLVE_PET' });
      setEvolving(false);
    }, EVOLVE_FLASH_DURATION_MS);
  }

  return (
    <div>
      {pet.justEvolved && <EvolutionBanner petName={pet.name} />}
      {showEvolveRequirements && (
        <EvolveRequirementsModal
          petName={pet.name}
          hasMcGuffin={hasMcGuffin}
          hasRitualGrounds={hasRitualGrounds}
          onClose={() => setShowEvolveRequirements(false)}
        />
      )}
      <PetStage
        pet={pet}
        room={state.room}
        activeActivity={activeActivity}
        onActivityComplete={handleActivityComplete}
        isEvolving={evolving}
      />
      <p style={{ textAlign: 'center' }}>
        {pet.name} the {pet.stage}
      </p>
      <p style={{ textAlign: 'center', fontSize: 11 }}>Score: {computePetScore(pet, Date.now())}</p>
      {pet.justWokeRested && <p className="sleep-bonus-indicator">✨ {pet.name} had a great nap! +happiness</p>}
      {mood === 'critical' && <p className="critical-warning">⚠ {pet.name} urgently needs your help!</p>}
      {pet.stage === 'baby' && <GrowthBar growth={pet.growth} />}
      {readyToEvolve && (
        <div style={{ textAlign: 'center', margin: '6px 0' }}>
          <button
            type="button"
            className="btn-retro"
            onClick={handleEvolveClick}
            disabled={Boolean(activeActivity) || evolving}
          >
            {evolving ? 'Evolving...' : 'Evolve'}
          </button>
        </div>
      )}
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

function AppShellWithState({ onOpenShop, onOpenMiniGame, onOpenSettings, onOpenHelp }) {
  const state = useGameState();
  return (
    <AppShell
      petName={state.pet?.name}
      currency={state.currency}
      onOpenShop={state.pet ? onOpenShop : undefined}
      onOpenSettings={state.pet ? onOpenSettings : undefined}
      onOpenHelp={onOpenHelp}
    >
      <GameScreen onOpenMiniGame={onOpenMiniGame} />
    </AppShell>
  );
}

function App() {
  const [shopOpen, setShopOpen] = useState(false);
  const [miniGameOpen, setMiniGameOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <GameProvider>
      <AppShellWithState
        onOpenShop={() => setShopOpen(true)}
        onOpenMiniGame={() => setMiniGameOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
      />
      {shopOpen && <ShopModal onClose={() => setShopOpen(false)} />}
      {miniGameOpen && <GamesHubModal onClose={() => setMiniGameOpen(false)} />}
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </GameProvider>
  );
}

export default App;
