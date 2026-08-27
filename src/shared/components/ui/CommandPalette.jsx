import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Plus,
  Moon,
  Sun,
  RefreshCw,
  LayoutGrid,
  List,
  Kanban,
  FileText,
  FileSpreadsheet,
  FileJson,
  FilterX,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  Sparkles,
  History,
  RotateCcw,
  BarChart3,
} from 'lucide-react';
import { useTodos } from '../../../features/todos/context/TodoContext';
import { useTheme } from '../../context/ThemeContext';
import { exportToCSV, exportToJSON, exportToPDF } from '../../utils/exportUtils';
import { showGlobalToast } from '../../hooks/useToast';

export const CommandPalette = ({ isOpen, onClose, onOpenNewTaskModal, onEditTask }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const {
    todos,
    fetchTodos,
    setViewMode,
    setStatusFilter,
    setPriorityFilter,
    resetFilters,
    setIsActivityDrawerOpen,
    setIsAnalyticsModalOpen,
    undoLastAction,
  } = useTodos();
  const { isDark, toggleTheme } = useTheme();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keydown for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          window.dispatchEvent(new CustomEvent('open-command-palette'));
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Actions list
  const baseActions = [
    {
      id: 'create-task',
      group: 'Actions',
      label: 'Create New Task (POST)',
      icon: <Plus size={16} color="var(--primary-500)" />,
      run: () => onOpenNewTaskModal(),
    },
    {
      id: 'open-activity-log',
      group: 'Actions',
      label: 'Open Activity Log & Audit Trail',
      icon: <History size={16} color="var(--info-500)" />,
      run: () => setIsActivityDrawerOpen(true),
    },
    {
      id: 'undo-last-action',
      group: 'Actions',
      label: 'Undo Last Action (1-Click Restore)',
      icon: <RotateCcw size={16} color="var(--warning-500)" />,
      run: () => undoLastAction(),
    },
    {
      id: 'open-analytics-dashboard',
      group: 'Actions',
      label: 'Open Sprint Analytics & Metrics Dashboard',
      icon: <BarChart3 size={16} color="var(--primary-600)" />,
      run: () => setIsAnalyticsModalOpen(true),
    },
    {
      id: 'refresh-data',
      group: 'Actions',
      label: 'Refresh from REST API',
      icon: <RefreshCw size={16} color="var(--primary-500)" />,
      run: () => fetchTodos(true),
    },
    {
      id: 'toggle-theme',
      group: 'Actions',
      label: `Switch to ${isDark ? 'Light' : 'Dark'} Theme`,
      icon: isDark ? <Sun size={16} color="var(--warning-500)" /> : <Moon size={16} color="var(--primary-500)" />,
      run: () => toggleTheme(),
    },
    {
      id: 'view-kanban',
      group: 'Views',
      label: 'Switch to Kanban Board View',
      icon: <Kanban size={16} color="var(--primary-500)" />,
      run: () => setViewMode('kanban'),
    },
    {
      id: 'view-grid',
      group: 'Views',
      label: 'Switch to Grid Cards View',
      icon: <LayoutGrid size={16} color="var(--primary-500)" />,
      run: () => setViewMode('grid'),
    },
    {
      id: 'view-list',
      group: 'Views',
      label: 'Switch to List Row View',
      icon: <List size={16} color="var(--primary-500)" />,
      run: () => setViewMode('list'),
    },
    {
      id: 'filter-completed',
      group: 'Filters',
      label: 'Filter: Completed Tasks Only',
      icon: <CheckCircle2 size={16} color="var(--success-500)" />,
      run: () => setStatusFilter('completed'),
    },
    {
      id: 'filter-pending',
      group: 'Filters',
      label: 'Filter: Pending / Active Tasks Only',
      icon: <Clock size={16} color="var(--warning-500)" />,
      run: () => setStatusFilter('pending'),
    },
    {
      id: 'filter-urgent',
      group: 'Filters',
      label: 'Filter: Urgent Priority Tasks',
      icon: <Flame size={16} color="var(--danger-500)" />,
      run: () => setPriorityFilter('urgent'),
    },
    {
      id: 'export-pdf',
      group: 'Data',
      label: 'Export Tasks to PDF Document Report',
      icon: <FileText size={16} color="var(--danger-500)" />,
      run: () => {
        exportToPDF(todos, 'tasks_export', 'StackPulse — Enterprise Tasks Report');
        showGlobalToast({ type: 'success', title: 'PDF Report Ready', message: 'Downloaded PDF document report.' });
      },
    },
    {
      id: 'export-csv',
      group: 'Data',
      label: 'Export Tasks to CSV',
      icon: <FileSpreadsheet size={16} color="var(--success-600)" />,
      run: () => {
        exportToCSV(todos);
        showGlobalToast({ type: 'success', title: 'Export Complete', message: 'Downloaded CSV file.' });
      },
    },
    {
      id: 'export-json',
      group: 'Data',
      label: 'Export Tasks to JSON',
      icon: <FileJson size={16} color="var(--info-500)" />,
      run: () => {
        exportToJSON(todos);
        showGlobalToast({ type: 'success', title: 'Export Complete', message: 'Downloaded JSON file.' });
      },
    },
    {
      id: 'reset-filters',
      group: 'Filters',
      label: 'Reset All Active Filters',
      icon: <FilterX size={16} color="var(--text-tertiary)" />,
      run: () => resetFilters(),
    },
  ];

  // Search filtered actions
  const filteredActions = query.trim()
    ? baseActions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase().trim()))
    : baseActions;

  // Search matching tasks from dataset
  const matchingTasks = query.trim()
    ? todos
        .filter((t) => t.title.toLowerCase().includes(query.toLowerCase().trim()) || String(t.id) === query.trim())
        .slice(0, 5)
        .map((t) => ({
          id: `task-${t.id}`,
          group: 'Matching Tasks',
          label: `#${t.id}: ${t.title}`,
          isTask: true,
          todo: t,
          icon: <Sparkles size={15} color="var(--primary-500)" />,
          run: () => onEditTask(t),
        }))
    : [];

  const allItems = [...filteredActions, ...matchingTasks];

  // Keyboard navigation inside menu
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < allItems.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        allItems[selectedIndex].run();
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="cmd-dialog-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cmd-dialog" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        {/* Search Header */}
        <div className="cmd-search-wrapper">
          <Search size={20} color="var(--primary-500)" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-input"
            placeholder="Type a command, action, or search task title..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <span className="kbd-badge">ESC</span>
        </div>

        {/* Results List */}
        <div className="cmd-list" ref={listRef}>
          {allItems.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              No commands or tasks match "{query}"
            </div>
          ) : (
            allItems.map((item, idx) => (
              <div
                key={item.id}
                className={`cmd-item ${idx === selectedIndex ? 'selected' : ''}`}
                onClick={() => {
                  item.run();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="cmd-item-left" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                  {item.icon}
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                </div>
                <ArrowRight size={14} color="var(--text-tertiary)" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="cmd-footer">
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span>
              <span className="kbd-badge" style={{ marginRight: '0.25rem' }}>↑</span>
              <span className="kbd-badge">↓</span> navigate
            </span>
            <span>
              <span className="kbd-badge">↵</span> select
            </span>
          </div>
          <span>StackPulse Command Center</span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CommandPalette;
