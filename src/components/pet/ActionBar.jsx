import { useEffect, useState } from 'react';
import { CARE_ACTIONS } from '../../data/constants.js';

const LABELS = { feed: 'Feed', play: 'Play', clean: 'Clean' };

export default function ActionBar({ cooldowns, isSleeping, activeActivity, onStartActivity, onWake }) {
  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {isSleeping && <p className="sleeping-indicator">💤 Napping... click any action to wake early.</p>}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
        {Object.keys(CARE_ACTIONS).map((actionId) => {
          const readyAt = cooldowns[actionId] ?? 0;
          const remainingMs = Math.max(0, readyAt - nowTick);
          const onCooldown = remainingMs > 0;
          const disabled = isSleeping ? false : onCooldown || Boolean(activeActivity);

          return (
            <button
              key={actionId}
              type="button"
              className="btn-retro"
              disabled={disabled}
              onClick={() => (isSleeping ? onWake() : onStartActivity(actionId))}
            >
              {LABELS[actionId]}
              {!isSleeping && onCooldown ? ` (${Math.ceil(remainingMs / 1000)}s)` : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
}
