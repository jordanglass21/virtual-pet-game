import Modal from './Modal.jsx';
import { useGameDispatch } from '../../state/GameContext.jsx';

export default function GameOverModal({ entry }) {
  const dispatch = useGameDispatch();

  function dismiss() {
    dispatch({ type: 'CLEAR_LAST_DEATH' });
  }

  return (
    <Modal title="Game Over" onClose={dismiss}>
      <p style={{ textAlign: 'center' }}>
        {entry.name} didn't make it - too many needs went unmet for too long.
      </p>
      <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Final Score: {entry.score}</p>
      <p style={{ textAlign: 'center', fontSize: 11 }}>
        {entry.name} has been added to the Memoriam in Settings.
      </p>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <button type="button" className="btn-retro" onClick={dismiss}>
          Continue
        </button>
      </div>
    </Modal>
  );
}
