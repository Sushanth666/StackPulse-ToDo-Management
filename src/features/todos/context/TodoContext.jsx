import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import todoService from '../../../shared/services/todoService';
import { showGlobalToast } from '../../../shared/hooks/useToast';
import { getProfessionalTodo, TEAM_MEMBERS, getUserProfile } from '../../../shared/utils/professionalData';
import { getTodayDateString } from '../../../shared/utils/dateUtils';
import confetti from 'canvas-confetti';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Filter & Search & Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'pending'
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all' | 'urgent' | 'high' | 'medium' | 'low'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'Backend' | 'Frontend' | etc.
  const [userFilter, setUserFilter] = useState('all'); // 'all' | 1..10
  const [sortBy, setSortBy] = useState('id-desc');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('stackpulse_view') || localStorage.getItem('taskflow_view') || 'grid');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    try {
      const saved = localStorage.getItem('stackpulse_per_page') || localStorage.getItem('taskflow_per_page');
      return saved ? Number(saved) : 24;
    } catch {
      return 24;
    }
  });

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Live API / Offline Mode (PulseSync)
  const [isLiveSync, setIsLiveSync] = useState(() => {
    try {
      const saved = localStorage.getItem('stackpulse_pulsesync');
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  const toggleLiveSync = useCallback(() => {
    setIsLiveSync((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('stackpulse_pulsesync', String(next));
      } catch (e) {
        console.warn('Failed to save PulseSync state:', e);
      }

      showGlobalToast({
        type: next ? 'success' : 'info',
        title: next ? 'PulseSync: LIVE REST API' : 'PulseSync: Offline Sandbox',
        message: next
          ? 'Live two-way synchronization with JSONPlaceholder REST endpoints enabled.'
          : 'Offline Sandbox mode active. Operations run instantly with local caching.',
      });

      return next;
    });
  }, []);

  // Drawers & Modals State
  const [activeUserDrawerId, setActiveUserDrawerId] = useState(null);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  // Activity Log State & Synchronous Ref
  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('stackpulse_activities') || localStorage.getItem('taskflow_activities');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const activitiesRef = useRef(activities);
  useEffect(() => {
    activitiesRef.current = activities;
    try {
      localStorage.setItem('stackpulse_activities', JSON.stringify(activities.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to save activities to localStorage:', e);
    }
  }, [activities]);

  // Synchronous logActivity helper
  const logActivity = useCallback((type, title, description, details = {}) => {
    const newActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type, // 'create' | 'update' | 'delete' | 'toggle' | 'bulk_toggle' | 'bulk_delete'
      title,
      description,
      timestamp: new Date().toISOString(),
      details,
      canUndo: details.canUndo !== false,
      undone: false,
    };

    setActivities((prev) => {
      const next = [newActivity, ...prev.slice(0, 49)];
      activitiesRef.current = next;
      return next;
    });

    return newActivity;
  }, []);

  // Save view mode & pagination preferences
  useEffect(() => {
    try {
      localStorage.setItem('stackpulse_view', viewMode);
    } catch (e) {
      console.warn('Failed to save view mode:', e);
    }
  }, [viewMode]);

  useEffect(() => {
    try {
      localStorage.setItem('stackpulse_per_page', itemsPerPage);
    } catch (e) {
      console.warn('Failed to save per page setting:', e);
    }
  }, [itemsPerPage]);

  // Direct Restore Helper for Deleted Tasks
  const restoreDeletedTodo = useCallback((deletedItem, actId = null) => {
    if (!deletedItem) return;
    setTodos((prev) => {
      if (prev.some((t) => t.id === deletedItem.id)) return prev;
      return [deletedItem, ...prev];
    });

    if (actId) {
      setActivities((prev) => {
        const next = prev.map((a) => (a.id === actId ? { ...a, canUndo: false, undone: true } : a));
        activitiesRef.current = next;
        return next;
      });
    }

    showGlobalToast({
      type: 'success',
      title: 'Task Restored',
      message: `Restored task #${deletedItem.id} ("${deletedItem.title.substring(0, 32)}...").`,
    });
  }, []);

  // Direct Revert Helper for Status Toggles
  const revertStatusToggle = useCallback((todoId, previousCompleted, actId = null) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === todoId ? { ...t, completed: previousCompleted } : t))
    );

    if (actId) {
      setActivities((prev) => {
        const next = prev.map((a) => (a.id === actId ? { ...a, canUndo: false, undone: true } : a));
        activitiesRef.current = next;
        return next;
      });
    }

    showGlobalToast({
      type: 'info',
      title: 'Status Reverted',
      message: `Task #${todoId} marked as ${previousCompleted ? 'Done' : 'Active'}.`,
    });
  }, []);

  // Direct Revert Helper for Updates
  const revertTodoUpdate = useCallback((previousTodo, actId = null) => {
    if (!previousTodo) return;
    setTodos((prev) => prev.map((t) => (t.id === previousTodo.id ? previousTodo : t)));

    if (actId) {
      setActivities((prev) => {
        const next = prev.map((a) => (a.id === actId ? { ...a, canUndo: false, undone: true } : a));
        activitiesRef.current = next;
        return next;
      });
    }

    showGlobalToast({
      type: 'success',
      title: 'Edits Reverted',
      message: `Reverted changes on task #${previousTodo.id}.`,
    });
  }, []);

  // Direct Revert Helper for Task Creation
  const revertTodoCreation = useCallback((createdId, actId = null) => {
    setTodos((prev) => prev.filter((t) => t.id !== createdId));

    if (actId) {
      setActivities((prev) => {
        const next = prev.map((a) => (a.id === actId ? { ...a, canUndo: false, undone: true } : a));
        activitiesRef.current = next;
        return next;
      });
    }

    showGlobalToast({
      type: 'info',
      title: 'Task Creation Reverted',
      message: `Removed created task #${createdId}.`,
    });
  }, []);

  // 1-Click Undo Engine using Synchronous Ref
  const undoActivity = useCallback((activityId) => {
    const list = activitiesRef.current || [];
    const act = list.find((a) => a.id === activityId);

    if (!act || !act.canUndo) {
      showGlobalToast({
        type: 'warning',
        title: 'Cannot Undo',
        message: 'This action cannot be undone or was already reverted.',
      });
      return false;
    }

    const { type, details } = act;

    if (type === 'delete' && details.deletedTodo) {
      restoreDeletedTodo(details.deletedTodo, activityId);
      return true;
    }

    if (type === 'create' && details.createdId) {
      revertTodoCreation(details.createdId, activityId);
      return true;
    }

    if (type === 'toggle' && details.todoId) {
      revertStatusToggle(details.todoId, details.previousCompleted, activityId);
      return true;
    }

    if (type === 'update' && details.previousTodo) {
      revertTodoUpdate(details.previousTodo, activityId);
      return true;
    }

    if (type === 'bulk_delete' && details.deletedTodos) {
      const restoredList = details.deletedTodos;
      setTodos((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const toAdd = restoredList.filter((t) => !existingIds.has(t.id));
        return [...toAdd, ...prev];
      });
      setActivities((prev) => {
        const next = prev.map((a) => (a.id === activityId ? { ...a, canUndo: false, undone: true } : a));
        activitiesRef.current = next;
        return next;
      });
      showGlobalToast({
        type: 'success',
        title: 'Bulk Delete Reverted',
        message: `Restored ${restoredList.length} tasks to workspace.`,
      });
      return true;
    }

    if (type === 'bulk_toggle' && details.previousStates) {
      const stateMap = details.previousStates;
      setTodos((prev) =>
        prev.map((t) => (t.id in stateMap ? { ...t, completed: stateMap[t.id] } : t))
      );
      setActivities((prev) => {
        const next = prev.map((a) => (a.id === activityId ? { ...a, canUndo: false, undone: true } : a));
        activitiesRef.current = next;
        return next;
      });
      showGlobalToast({
        type: 'info',
        title: 'Bulk Status Reverted',
        message: `Reverted statuses for ${Object.keys(stateMap).length} tasks.`,
      });
      return true;
    }

    return false;
  }, [restoreDeletedTodo, revertTodoCreation, revertStatusToggle, revertTodoUpdate]);

  // Undo the most recent action
  const undoLastAction = useCallback(() => {
    const list = activitiesRef.current || [];
    const lastUndoable = list.find((a) => a.canUndo && !a.undone);
    if (lastUndoable) {
      return undoActivity(lastUndoable.id);
    }
    showGlobalToast({
      type: 'info',
      title: 'Nothing to Undo',
      message: 'No recent actions available in history to undo.',
    });
    return false;
  }, [undoActivity]);

  // Clear Activity Log
  const clearActivities = useCallback(() => {
    setActivities([]);
    activitiesRef.current = [];
    try {
      localStorage.removeItem('stackpulse_activities');
      localStorage.removeItem('taskflow_activities');
    } catch {}
    showGlobalToast({
      type: 'info',
      title: 'Audit Log Cleared',
      message: 'Activity history has been reset.',
    });
  }, []);

  // Fetch all Todos from JSONPlaceholder
  const fetchTodos = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const rawData = await todoService.getTodos();
      const rawItems = Array.isArray(rawData) ? rawData : [];
      
      const professionalItems = rawItems.map((item) => getProfessionalTodo(item));

      setTodos(professionalItems);
      setLastUpdated(new Date());
      setSelectedIds(new Set());

      if (isManualRefresh) {
        logActivity('sync', 'Workspace Synchronized', `Refreshed ${professionalItems.length} tasks from REST API.`, { canUndo: false });
        showGlobalToast({
          type: 'success',
          title: 'Workspace Refreshed',
          message: `Synchronized ${professionalItems.length} enterprise tasks from REST API.`,
        });
      }
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      const msg = err.message || 'Failed to load tasks from API.';
      setError(msg);
      showGlobalToast({
        type: 'error',
        title: 'API Sync Error',
        message: msg,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [logActivity]);

  // Initial Load
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Create Todo (POST /todos)
  const addTodo = async (todoData) => {
    setActionLoadingId('new');
    try {
      const createdItem = await todoService.createTodo(todoData);
      
      const highestId = todos.reduce((max, t) => Math.max(max, Number(t.id) || 0), 0);
      const uniqueId = Math.max(highestId + 1, createdItem.id || 201);
      const assignedUser = getUserProfile(Number(todoData.userId) || 1);
      
      const newTodo = {
        ...createdItem,
        id: uniqueId,
        title: todoData.title?.trim(),
        priority: todoData.priority || 'medium',
        category: todoData.category || 'Backend',
        dueDate: todoData.dueDate || getTodayDateString(3),
        userId: Number(todoData.userId) || 1,
        assignedUser,
        completed: Boolean(todoData.completed),
        createdAt: new Date().toISOString(),
      };

      setTodos((prev) => [newTodo, ...prev]);
      setCurrentPage(1);

      // Log into audit trail
      const act = logActivity(
        'create',
        `Created Task #${newTodo.id}`,
        `Assigned to ${assignedUser.name} [${newTodo.priority.toUpperCase()} | ${newTodo.category}]`,
        { createdId: newTodo.id, taskData: newTodo }
      );
      
      showGlobalToast({
        type: 'success',
        title: 'Task Created (POST 201)',
        message: `Task #${newTodo.id} assigned to ${assignedUser.name} [${newTodo.priority.toUpperCase()}].`,
        action: {
          label: 'Undo Create',
          onClick: () => revertTodoCreation(newTodo.id, act.id),
        },
      });

      return { success: true, data: newTodo };
    } catch (err) {
      const msg = err.message || 'Failed to create task.';
      showGlobalToast({
        type: 'error',
        title: 'Creation Failed',
        message: msg,
      });
      return { success: false, error: msg };
    } finally {
      setActionLoadingId(null);
    }
  };

  // Update Todo (PUT/PATCH /todos/:id)
  const updateTodo = async (id, updates, isPartial = true) => {
    setActionLoadingId(id);
    const prevTodo = todos.find((t) => t.id === id);
    if (!prevTodo) {
      setActionLoadingId(null);
      return { success: false, error: 'Todo not found' };
    }

    const assignedUser = updates.userId ? getUserProfile(updates.userId) : prevTodo.assignedUser;
    const updatedPayload = { ...prevTodo, ...updates, assignedUser };

    // Optimistic Update
    setTodos((prev) => prev.map((t) => (t.id === id ? updatedPayload : t)));

    try {
      const responseData = await todoService.updateTodo(id, updates, isPartial);
      const finalItem = { ...updatedPayload, ...responseData, assignedUser };
      
      setTodos((prev) => prev.map((t) => (t.id === id ? finalItem : t)));

      // Log into audit trail
      const act = logActivity(
        'update',
        `Updated Task #${id}`,
        `Modified task properties.`,
        { previousTodo: prevTodo, updatedTodo: finalItem }
      );

      showGlobalToast({
        type: 'success',
        title: 'Task Updated (PATCH 200)',
        message: `Task #${id} was updated successfully.`,
        action: {
          label: 'Undo Edit',
          onClick: () => revertTodoUpdate(prevTodo, act.id),
        },
      });

      return { success: true, data: finalItem };
    } catch (err) {
      setTodos((prev) => prev.map((t) => (t.id === id ? prevTodo : t)));
      const msg = err.message || 'Failed to update task.';
      showGlobalToast({
        type: 'error',
        title: 'Update Failed',
        message: msg,
      });
      return { success: false, error: msg };
    } finally {
      setActionLoadingId(null);
    }
  };

  // Fast Status Toggle
  const toggleTodoStatus = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newCompleted = !todo.completed;
    const prevCompleted = todo.completed;
    setActionLoadingId(id);

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );

    if (newCompleted) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
      });
    }

    // Log into audit trail
    const act = logActivity(
      'toggle',
      newCompleted ? `Completed Task #${id}` : `Reopened Task #${id}`,
      `"${todo.title.substring(0, 40)}..." marked as ${newCompleted ? 'Done' : 'Active'}.`,
      { todoId: id, previousCompleted: prevCompleted, newCompleted }
    );

    try {
      await todoService.updateTodo(id, { completed: newCompleted }, true);
      showGlobalToast({
        type: 'info',
        title: newCompleted ? 'Task Completed' : 'Task In Progress',
        message: `"${todo.title.substring(0, 35)}..." marked as ${newCompleted ? 'Done' : 'Active'}.`,
        duration: 3800,
        action: {
          label: 'Undo',
          onClick: () => revertStatusToggle(id, prevCompleted, act.id),
        },
      });
    } catch (err) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !newCompleted } : t))
      );
      showGlobalToast({
        type: 'error',
        title: 'Status Update Failed',
        message: err.message || 'Could not update task status.',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Todo
  const deleteTodo = async (id) => {
    const todoToDelete = todos.find((t) => t.id === id);
    if (!todoToDelete) return { success: false };

    setActionLoadingId(id);

    // Optimistically remove from state
    setTodos((prev) => prev.filter((t) => t.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    // Log into audit trail
    const act = logActivity(
      'delete',
      `Deleted Task #${id}`,
      `"${todoToDelete.title.substring(0, 40)}..." removed from workspace.`,
      { deletedTodo: todoToDelete }
    );

    try {
      await todoService.deleteTodo(id);
      showGlobalToast({
        type: 'success',
        title: 'Task Deleted (DELETE 200)',
        message: `Task #${id} removed from workspace.`,
        duration: 5000,
        action: {
          label: 'Undo Delete',
          onClick: () => restoreDeletedTodo(todoToDelete, act.id),
        },
      });
      return { success: true };
    } catch (err) {
      setTodos((prev) => [todoToDelete, ...prev]);
      const msg = err.message || 'Failed to delete task.';
      showGlobalToast({
        type: 'error',
        title: 'Delete Failed',
        message: msg,
      });
      return { success: false, error: msg };
    } finally {
      setActionLoadingId(null);
    }
  };

  // Bulk Status Toggle
  const bulkToggleStatus = async (markAsCompleted) => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);

    const previousStates = {};
    todos.forEach((t) => {
      if (selectedIds.has(t.id)) {
        previousStates[t.id] = t.completed;
      }
    });

    setTodos((prev) =>
      prev.map((t) => (selectedIds.has(t.id) ? { ...t, completed: markAsCompleted } : t))
    );

    const act = logActivity(
      'bulk_toggle',
      `Bulk Status Update (${ids.length} tasks)`,
      `Marked ${ids.length} deliverables as ${markAsCompleted ? 'Completed' : 'Active'}.`,
      { previousStates, newStatus: markAsCompleted }
    );

    showGlobalToast({
      type: 'info',
      title: 'Bulk Update',
      message: `Updated ${ids.length} tasks to ${markAsCompleted ? 'Completed' : 'Active'}.`,
      action: {
        label: 'Undo Bulk',
        onClick: () => undoActivity(act.id),
      },
    });

    setSelectedIds(new Set());
  };

  // Bulk Delete
  const bulkDeleteTodos = async () => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    const deletedTodos = todos.filter((t) => selectedIds.has(t.id));
    
    setTodos((prev) => prev.filter((t) => !selectedIds.has(t.id)));
    setSelectedIds(new Set());

    const act = logActivity(
      'bulk_delete',
      `Bulk Deleted ${count} Tasks`,
      `Removed ${count} tasks from workspace.`,
      { deletedTodos }
    );

    showGlobalToast({
      type: 'success',
      title: 'Bulk Delete',
      message: `Deleted ${count} tasks.`,
      action: {
        label: 'Undo Bulk Delete',
        onClick: () => undoActivity(act.id),
      },
    });
  };

  // Subtask Management Engine
  const toggleSubtask = useCallback((todoId, subtaskId) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== todoId) return t;
        const currentSubtasks = t.subtasks || [];
        const nextSubtasks = currentSubtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const targetSt = currentSubtasks.find((st) => st.id === subtaskId);
        const newCompleted = targetSt ? !targetSt.completed : false;

        const allCompleted = nextSubtasks.length > 0 && nextSubtasks.every((st) => st.completed);

        logActivity(
          'update',
          `Subtask ${newCompleted ? 'Completed' : 'Reopened'}`,
          `"${targetSt?.title || 'Subtask'}" on Task #${todoId}`,
          { todoId, subtaskId }
        );

        return {
          ...t,
          subtasks: nextSubtasks,
          completed: allCompleted ? true : t.completed,
        };
      })
    );
  }, [logActivity]);

  const addSubtask = useCallback((todoId, subtaskTitle) => {
    if (!subtaskTitle || !subtaskTitle.trim()) return;
    const title = subtaskTitle.trim();
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== todoId) return t;
        const currentSubtasks = t.subtasks || [];
        const newSt = {
          id: `st-${todoId}-${Date.now()}`,
          title: title,
          completed: false,
        };
        const nextSubtasks = [...currentSubtasks, newSt];
        logActivity(
          'update',
          `Added Subtask on Task #${todoId}`,
          `"${title}"`,
          { todoId, addedSubtaskId: newSt.id }
        );
        return { ...t, subtasks: nextSubtasks, completed: false };
      })
    );
  }, [logActivity]);

  const deleteSubtask = useCallback((todoId, subtaskId) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== todoId) return t;
        const currentSubtasks = t.subtasks || [];
        const nextSubtasks = currentSubtasks.filter((st) => st.id !== subtaskId);
        return { ...t, subtasks: nextSubtasks };
      })
    );
  }, []);

  // Selection handlers
  const toggleSelectTodo = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAllFiltered = () => {
    if (selectedIds.size === paginatedTodos.length && paginatedTodos.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedTodos.map((t) => t.id)));
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setUserFilter('all');
    setSortBy('id-desc');
    setCurrentPage(1);
  };

  const priorityWeight = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  // Filter and Sort calculation
  const filteredTodos = useMemo(() => {
    // If API button is OFF, do not show the data
    if (!isLiveSync) {
      return [];
    }

    let result = [...todos];

    // Search query filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter((todo) => {
        const titleMatch = todo.title?.toLowerCase().includes(query);
        const idMatch = String(todo.id) === query || String(todo.id).includes(query);
        const userMatch = todo.assignedUser?.name?.toLowerCase().includes(query);
        const catMatch = todo.category?.toLowerCase().includes(query);
        return titleMatch || idMatch || userMatch || catMatch;
      });
    }

    // Status filter
    if (statusFilter === 'completed') {
      result = result.filter((todo) => todo.completed === true);
    } else if (statusFilter === 'pending') {
      result = result.filter((todo) => todo.completed === false);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((todo) => todo.priority === priorityFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((todo) => todo.category === categoryFilter);
    }

    // User ID filter
    if (userFilter !== 'all') {
      const uid = Number(userFilter);
      result = result.filter((todo) => todo.userId === uid);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'id-desc':
          return Number(b.id) - Number(a.id);
        case 'id-asc':
          return Number(a.id) - Number(b.id);
        case 'priority-desc':
          return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        case 'priority-asc':
          return (priorityWeight[a.priority] || 0) - (priorityWeight[b.priority] || 0);
        case 'dueDate-asc':
          return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
        case 'dueDate-desc':
          return (b.dueDate || '0000').localeCompare(a.dueDate || '0000');
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'status-pending':
          return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
        case 'status-completed':
          return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
        default:
          return Number(b.id) - Number(a.id);
      }
    });

    return result;
  }, [todos, searchTerm, statusFilter, priorityFilter, categoryFilter, userFilter, sortBy, isLiveSync]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const paginatedTodos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTodos.slice(start, start + itemsPerPage);
  }, [filteredTodos, currentPage, itemsPerPage]);

  // Overall Statistics
  const stats = useMemo(() => {
    if (!isLiveSync) {
      return { total: 0, completed: 0, pending: 0, rate: 0, urgentCount: 0 };
    }
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const urgentCount = todos.filter((t) => t.priority === 'urgent' && !t.completed).length;
    return { total, completed, pending, rate, urgentCount };
  }, [todos, isLiveSync]);

  // Unique categories
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(todos.map((t) => t.category).filter(Boolean)));
    return cats.sort();
  }, [todos]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        filteredTodos,
        paginatedTodos,
        loading,
        refreshing,
        actionLoadingId,
        error,
        lastUpdated,
        stats,
        teamMembers: TEAM_MEMBERS,
        availableCategories,
        // Activity Log & Undo Engine
        activities,
        logActivity,
        undoActivity,
        undoLastAction,
        restoreDeletedTodo,
        clearActivities,
        isActivityDrawerOpen,
        setIsActivityDrawerOpen,
        // Analytics Modal
        isAnalyticsModalOpen,
        setIsAnalyticsModalOpen,
        // Filters
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        categoryFilter,
        setCategoryFilter,
        userFilter,
        setUserFilter,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        resetFilters,
        // User Drawer
        activeUserDrawerId,
        setActiveUserDrawerId,
        // Pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        // Selection
        selectedIds,
        toggleSelectTodo,
        selectAllFiltered,
        clearSelection,
        // CRUD Operations
        fetchTodos,
        addTodo,
        updateTodo,
        toggleTodoStatus,
        deleteTodo,
        bulkToggleStatus,
        bulkDeleteTodos,
        // Live Sync State (PulseSync)
        isLiveSync,
        toggleLiveSync,
        // Subtasks
        toggleSubtask,
        addSubtask,
        deleteSubtask,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

export default TodoContext;
