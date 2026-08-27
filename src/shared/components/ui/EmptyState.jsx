import React from 'react';
import { SearchX, Inbox, AlertTriangle, Plus, RotateCcw, RefreshCw, Zap, ZapOff } from 'lucide-react';

export const EmptyState = ({
  type = 'empty', // 'empty' | 'no-results' | 'error' | 'offline'
  title,
  description,
  onAction,
  actionLabel,
  errorDetails,
}) => {
  if (type === 'offline') {
    return (
      <div className="empty-state-card" style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-secondary)' }}>
        <div className="empty-state-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-500)' }}>
          <ZapOff size={32} />
        </div>
        <h3 className="empty-state-title" style={{ color: 'var(--text-primary)' }}>
          {title || 'REST API is Offline'}
        </h3>
        <p className="empty-state-desc">
          {description || 'The live REST API is currently turned OFF. Deliverables data is hidden. Turn ON the API button in the top navbar to reconnect and load deliverables.'}
        </p>
        {onAction && (
          <button id="empty-state-connect-btn" className="btn btn-primary" onClick={onAction} style={{ gap: '0.5rem' }}>
            <Zap size={16} fill="currentColor" />
            {actionLabel || 'Turn ON REST API'}
          </button>
        )}
      </div>
    );
  }
  if (type === 'error') {
    return (
      <div className="empty-state-card" style={{ borderColor: 'var(--danger-500)' }}>
        <div className="empty-state-icon" style={{ background: 'var(--danger-50)', color: 'var(--danger-600)' }}>
          <AlertTriangle size={32} />
        </div>
        <h3 className="empty-state-title" style={{ color: 'var(--danger-600)' }}>
          {title || 'Failed to Load Todos'}
        </h3>
        <p className="empty-state-desc">
          {description || 'There was an issue communicating with the JSONPlaceholder API. Please check your connection and retry.'}
        </p>
        {errorDetails && (
          <code
            style={{
              padding: '0.5rem 0.8rem',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: 'var(--danger-600)',
              maxWidth: '90%',
              wordBreak: 'break-word',
            }}
          >
            {errorDetails}
          </code>
        )}
        {onAction && (
          <button id="empty-state-retry-btn" className="btn btn-primary" onClick={onAction}>
            <RefreshCw size={16} />
            {actionLabel || 'Retry API Request'}
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-results') {
    return (
      <div className="empty-state-card">
        <div className="empty-state-icon">
          <SearchX size={32} />
        </div>
        <h3 className="empty-state-title">{title || 'No Matching Tasks Found'}</h3>
        <p className="empty-state-desc">
          {description || "We couldn't find any tasks matching your active search keywords or filters."}
        </p>
        {onAction && (
          <button id="empty-state-reset-btn" className="btn btn-secondary" onClick={onAction}>
            <RotateCcw size={16} />
            {actionLabel || 'Clear All Filters'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">
        <Inbox size={32} />
      </div>
      <h3 className="empty-state-title">{title || 'No Tasks Available'}</h3>
      <p className="empty-state-desc">
        {description || 'Your task list is empty. Create your first task to get started.'}
      </p>
      {onAction && (
        <button id="empty-state-create-btn" className="btn btn-primary" onClick={onAction}>
          <Plus size={16} />
          {actionLabel || 'Create New Task'}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
