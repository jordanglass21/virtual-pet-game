import { useEffect, useRef, useState } from 'react';
import { useGameDispatch } from '../../state/GameContext.jsx';
import { MINIGAME_PAYOUT_MULTIPLIER } from '../../data/constants.js';

// Sized to comfortably fit inside the modal on narrow (~320px) viewports.
const GAME_WIDTH = 220;
const GAME_HEIGHT = 200;
const BASKET_WIDTH = 40;
const BASKET_HEIGHT = 18;
const ITEM_SIZE = 18;
const BASKET_SPEED = 180; // px/sec
const BASE_FALL_SPEED = 45; // px/sec
const SPAWN_INTERVAL_MS = 700;
const BAD_ITEM_CHANCE = 0.25;
const RED_ITEM_CHANCE = 0.25;
const RED_TREAT_SCORE_VALUE = 5;
// Fall speed ramps up continuously over the run - no fixed round length,
// this just controls how quickly it gets harder.
const SPEED_RAMP_PERIOD_MS = 30000;

let nextItemId = 0;

export default function TreatCatchGame({ onFinish }) {
  const dispatch = useGameDispatch();
  const [basketX, setBasketX] = useState(GAME_WIDTH / 2 - BASKET_WIDTH / 2);
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);

  const keysRef = useRef({ left: false, right: false });
  const basketXRef = useRef(basketX);
  const itemsRef = useRef(items);
  const scoreRef = useRef(score);
  const lastSpawnRef = useRef(0);
  const elapsedRef = useRef(0);
  const onFinishRef = useRef(onFinish);
  const dispatchRef = useRef(dispatch);
  onFinishRef.current = onFinish;
  dispatchRef.current = dispatch;

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
      if (e.key === 'ArrowLeft') keysRef.current.left = true;
      if (e.key === 'ArrowRight') keysRef.current.right = true;
    }
    function handleKeyUp(e) {
      if (e.key === 'ArrowLeft') keysRef.current.left = false;
      if (e.key === 'ArrowRight') keysRef.current.right = false;
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let rafId;
    let lastTime = performance.now();
    let stopped = false;

    function endRound() {
      if (stopped) return;
      stopped = true;
      const finalScore = Math.max(0, scoreRef.current);
      const payout = finalScore * MINIGAME_PAYOUT_MULTIPLIER;
      dispatchRef.current({
        type: 'RECORD_MINIGAME_RESULT',
        payload: { game: 'treatCatch', score: finalScore, payout },
      });
      onFinishRef.current({ score: finalScore, payout });
    }

    function tick(now) {
      if (stopped) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      elapsedRef.current += dt * 1000;

      let nextX = basketXRef.current;
      if (keysRef.current.left) nextX -= BASKET_SPEED * dt;
      if (keysRef.current.right) nextX += BASKET_SPEED * dt;
      nextX = Math.max(0, Math.min(GAME_WIDTH - BASKET_WIDTH, nextX));
      basketXRef.current = nextX;
      setBasketX(nextX);

      const speedMultiplier = 1 + elapsedRef.current / SPEED_RAMP_PERIOD_MS;
      if (now - lastSpawnRef.current > SPAWN_INTERVAL_MS) {
        lastSpawnRef.current = now;
        const roll = Math.random();
        let type = 'good';
        if (roll < BAD_ITEM_CHANCE) type = 'bad';
        else if (roll < BAD_ITEM_CHANCE + RED_ITEM_CHANCE) type = 'red';
        itemsRef.current = [
          ...itemsRef.current,
          {
            id: nextItemId++,
            x: Math.random() * (GAME_WIDTH - ITEM_SIZE),
            y: -ITEM_SIZE,
            type,
            speed: BASE_FALL_SPEED * speedMultiplier * (0.8 + Math.random() * 0.4),
          },
        ];
      }

      const basketTop = GAME_HEIGHT - BASKET_HEIGHT - 4;
      const survivors = [];
      let scoreDelta = 0;
      for (const item of itemsRef.current) {
        const newY = item.y + item.speed * dt;
        const caught =
          newY + ITEM_SIZE >= basketTop &&
          item.x + ITEM_SIZE > basketXRef.current &&
          item.x < basketXRef.current + BASKET_WIDTH;

        if (caught) {
          scoreDelta += item.type === 'good' ? 1 : item.type === 'red' ? RED_TREAT_SCORE_VALUE : -1;
          continue;
        }
        if (newY > GAME_HEIGHT) {
          if (item.type !== 'bad') {
            scoreRef.current += scoreDelta;
            setScore(scoreRef.current);
            endRound();
            return;
          }
          continue;
        }
        survivors.push({ ...item, y: newY });
      }
      itemsRef.current = survivors;
      setItems(survivors);
      if (scoreDelta !== 0) {
        scoreRef.current += scoreDelta;
        setScore(scoreRef.current);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'center', fontSize: 12, marginBottom: 4 }}>
        <span>Score: {score}</span>
      </div>
      <div className="treat-game-area" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`treat-item treat-${item.type}`}
            style={{ left: item.x, top: item.y, width: ITEM_SIZE, height: ITEM_SIZE }}
          />
        ))}
        <div
          className="treat-basket"
          style={{ left: basketX, width: BASKET_WIDTH, height: BASKET_HEIGHT }}
        />
      </div>
      <p style={{ fontSize: 11, textAlign: 'center', marginTop: 4 }}>
        Use ← → to move. Don't let a good or red treat hit the ground - rotten (brown) treats are safe to miss!
      </p>
    </div>
  );
}
