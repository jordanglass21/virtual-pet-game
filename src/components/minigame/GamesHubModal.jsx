import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import MiniGameModal from './MiniGameModal.jsx';
import TreatCatchGame from './TreatCatchGame.jsx';
import DogfightGame from './DogfightGame.jsx';
import PetRunGame from './PetRunGame.jsx';
import SlotMachineModal from './SlotMachineModal.jsx';
import { useGameState } from '../../state/GameContext.jsx';

const GAMES = [
  {
    key: 'treatCatch',
    title: 'Treat Catch',
    description:
      'Catch falling treats with your basket - miss a good or red one and it\'s over! Rotten treats are safe to miss.',
    GameComponent: TreatCatchGame,
  },
  {
    key: 'dogfight',
    title: 'Dogfight',
    description:
      'Pick Scatter Shot, Assault Shot, or the Bomb - the enemy picks at random. Battle it out to 0 health!',
    GameComponent: DogfightGame,
  },
  {
    key: 'petRun',
    title: 'Pet Run',
    description:
      'Jump and duck to survive as long as you can. Hold down then jump for a super jump over tall obstacles!',
    GameComponent: PetRunGame,
  },
  {
    key: 'slotMachine',
    title: 'Slot Machine',
    description: 'Bet coins and spin the reels - match 3 for a big payout!',
    CustomModal: SlotMachineModal,
    statLabel: (state) => `Biggest win: $${state.miniGames.slotMachine?.highScore ?? 0}`,
  },
];

export default function GamesHubModal({ onClose }) {
  const state = useGameState();
  const [activeGameKey, setActiveGameKey] = useState(null);

  if (activeGameKey) {
    const game = GAMES.find((g) => g.key === activeGameKey);
    if (game.CustomModal) {
      const CustomModal = game.CustomModal;
      return <CustomModal onClose={onClose} />;
    }
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
            <div style={{ fontSize: 11 }}>
              {game.statLabel ? game.statLabel(state) : `High score: ${state.miniGames[game.key]?.highScore ?? 0}`}
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
