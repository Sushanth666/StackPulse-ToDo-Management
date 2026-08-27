import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Phone, Building2, MapPin, CheckCircle2, ListFilter, Briefcase, Award } from 'lucide-react';
import { useTodos } from '../../features/todos/context/TodoContext';
import { getUserProfile } from '../../shared/utils/professionalData';

export const UserDrawer = ({ userId, isOpen, onClose }) => {
  const { todos, toggleTodoStatus, setUserFilter } = useTodos();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      const profile = getUserProfile(Number(userId));
      setUser(profile);
    }
  }, [isOpen, userId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const userTodos = todos.filter((t) => t.userId === Number(userId));
  const completedCount = userTodos.filter((t) => t.completed).length;
  const pendingCount = userTodos.length - completedCount;
  const completionRate = userTodos.length > 0 ? Math.round((completedCount / userTodos.length) * 100) : 0;

  const handleFilterToThisUser = () => {
    setUserFilter(String(userId));
    onClose();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return createPortal(
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer-panel" aria-label="Team Member Profile Drawer">
        {/* Header */}
        <div className="drawer-header">
          <span style={{ fontSize: '1rem', fontWeight: 700 }}>Team Member Directory</span>
          <button
            id="close-user-drawer-btn"
            className="btn-icon btn-ghost"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* Avatar, Name, Role */}
          <div className="user-avatar-hero">
            <div className="user-avatar-circle" style={{ background: user.avatarColor }}>
              {getInitials(user.name)}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{user.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600 }}>{user.role}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{user.department}</p>
            </div>
          </div>

          {/* Contact Meta Grid */}
          <div className="user-meta-grid">
            <div className="user-meta-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="user-meta-label">
                <Mail size={13} />
                <span>Email</span>
              </div>
              <div className="user-meta-val">{user.email}</div>
            </div>

            <div className="user-meta-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="user-meta-label">
                <Phone size={13} />
                <span>Phone</span>
              </div>
              <div className="user-meta-val">{user.phone}</div>
            </div>

            <div className="user-meta-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="user-meta-label">
                <Building2 size={13} />
                <span>Organization</span>
              </div>
              <div className="user-meta-val">{user.company}</div>
            </div>

            <div className="user-meta-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="user-meta-label">
                <MapPin size={13} />
                <span>Location</span>
              </div>
              <div className="user-meta-val">{user.city}</div>
            </div>
          </div>

          {/* Task Performance Overview */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Assigned Responsibilities ({userTodos.length})
              </span>
              <button
                id="filter-by-user-btn"
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                onClick={handleFilterToThisUser}
              >
                <ListFilter size={13} />
                <span>Filter Workspace to {user.name.split(' ')[0]}</span>
              </button>
            </div>

            {/* Progress bar */}
            <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                <span>Delivery Velocity</span>
                <span style={{ color: 'var(--primary-600)' }}>{completionRate}%</span>
              </div>
              <div className="progress-bar-container" style={{ margin: 0 }}>
                <div className="progress-bar-fill" style={{ width: `${completionRate}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                <span>{completedCount} Completed</span>
                <span>{pendingCount} In Progress</span>
              </div>
            </div>

            {/* List of Tasks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
              {userTodos.map((todo) => (
                <div
                  key={todo.id}
                  style={{
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    fontSize: '0.825rem',
                  }}
                >
                  <span
                    style={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                      flex: 1,
                    }}
                  >
                    #{todo.id} {todo.title}
                  </span>
                  <button
                    className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
                    style={{ width: 18, height: 18 }}
                    onClick={() => toggleTodoStatus(todo.id)}
                    title="Toggle status"
                  >
                    {todo.completed && <CheckCircle2 size={13} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
};

export default UserDrawer;
