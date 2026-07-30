export function now() {
  return Date.now();
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function isSameCalendarDay(tsA, tsB) {
  const a = new Date(tsA);
  const b = new Date(tsB);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
