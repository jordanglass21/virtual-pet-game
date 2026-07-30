import { useState } from 'react';
import { SPECIES_LIST } from '../../data/species.js';
import { useGameDispatch } from '../../state/GameContext.jsx';

export default function SpeciesSelect() {
  const dispatch = useGameDispatch();
  const [speciesId, setSpeciesId] = useState(SPECIES_LIST[0].id);
  const [name, setName] = useState('');

  const canStart = name.trim().length > 0;

  function handleStart() {
    if (!canStart) return;
    dispatch({
      type: 'SELECT_SPECIES',
      payload: { speciesId, name: name.trim(), now: Date.now() },
    });
  }

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Choose your pet</h2>
      <div className="species-grid">
        {SPECIES_LIST.map((species) => (
          <button
            type="button"
            key={species.id}
            className={`species-card${species.id === speciesId ? ' selected' : ''}`}
            onClick={() => setSpeciesId(species.id)}
          >
            <img src={species.images.baby} alt={species.name} />
            <div>
              <strong>{species.name}</strong>
              <p style={{ fontSize: 11, margin: '4px 0 0' }}>{species.tagline}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="panel-sunken" style={{ marginTop: 16, padding: 10 }}>
        <label htmlFor="pet-name" style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
          Name your pet:
        </label>
        <input
          id="pet-name"
          type="text"
          value={name}
          maxLength={16}
          onChange={(e) => setName(e.target.value)}
          style={{ fontFamily: 'var(--font-body)', padding: 4, width: '100%' }}
        />
      </div>

      <button type="button" className="btn-retro" style={{ marginTop: 12 }} onClick={handleStart} disabled={!canStart}>
        Start
      </button>
    </div>
  );
}
