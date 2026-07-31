import { useEffect, useRef, useState } from 'react';
import { useGameDispatch, useGameState } from '../../state/GameContext.jsx';
import { WEAPONS, WEAPON_LIST, pickAiWeaponId } from '../../data/dogfightWeapons.js';

// Top-down 1v1 dogfight. "forward" weapons auto-aim at the opponent's
// current position each shot (like the other games' auto-fire guns);
// bombs just fall straight down from wherever the ship currently is, so
// hitting with one means maneuvering above the target instead of aiming.
const ARENA_WIDTH = 220;
const ARENA_HEIGHT = 200;
const SHIP_RADIUS = 9;
const SHIP_SPEED = 110; // px/s
const AI_SPEED = 112; // px/s - just above the player's speed
const AI_DODGE_LOOKAHEAD_S = 0.7;
const AI_DODGE_MARGIN = 22;
const MAX_HEALTH = 100;
const PROJECTILE_RADIUS = 3;
const BOMB_RADIUS = 6;
const WIN_BONUS = 20;
const STREAK_BONUS_PER_WIN = 5;

let nextProjectileId = 0;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function makeInitialGame() {
  return {
    phase: 'select', // select | battle
    playerWeaponId: null,
    aiWeaponId: null,
    player: { x: ARENA_WIDTH * 0.25, y: ARENA_HEIGHT * 0.75, health: MAX_HEALTH },
    ai: { x: ARENA_WIDTH * 0.75, y: ARENA_HEIGHT * 0.25, health: MAX_HEALTH },
    playerFireNextAt: 0,
    aiFireNextAt: 0,
    projectiles: [],
  };
}

