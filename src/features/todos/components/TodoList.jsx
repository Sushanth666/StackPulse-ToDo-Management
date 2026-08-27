import React, { useState } from 'react';
import { CheckCheck, Clock, Trash2, X, CheckSquare, FileText } from 'lucide-react';
import { useTodos } from '../context/TodoContext';
import { exportToPDF } from '../../../shared/utils/exportUtils';
import { showGlobalToast } from '../../../shared/hooks/useToast';
import TodoCard from './TodoCard';
import TodoRow from './TodoRow';
import KanbanBoard from '../../kanban/KanbanBoard';
import SkeletonLoader from '../../../shared/components/ui/SkeletonLoader';
import EmptyState from '../../../shared/components/ui/EmptyState';
import Pagination from './Pagination';
import TodoModal from './TodoModal';
import ConfirmModal from './ConfirmModal';

export const TodoList = ({ onOpenNewModal, onOpenUserDrawer }) => {
  const {
    paginatedTodos,
    filteredTodos,
    todos,
    loading,
    error,
    viewMode,
    searchTerm,
    statusFilter,
    priorityFilter,
    userFilter,
    resetFilters,
    fetchTodos,
    selectedIds,
    selectAllFiltered,
    clearSelection,
    bulkToggleStatus,
    bulkDeleteTodos,
    deleteTodo,
    isLiveSync,
    toggleLiveSync,
  } = useTodos();

  // Edit Modal State
  const [editingTodo, setEditingTodo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete Confirm Modal State
  const [deletingTodo, setDeletingTodo] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (todo) => {
    setDeletingTodo(todo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmSingleDelete = async () => {
    if (!deletingTodo) return;
    setIsDeleting(true);
    try {
      await deleteTodo(deletingTodo.id);
      setIsDeleteModalOpen(false);
      setDeletingTodo(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportSelectedPDF = () => {
    const selectedTodosList = todos.filter((t) => selectedIds.has(t.id));
    exportToPDF(selectedTodosList, 'selected_tasks_report', 'StackPulse — Selected Deliverables Report');
    showGlobalToast({
      type: 'success',
      title: 'Selected Tasks Exported',
      message: `Exported ${selectedTodosList.length} selected deliverables to a PDF document.`,
    });
  };

  const handleConfirmBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await bulkDeleteTodos();
      setIsBulkDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // 0. REST API Disconnected State (when API button is OFF)
  if (!isLiveSync) {
    return (
      <EmptyState
        type="offline"
        title="REST API is Offline"
        description="The live REST API connection is turned OFF. Tasks and sprint deliverables data are hidden. Turn ON the API button in the top navbar to reconnect and display deliverables."
        onAction={toggleLiveSync}
        actionLabel="Turn ON REST API"
      />
    );
  }

  // 1. Loading State
  if (loading) {
    return <SkeletonLoader count={8} viewMode={viewMode === 'kanban' ? 'grid' : viewMode} />;
  }

  // 2. Error State
  if (error && todos.length === 0) {
    return (
      <EmptyState
        type="error"
        title="Could Not Connect to API"
        description="We couldn't fetch your tasks from JSONPlaceholder. Please ensure your internet connection is active and try again."
        errorDetails={error}
        onAction={() => fetchTodos(true)}
        actionLabel="Retry Connection"
      />
    );
  }

  // 3. Empty State (when no search results match)
  if (filteredTodos.length === 0) {
    const isFiltered =
      searchTerm.trim() !== '' ||
      statusFilter !== 'all' ||
      priorityFilter !== 'all' ||
      userFilter !== 'all';

    if (isFiltered) {
      return (
        <EmptyState
          type="no-results"
          title="No Matching Tasks"
          description={`No tasks match your current search keywords or filters. Try adjusting them.`}
          onAction={resetFilters}
          actionLabel="Clear All Filters"
        />
      );
    }

    return (
      <EmptyState
        type="empty"
        title="All Caught Up!"
        description="You have no tasks in your list. Click below to add a new task via REST API POST."
        onAction={onOpenNewModal}
        actionLabel="Create First Task"
      />
    );
  }

  const isAllSelected =
    paginatedTodos.length > 0 &&
    paginatedTodos.every((t) => selectedIds.has(t.id));

  return (
    <div className="todo-container">
      {/* Bulk Action Bar (Visible when 1 or more items are selected) */}
      {selectedIds.size > 0 && (
        <div className="bulk-bar">
          <div className="bulk-info">
            <CheckSquare size={18} />
            <span>{selectedIds.size} task(s) selected</span>
          </div>

          <div className="bulk-actions-btns">
            <button
              id="bulk-complete-btn"
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => bulkToggleStatus(true)}
              title="Mark selected tasks as completed"
            >
              <CheckCheck size={15} color="var(--success-600)" />
              <span>Mark Done</span>
            </button>

            <button
              id="bulk-pending-btn"
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => bulkToggleStatus(false)}
              title="Mark selected tasks as pending"
            >
              <Clock size={15} color="var(--warning-600)" />
              <span>Mark Active</span>
            </button>

            <button
              id="bulk-export-pdf-btn"
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={handleExportSelectedPDF}
              title="Export selected tasks to PDF report"
            >
              <FileText size={15} color="var(--danger-500)" />
              <span>Export PDF</span>
            </button>

            <button
              id="bulk-delete-btn"
              className="btn btn-danger"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => setIsBulkDeleteModalOpen(true)}
              title="Delete all selected tasks"
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>

            <button
              id="bulk-clear-btn"
              className="btn btn-ghost btn-icon"
              onClick={clearSelection}
              title="Deselect all"
              aria-label="Clear selection"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Select All on Page Toggle (for Grid & List views) */}
      {viewMode !== 'kanban' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
          }}
        >
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <input
              id="select-all-page-checkbox"
              type="checkbox"
              checked={isAllSelected}
              onChange={selectAllFiltered}
              style={{ accentColor: 'var(--primary-500)', cursor: 'pointer' }}
            />
            <span>Select all on page ({paginatedTodos.length})</span>
          </label>

          <span>
            Page Total: <strong>{paginatedTodos.length}</strong> / Filtered Total: <strong>{filteredTodos.length}</strong>
          </span>
        </div>
      )}

      {/* Render View: Kanban Board vs Grid vs List */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onOpenUserDrawer={onOpenUserDrawer}
        />
      ) : viewMode === 'grid' ? (
        <div className="todo-grid">
          {paginatedTodos.map((todo, idx) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              index={idx}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onOpenUserDrawer={onOpenUserDrawer}
            />
          ))}
        </div>
      ) : (
        <div className="todo-list">
          {paginatedTodos.map((todo, idx) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              index={idx}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onOpenUserDrawer={onOpenUserDrawer}
            />
          ))}
        </div>
      )}

      {/* Pagination Bar (not needed for full-screen Kanban) */}
      {viewMode !== 'kanban' && <Pagination />}

      {/* Edit Todo Modal */}
      <TodoModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTodo(null);
        }}
        todoToEdit={editingTodo}
      />

      {/* Single Delete Confirm Dialog */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTodo(null);
        }}
        onConfirm={handleConfirmSingleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete task #${deletingTodo?.id}: "${deletingTodo?.title}"? This will execute an HTTP DELETE call.`}
        confirmText="Delete Task"
        isLoading={isDeleting}
      />

      {/* Bulk Delete Confirm Dialog */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Selected Tasks"
        message={`Are you sure you want to delete all ${selectedIds.size} selected tasks? This action cannot be undone.`}
        confirmText={`Delete ${selectedIds.size} Tasks`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TodoList;
