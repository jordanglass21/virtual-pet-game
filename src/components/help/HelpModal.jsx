import Modal from '../common/Modal.jsx';

export default function HelpModal({ onClose }) {
  return (
    <Modal title="Help" onClose={onClose}>
      <div style={{ fontSize: 12, lineHeight: 1.5 }}>
        <p>
          Your pet's <strong>Hunger</strong>, <strong>Happiness</strong>, <strong>Energy</strong>, and{' '}
          <strong>Cleanliness</strong> slowly drop over time. Keep them up by taking care of your pet!
        </p>
        <ul style={{ paddingLeft: 18, margin: '4px 0 12px' }}>
          <li>
            <strong>Feed</strong> - drag food from the bowl onto your pet.
          </li>
          <li>
            <strong>Clean</strong> - scrub the dirty spots with the brush.
          </li>
          <li>
            <strong>Sleep</strong> - happens automatically when energy gets low. Leave your pet undisturbed while
            it naps for a bonus!
          </li>
          <li>
            <strong>Play</strong> - open Games to play Treat Catch or Whack-a-Mole, which also makes your pet
            happy.
          </li>
        </ul>
        <p>
          <strong>Currency</strong> - taking care of your pet and playing games earns coins. Spend them in the Shop
          on clothes, furniture, and backgrounds.
        </p>
        <p>
          <strong>Growing up</strong> - every care action and game you play helps your pet grow. Once it's grown
          enough, it evolves into an adult and unlocks special items in the Shop!
        </p>
      </div>
    </Modal>
  );
}
