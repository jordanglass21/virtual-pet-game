import Modal from './Modal.jsx';
import { useGameDispatch } from '../../state/GameContext.jsx';

export default function EvolutionBanner({ petName }) {
  const dispatch = useGameDispatch();

  function dismiss() {
    dispatch({ type: 'CLEAR_EVOLUTION_FLAG' });
  }

  return (
    <Modal title="Evolution!" onClose={dismiss}>
      <p style={{ textAlign: 'center' }}>{petName} grew up into an adult!</p>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <button type="button" className="btn-retro" onClick={dismiss}>
          Nice!
        </button>
      </div>
    </Modal>
  );
}
