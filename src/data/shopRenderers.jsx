// Small, self-contained CSS/SVG icon components for shop items. Each is
// sized by its container (badge overlay, shop card preview, or room slot).

import desertImg from '../assets/backgrounds/desert.jpg';
import fortressImg from '../assets/backgrounds/fortress.jpg';
import oceanImg from '../assets/backgrounds/ocean.jpg';

// Real illustrated backgrounds (as opposed to the CSS/SVG ones below) - each
// is a species' native default background, but purchasable by anyone.
function makeImageBackground(src) {
  return function ImageBackground() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    );
  };
}

export const DesertBackground = makeImageBackground(desertImg);
export const FortressBackground = makeImageBackground(fortressImg);
export const OceanBackground = makeImageBackground(oceanImg);

export function PartyHatIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <polygon points="24,4 8,40 40,40" fill="#ff5fa2" stroke="#a3235f" strokeWidth="2" />
      <circle cx="24" cy="6" r="4" fill="#ffd400" />
      <circle cx="18" cy="24" r="2.5" fill="#ffd400" />
      <circle cx="30" cy="30" r="2.5" fill="#ffd400" />
    </svg>
  );
}

export function CapIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <path d="M8 30 a16 16 0 0 1 32 0 z" fill="#3b7dd8" stroke="#1e4a8c" strokeWidth="2" />
      <rect x="4" y="28" width="20" height="6" rx="2" fill="#1e4a8c" />
    </svg>
  );
}

export function BowTieIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <polygon points="6,14 22,24 6,34" fill="#d81b1b" stroke="#7a0f0f" strokeWidth="2" />
      <polygon points="42,14 26,24 42,34" fill="#d81b1b" stroke="#7a0f0f" strokeWidth="2" />
      <rect x="20" y="18" width="8" height="12" fill="#a80f0f" />
    </svg>
  );
}

export function ScarfIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect x="6" y="16" width="36" height="14" rx="4" fill="#e0a020" stroke="#8a5f0e" strokeWidth="2" />
      <rect x="6" y="16" width="36" height="4" fill="#8a5f0e" />
    </svg>
  );
}

export function GlassesIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <circle cx="14" cy="24" r="9" fill="none" stroke="#222" strokeWidth="3" />
      <circle cx="34" cy="24" r="9" fill="none" stroke="#222" strokeWidth="3" />
      <line x1="23" y1="24" x2="25" y2="24" stroke="#222" strokeWidth="3" />
    </svg>
  );
}

export function ChairIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect x="12" y="6" width="24" height="6" fill="#a06a3a" />
      <rect x="12" y="6" width="6" height="30" fill="#a06a3a" />
      <rect x="8" y="24" width="32" height="6" fill="#c98950" />
      <rect x="10" y="30" width="5" height="12" fill="#7a4d26" />
      <rect x="33" y="30" width="5" height="12" fill="#7a4d26" />
    </svg>
  );
}

export function StoolIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <ellipse cx="24" cy="18" rx="16" ry="6" fill="#c98950" stroke="#7a4d26" strokeWidth="2" />
      <rect x="12" y="20" width="5" height="18" fill="#7a4d26" />
      <rect x="31" y="20" width="5" height="18" fill="#7a4d26" />
    </svg>
  );
}

export function TableIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect x="6" y="14" width="36" height="6" fill="#8a5f2e" stroke="#4d3416" strokeWidth="1" />
      <rect x="10" y="20" width="5" height="18" fill="#4d3416" />
      <rect x="33" y="20" width="5" height="18" fill="#4d3416" />
    </svg>
  );
}

export function LampIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <polygon points="14,6 34,6 30,20 18,20" fill="#f4d35e" stroke="#a3831c" strokeWidth="2" />
      <rect x="22" y="20" width="4" height="18" fill="#555" />
      <ellipse cx="24" cy="40" rx="12" ry="3" fill="#333" />
    </svg>
  );
}

export function PaintingIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect x="6" y="6" width="36" height="28" fill="#fff8e6" stroke="#7a4d26" strokeWidth="3" />
      <polygon points="10,30 20,14 28,26 34,18 38,30" fill="#6fa85f" />
    </svg>
  );
}

export function ShelfIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect x="6" y="14" width="36" height="5" fill="#8a5f2e" />
      <rect x="6" y="30" width="36" height="5" fill="#8a5f2e" />
      <rect x="10" y="4" width="6" height="10" fill="#d81b1b" />
      <rect x="20" y="2" width="6" height="12" fill="#3b7dd8" />
    </svg>
  );
}

