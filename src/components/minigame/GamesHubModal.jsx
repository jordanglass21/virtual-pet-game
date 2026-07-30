import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import MiniGameModal from './MiniGameModal.jsx';
import TreatCatchGame from './TreatCatchGame.jsx';
import WhackAMoleGame from './WhackAMoleGame.jsx';
import DinoRunGame from './DinoRunGame.jsx';
import { useGameState } from '../../state/GameContext.jsx';

const GAMES = [
  {
    key: 'treatCatch',
    title: 'Treat Catch',
    description: 'Catch falling treats with your basket for 30 seconds. Avoid the rotten food!',
    GameComponent: TreatCatchGame,
  },
  {
    key: 'whackAMole',
    title: 'Whack-a-Mole',
    description: 'Click the moles as they pop up before time runs out!',
    GameComponent: WhackAMoleGame,
  },
  {
    key: 'dinoRun',
    title: 'Dino Run',
    description: 'Jump and duck to survive as long as you can. Speed picks up the longer you last!',
    GameComponent: DinoRunGame,
  },
];

export default function GamesHubModal({ onClose }) {
  const state = useGameState();
  const [activeGameKey, setActiveGameKey] = useState(null);

  if (activeGameKey) {
    const game = GAMES.find((g) => g.key === activeGameKey);
    return (
      <MiniGameModal
        title={game.title}
        description={game.description}
        gameKey={game.key}
        GameComponent={game.GameComponent}
        onClose={onClose}
      />
    );
  }

  return (
    <Modal title="Games" onClose={onClose}>
      <div className="games-hub-grid">
        {GAMES.map((game) => (
          <button
            key={game.key}
            type="button"
            className="shop-item-card"
            onClick={() => setActiveGameKey(game.key)}
          >
            <div className="shop-item-name">{game.title}</div>
            <div style={{ fontSize: 11 }}>High score: {state.miniGames[game.key]?.highScore ?? 0}</div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
