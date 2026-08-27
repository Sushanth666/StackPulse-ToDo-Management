import React, { useState } from 'react';
import {
  Search,
  X,
  LayoutGrid,
  List,
  Kanban,
  ChevronDown,
  FilterX,
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  Tags,
} from 'lucide-react';
import { useTodos } from '../context/TodoContext';
import { exportToCSV, exportToJSON, exportToPDF } from '../../../shared/utils/exportUtils';
import { showGlobalToast } from '../../../shared/hooks/useToast';

export const FilterBar = () => {
  const {
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
    teamMembers,
    availableCategories,
    stats,
    resetFilters,
    filteredTodos,
  } = useTodos();

  const [showExportMenu, setShowExportMenu] = useState(false);

  const isFiltered =
    searchTerm.trim() !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    categoryFilter !== 'all' ||
    userFilter !== 'all' ||
    sortBy !== 'id-desc';

  const handleExportPDF = () => {
    exportToPDF(filteredTodos, 'tasks_filtered', 'StackPulse — Task Deliverables Report');
    setShowExportMenu(false);
    showGlobalToast({
      type: 'success',
      title: 'PDF Export Complete',
      message: `Exported ${filteredTodos.length} enterprise tasks to a PDF report document.`,
    });
  };

  const handleExportCSV = () => {
    exportToCSV(filteredTodos, 'tasks_filtered');
    setShowExportMenu(false);
    showGlobalToast({
      type: 'success',
      title: 'Export Complete',
      message: `Exported ${filteredTodos.length} enterprise tasks to CSV.`,
    });
  };

  const handleExportJSON = () => {
    exportToJSON(filteredTodos, 'tasks_filtered');
    setShowExportMenu(false);
    showGlobalToast({
      type: 'success',
      title: 'Export Complete',
      message: `Exported ${filteredTodos.length} enterprise tasks to JSON.`,
    });
  };

  return (
    <div className="filter-card">
      {/* Top row: Search input, Export, View switch */}
      <div className="search-and-controls">
        {/* Live Search */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            id="todo-search-input"
            type="text"
            className="input-field search-input"
            placeholder="Search tasks, assignees, categories, or press Ctrl+K..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              id="clear-search-btn"
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Export Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              id="export-dropdown-btn"
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
              onClick={() => setShowExportMenu((prev) => !prev)}
              title="Export tasks to PDF, CSV, or JSON"
            >
              <Download size={15} />
              <span>Export</span>
              <ChevronDown size={14} />
            </button>

            {showExportMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  zIndex: 30,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  minWidth: '175px',
                  animation: 'modalSpringIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <button
                  id="export-pdf-btn"
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
                  onClick={handleExportPDF}
                >
                  <FileText size={15} color="var(--danger-500)" />
                  <span style={{ fontWeight: 600 }}>Export as PDF</span>
                </button>
                <button
                  id="export-csv-btn"
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
                  onClick={handleExportCSV}
                >
                  <FileSpreadsheet size={15} color="var(--success-600)" />
                  <span>Export as CSV</span>
                </button>
                <button
                  id="export-json-btn"
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
                  onClick={handleExportJSON}
                >
                  <FileJson size={15} color="var(--info-500)" />
                  <span>Export as JSON</span>
                </button>
              </div>
            )}
          </div>

          {/* View Mode Switcher (Grid / List / Kanban) */}
          <div className="view-toggle-group">
            <button
              id="view-grid-btn"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
              <span>Grid</span>
            </button>
            <button
              id="view-list-btn"
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
              aria-label="List view"
            >
              <List size={16} />
              <span>List</span>
            </button>
            <button
              id="view-kanban-btn"
              className={`view-toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban Board View (Drag & Drop)"
              aria-label="Kanban board view"
            >
              <Kanban size={16} />
              <span>Kanban</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Status Filter Tabs, Category, Priority, Assignee Dropdown, Sort Dropdown */}
      <div className="filter-pills-row">
        {/* Status Tabs */}
        <div className="status-tabs">
          <button
            id="filter-all-btn"
            className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All <span className="tab-count">{stats.total}</span>
          </button>
          <button
            id="filter-pending-btn"
            className={`tab-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            In Progress <span className="tab-count">{stats.pending}</span>
          </button>
          <button
            id="filter-completed-btn"
            className={`tab-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Done <span className="tab-count">{stats.completed}</span>
          </button>
        </div>

        {/* Dropdowns */}
        <div className="dropdown-controls">
          {/* Category Filter */}
          <div className="select-wrapper">
            <select
              id="category-filter-select"
              className="select-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by domain/category"
            >
              <option value="all">All Domains</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="select-arrow" />
          </div>

          {/* Priority Filter */}
          <div className="select-wrapper">
            <select
              id="priority-filter-select"
              className="select-control"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🔥 Urgent Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <ChevronDown size={14} className="select-arrow" />
          </div>

          {/* Assignee Filter */}
          <div className="select-wrapper">
            <select
              id="user-filter-select"
              className="select-control"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              aria-label="Filter by team member"
            >
              <option value="all">All Assignees</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role.split(' ')[0]})
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="select-arrow" />
          </div>

          {/* Sort By Dropdown */}
          <div className="select-wrapper">
            <select
              id="sort-by-select"
              className="select-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort tasks"
            >
              <option value="id-desc">Newest First (ID ↓)</option>
              <option value="id-asc">Oldest First (ID ↑)</option>
              <option value="priority-desc">Priority (High → Low)</option>
              <option value="priority-asc">Priority (Low → High)</option>
              <option value="dueDate-asc">Due Date (Earliest First)</option>
              <option value="dueDate-desc">Due Date (Latest First)</option>
              <option value="title-asc">Title (A → Z)</option>
              <option value="title-desc">Title (Z → A)</option>
              <option value="status-pending">In Progress First</option>
              <option value="status-completed">Completed First</option>
            </select>
            <ChevronDown size={14} className="select-arrow" />
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              id="reset-filters-btn"
              className="btn btn-ghost"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
              onClick={resetFilters}
              title="Reset all active filters"
            >
              <FilterX size={14} />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
