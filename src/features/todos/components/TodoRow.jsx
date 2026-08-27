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
} from 'lucide-react';
import { useTodos } from '../context/TodoContext';
import { getDueDateStatus } from '../../../shared/utils/dateUtils';

export const TodoRow = ({ todo, index = 0, onEdit, onDelete, onOpenUserDrawer }) => {
  const {
    toggleTodoStatus,
    selectedIds,
    toggleSelectTodo,
    actionLoadingId,
    setActiveUserDrawerId,
    toggleSubtask,
  } = useTodos();

  const [showSubtasks, setShowSubtasks] = useState(false);

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

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column' }}
      className={`todo-row-wrapper ${isSelected ? 'selected' : ''}`}
    >
      <div
        className={`todo-row ${todo.completed ? 'completed' : 'pending'} ${
          todo.priority === 'urgent' && !todo.completed ? 'priority-urgent' : ''
        }`}
        style={{ animationDelay: `${Math.min((index % 24) * 0.02, 0.35)}s` }}
      >
        <div className="row-left">
          {/* Bulk Selection */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelectTodo(todo.id)}
            aria-label={`Select task #${todo.id}`}
            style={{ cursor: 'pointer', accentColor: 'var(--primary-500)', width: '16px', height: '16px' }}
          />

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

          {/* ID */}
          <span className="badge badge-id" style={{ minWidth: '42px', justifyContent: 'center' }}>
            #{todo.id}
          </span>

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

          {/* Title */}
          <p className={`todo-title ${todo.completed ? 'completed' : ''}`} style={{ flex: 1 }}>
            {todo.title}
          </p>
        </div>

        <div className="row-right">
          {/* Subtask Mini Tag */}
          {totalSubtasks > 0 && (
            <button
              className="badge"
              onClick={() => setShowSubtasks(!showSubtasks)}
              title="Click to view/toggle subtasks"
              style={{
                background:
                  subtaskProgress === 100
                    ? 'var(--success-50)'
                    : 'var(--bg-tertiary)',
                color:
                  subtaskProgress === 100
                    ? 'var(--success-600)'
                    : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              <CheckSquare size={11} color="var(--primary-600)" />
              <span>
                {completedSubtasksCount}/{totalSubtasks} ({subtaskProgress}%)
              </span>
              {showSubtasks ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}

          {/* Priority Badge */}
          {todo.priority && (
            <span className={`badge badge-priority-${todo.priority}`}>
              {todo.priority === 'urgent' && <Flame size={11} />}
              {todo.priority}
            </span>
          )}

          {/* Due Date Badge */}
          {todo.dueDate && (
            <span className={`badge badge-date-${dateStatus.status}`}>
              <Calendar size={11} />
              {dateStatus.label}
            </span>
          )}

          {/* User Badge */}
          <button
            className="badge badge-user"
            onClick={handleUserClick}
            title={`View ${userName}'s profile`}
            style={{ border: 'none' }}
          >
            <User size={12} />
            <span>{userName}</span>
          </button>

          {/* Status Badge */}
          <span className={`badge ${todo.completed ? 'badge-completed' : 'badge-pending'}`}>
            {todo.completed ? 'Completed' : 'Pending'}
          </span>

          {/* Actions */}
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

      {/* Row Inline Subtasks Dropdown */}
      {showSubtasks && totalSubtasks > 0 && (
        <div className="row-subtasks-panel">
          <div className="subtask-list" style={{ gap: '0.35rem' }}>
            {subtasks.map((st) => (
              <label
                key={st.id}
                className="subtask-label"
                style={{ fontSize: '0.8rem', padding: '0.2rem 0' }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(st.completed)}
                  onChange={() => toggleSubtask(todo.id, st.id)}
                  className="subtask-checkbox"
                />
                <span className={`subtask-title-text ${st.completed ? 'completed' : ''}`}>
                  {st.title}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoRow;
