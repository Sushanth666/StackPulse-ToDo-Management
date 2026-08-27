import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  History,
  RotateCcw,
  Trash2,
  PlusCircle,
  Edit3,
  CheckCircle,
  Layers,
  Sparkles,
  Clock,
  Filter,
} from 'lucide-react';
import { useTodos } from '../../features/todos/context/TodoContext';

export const ActivityDrawer = ({ isOpen, onClose }) => {
  const { activities, undoActivity, clearActivities } = useTodos();
  const [filterType, setFilterType] = useState('all');

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

  const filteredActivities = activities.filter((act) => {
    if (filterType === 'all') return true;
    if (filterType === 'create') return act.type === 'create';
    if (filterType === 'update') return act.type === 'update';
    if (filterType === 'delete') return act.type === 'delete' || act.type === 'bulk_delete';
    if (filterType === 'toggle') return act.type === 'toggle' || act.type === 'bulk_toggle';
    return true;
  });

  const getRelativeTime = (timestamp) => {
    try {
      const now = new Date();
      const time = new Date(timestamp);
      const diffSecs = Math.floor((now - time) / 1000);

      if (diffSecs < 10) return 'Just now';
      if (diffSecs < 60) return `${diffSecs}s ago`;
      const diffMins = Math.floor(diffSecs / 60);
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return time.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'create':
        return <PlusCircle size={15} color="var(--primary-500)" />;
      case 'update':
        return <Edit3 size={15} color="var(--info-500)" />;
      case 'delete':
      case 'bulk_delete':
        return <Trash2 size={15} color="var(--danger-500)" />;
      case 'toggle':
      case 'bulk_toggle':
        return <CheckCircle size={15} color="var(--success-500)" />;
      default:
        return <Sparkles size={15} color="var(--warning-500)" />;
    }
  };

  const getMethodBadge = (type) => {
    switch (type) {
      case 'create':
        return <span className="brand-badge" style={{ fontSize: '0.625rem' }}>POST 201</span>;
      case 'update':
        return <span className="brand-badge" style={{ fontSize: '0.625rem', color: 'var(--info-600)', background: 'var(--info-50)', borderColor: 'var(--info-100)' }}>PATCH 200</span>;
      case 'delete':
      case 'bulk_delete':
        return <span className="brand-badge" style={{ fontSize: '0.625rem', color: 'var(--danger-600)', background: 'var(--danger-50)', borderColor: 'var(--danger-100)' }}>DELETE 200</span>;
      case 'toggle':
      case 'bulk_toggle':
        return <span className="brand-badge" style={{ fontSize: '0.625rem', color: 'var(--success-600)', background: 'var(--success-50)', borderColor: 'var(--success-100)' }}>STATUS</span>;
      default:
        return <span className="brand-badge" style={{ fontSize: '0.625rem' }}>REST API</span>;
    }
  };

  return createPortal(
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer-panel" aria-label="Activity Log & Audit Trail Drawer">
        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="stat-icon-wrapper stat-icon-indigo" style={{ width: 34, height: 34 }}>
              <History size={17} />
            </div>
            <div>
              <span style={{ fontSize: '1rem', fontWeight: 800, display: 'block' }}>
                Activity & Audit Trail
              </span>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>
                {activities.length} recorded REST events
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {activities.length > 0 && (
              <button
                id="clear-activity-log-btn"
                className="btn btn-ghost"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                onClick={clearActivities}
                title="Clear audit trail"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            )}
            <button
              id="close-activity-drawer-btn"
              className="btn-icon btn-ghost"
              onClick={onClose}
              aria-label="Close activity drawer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ padding: '0.85rem 1.65rem 0.2rem 1.65rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-tertiary)' }}>
          <div style={{ display: 'flex', gap: '0.3rem', overflowX: 'auto', paddingBottom: '0.65rem' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'create', label: 'Created' },
              { id: 'update', label: 'Updated' },
              { id: 'toggle', label: 'Status' },
              { id: 'delete', label: 'Deleted' },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${filterType === tab.id ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                onClick={() => setFilterType(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Body */}
        <div className="drawer-body" style={{ gap: '1rem', paddingTop: '1.25rem' }}>
          {filteredActivities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-tertiary)' }}>
              <History size={42} strokeWidth={1.5} style={{ margin: '0 auto 0.85rem auto', opacity: 0.5 }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                No Activity Recorded
              </h4>
              <p style={{ fontSize: '0.825rem', maxWidth: '280px', margin: '0 auto' }}>
                Create, edit, delete, or toggle tasks to build your live workspace audit trail.
              </p>
            </div>
          ) : (
            <div className="activity-timeline">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className={`activity-item ${act.undone ? 'activity-undone' : ''}`}
                >
                  <div className="activity-icon-col">
                    <div className="activity-icon-bubble">
                      {getActionIcon(act.type)}
                    </div>
                    <div className="activity-timeline-line" />
                  </div>

                  <div className="activity-content-box">
                    <div className="activity-header-row">
                      <span className="activity-title">{act.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {getMethodBadge(act.type)}
                        <span className="activity-time">
                          <Clock size={10} style={{ display: 'inline', marginRight: 2 }} />
                          {getRelativeTime(act.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className="activity-desc">{act.description}</p>

                    {/* Action Undo Button */}
                    {act.canUndo && !act.undone && (
                      <div style={{ marginTop: '0.6rem' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.725rem' }}
                          onClick={() => undoActivity(act.id)}
                          title="Undo this specific change"
                        >
                          <RotateCcw size={12} color="var(--primary-500)" />
                          <span>Undo Action</span>
                        </button>
                      </div>
                    )}

                    {act.undone && (
                      <span style={{ fontSize: '0.675rem', color: 'var(--text-tertiary)', fontStyle: 'italic', display: 'inline-block', marginTop: '0.4rem' }}>
                        ✓ Change Reverted
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>,
    document.body
  );
};

export default ActivityDrawer;
