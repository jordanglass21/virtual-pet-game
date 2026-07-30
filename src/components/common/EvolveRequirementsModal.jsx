import Modal from './Modal.jsx';

export default function EvolveRequirementsModal({ petName, hasMcGuffin, hasRitualGrounds, onClose }) {
  return (
    <Modal title="Evolution Ritual" onClose={onClose}>
      <p style={{ fontSize: 13 }}>{petName} is ready to evolve! To complete the ritual, you need:</p>
      <ul style={{ fontSize: 12, paddingLeft: 18, lineHeight: 1.6 }}>
        <li>
          {hasMcGuffin ? '✅' : '⬜'} Buy the <strong>McGuffin</strong> from the Shop (Clothes) and equip it
        </li>
        <li>
          {hasRitualGrounds ? '✅' : '⬜'} Buy the <strong>Ritual Grounds</strong> background from the Shop and set
          it
        </li>
      </ul>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <button type="button" className="btn-retro" onClick={onClose}>
          Got it
        </button>
      </div>
    </Modal>
  );
}
