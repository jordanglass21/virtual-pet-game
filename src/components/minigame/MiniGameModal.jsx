import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { useGameState } from '../../state/GameContext.jsx';

export default function MiniGameModal({ title, description, gameKey, GameComponent, onClose }) {
  const state = useGameState();
  const [phase, setPhase] = useState('intro'); // intro | playing | result
  const [result, setResult] = useState(null);

  function handleFinish(res) {
    setResult(res);
    setPhase('result');
  }

  return (
    <Modal title={title} onClose={onClose}>
      {phase === 'intro' && (
        <div style={{ textAlign: 'center' }}>
          <p>{description}</p>
          <p style={{ fontSize: 12 }}>High score: {state.miniGames[gameKey]?.highScore ?? 0}</p>
          <button type="button" className="btn-retro" onClick={() => setPhase('playing')}>
            Play
          </button>
        </div>
      )}
      {phase === 'playing' && <GameComponent onFinish={handleFinish} />}
      {phase === 'result' && (
        <div style={{ textAlign: 'center' }}>
          <p>Score: {result.score}</p>
          <p>You earned ${result.payout}!</p>
          <button type="button" className="btn-retro" onClick={onClose}>
            Done
          </button>
        </div>
      )}
    </Modal>
  );
}
