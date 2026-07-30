import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import TreatCatchGame from './TreatCatchGame.jsx';
import { useGameState } from '../../state/GameContext.jsx';

export default function MiniGameModal({ onClose }) {
  const state = useGameState();
  const [phase, setPhase] = useState('intro'); // intro | playing | result
  const [result, setResult] = useState(null);

  function handleFinish(res) {
    setResult(res);
    setPhase('result');
  }

  return (
    <Modal title="Treat Catch" onClose={onClose}>
      {phase === 'intro' && (
        <div style={{ textAlign: 'center' }}>
          <p>Catch falling treats with your basket for 30 seconds. Avoid the rotten food!</p>
          <p style={{ fontSize: 12 }}>High score: {state.miniGames.treatCatch.highScore}</p>
          <button type="button" className="btn-retro" onClick={() => setPhase('playing')}>
            Play
          </button>
        </div>
      )}
      {phase === 'playing' && <TreatCatchGame onFinish={handleFinish} />}
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
