// Small CSS/SVG icon components for the interactive Feed/Clean activities.

export function DirtSpotIcon() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <path
        d="M16 3 C22 3 27 8 26 15 C25 22 20 29 16 29 C12 29 7 22 6 15 C5 8 10 3 16 3 Z"
        fill="#6b4a2f"
        stroke="#3d2a1a"
        strokeWidth="2"
        opacity="0.85"
      />
    </svg>
  );
}

export function FoodBiteIcon() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <circle cx="16" cy="16" r="12" fill="#f4a742" stroke="#a35c0e" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="#a35c0e" />
      <circle cx="20" cy="14" r="2" fill="#a35c0e" />
      <circle cx="15" cy="20" r="2" fill="#a35c0e" />
    </svg>
  );
}

export function FoodBowlIcon() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <ellipse cx="16" cy="14" rx="13" ry="5" fill="#e0762c" stroke="#7a3f12" strokeWidth="2" />
      <path d="M4 14 L7 24 A10 5 0 0 0 25 24 L28 14 Z" fill="#c9c9c9" stroke="#888" strokeWidth="2" />
    </svg>
  );
}
