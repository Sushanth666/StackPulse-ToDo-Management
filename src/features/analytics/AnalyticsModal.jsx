import React from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Flame,
  User,
  Tag,
  Download,
  FileText,
  Filter,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useTodos } from '../../features/todos/context/TodoContext';
import { exportToCSV, exportToJSON, exportToPDF } from '../../shared/utils/exportUtils';
import { showGlobalToast } from '../../shared/hooks/useToast';

export const AnalyticsModal = ({ isOpen, onClose }) => {
  const {
    todos,
    stats,
    teamMembers,
    availableCategories,
    setCategoryFilter,
    setUserFilter,
    setPriorityFilter,
  } = useTodos();

  if (!isOpen) return null;

  // Category breakdown calculation
  const categoryMetrics = availableCategories.map((cat) => {
    const catTodos = todos.filter((t) => t.category === cat);
    const completed = catTodos.filter((t) => t.completed).length;
    const total = catTodos.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      category: cat,
      total,
      completed,
      pending: total - completed,
      rate,
    };
  });

  // Priority breakdown calculation
  const priorityStats = {
    urgent: {
      total: todos.filter((t) => t.priority === 'urgent').length,
      completed: todos.filter((t) => t.priority === 'urgent' && t.completed).length,
    },
    high: {
      total: todos.filter((t) => t.priority === 'high').length,
      completed: todos.filter((t) => t.priority === 'high' && t.completed).length,
    },
    medium: {
      total: todos.filter((t) => t.priority === 'medium').length,
      completed: todos.filter((t) => t.priority === 'medium' && t.completed).length,
    },
    low: {
      total: todos.filter((t) => t.priority === 'low').length,
      completed: todos.filter((t) => t.priority === 'low' && t.completed).length,
    },
  };

  // Team capacity breakdown
  const teamMetrics = teamMembers.map((member) => {
    const userTodos = todos.filter((t) => t.userId === member.id);
    const completed = userTodos.filter((t) => t.completed).length;
    const total = userTodos.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      ...member,
      total,
      completed,
      pending: total - completed,
      rate,
    };
  });

  const handleFilterDomain = (cat) => {
    setCategoryFilter(cat);
    onClose();
    showGlobalToast({
      type: 'info',
      title: 'Domain Filter Applied',
      message: `Filtering workspace to [${cat}] deliverables.`,
    });
  };

  const handleFilterUser = (userId, name) => {
    setUserFilter(String(userId));
    onClose();
    showGlobalToast({
      type: 'info',
      title: 'Assignee Filter Applied',
      message: `Filtering workspace to ${name}'s deliverables.`,
    });
  };

  const handleExportPDFReport = () => {
    exportToPDF(todos, 'sprint_velocity_report', 'StackPulse — Sprint Velocity & Analytics Report');
    showGlobalToast({
      type: 'success',
      title: 'PDF Sprint Report Exported',
      message: 'Downloaded executive sprint report in PDF format.',
    });
  };

  const handleExportSprintReport = () => {
    exportToCSV(todos, 'sprint_velocity_report');
    showGlobalToast({
      type: 'success',
      title: 'Sprint Report Exported',
      message: 'Downloaded complete sprint metrics to CSV.',
    });
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container analytics-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <div className="stat-icon-wrapper stat-icon-purple" style={{ width: 36, height: 36 }}>
              <BarChart3 size={18} />
            </div>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, display: 'block' }}>
                Sprint Analytics & Velocity Dashboard
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Real-time workload distribution, domain progress, and team capacity
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              id="export-pdf-analytics-btn"
              className="btn btn-primary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem' }}
              onClick={handleExportPDFReport}
              title="Download executive PDF Sprint Report"
            >
              <FileText size={14} />
              <span>PDF Report</span>
            </button>

            <button
              id="export-analytics-btn"
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem' }}
              onClick={handleExportSprintReport}
              title="Download CSV spreadsheet"
            >
              <Download size={14} />
              <span>CSV Data</span>
            </button>

            <button
              id="close-analytics-modal-btn"
              className="btn-icon btn-ghost"
              onClick={onClose}
              aria-label="Close analytics modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body analytics-modal-body">
          {/* Executive Metrics Overview */}
          <div className="analytics-kpi-grid">
            <div className="analytics-kpi-card">
              <div className="kpi-label">Sprint Velocity</div>
              <div className="kpi-value" style={{ color: 'var(--primary-600)' }}>
                {stats.rate}%
              </div>
              <div className="kpi-subtext">Overall completion rate</div>
            </div>

            <div className="analytics-kpi-card">
              <div className="kpi-label">Total Deliverables</div>
              <div className="kpi-value">{stats.total}</div>
              <div className="kpi-subtext">Active sprint backlog</div>
            </div>

            <div className="analytics-kpi-card">
              <div className="kpi-label">Critical Path (Urgent)</div>
              <div className="kpi-value" style={{ color: 'var(--danger-500)' }}>
                {stats.urgentCount}
              </div>
              <div className="kpi-subtext">Pending urgent priorities</div>
            </div>

            <div className="analytics-kpi-card">
              <div className="kpi-label">Delivered on Track</div>
              <div className="kpi-value" style={{ color: 'var(--success-500)' }}>
                {stats.completed}
              </div>
              <div className="kpi-subtext">{stats.pending} remaining in progress</div>
            </div>
          </div>

          {/* Section 1: Priority Distribution Bar */}
          <div className="analytics-section">
            <h4 className="analytics-section-title">
              <Flame size={16} color="var(--danger-500)" />
              <span>Priority Breakdown</span>
            </h4>

            {/* Segmented Stacked Progress Bar */}
            <div className="priority-stacked-bar">
              {stats.total > 0 && (
                <>
                  <div
                    className="priority-segment segment-urgent"
                    style={{ width: `${(priorityStats.urgent.total / stats.total) * 100}%` }}
                    title={`Urgent: ${priorityStats.urgent.total}`}
                  />
                  <div
                    className="priority-segment segment-high"
                    style={{ width: `${(priorityStats.high.total / stats.total) * 100}%` }}
                    title={`High: ${priorityStats.high.total}`}
                  />
                  <div
                    className="priority-segment segment-medium"
                    style={{ width: `${(priorityStats.medium.total / stats.total) * 100}%` }}
                    title={`Medium: ${priorityStats.medium.total}`}
                  />
                  <div
                    className="priority-segment segment-low"
                    style={{ width: `${(priorityStats.low.total / stats.total) * 100}%` }}
                    title={`Low: ${priorityStats.low.total}`}
                  />
                </>
              )}
            </div>

            <div className="priority-legend-grid">
              {[
                { key: 'urgent', label: 'Urgent', color: 'var(--danger-500)', data: priorityStats.urgent },
                { key: 'high', label: 'High', color: 'var(--warning-500)', data: priorityStats.high },
                { key: 'medium', label: 'Medium', color: 'var(--info-500)', data: priorityStats.medium },
                { key: 'low', label: 'Low', color: 'var(--text-secondary)', data: priorityStats.low },
              ].map((p) => (
                <div key={p.key} className="priority-legend-item">
                  <span className="legend-dot" style={{ background: p.color }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                      {p.label}: {p.data.total} tasks
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                      {p.data.completed} completed ({p.data.total > 0 ? Math.round((p.data.completed / p.data.total) * 100) : 0}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Domain Category Workload Matrix */}
          <div className="analytics-section">
            <h4 className="analytics-section-title">
              <Layers size={16} color="var(--primary-500)" />
              <span>Domain Workload & Delivery Velocity</span>
            </h4>

            <div className="category-matrix-grid">
              {categoryMetrics.map((item) => (
                <div key={item.category} className="category-matrix-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Tag size={13} color="var(--primary-600)" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.category}</span>
                    </div>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                      onClick={() => handleFilterDomain(item.category)}
                      title={`Filter workspace to ${item.category}`}
                    >
                      <Filter size={11} />
                      <span>Filter</span>
                    </button>
                  </div>

                  <div className="progress-bar-container" style={{ margin: '0.4rem 0' }}>
                    <div className="progress-bar-fill" style={{ width: `${item.rate}%` }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.35rem' }}>
                    <span>{item.completed} / {item.total} Done</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{item.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Team Capacity Matrix */}
          <div className="analytics-section">
            <h4 className="analytics-section-title">
              <User size={16} color="var(--success-500)" />
              <span>Team Workload & Engineering Capacity</span>
            </h4>

            <div className="team-capacity-grid">
              {teamMetrics.map((member) => (
                <div key={member.id} className="team-capacity-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      className="user-avatar-circle"
                      style={{ width: 38, height: 38, fontSize: '0.85rem', background: member.avatarColor }}
                    >
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {member.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                        {member.role.split(' ')[0]} • {member.total} Tasks
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                      onClick={() => handleFilterUser(member.id, member.name)}
                      title={`Filter workspace to ${member.name}`}
                    >
                      <Filter size={12} />
                    </button>
                  </div>

                  <div className="progress-bar-container" style={{ margin: '0.5rem 0 0.25rem 0' }}>
                    <div className="progress-bar-fill" style={{ width: `${member.rate}%` }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-tertiary)' }}>
                    <span>{member.completed} Completed</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{member.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            type="button"
            id="close-analytics-footer-btn"
            className="btn btn-primary"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AnalyticsModal;
