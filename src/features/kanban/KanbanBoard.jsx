import React from 'react';
import { ListTodo, PlayCircle, CheckCircle2 } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import { useTodos } from '../../features/todos/context/TodoContext';

export const KanbanBoard = ({ onEdit, onDelete, onOpenUserDrawer }) => {
  const { filteredTodos, updateTodo } = useTodos();

  const handleDropTask = async (todoId, targetColumn) => {
    const todo = filteredTodos.find((t) => t.id === todoId);
    if (!todo) return;

    if (targetColumn === 'completed') {
      if (!todo.completed) {
        await updateTodo(todoId, { completed: true }, true);
      }
    } else if (targetColumn === 'in-progress') {
      await updateTodo(todoId, { completed: false, priority: 'high' }, true);
    } else if (targetColumn === 'todo') {
      await updateTodo(todoId, { completed: false, priority: 'medium' }, true);
    }
  };

  const todoTasks = filteredTodos.filter(
    (t) => !t.completed && (t.priority === 'low' || t.priority === 'medium' || !t.priority)
  );

  const inProgressTasks = filteredTodos.filter(
    (t) => !t.completed && (t.priority === 'high' || t.priority === 'urgent')
  );

  const completedTasks = filteredTodos.filter((t) => t.completed);

  return (
    <div className="kanban-board">
      {/* Column 1: Backlog / To Do */}
      <KanbanColumn
        columnId="todo"
        title="To Do / Backlog"
        icon={<ListTodo size={18} color="var(--primary-600)" />}
        todos={todoTasks}
        onDropTask={handleDropTask}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpenUserDrawer={onOpenUserDrawer}
      />

      {/* Column 2: In Progress / High Priority */}
      <KanbanColumn
        columnId="in-progress"
        title="In Progress / High Priority"
        icon={<PlayCircle size={18} color="var(--warning-600)" />}
        todos={inProgressTasks}
        onDropTask={handleDropTask}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpenUserDrawer={onOpenUserDrawer}
      />

      {/* Column 3: Completed */}
      <KanbanColumn
        columnId="completed"
        title="Completed"
        icon={<CheckCircle2 size={18} color="var(--success-600)" />}
        todos={completedTasks}
        onDropTask={handleDropTask}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpenUserDrawer={onOpenUserDrawer}
      />
    </div>
  );
};

export default KanbanBoard;