export function RugStripesIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect x="4" y="14" width="40" height="20" rx="4" fill="#e0e0e0" stroke="#999" strokeWidth="2" />
      <rect x="4" y="18" width="40" height="4" fill="#d81b1b" />
      <rect x="4" y="26" width="40" height="4" fill="#3b7dd8" />
    </svg>
  );
}

export function RugDotsIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <rect x="4" y="14" width="40" height="20" rx="4" fill="#fff3d6" stroke="#c9a227" strokeWidth="2" />
      <circle cx="14" cy="20" r="3" fill="#c9a227" />
      <circle cx="24" cy="28" r="3" fill="#c9a227" />
      <circle cx="34" cy="20" r="3" fill="#c9a227" />
    </svg>
  );
}

export function BeachBackground() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, #7ec8ff 0%, #7ec8ff 55%, #f4dfa3 55%, #f4dfa3 100%)',
      }}
    />
  );
}

export function SpaceBackground() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background:
          'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1.5px), radial-gradient(circle at 70% 60%, #fff 1px, transparent 1.5px), radial-gradient(circle at 45% 80%, #fff 1px, transparent 1.5px), #0b0b2e',
      }}
    />
  );
}

export function MeadowBackground() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, #bfe8ff 0%, #bfe8ff 60%, #8fce6a 60%, #8fce6a 100%)',
      }}
    />
  );
}

// The free starting background, before any background has been bought -
// a plain little meadow so the room isn't just a blank panel.
export function DefaultBackground() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #a9ddf7 0%, #a9ddf7 58%, #9ed16a 58%, #9ed16a 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '14%',
          width: '18%',
          aspectRatio: '1',
          borderRadius: '50%',
          background: '#fff2a8',
          boxShadow: '0 0 10px 4px rgba(255, 242, 168, 0.7)',
        }}
      />
      {[['22%', '78%'], ['42%', '88%'], ['65%', '82%'], ['80%', '92%']].map(([left, top], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left,
            top,
            width: '5%',
            aspectRatio: '1',
            borderRadius: '50%',
            background: i % 2 === 0 ? '#ffffff' : '#ffd400',
          }}
        />
      ))}
    </div>
  );
}

// Adult-exclusive items.

export function CrownIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <polygon
        points="8,32 8,16 16,24 24,12 32,24 40,16 40,32"
        fill="#ffd400"
        stroke="#a3831c"
        strokeWidth="2"
      />
      <rect x="8" y="32" width="32" height="6" fill="#ffd400" stroke="#a3831c" strokeWidth="2" />
      <circle cx="16" cy="18" r="2" fill="#d81b1b" />
      <circle cx="24" cy="14" r="2" fill="#3b7dd8" />
      <circle cx="32" cy="18" r="2" fill="#d81b1b" />
    </svg>
  );
}

export function TrophyIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <path d="M14 6 H34 V18 A10 10 0 0 1 14 18 Z" fill="#ffd400" stroke="#a3831c" strokeWidth="2" />
      <rect x="21" y="28" width="6" height="8" fill="#a3831c" />
      <rect x="14" y="36" width="20" height="5" fill="#ffd400" stroke="#a3831c" strokeWidth="2" />
      <path d="M14 8 H6 V14 A8 8 0 0 0 14 22" fill="none" stroke="#a3831c" strokeWidth="2" />
      <path d="M34 8 H42 V14 A8 8 0 0 1 34 22" fill="none" stroke="#a3831c" strokeWidth="2" />
    </svg>
  );
}

export function CastleBackground() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background:
          'linear-gradient(to bottom, #6a5fa8 0%, #6a5fa8 55%, #8a7fc0 55%, #8a7fc0 70%, #4a4470 70%, #4a4470 100%)',
      }}
    />
  );
}

// Evolution ritual items.

export function McGuffinIcon() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%">
      <polygon points="24,4 38,18 30,44 18,44 10,18" fill="#9b59d6" stroke="#5e2f8a" strokeWidth="2" />
      <polygon points="24,4 32,18 16,18" fill="#c99bf0" />
      <circle cx="24" cy="24" r="3" fill="#ffffff" opacity="0.85" />
    </svg>
  );
}

export function RitualGroundsBackground() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'linear-gradient(to bottom, #1a1030 0%, #1a1030 55%, #2b1b45 55%, #2b1b45 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '18%',
          width: '55%',
          height: '30%',
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          border: '3px solid #c99bf0',
          boxShadow: '0 0 12px 4px rgba(201, 155, 240, 0.6)',
        }}
      />
    </div>
  );
}
