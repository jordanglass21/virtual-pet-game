import { useEffect, useRef, useState } from 'react';
import { DirtSpotIcon } from '../../data/activityRenderers.jsx';
import { CLEAN_TARGET_COUNT, SCRUB_DISTANCE_REQUIRED } from '../../data/constants.js';

const HIT_RADIUS_PERCENT = 9;

function randomSpots(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 75,
    top: 15 + Math.random() * 65,
    progress: 0,
  }));
}

export default function CleanActivity({ onComplete }) {
  const containerRef = useRef(null);
  const [spots, setSpots] = useState(() => randomSpots(CLEAN_TARGET_COUNT));
  const isScrubbingRef = useRef(false);
  const lastPosRef = useRef(null);

  useEffect(() => {
    if (spots.length > 0) return undefined;
    const timeout = setTimeout(onComplete, 200);
    return () => clearTimeout(timeout);
  }, [spots, onComplete]);

  function toPercentPos(clientX, clientY) {
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }

  function handlePointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    isScrubbingRef.current = true;
    lastPosRef.current = toPercentPos(e.clientX, e.clientY);
  }

  function handlePointerUp() {
    isScrubbingRef.current = false;
    lastPosRef.current = null;
  }

  function handlePointerMove(e) {
    if (!isScrubbingRef.current) return;
    const pos = toPercentPos(e.clientX, e.clientY);
    const last = lastPosRef.current;
    lastPosRef.current = pos;
    if (!last) return;

    const dist = Math.hypot(pos.x - last.x, pos.y - last.y);
    if (dist === 0) return;

    setSpots((prev) =>
      prev
        .map((spot) => {
          const distToSpot = Math.hypot(pos.x - spot.left, pos.y - spot.top);
          if (distToSpot > HIT_RADIUS_PERCENT) return spot;
          return { ...spot, progress: spot.progress + dist };
        })
        .filter((spot) => spot.progress < SCRUB_DISTANCE_REQUIRED),
    );
  }

  return (
    <div
      ref={containerRef}
      className="activity-overlay clean-cursor"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <p className="activity-hint">Scrub the dirty spots with the brush!</p>
      {spots.map((spot) => (
        <div
          key={spot.id}
          className="activity-target"
          style={{
            left: `${spot.left}%`,
            top: `${spot.top}%`,
            opacity: 1 - spot.progress / SCRUB_DISTANCE_REQUIRED,
          }}
        >
          <DirtSpotIcon />
        </div>
      ))}
    </div>
  );
}
