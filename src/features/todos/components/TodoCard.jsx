import React, { useState } from 'react';
import {
  Check,
  Edit2,
  Trash2,
  User,
  Loader2,
  Calendar,
  Flame,
  Tag,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from 'lucide-react';
import { useTodos } from '../context/TodoContext';
import { getDueDateStatus } from '../../../shared/utils/dateUtils';

export const TodoCard = ({ todo, index = 0, onEdit, onDelete, onOpenUserDrawer }) => {
  const {
    toggleTodoStatus,
    selectedIds,
    toggleSelectTodo,
    actionLoadingId,
    setActiveUserDrawerId,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
  } = useTodos();

  const [isChecklistExpanded, setIsChecklistExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const isSelected = selectedIds.has(todo.id);
  const isActionLoading = actionLoadingId === todo.id;
  const dateStatus = getDueDateStatus(todo.dueDate, todo.completed);
  const userName = todo.assignedUser?.name || `User ${todo.userId}`;

  const subtasks = todo.subtasks || [];
  const completedSubtasksCount = subtasks.filter((st) => st.completed).length;
  const totalSubtasks = subtasks.length;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasksCount / totalSubtasks) * 100) : 0;

  const handleUserClick = (e) => {
    e.stopPropagation();
    if (onOpenUserDrawer) {
      onOpenUserDrawer(todo.userId);
    } else {
      setActiveUserDrawerId(todo.userId);
    }
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(todo.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  return (
    <div
      className={`todo-card ${todo.completed ? 'completed' : 'pending'} ${
        todo.priority === 'urgent' && !todo.completed ? 'priority-urgent' : ''
      } ${isSelected ? 'selected' : ''}`}
      style={{ animationDelay: `${Math.min((index % 24) * 0.025, 0.4)}s` }}
    >
      {/* Header Badges & Bulk Select */}
      <div className="todo-card-header">
        <div className="todo-badges">
          <span className="badge badge-id">#{todo.id}</span>

          {/* Category Tag */}
          {todo.category && (
            <span
              className="badge"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--primary-600)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Tag size={10} />
              {todo.category}
            </span>
          )}

          {/* Priority Badge */}
          {todo.priority && (
            <span className={`badge badge-priority-${todo.priority}`}>
              {todo.priority === 'urgent' && <Flame size={11} />}
              {todo.priority}
            </span>
          )}

          {/* Status Badge */}
          <span className={`badge ${todo.completed ? 'badge-completed' : 'badge-pending'}`}>
            {todo.completed ? 'Completed' : 'Pending'}
          </span>
        </div>

        {/* Checkbox for Bulk Selection */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelectTodo(todo.id)}
          aria-label={`Select task #${todo.id}`}
          style={{ cursor: 'pointer', accentColor: 'var(--primary-500)', width: '16px', height: '16px' }}
        />
      </div>

      {/* Main Card Content */}
      <div className="todo-card-body">
        {/* Toggle Status Checkbox */}
        <button
          className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={() => toggleTodoStatus(todo.id)}
          disabled={isActionLoading}
          aria-label={todo.completed ? 'Mark pending' : 'Mark completed'}
          title={todo.completed ? 'Click to mark as pending' : 'Click to mark as completed'}
        >
          {isActionLoading ? (
            <Loader2 size={14} className="animate-spin" color="var(--primary-500)" />
          ) : (
            todo.completed && <Check size={14} strokeWidth={3} />
          )}
        </button>

        {/* Title */}
        <p className={`todo-title ${todo.completed ? 'completed' : ''}`}>
          {todo.title}
        </p>
      </div>

      {/* Interactive Subtask Section */}
      {totalSubtasks > 0 && (
        <div className="card-subtasks-container">
          {/* Subtask Progress Header Bar */}
          <div
            className="subtask-progress-header"
            onClick={() => setIsChecklistExpanded(!isChecklistExpanded)}
            title="Click to expand/collapse subtasks checklist"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <CheckSquare size={13} color="var(--primary-600)" />
              <span className="subtask-count-text">
                {completedSubtasksCount}/{totalSubtasks} Subtasks ({subtaskProgress}%)
              </span>
            </div>
            <button className="subtask-chevron-btn" type="button" aria-label="Toggle subtasks">
              {isChecklistExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Micro Progress Bar */}
          <div className="subtask-progress-track">
            <div
              className="subtask-progress-fill"
              style={{
                width: `${subtaskProgress}%`,
                background:
                  subtaskProgress === 100
                    ? 'var(--success-500)'
                    : 'var(--primary-gradient)',
              }}
            />
          </div>

          {/* Collapsible Inline Checklist */}
          {isChecklistExpanded && (
            <div className="card-checklist-body">
              <div className="subtask-list">
                {subtasks.map((st) => (
                  <div key={st.id} className={`subtask-item ${st.completed ? 'completed' : ''}`}>
                    <label className="subtask-label">
                      <input
                        type="checkbox"
                        checked={Boolean(st.completed)}
                        onChange={() => toggleSubtask(todo.id, st.id)}
                        className="subtask-checkbox"
                      />
                      <span className="subtask-title-text">{st.title}</span>
                    </label>
                    <button
                      className="subtask-delete-btn"
                      onClick={() => deleteSubtask(todo.id, st.id)}
                      title="Delete subtask"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Quick Add Subtask Input */}
              <form onSubmit={handleAddSubtask} className="subtask-add-form">
                <input
                  type="text"
                  placeholder="+ Add subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="subtask-add-input"
                />
                {newSubtaskTitle.trim() && (
                  <button type="submit" className="subtask-add-btn" title="Add subtask">
                    <Plus size={13} />
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      )}

      {/* Footer: User Avatar & Actions & Due Date */}
      <div className="todo-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Clickable Assigned User Badge */}
          <button
            className="badge badge-user"
            onClick={handleUserClick}
            title={`View ${userName}'s profile and tasks`}
            style={{ border: 'none' }}
          >
            <User size={11} />
            <span>{userName}</span>
          </button>

          {todo.dueDate && (
            <span className={`badge badge-date-${dateStatus.status}`} style={{ fontSize: '0.7rem' }}>
              <Calendar size={11} />
              {dateStatus.label}
            </span>
          )}
        </div>

        <div className="card-actions">
          <button
            className="action-btn"
            onClick={() => onEdit(todo)}
            title="Edit Task"
            aria-label={`Edit task #${todo.id}`}
          >
            <Edit2 size={15} />
          </button>

          <button
            className="action-btn delete"
            onClick={() => onDelete(todo)}
            title="Delete Task"
            aria-label={`Delete task #${todo.id}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
