import ProgressBar from '../common/ProgressBar.jsx';

const LABELS = {
  hunger: 'Hunger',
  happiness: 'Happiness',
  energy: 'Energy',
  cleanliness: 'Cleanliness',
};

export default function StatBars({ stats }) {
  return (
    <div>
      {Object.entries(stats).map(([key, value]) => (
        <ProgressBar key={key} label={LABELS[key]} value={value} />
      ))}
    </div>
  );
}
