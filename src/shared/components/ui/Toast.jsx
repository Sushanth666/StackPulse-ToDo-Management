import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 size={18} strokeWidth={2.5} />,
  error: <AlertCircle size={18} strokeWidth={2.5} />,
  warning: <AlertTriangle size={18} strokeWidth={2.5} />,
  info: <Info size={18} strokeWidth={2.5} />,
};

const badgeLabels = {
  success: 'REST API 200 OK',
  error: 'API ERROR',
  warning: 'ACTION REQUIRED',
  info: 'WORKSPACE UPDATE',
};

export const Toast = ({ toast, onClose }) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 200);
  };

  useEffect(() => {
    const duration = toast.duration || 4500;
    const intervalTime = 40;
    const decrement = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            handleDismiss();
            return 0;
          }
          return Math.max(0, prev - decrement);
        });
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [toast, onClose]);

  const type = toast.type || 'info';

  const handleActionClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (toast.action && typeof toast.action.onClick === 'function') {
      toast.action.onClick();
    }
    handleDismiss();
  };

  return (
    <div
      className={`toast-card toast-${type} ${isExiting ? 'toast-exiting' : ''}`}
      role="alert"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Toast Main Row */}
      <div className="toast-inner-row">
        {/* Glowing Icon Hub */}
        <div className={`toast-icon-badge icon-badge-${type}`}>
          {icons[type] || icons.info}
        </div>

        {/* Content Container */}
        <div className="toast-body-content">
          <div className="toast-top-meta">
            <span className={`toast-type-pill pill-${type}`}>
              {badgeLabels[type] || 'NOTIFICATION'}
            </span>
            {toast.title && <span className="toast-heading">{toast.title}</span>}
          </div>

          {toast.message && <p className="toast-description">{toast.message}</p>}

          {/* Action Button if provided */}
          {toast.action && (
            <div style={{ marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{
                  padding: '0.28rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderColor: 'var(--border-strong)',
                }}
                onClick={handleActionClick}
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>

        {/* Interactive Close Button */}
        <button
          type="button"
          className="toast-dismiss-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          aria-label="Dismiss notification"
          title="Dismiss"
        >
          <X size={15} />
        </button>
      </div>

      {/* Animated Glowing Progress Bar */}
      <div className="toast-progress-track">
        <div
          className={`toast-progress-bar bar-${type}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Toast;
