import { useState } from 'react';
import '../css/AddCandidateModal.css';

export default function Signout({ onConfirm, onCancel }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onCancel();
    }, 250);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
    }, 250);
  };

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`}>
      <div className={`modal ${isClosing ? 'closing' : ''}`}>
        <div className="modal-header">
          <h4>Confirm Logout</h4>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '15px', marginBottom: '24px', color: '#333' }}>
            Are you sure you want to logout?
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button
              className="save-btn enabled"
              onClick={handleConfirm}
              style={{ minWidth: '100px' }}
            >
              Yes
            </button>
            <button
              className="save-btn enabled"
              onClick={handleClose}
              style={{ minWidth: '100px', backgroundColor: 'gray' }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
