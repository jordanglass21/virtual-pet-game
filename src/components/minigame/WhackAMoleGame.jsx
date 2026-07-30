import { useEffect, useRef, useState } from 'react';
import { useGameDispatch } from '../../state/GameContext.jsx';
import { MINIGAME_DURATION_MS, MINIGAME_PAYOUT_MULTIPLIER } from '../../data/constants.js';

const HOLE_COUNT = 9;
const MOLE_VISIBLE_MS = 900;
const SPAWN_INTERVAL_MS = 700;

let nextMoleId = 0;

export default function WhackAMoleGame({ onFinish }) {
  const dispatch = useGameDispatch();
  const [moles, setMoles] = useState([]); // { id, holeIndex }
  const [score, setScore] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(MINIGAME_DURATION_MS);

  const molesRef = useRef(moles);
  molesRef.current = moles;
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const timeoutsRef = useRef(new Map());
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    // A local flag (not a ref) so each effect invocation starts fresh -
    // React 18 StrictMode mounts/cleans-up/remounts once in dev, and a ref
    // set to true in cleanup would otherwise stay true forever.
    let ended = false;
    const startTime = Date.now();
    let spawnTimer;
    let countdownTimer;

    function removeMole(id) {
      setMoles((prev) => prev.filter((m) => m.id !== id));
      const timeout = timeoutsRef.current.get(id);
      if (timeout) {
        clearTimeout(timeout);
        timeoutsRef.current.delete(id);
      }
    }

    function spawnMole() {
      if (ended) return;
      const occupied = new Set(molesRef.current.map((m) => m.holeIndex));
      const free = [];
      for (let i = 0; i < HOLE_COUNT; i += 1) {
        if (!occupied.has(i)) free.push(i);
      }
      if (free.length > 0) {
        const holeIndex = free[Math.floor(Math.random() * free.length)];
        const id = nextMoleId++;
        setMoles((prev) => [...prev, { id, holeIndex }]);
        timeoutsRef.current.set(
          id,
          setTimeout(() => removeMole(id), MOLE_VISIBLE_MS),
        );
      }
      spawnTimer = setTimeout(spawnMole, SPAWN_INTERVAL_MS);
    }

    function endRound() {
      if (ended) return;
      ended = true;
      clearTimeout(spawnTimer);
      clearInterval(countdownTimer);
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current.clear();
      const finalScore = Math.max(0, scoreRef.current);
      const payout = finalScore * MINIGAME_PAYOUT_MULTIPLIER;
      dispatchRef.current({
        type: 'RECORD_MINIGAME_RESULT',
        payload: { game: 'whackAMole', score: finalScore, payout },
      });
      onFinishRef.current({ score: finalScore, payout });
    }

    countdownTimer = setInterval(() => {
      const remaining = MINIGAME_DURATION_MS - (Date.now() - startTime);
      setTimeLeftMs(Math.max(0, remaining));
      if (remaining <= 0) endRound();
    }, 200);

    spawnTimer = setTimeout(spawnMole, 400);

    return () => {
      ended = true;
      clearTimeout(spawnTimer);
      clearInterval(countdownTimer);
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current.clear();
    };
  }, []);

  function handleWhack(id) {
    setMoles((prev) => prev.filter((m) => m.id !== id));
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
    scoreRef.current += 1;
    setScore(scoreRef.current);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span>Score: {score}</span>
        <span>Time: {Math.ceil(timeLeftMs / 1000)}s</span>
      </div>
      <div className="mole-grid">
        {Array.from({ length: HOLE_COUNT }).map((_, holeIndex) => {
          const mole = moles.find((m) => m.holeIndex === holeIndex);
          return (
            <button
              key={holeIndex}
              type="button"
              className="mole-hole"
              onClick={() => mole && handleWhack(mole.id)}
            >
              {mole && <div className="mole" />}
            </button>
          );
        })}
      </div>
      <p style={{ fontSize: 11, textAlign: 'center', marginTop: 4 }}>Click the moles before they disappear!</p>
    </div>
  );
}
