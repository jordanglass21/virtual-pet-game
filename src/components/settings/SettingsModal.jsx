import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { useGameDispatch, useGameState } from '../../state/GameContext.jsx';
import { SPECIES } from '../../data/species.js';

export default function SettingsModal({ onClose }) {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [confirming, setConfirming] = useState(false);

  function handleReset() {
    dispatch({ type: 'RESET_GAME' });
    onClose();
  }

  const memoriam = [...state.memoriam].reverse();

  return (
    <Modal title="Settings" onClose={onClose}>
      <p style={{ fontSize: 12 }}>
        Currently caring for <strong>{state.pet?.name}</strong>.
      </p>

      {!confirming ? (
        <button type="button" className="btn-retro" onClick={() => setConfirming(true)}>
          Reset Game
        </button>
      ) : (
        <div className="panel-sunken" style={{ padding: 10, marginTop: 8 }}>
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

      <h3 style={{ fontSize: 13, margin: '14px 0 6px' }}>In Memoriam</h3>
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
