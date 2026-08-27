import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, PlusCircle, Edit3, Loader2, Send, Flame, Tag, CheckSquare, Plus, Trash2 } from 'lucide-react';
import { useTodos } from '../context/TodoContext';
import { getTodayDateString } from '../../../shared/utils/dateUtils';

const DOMAIN_CATEGORIES = [
  'Backend',
  'Frontend',
  'DevOps',
  'Security',
  'Database',
  'Architecture',
  'Design',
  'QA',
  'Product',
  'API',
  'Performance',
];

export const TodoModal = ({ isOpen, onClose, todoToEdit = null }) => {
  const isEditMode = Boolean(todoToEdit);
  const { addTodo, updateTodo, teamMembers } = useTodos();

  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Backend');
  const [dueDate, setDueDate] = useState(getTodayDateString(3));
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when modal opens or todoToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (todoToEdit) {
        setTitle(todoToEdit.title || '');
        setUserId(todoToEdit.userId || 1);
        setCompleted(Boolean(todoToEdit.completed));
        setPriority(todoToEdit.priority || 'medium');
        setCategory(todoToEdit.category || 'Backend');
        setDueDate(todoToEdit.dueDate || getTodayDateString(3));
        setSubtasks(todoToEdit.subtasks || []);
      } else {
        setTitle('');
        setUserId(1);
        setCompleted(false);
        setPriority('medium');
        setCategory('Backend');
        setDueDate(getTodayDateString(3));
        setSubtasks([
          { id: `st-init-1`, title: 'Design specifications and schema draft', completed: false },
          { id: `st-init-2`, title: 'Implement core functionality & test cases', completed: false },
          { id: `st-init-3`, title: 'Code review and deployment verification', completed: false },
        ]);
      }
      setNewSubtaskInput('');
      setErrors({});
    }
  }, [isOpen, todoToEdit]);

  // Handle ESC key
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

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Task title is required.';
    } else if (title.trim().length < 5) {
      errs.title = 'Title must be at least 5 characters long for clear engineering context.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddSubtaskItem = (e) => {
    if (e) e.preventDefault();
    if (!newSubtaskInput.trim()) return;
    const newItem = {
      id: `st-modal-${Date.now()}`,
      title: newSubtaskInput.trim(),
      completed: false,
    };
    setSubtasks((prev) => [...prev, newItem]);
    setNewSubtaskInput('');
  };

  const handleToggleSubtaskItem = (id) => {
    setSubtasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleDeleteSubtaskItem = (id) => {
    setSubtasks((prev) => prev.filter((st) => st.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const result = await updateTodo(
          todoToEdit.id,
          {
            title: title.trim(),
            userId: Number(userId),
            completed: Boolean(completed),
            priority,
            category,
            dueDate,
            subtasks,
          },
          true // PATCH
        );
        if (result.success) {
          onClose();
        }
      } else {
        const result = await addTodo({
          title: title.trim(),
          userId: Number(userId),
          completed: Boolean(completed),
          priority,
          category,
          dueDate,
          subtasks,
        });
        if (result.success) {
          onClose();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            {isEditMode ? (
              <>
                <Edit3 size={20} color="var(--primary-500)" />
                <span>Edit Engineering Task #{todoToEdit?.id}</span>
                <span className="brand-badge" style={{ fontSize: '0.65rem' }}>
                  PATCH
                </span>
              </>
            ) : (
              <>
                <PlusCircle size={20} color="var(--primary-500)" />
                <span>Create Enterprise Task</span>
                <span className="brand-badge" style={{ fontSize: '0.65rem' }}>
                  POST
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            className="action-btn"
            onClick={onClose}
            aria-label="Close modal"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body" style={{ overflowY: 'auto', flex: 1 }}>
            {/* Title Input */}
            <div className="form-group">
              <label htmlFor="todo-title-input" className="form-label">
                Task Title / Deliverable <span style={{ color: 'var(--danger-500)' }}>*</span>
              </label>
              <input
                id="todo-title-input"
                type="text"
                className={`input-field ${errors.title ? 'error' : ''}`}
                placeholder="e.g. Implement Redis distributed caching for session management..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                }}
                autoFocus
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            {/* Category & Assignee */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              {/* Category Select */}
              <div className="form-group">
                <label htmlFor="todo-category-select" className="form-label">
                  Engineering Domain
                </label>
                <select
                  id="todo-category-select"
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {DOMAIN_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee Select */}
              <div className="form-group">
                <label htmlFor="todo-user-select" className="form-label">
                  Assignee
                </label>
                <select
                  id="todo-user-select"
                  className="input-field"
                  value={userId}
                  onChange={(e) => setUserId(Number(e.target.value))}
                >
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority Selector */}
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                {[
                  { id: 'low', label: 'Low', color: 'var(--text-secondary)' },
                  { id: 'medium', label: 'Medium', color: 'var(--info-600)' },
                  { id: 'high', label: 'High', color: 'var(--warning-600)' },
                  { id: 'urgent', label: 'Urgent', color: 'var(--danger-600)' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`btn ${priority === p.id ? 'btn-secondary' : 'btn-ghost'}`}
                    style={{
                      padding: '0.4rem 0.2rem',
                      fontSize: '0.8rem',
                      borderColor: priority === p.id ? p.color : 'var(--border-subtle)',
                      color: priority === p.id ? p.color : 'var(--text-secondary)',
                      fontWeight: priority === p.id ? 700 : 500,
                    }}
                    onClick={() => setPriority(p.id)}
                  >
                    {p.id === 'urgent' && <Flame size={13} />}
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtasks & Checklist Builder */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckSquare size={14} color="var(--primary-600)" />
                  <span>Subtasks & Execution Checklist ({subtasks.filter((s) => s.completed).length}/{subtasks.length})</span>
                </label>
              </div>

              {/* Subtask Items List */}
              <div className="modal-subtasks-box">
                {subtasks.map((st) => (
                  <div key={st.id} className="modal-subtask-row">
                    <input
                      type="checkbox"
                      checked={Boolean(st.completed)}
                      onChange={() => handleToggleSubtaskItem(st.id)}
                      className="subtask-checkbox"
                    />
                    <span className={`subtask-title-text ${st.completed ? 'completed' : ''}`} style={{ flex: 1 }}>
                      {st.title}
                    </span>
                    <button
                      type="button"
                      className="subtask-delete-btn"
                      onClick={() => handleDeleteSubtaskItem(st.id)}
                      title="Remove subtask"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}

                {/* Subtask Input */}
                <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.45rem' }}>
                  <input
                    type="text"
                    placeholder="Add step or acceptance criteria (press Enter)..."
                    value={newSubtaskInput}
                    onChange={(e) => setNewSubtaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtaskItem();
                      }
                    }}
                    className="input-field"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAddSubtaskItem}
                    disabled={!newSubtaskInput.trim()}
                    style={{ padding: '0.45rem 0.75rem' }}
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Due Date & Initial Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              {/* Due Date Picker */}
              <div className="form-group">
                <label htmlFor="todo-due-date-input" className="form-label">
                  Target Due Date
                </label>
                <input
                  id="todo-due-date-input"
                  type="date"
                  className="input-field"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              {/* Status Toggle */}
              <div className="form-group">
                <label className="form-label">Status</label>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.1rem' }}>
                  <button
                    type="button"
                    id="status-pending-btn"
                    className={`btn ${!completed ? 'btn-secondary' : 'btn-ghost'}`}
                    style={{
                      flex: 1,
                      padding: '0.4rem 0.2rem',
                      fontSize: '0.75rem',
                      borderColor: !completed ? 'var(--warning-500)' : 'var(--border-subtle)',
                      background: !completed ? 'var(--warning-50)' : 'transparent',
                      color: !completed ? 'var(--warning-600)' : 'var(--text-secondary)',
                    }}
                    onClick={() => setCompleted(false)}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    id="status-completed-btn"
                    className={`btn ${completed ? 'btn-secondary' : 'btn-ghost'}`}
                    style={{
                      flex: 1,
                      padding: '0.4rem 0.2rem',
                      fontSize: '0.75rem',
                      borderColor: completed ? 'var(--success-500)' : 'var(--border-subtle)',
                      background: completed ? 'var(--success-50)' : 'transparent',
                      color: completed ? 'var(--success-600)' : 'var(--text-secondary)',
                    }}
                    onClick={() => setCompleted(true)}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              id="cancel-modal-btn"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-todo-btn"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>{isEditMode ? 'Save Changes' : 'Dispatch Task'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default TodoModal;
