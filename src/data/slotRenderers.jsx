// Small CSS/SVG icon components for the slot machine reels.

export function CherryIcon() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <path d="M16 4 C16 10 14 12 14 12 M16 4 C16 9 19 11 19 11" stroke="#3d6b2e" strokeWidth="2" fill="none" />
      <circle cx="12" cy="21" r="7" fill="#d81b1b" stroke="#7a0f0f" strokeWidth="2" />
      <circle cx="21" cy="19" r="7" fill="#d81b1b" stroke="#7a0f0f" strokeWidth="2" />
    </svg>
  );
}

export function BellIcon() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <path d="M16 5 C10 5 9 12 9 16 C9 20 7 22 7 22 H25 C25 22 23 20 23 16 C23 12 22 5 16 5 Z" fill="#f4c542" stroke="#a3831c" strokeWidth="2" />
      <circle cx="16" cy="26" r="2.5" fill="#a3831c" />
      <rect x="14" y="2" width="4" height="4" rx="1" fill="#a3831c" />
    </svg>
  );
}

export function StarIcon() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <polygon
        points="16,3 19.5,12 29,12 21.5,18 24,27 16,21.5 8,27 10.5,18 3,12 12.5,12"
        fill="#4fa8e0"
        stroke="#1e5f8c"
        strokeWidth="2"
      />
    </svg>
  );
}

export function SevenIcon() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <circle cx="16" cy="16" r="14" fill="#d81b1b" stroke="#7a0f0f" strokeWidth="2" />
      <text x="16" y="22" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#fff" fontFamily="Courier New, monospace">
        7
      </text>
    </svg>
  );
}
