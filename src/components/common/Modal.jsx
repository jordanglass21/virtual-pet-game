export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay">
      <div className="retro-window modal-window">
        <div className="retro-titlebar">
          <span>{title}</span>
          <button type="button" className="btn-retro" onClick={onClose}>
            X
          </button>
        </div>
        <div className="panel-sunken" style={{ margin: 8, padding: 12 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
