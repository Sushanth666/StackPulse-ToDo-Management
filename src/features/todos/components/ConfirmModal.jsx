import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Task',
  message = 'Are you sure you want to delete this task? This will perform an API DELETE request and cannot be undone.',
  confirmText = 'Delete Task',
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
          <div className="modal-title" style={{ color: 'var(--danger-600)' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--danger-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '0.25rem',
              }}
            >
              <AlertTriangle size={20} color="var(--danger-500)" />
            </div>
            <span>{title}</span>
          </div>
          <button
            id="close-confirm-modal-btn"
            className="btn-icon btn-ghost"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Body */}
        <div className="modal-body" style={{ paddingTop: '0.5rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            id="cancel-delete-btn"
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            <Trash2 size={16} />
            <span>{isLoading ? 'Deleting...' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
