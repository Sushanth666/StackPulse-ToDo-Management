import React, { useState } from 'react';
import { Check, Edit2, Trash2, User, Calendar, Flame, Tag, CheckSquare } from 'lucide-react';
import { getDueDateStatus } from '../../shared/utils/dateUtils';
import { useTodos } from '../../features/todos/context/TodoContext';

export const KanbanColumn = ({
  columnId,
  title,
  icon,
  todos,
  onDropTask,
  onEdit,
  onDelete,
  onOpenUserDrawer,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { toggleTodoStatus } = useTodos();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const todoId = e.dataTransfer.getData('text/plain');
    if (todoId) {
      onDropTask(Number(todoId), columnId);
    }
  };

  return (
    <div
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="kanban-col-header">
        <div className="kanban-col-title">
          {icon}
          <span>{title}</span>
        </div>
        <span className="kanban-col-count">{todos.length}</span>
      </div>

      {/* Cards Container */}
      <div className="kanban-cards-container">
        {todos.length === 0 ? (
          <div className="kanban-empty-drop">Drop tasks here</div>
        ) : (
          todos.map((todo) => {
            const dateStatus = getDueDateStatus(todo.dueDate, todo.completed);
            const userName = todo.assignedUser?.name || `User ${todo.userId}`;
            const subtasks = todo.subtasks || [];
            const completedStCount = subtasks.filter((st) => st.completed).length;
            const totalSt = subtasks.length;
            const subtaskProgress = totalSt > 0 ? Math.round((completedStCount / totalSt) * 100) : 0;

            return (
              <div
                key={todo.id}
                className="kanban-card"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', String(todo.id));
                }}
              >
                {/* Header Badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-id">#{todo.id}</span>

                    {todo.category && (
                      <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--primary-600)', fontSize: '0.65rem' }}>
                        <Tag size={9} />
                        {todo.category}
                      </span>
                    )}

                    {todo.priority && (
                      <span className={`badge badge-priority-${todo.priority}`}>
                        {todo.priority === 'urgent' && <Flame size={11} />}
                        {todo.priority}
                      </span>
                    )}
                  </div>

                  <div className="card-actions">
                    <button
                      className="action-btn"
                      style={{ padding: '0.25rem' }}
                      onClick={() => onEdit(todo)}
                      title="Edit task"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      className="action-btn delete"
                      style={{ padding: '0.25rem' }}
                      onClick={() => onDelete(todo)}
                      title="Delete task"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <button
                    className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
                    style={{ width: 18, height: 18, marginTop: '2px' }}
                    onClick={() => toggleTodoStatus(todo.id)}
                    title="Toggle completion"
                  >
                    {todo.completed && <Check size={12} strokeWidth={3} />}
                  </button>
                  <p
                    className={`todo-title ${todo.completed ? 'completed' : ''}`}
                    style={{ fontSize: '0.875rem' }}
                  >
                    {todo.title}
                  </p>
                </div>

                {/* Subtask Mini Progress Bar in Kanban Card */}
                {totalSt > 0 && (
                  <div style={{ marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.675rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                        <CheckSquare size={11} color="var(--primary-600)" />
                        {completedStCount}/{totalSt} Subtasks
                      </span>
                      <span>{subtaskProgress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${subtaskProgress}%`,
                          background: subtaskProgress === 100 ? 'var(--success-500)' : 'var(--primary-gradient)',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer: User & Due Date & Quick Move */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)', flexWrap: 'wrap', gap: '0.4rem', paddingTop: '0.45rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      className="badge badge-user"
                      onClick={() => onOpenUserDrawer(todo.userId)}
                      title="View user details"
                      style={{ border: 'none', padding: '0.15rem 0.45rem', fontSize: '0.7rem' }}
                    >
                      <User size={10} />
                      {userName}
                    </button>

                    {todo.dueDate && (
                      <span className={`badge badge-date-${dateStatus.status}`} style={{ fontSize: '0.65rem' }}>
                        <Calendar size={10} />
                        {dateStatus.label}
                      </span>
                    )}
                  </div>

                  {/* Quick move selector */}
                  <select
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '0.725rem',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                    value={columnId}
                    onChange={(e) => onDropTask(todo.id, e.target.value)}
                    title="Move column"
                  >
                    <option value="todo" disabled={columnId === 'todo'}>
                      Move: To Do
                    </option>
                    <option value="in-progress" disabled={columnId === 'in-progress'}>
                      Move: In Progress
                    </option>
                    <option value="completed" disabled={columnId === 'completed'}>
                      Move: Completed
                    </option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
