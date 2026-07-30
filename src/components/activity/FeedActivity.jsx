import { useEffect, useRef, useState } from 'react';
import { FoodBiteIcon, FoodBowlIcon } from '../../data/activityRenderers.jsx';
import { FEED_TARGET_COUNT } from '../../data/constants.js';

const BOWL_CENTER = { x: 16, y: 82 };

function initialFoods() {
  return Array.from({ length: FEED_TARGET_COUNT }, (_, i) => {
    const origin = {
      x: BOWL_CENTER.x + (Math.random() * 10 - 5),
      y: BOWL_CENTER.y + (Math.random() * 8 - 4),
    };
    return { id: i, origin, pos: origin };
  });
}

export default function FeedActivity({ onComplete, petTargetRef }) {
  const containerRef = useRef(null);
  const draggingIdRef = useRef(null);
  const [foods, setFoods] = useState(initialFoods);

  useEffect(() => {
    if (foods.length > 0) return undefined;
    const timeout = setTimeout(onComplete, 200);
    return () => clearTimeout(timeout);
  }, [foods, onComplete]);

  function toPercentPos(clientX, clientY) {
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }

  function handlePointerDown(e, id) {
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingIdRef.current = id;
    const pos = toPercentPos(e.clientX, e.clientY);
    setFoods((prev) => prev.map((f) => (f.id === id ? { ...f, pos } : f)));
  }

  function handlePointerMove(e) {
    const id = draggingIdRef.current;
    if (id === null) return;
    const pos = toPercentPos(e.clientX, e.clientY);
    setFoods((prev) => prev.map((f) => (f.id === id ? { ...f, pos } : f)));
  }

  function handlePointerUp(e) {
    const id = draggingIdRef.current;
    draggingIdRef.current = null;
    if (id === null) return;

    const petRect = petTargetRef.current?.getBoundingClientRect();
    const droppedOnPet =
      petRect &&
      e.clientX >= petRect.left &&
      e.clientX <= petRect.right &&
      e.clientY >= petRect.top &&
      e.clientY <= petRect.bottom;

    if (droppedOnPet) {
      setFoods((prev) => prev.filter((f) => f.id !== id));
    } else {
      setFoods((prev) => prev.map((f) => (f.id === id ? { ...f, pos: f.origin } : f)));
    }
  }

  return (
    <div
      ref={containerRef}
      className="activity-overlay"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <p className="activity-hint">Drag food from the bowl to your pet!</p>
      <div className="food-bowl" style={{ left: `${BOWL_CENTER.x}%`, top: `${BOWL_CENTER.y}%` }}>
        <FoodBowlIcon />
      </div>
      {foods.map((food) => (
        <div
          key={food.id}
          className="food-piece"
          style={{ left: `${food.pos.x}%`, top: `${food.pos.y}%` }}
          onPointerDown={(e) => handlePointerDown(e, food.id)}
        >
          <FoodBiteIcon />
        </div>
      ))}
    </div>
  );
}
