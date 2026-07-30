import { useEffect, useState } from 'react';
import { DirtSpotIcon, FoodBiteIcon, ToyIcon } from '../../data/activityRenderers.jsx';

const ACTIVITY_CONFIG = {
  clean: { label: 'Click the dirty spots to clean them!', targetCount: 5, Icon: DirtSpotIcon },
  feed: { label: 'Click the food to feed your pet!', targetCount: 4, Icon: FoodBiteIcon },
  play: { label: 'Click the toy to play!', targetCount: 3, Icon: ToyIcon },
};

function randomTargets(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${10 + Math.random() * 75}%`,
    top: `${15 + Math.random() * 65}%`,
  }));
}

export default function ActivityOverlay({ activityId, onComplete }) {
  const config = ACTIVITY_CONFIG[activityId];
  const [targets, setTargets] = useState(() => randomTargets(config.targetCount));

  useEffect(() => {
    if (targets.length > 0) return undefined;
    const timeout = setTimeout(onComplete, 200);
    return () => clearTimeout(timeout);
  }, [targets, onComplete]);

  function handleTargetClick(id) {
    setTargets((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="activity-overlay">
      <p className="activity-hint">{config.label}</p>
      {targets.map((t) => (
        <button
          key={t.id}
          type="button"
          className="activity-target"
          style={{ left: t.left, top: t.top }}
          onClick={() => handleTargetClick(t.id)}
          aria-label={`${activityId} target`}
        >
          <config.Icon />
        </button>
      ))}
    </div>
  );
}
