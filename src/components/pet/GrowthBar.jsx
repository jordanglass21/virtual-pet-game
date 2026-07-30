import ProgressBar from '../common/ProgressBar.jsx';
import { EVOLVE_THRESHOLD } from '../../data/constants.js';

export default function GrowthBar({ growth }) {
  return <ProgressBar label="Growth to adulthood" value={growth} max={EVOLVE_THRESHOLD} />;
}