export default function DogfightGame({ onFinish }) {
  const dispatch = useGameDispatch();
  const state = useGameState();
  const stateRef = useRef(state);
  stateRef.current = state;
  const gameRef = useRef(null);
  if (!gameRef.current) gameRef.current = makeInitialGame();

  const [phase, setPhase] = useState('select');
  const [playerWeaponId, setPlayerWeaponId] = useState(null);
  const [aiWeaponId, setAiWeaponId] = useState(null);
  const [player, setPlayer] = useState(gameRef.current.player);
  const [ai, setAi] = useState(gameRef.current.ai);
  const [projectiles, setProjectiles] = useState([]);

  const keysRef = useRef({ up: false, down: false, left: false, right: false, fire: false });
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    function handleKeyDown(e) {
      const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        keysRef.current[dir] = true;
      } else if (e.code === 'Space') {
        e.preventDefault();
        keysRef.current.fire = true;
      }
    }
    function handleKeyUp(e) {
      const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
      const dir = map[e.key];
      if (dir) keysRef.current[dir] = false;
      else if (e.code === 'Space') keysRef.current.fire = false;
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
    const game = gameRef.current;

    function endMatch(outcome) {
      if (stopped) return;
      stopped = true;
      const prev = stateRef.current.miniGames.dogfight ?? { winStreak: 0, maxWinStreak: 0 };
      let winStreak = prev.winStreak ?? 0;
      let payout = 0;
      if (outcome === 'win') {
        winStreak += 1;
        payout = WIN_BONUS + STREAK_BONUS_PER_WIN * (winStreak - 1);
      } else if (outcome === 'lose') {
        winStreak = 0;
      }
      // A tie leaves the streak untouched - it's neither a win nor a loss.
      const maxWinStreak = Math.max(prev.maxWinStreak ?? 0, winStreak);
      dispatchRef.current({
        type: 'RECORD_DOGFIGHT_RESULT',
        payload: { outcome, payout, winStreak, maxWinStreak },
      });
      onFinishRef.current({ payout, outcome, winStreak, maxWinStreak });
    }

    function fireForward(shooter, weapon, targetX, targetY, owner) {
      const angle = Math.atan2(targetY - shooter.y, targetX - shooter.x);
      const count = weapon.pelletCount;
      const spreadRad = (weapon.spreadDeg * Math.PI) / 180;
      const shots = [];
      for (let i = 0; i < count; i += 1) {
        const t = count === 1 ? 0 : i / (count - 1) - 0.5;
        const shotAngle = angle + t * spreadRad;
        shots.push({
          id: nextProjectileId++,
          x: shooter.x,
          y: shooter.y,
          vx: Math.cos(shotAngle) * weapon.projectileSpeed,
          vy: Math.sin(shotAngle) * weapon.projectileSpeed,
          traveled: 0,
          maxRange: weapon.range,
          damage: weapon.damage,
          owner,
          kind: 'forward',
        });
      }
      return shots;
    }

    function fireBomb(shooter, weapon, owner) {
      return [
        {
          id: nextProjectileId++,
          x: shooter.x,
          y: shooter.y,
          vx: 0,
          vy: weapon.fallSpeed,
          traveled: 0,
          maxRange: Infinity,
          damage: weapon.damage,
          owner,
          kind: 'bomb',
        },
      ];
    }

    let prevPlayerX = game.player.x;
    let prevPlayerY = game.player.y;

    function tick(now) {
      if (stopped) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (game.phase === 'battle') {
        const playerWeapon = WEAPONS[game.playerWeaponId];
        const aiWeapon = WEAPONS[game.aiWeaponId];

        // Player movement
        let dx = 0;
        let dy = 0;
        if (keysRef.current.left) dx -= 1;
        if (keysRef.current.right) dx += 1;
        if (keysRef.current.up) dy -= 1;
        if (keysRef.current.down) dy += 1;
        if (dx !== 0 && dy !== 0) {
          dx *= Math.SQRT1_2;
          dy *= Math.SQRT1_2;
        }
        game.player.x = clamp(game.player.x + dx * SHIP_SPEED * dt, SHIP_RADIUS, ARENA_WIDTH - SHIP_RADIUS);
        game.player.y = clamp(game.player.y + dy * SHIP_SPEED * dt, SHIP_RADIUS, ARENA_HEIGHT - SHIP_RADIUS);

        // Track the player's velocity so the AI can lead its forward shots
        // instead of aiming at where the player already was.
        const playerVelX = dt > 0 ? (game.player.x - prevPlayerX) / dt : 0;
        const playerVelY = dt > 0 ? (game.player.y - prevPlayerY) / dt : 0;
        prevPlayerX = game.player.x;
        prevPlayerY = game.player.y;

        // Incoming-fire detection: if a player shot or bomb is about to hit,
        // the AI dodges instead of holding its usual weapon position.
        let dodge = null;
        for (const proj of game.projectiles) {
          if (proj.owner !== 'player') continue;
          if (proj.kind === 'bomb') {
            const gap = proj.x - game.ai.x;
            if (proj.vy > 0 && Math.abs(gap) < SHIP_RADIUS + BOMB_RADIUS + AI_DODGE_MARGIN) {
              const away = gap === 0 ? 1 : -Math.sign(gap);
              dodge = { x: game.ai.x + away * 60, y: game.ai.y };
              break;
            }
          } else {
            const relX = game.ai.x - proj.x;
            const relY = game.ai.y - proj.y;
            const speedSq = proj.vx * proj.vx + proj.vy * proj.vy;
            if (speedSq === 0) continue;
            const t = clamp((relX * proj.vx + relY * proj.vy) / speedSq, 0, AI_DODGE_LOOKAHEAD_S);
            const closestX = proj.x + proj.vx * t;
            const closestY = proj.y + proj.vy * t;
            const closeDist = Math.hypot(closestX - game.ai.x, closestY - game.ai.y);
            if (t < AI_DODGE_LOOKAHEAD_S && closeDist < SHIP_RADIUS + PROJECTILE_RADIUS + AI_DODGE_MARGIN) {
              const side = relX * proj.vy - relY * proj.vx >= 0 ? 1 : -1;
              const perpLen = Math.hypot(proj.vx, proj.vy) || 1;
              dodge = {
                x: game.ai.x + (-proj.vy / perpLen) * side * 60,
                y: game.ai.y + (proj.vx / perpLen) * side * 60,
              };
              break;
            }
          }
        }

        // AI movement: steer toward a spot that suits its own weapon, unless
        // it needs to dodge incoming fire first.
        let desiredX = game.ai.x;
        let desiredY = game.ai.y;
        if (dodge) {
          desiredX = dodge.x;
          desiredY = dodge.y;
        } else if (aiWeapon.kind === 'bomb') {
          desiredX = game.player.x;
          desiredY = SHIP_RADIUS + 4;
        } else {
          const ddx = game.ai.x - game.player.x;
          const ddy = game.ai.y - game.player.y;
          const dist = Math.hypot(ddx, ddy) || 1;
          const t = aiWeapon.preferredDistance / dist;
          desiredX = game.player.x + ddx * t;
          desiredY = game.player.y + ddy * t;
        }
        const toDesiredX = desiredX - game.ai.x;
        const toDesiredY = desiredY - game.ai.y;
        const toDesiredDist = Math.hypot(toDesiredX, toDesiredY);
        if (toDesiredDist > 4) {
          game.ai.x = clamp(
            game.ai.x + (toDesiredX / toDesiredDist) * AI_SPEED * dt,
            SHIP_RADIUS,
            ARENA_WIDTH - SHIP_RADIUS,
          );
          game.ai.y = clamp(
            game.ai.y + (toDesiredY / toDesiredDist) * AI_SPEED * dt,
            SHIP_RADIUS,
            ARENA_HEIGHT - SHIP_RADIUS,
          );
        }

        // Firing - the player must hold Space; the AI fires on its own.
        if (keysRef.current.fire && now >= game.playerFireNextAt) {
          game.playerFireNextAt = now + playerWeapon.fireIntervalMs;
          const newShots =
            playerWeapon.kind === 'bomb'
              ? fireBomb(game.player, playerWeapon, 'player')
              : fireForward(game.player, playerWeapon, game.ai.x, game.ai.y, 'player');
          game.projectiles.push(...newShots);
        }
        if (now >= game.aiFireNextAt) {
          game.aiFireNextAt = now + aiWeapon.fireIntervalMs;
          let aimX = game.player.x;
          let aimY = game.player.y;
          if (aiWeapon.kind !== 'bomb') {
            // Lead the shot: aim at where the player should be once the
            // pellet arrives, instead of where they are right now.
            const distToPlayer = Math.hypot(game.player.x - game.ai.x, game.player.y - game.ai.y);
            const leadTime = distToPlayer / aiWeapon.projectileSpeed;
            aimX = game.player.x + playerVelX * leadTime;
            aimY = game.player.y + playerVelY * leadTime;
          }
          const newShots =
            aiWeapon.kind === 'bomb' ? fireBomb(game.ai, aiWeapon, 'ai') : fireForward(game.ai, aiWeapon, aimX, aimY, 'ai');
          game.projectiles.push(...newShots);
        }

        // Projectiles: move, check collision with the opposing ship, cull.
        const survivors = [];
        for (const proj of game.projectiles) {
          const stepDist = Math.hypot(proj.vx, proj.vy) * dt;
          proj.x += proj.vx * dt;
          proj.y += proj.vy * dt;
          proj.traveled += stepDist;

          const target = proj.owner === 'player' ? game.ai : game.player;
          const radius = proj.kind === 'bomb' ? BOMB_RADIUS : PROJECTILE_RADIUS;
          const hitRadiusSq = (radius + SHIP_RADIUS) ** 2;
          const hit = (proj.x - target.x) ** 2 + (proj.y - target.y) ** 2 <= hitRadiusSq;

          if (hit) {
            target.health = Math.max(0, target.health - proj.damage);
            if (proj.kind === 'bomb') {
              // Dropping a bomb while right on top of your target catches
              // your own ship in the blast too - a tie, not a clean win.
              const shooter = proj.owner === 'player' ? game.player : game.ai;
              const shipsIntersect = (shooter.x - target.x) ** 2 + (shooter.y - target.y) ** 2 <= (SHIP_RADIUS * 2) ** 2;
              if (shipsIntersect) shooter.health = 0;
            }
            continue;
          }
          if (proj.traveled > proj.maxRange) continue;
          if (proj.x < -20 || proj.x > ARENA_WIDTH + 20 || proj.y < -20 || proj.y > ARENA_HEIGHT + 20) continue;
          survivors.push(proj);
        }
        game.projectiles = survivors;

        if (game.ai.health <= 0 && game.player.health <= 0) {
          setAi({ ...game.ai });
          setPlayer({ ...game.player });
          endMatch('tie');
          return;
        }
        if (game.ai.health <= 0) {
          setAi({ ...game.ai });
          endMatch('win');
          return;
        }
        if (game.player.health <= 0) {
          setPlayer({ ...game.player });
          endMatch('lose');
          return;
        }

        setPlayer({ ...game.player });
        setAi({ ...game.ai });
        setProjectiles(game.projectiles.map((p) => ({ ...p })));
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  function handleChooseWeapon(weaponId) {
    const game = gameRef.current;
    const aiId = pickAiWeaponId();
    game.playerWeaponId = weaponId;
    game.aiWeaponId = aiId;
    game.phase = 'battle';
    setPlayerWeaponId(weaponId);
    setAiWeaponId(aiId);
    setPhase('battle');
  }

  if (phase === 'select') {
    return (
      <div>
        <p style={{ textAlign: 'center', fontSize: 12 }}>Choose your weapon - the enemy picks at random, so it might match yours:</p>
        <div className="dogfight-weapon-grid">
          {WEAPON_LIST.map((w) => (
            <button
              key={w.id}
              type="button"
              className="btn-retro dogfight-weapon-card"
              onClick={() => handleChooseWeapon(w.id)}
            >
              <strong>{w.name}</strong>
              <span style={{ fontSize: 11 }}>{w.description}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="dogfight-health-row">
        <div className="dogfight-health-bar-outer">
          <div
            className="dogfight-health-bar-inner dogfight-health-player"
            style={{ width: `${player.health}%` }}
          />
        </div>
        <div className="dogfight-health-bar-outer">
          <div className="dogfight-health-bar-inner dogfight-health-ai" style={{ width: `${ai.health}%` }} />
        </div>
      </div>
      <div className="dogfight-arena" style={{ width: ARENA_WIDTH, height: ARENA_HEIGHT }}>
        {projectiles.map((p) => (
          <div
            key={p.id}
            className={`dogfight-projectile ${p.kind === 'bomb' ? 'dogfight-bomb' : `dogfight-shot-${p.owner}`}`}
            style={{
              left: p.x - (p.kind === 'bomb' ? BOMB_RADIUS : PROJECTILE_RADIUS),
              top: p.y - (p.kind === 'bomb' ? BOMB_RADIUS : PROJECTILE_RADIUS),
              width: (p.kind === 'bomb' ? BOMB_RADIUS : PROJECTILE_RADIUS) * 2,
              height: (p.kind === 'bomb' ? BOMB_RADIUS : PROJECTILE_RADIUS) * 2,
            }}
          />
        ))}
        <div
          className="dogfight-ship dogfight-ship-player"
          style={{ left: player.x - SHIP_RADIUS, top: player.y - SHIP_RADIUS, width: SHIP_RADIUS * 2, height: SHIP_RADIUS * 2 }}
        />
        <div
          className="dogfight-ship dogfight-ship-ai"
          style={{ left: ai.x - SHIP_RADIUS, top: ai.y - SHIP_RADIUS, width: SHIP_RADIUS * 2, height: SHIP_RADIUS * 2 }}
        />
      </div>
      <p style={{ fontSize: 11, textAlign: 'center', marginTop: 4 }}>
        Arrows to fly, Space to fire your {WEAPONS[playerWeaponId].name}. Enemy has {WEAPONS[aiWeaponId].name}.
      </p>
    </div>
  );
}
