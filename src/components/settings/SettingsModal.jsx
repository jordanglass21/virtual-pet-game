import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { useGameDispatch, useGameState } from '../../state/GameContext.jsx';
import { SPECIES } from '../../data/species.js';
import { computePetScore } from '../../utils/score.js';

const GAME_LABELS = {
  treatCatch: 'Treat Catch',
  petRun: 'Pet Run',
  slotMachine: 'Slot Machine (biggest win)',
  dogfight: 'Dogfight (best win streak)',
};

function BackButton({ onClick }) {
  return (
    <button type="button" className="btn-retro" onClick={onClick} style={{ marginBottom: 10 }}>
      ← Back
    </button>
  );
}

export default function SettingsModal({ onClose }) {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [view, setView] = useState('menu'); // menu | memoriam | records | debug
  const [confirming, setConfirming] = useState(false);
  const [currencyInput, setCurrencyInput] = useState(String(state.currency));

  function handleReset() {
    dispatch({ type: 'RESET_GAME' });
    onClose();
  }

  function handleSetCurrency() {
    const amount = Number(currencyInput);
    if (!Number.isFinite(amount)) return;
    dispatch({ type: 'SET_CURRENCY', payload: { amount } });
  }

  function handleMaxGrowth() {
    dispatch({ type: 'DEBUG_MAX_GROWTH' });
  }

  if (view === 'memoriam') {
    const memoriam = [...state.memoriam].reverse();
    return (
      <Modal title="Settings" onClose={onClose}>
        <BackButton onClick={() => setView('menu')} />
        <h3 style={{ fontSize: 13, margin: '0 0 6px' }}>In Memoriam</h3>
        {memoriam.length === 0 ? (
          <p style={{ fontSize: 12 }}>No pets have passed on yet.</p>
        ) : (
          <div className="panel-sunken memoriam-list">
            {memoriam.map((entry, i) => (
              <div key={i} className="memoriam-entry">
                <span>
                  {entry.name} the {SPECIES[entry.speciesId]?.name ?? entry.speciesId}
                </span>
                <span>Score: {entry.score}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    );
  }

  if (view === 'records') {
    const allPets = [
      ...state.memoriam,
      state.pet
        ? { name: state.pet.name, speciesId: state.pet.speciesId, score: computePetScore(state.pet, Date.now()) }
        : null,
    ].filter(Boolean);
    const topPet = allPets.reduce((best, p) => (!best || p.score > best.score ? p : best), null);

    return (
      <Modal title="Settings" onClose={onClose}>
        <BackButton onClick={() => setView('menu')} />
        <h3 style={{ fontSize: 13, margin: '0 0 6px' }}>Records</h3>
        <div className="panel-sunken" style={{ padding: 10, fontSize: 12, lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            <strong>Top pet:</strong>{' '}
            {topPet
              ? `${topPet.name} the ${SPECIES[topPet.speciesId]?.name ?? topPet.speciesId} - Score: ${topPet.score}`
              : 'None yet'}
          </p>
          <hr style={{ margin: '8px 0' }} />
          {Object.entries(GAME_LABELS).map(([key, label]) => {
            const entry = state.miniGames[key];
            const isDogfight = key === 'dogfight';
            const value = isDogfight ? entry?.maxWinStreak : entry?.highScore;
            const holder = isDogfight ? entry?.maxWinStreakName : entry?.highScoreName;
            return (
              <p key={key} style={{ margin: '4px 0' }}>
                <strong>{label}:</strong> {value > 0 ? `${value} by ${holder ?? '?'}` : 'None yet'}
              </p>
            );
          })}
        </div>
      </Modal>
    );
  }

  if (view === 'debug') {
    return (
      <Modal title="Settings" onClose={onClose}>
        <BackButton onClick={() => setView('menu')} />
        <h3 style={{ fontSize: 13, margin: '0 0 6px' }}>Debug</h3>
        <div className="panel-sunken" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12 }}>Set currency:</span>
            <input
              type="number"
              value={currencyInput}
              onChange={(e) => setCurrencyInput(e.target.value)}
              style={{ fontFamily: 'var(--font-body)', padding: 4, width: 90 }}
            />
            <button type="button" className="btn-retro" onClick={handleSetCurrency}>
              Set
            </button>
          </div>
          <button type="button" className="btn-retro" onClick={handleMaxGrowth} disabled={!state.pet}>
            Max Growth (100)
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Settings" onClose={onClose}>
      <p style={{ fontSize: 12 }}>
        Currently caring for <strong>{state.pet?.name}</strong>.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
        {!confirming ? (
          <button type="button" className="btn-retro" onClick={() => setConfirming(true)}>
            Reset Game
          </button>
        ) : (
          <div className="panel-sunken" style={{ padding: 10 }}>
            <p style={{ fontSize: 12 }}>
              This deletes {state.pet?.name} and all progress - currency, inventory, and room - so you can start over
              with a new pet. This can&apos;t be undone.
            </p>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              <button type="button" className="btn-retro" onClick={handleReset}>
                Yes, reset
              </button>
              <button type="button" className="btn-retro" onClick={() => setConfirming(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
        <button type="button" className="btn-retro" onClick={() => setView('memoriam')}>
          In Memoriam
        </button>
        <button type="button" className="btn-retro" onClick={() => setView('records')}>
          Records
        </button>
        <button type="button" className="btn-retro" onClick={() => setView('debug')}>
          Debug
        </button>
      </div>
    </Modal>
  );
}
