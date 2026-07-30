import { useEffect, useRef, useState } from 'react';
import { useGameDispatch } from '../../state/GameContext.jsx';

// A small, self-contained physics sim. All vertical positions are tracked
// as "height above ground" (0 = feet on the ground), converted to CSS
// `bottom` at render time - this keeps the jump/duck/obstacle collision math
// independent of screen coordinates.
const GAME_WIDTH = 220;
const GAME_HEIGHT = 110;
const GROUND_MARGIN = 12;
const BLOB_X = 20;

const STAND_SIZE = { width: 20, height: 24 };
const DUCK_SIZE = { width: 28, height: 13 };

const GRAVITY = 1400; // px/s^2
const JUMP_VELOCITY = 420; // px/s upward

const SPEED_START = 140; // px/s
const SPEED_RAMP_PER_SEC = 3;
const SPEED_MAX = 300;

const MIN_GAP_PX = 100;
const MAX_GAP_PX = 200;
const PTERO_INTRODUCE_AFTER_SEC = 8;
const PTERO_CHANCE = 0.3;

const CACTUS_MIN_H = 16;
const CACTUS_MAX_H = 28;
const CACTUS_MIN_W = 9;
const CACTUS_MAX_W = 15;

const PTERO_SIZE = { width: 24, height: 13 };
const PTERO_BOTTOM_AG = 18;

const BLOB_RUN_PAYOUT_PER_SECOND = 2;

let nextObstacleId = 0;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

export default function BlobRunGame({ onFinish }) {
  const dispatch = useGameDispatch();
  const [airborneY, setAirborneY] = useState(0);
  const [isDucking, setIsDucking] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [elapsedMs, setElapsedMs] = useState(0);

  const wantsJumpRef = useRef(false);
  const wantsDuckRef = useRef(false);
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowUp' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (!e.repeat) wantsJumpRef.current = true;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        wantsDuckRef.current = true;
      }
    }
    function handleKeyUp(e) {
      if (e.key === 'ArrowDown') wantsDuckRef.current = false;
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    // Local flag (not a ref) so each effect invocation starts fresh under
    // React 18 StrictMode's dev-only mount/cleanup/remount cycle.
    let stopped = false;
    let rafId;
    let lastTime = performance.now();
    let elapsed = 0;
    let velocity = 0;
    let airborne = 0;
    let obstacleList = [];
    let spawnTimer = 0;
    let nextSpawnMs = (randomBetween(MIN_GAP_PX, MAX_GAP_PX) / SPEED_START) * 1000;

    function endRun() {
      if (stopped) return;
      stopped = true;
      const survivalSeconds = elapsed / 1000;
      const score = Math.floor(elapsed / 100);
      const payout = Math.max(0, Math.floor(survivalSeconds * BLOB_RUN_PAYOUT_PER_SECOND));
      dispatchRef.current({
        type: 'RECORD_MINIGAME_RESULT',
        payload: { game: 'blobRun', score, payout },
      });
      onFinishRef.current({ score, payout });
    }

    function tick(now) {
      if (stopped) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      elapsed += dt * 1000;
      setElapsedMs(elapsed);

      const speed = Math.min(SPEED_MAX, SPEED_START + (elapsed / 1000) * SPEED_RAMP_PER_SEC);

      if (wantsJumpRef.current && airborne === 0) {
        velocity = JUMP_VELOCITY;
      }
      wantsJumpRef.current = false;
      const ducking = wantsDuckRef.current && airborne === 0;
      setIsDucking(ducking);

      if (airborne > 0 || velocity > 0) {
        velocity -= GRAVITY * dt;
        airborne += velocity * dt;
        if (airborne <= 0) {
          airborne = 0;
          velocity = 0;
        }
      }
      setAirborneY(airborne);

      spawnTimer += dt * 1000;
      if (spawnTimer >= nextSpawnMs) {
        spawnTimer = 0;
        const canBePtero = elapsed / 1000 > PTERO_INTRODUCE_AFTER_SEC && Math.random() < PTERO_CHANCE;
        if (canBePtero) {
          obstacleList = [
            ...obstacleList,
            {
              id: nextObstacleId++,
              type: 'ptero',
              x: GAME_WIDTH,
              width: PTERO_SIZE.width,
              height: PTERO_SIZE.height,
              bottomAG: PTERO_BOTTOM_AG,
            },
          ];
        } else {
          obstacleList = [
            ...obstacleList,
            {
              id: nextObstacleId++,
              type: 'cactus',
              x: GAME_WIDTH,
              width: randomBetween(CACTUS_MIN_W, CACTUS_MAX_W),
              height: randomBetween(CACTUS_MIN_H, CACTUS_MAX_H),
              bottomAG: 0,
            },
          ];
        }
        nextSpawnMs = (randomBetween(MIN_GAP_PX, MAX_GAP_PX) / speed) * 1000;
      }

      obstacleList = obstacleList.map((o) => ({ ...o, x: o.x - speed * dt })).filter((o) => o.x + o.width > 0);
      setObstacles(obstacleList);

      const blobSize = ducking ? DUCK_SIZE : STAND_SIZE;
      const blobLeft = BLOB_X;
      const blobRight = BLOB_X + blobSize.width;
      const blobBottomAG = airborne;
      const blobTopAG = airborne + blobSize.height;

      for (const o of obstacleList) {
        const horizontalOverlap = blobRight > o.x && blobLeft < o.x + o.width;
        const verticalOverlap = blobBottomAG < o.bottomAG + o.height && blobTopAG > o.bottomAG;
        if (horizontalOverlap && verticalOverlap) {
          endRun();
          return;
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  const blobSize = isDucking ? DUCK_SIZE : STAND_SIZE;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span>Score: {Math.floor(elapsedMs / 100)}</span>
      </div>
      <div className="blob-run-area" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        <div className="blob-run-ground" style={{ bottom: GROUND_MARGIN }} />
        <div
          className="blob-run-character"
          style={{
            left: BLOB_X,
            width: blobSize.width,
            height: blobSize.height,
            bottom: GROUND_MARGIN + airborneY,
          }}
        />
        {obstacles.map((o) => (
          <div
            key={o.id}
            className={o.type === 'ptero' ? 'blob-run-ptero' : 'blob-run-cactus'}
            style={{ left: o.x, width: o.width, height: o.height, bottom: GROUND_MARGIN + o.bottomAG }}
          />
        ))}
      </div>
      <p style={{ fontSize: 11, textAlign: 'center', marginTop: 4 }}>
        Space/↑ to jump, ↓ to duck. Avoid the cacti and pterodactyls!
      </p>
    </div>
  );
}
