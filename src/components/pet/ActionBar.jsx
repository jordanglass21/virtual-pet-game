import { useEffect, useState } from 'react';
import { useGameDispatch } from '../../state/GameContext.jsx';
import { CARE_ACTIONS } from '../../data/constants.js';

const LABELS = { feed: 'Feed', play: 'Play', sleep: 'Sleep', clean: 'Clean' };

export default function ActionBar({ cooldowns }) {
  const dispatch = useGameDispatch();
  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  function handleAction(actionId) {
    dispatch({ type: 'CARE_ACTION', payload: { actionId, now: Date.now() } });
  }

  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
      {Object.keys(CARE_ACTIONS).map((actionId) => {
        const readyAt = cooldowns[actionId] ?? 0;
        const remainingMs = Math.max(0, readyAt - nowTick);
        const onCooldown = remainingMs > 0;
        return (
          <button
            key={actionId}
            type="button"
            className="btn-retro"
            disabled={onCooldown}
            onClick={() => handleAction(actionId)}
          >
            {LABELS[actionId]}
            {onCooldown ? ` (${Math.ceil(remainingMs / 1000)}s)` : ''}
          </button>
        );
      })}
    </div>
  );
}
