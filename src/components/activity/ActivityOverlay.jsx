import FeedActivity from './FeedActivity.jsx';
import CleanActivity from './CleanActivity.jsx';

export default function ActivityOverlay({ activityId, onComplete, petTargetRef }) {
  if (activityId === 'feed') return <FeedActivity onComplete={onComplete} petTargetRef={petTargetRef} />;
  if (activityId === 'clean') return <CleanActivity onComplete={onComplete} />;
  return null;
}
