export default function ProgressBar({ label, value, max = 100 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const color = pct > 60 ? 'var(--good)' : pct > 30 ? '#e0a800' : 'var(--danger)';

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div className="panel-sunken" style={{ height: 14, padding: 2 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}
