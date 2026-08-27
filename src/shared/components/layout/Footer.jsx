import React from 'react';
import {
  ArrowUp,
  Heart,
  PlusCircle,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { useTodos } from '../../../features/todos/context/TodoContext';
import { exportToPDF, exportToCSV } from '../../utils/exportUtils';
import { showGlobalToast } from '../../hooks/useToast';
import BrandLogo from './BrandLogo';

export const Footer = ({ onOpenNewModal, onOpenCommandPalette, onOpenTeamDrawer }) => {
  const {
    todos,
    stats,
    viewMode,
    setViewMode,
    setIsActivityDrawerOpen,
    setIsAnalyticsModalOpen,
    isLiveSync,
    toggleLiveSync,
  } = useTodos();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleExportPDF = () => {
    exportToPDF(todos, 'tasks_export', 'StackPulse — Enterprise Tasks Report');
    showGlobalToast({
      type: 'success',
      title: 'PDF Report Ready',
      message: `Exported ${todos.length} deliverables to PDF document.`,
    });
  };

  const handleExportCSV = () => {
    exportToCSV(todos, 'tasks_export');
    showGlobalToast({
      type: 'success',
      title: 'CSV Data Exported',
      message: `Exported ${todos.length} deliverables to CSV spreadsheet.`,
    });
  };

  return (
    <footer className="app-footer">
      {/* Top Animated Laser Line */}
      <div className="footer-gradient-line" />

      <div className="footer-container">
        {/* 3 Clean SaaS Columns */}
        <div className="footer-columns-grid">
          {/* Column 1: Brand & Status */}
          <div className="footer-col-brand">
            <div className="footer-brand-header">
              <div className="footer-brand-logo">
                <BrandLogo size={22} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span className="footer-brand-name">StackPulse</span>
                <span className="brand-badge" style={{ fontSize: '0.625rem', padding: '0.1rem 0.4rem' }}>v1.0.0</span>
              </div>
            </div>

            <p className="footer-tagline-text">
              High-performance task tracking and sprint orchestration powered by REST CRUD architecture and real-time state synchronization.
            </p>

            <button
              type="button"
              className="footer-api-status-badge"
              onClick={toggleLiveSync}
              title={
                isLiveSync
                  ? 'PulseSync: LIVE REST API Connected (Click to switch to Offline Sandbox)'
                  : 'PulseSync: Offline Sandbox Active (Click to switch to Live REST API)'
              }
              style={{ cursor: 'pointer', textAlign: 'left' }}
            >
              <span className={`api-live-dot ${isLiveSync ? 'live' : 'offline'}`} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {isLiveSync ? 'JSONPlaceholder REST API' : 'PulseSync Offline Sandbox'}
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: isLiveSync ? 'var(--success-600)' : 'var(--warning-600)',
                    fontWeight: 600,
                  }}
                >
                  {isLiveSync ? `Operational • ${stats.total} Endpoints Synced` : 'Local Persistence • Zero Latency'}
                </span>
              </div>
            </button>
          </div>

          {/* Column 2: Workspace Views */}
          <div className="footer-nav-col">
            <h4 className="footer-nav-heading">Workspace Views</h4>
            <ul className="footer-nav-links">
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => {
                    setViewMode('grid');
                    scrollToTop();
                  }}
                >
                  <span>Grid Cards View</span>
                  {viewMode === 'grid' && <span className="nav-active-indicator">Active</span>}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => {
                    setViewMode('list');
                    scrollToTop();
                  }}
                >
                  <span>Compact Table View</span>
                  {viewMode === 'list' && <span className="nav-active-indicator">Active</span>}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => {
                    setViewMode('kanban');
                    scrollToTop();
                  }}
                >
                  <span>Interactive Kanban Board</span>
                  {viewMode === 'kanban' && <span className="nav-active-indicator">Active</span>}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => onOpenTeamDrawer(1)}
                >
                  <span>Team Directory</span>
                  <span className="nav-badge-pill">10 Users</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={onOpenNewModal}
                >
                  <span>Create Deliverable</span>
                  <PlusCircle size={12} color="var(--primary-600)" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Tools & Data */}
          <div className="footer-nav-col">
            <h4 className="footer-nav-heading">Tools & Data Hub</h4>
            <ul className="footer-nav-links">
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={onOpenCommandPalette}
                >
                  <span>Command Center</span>
                  <span className="kbd-badge" style={{ fontSize: '0.625rem', padding: '0.08rem 0.35rem' }}>Ctrl+K</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => setIsAnalyticsModalOpen(true)}
                >
                  <span>Sprint Velocity Analytics</span>
                  <span className="nav-badge-pill">{stats.rate}% Rate</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => setIsActivityDrawerOpen(true)}
                >
                  <span>Activity Log & Undo</span>
                  <span className="nav-badge-pill" style={{ color: 'var(--info-600)', background: 'var(--info-50)', borderColor: 'var(--info-200)' }}>Audit</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={handleExportPDF}
                >
                  <span>Export PDF Report</span>
                  <FileText size={12} color="var(--danger-500)" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={handleExportCSV}
                >
                  <span>Export CSV Spreadsheets</span>
                  <FileSpreadsheet size={12} color="var(--success-600)" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Developer Credits (Centered) & Back to Top */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-center">
            <span>© {new Date().getFullYear()} StackPulse. Open source portfolio project.</span>
            <span className="footer-dot">•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Built with <Heart size={13} color="#ef4444" fill="#ef4444" className="heart-beat" /> by <strong style={{ color: 'var(--text-primary)' }}>Sree Sushanth B V</strong>
            </span>
          </div>

          <button
            id="scroll-to-top-btn"
            className="scroll-top-btn"
            onClick={scrollToTop}
            title="Scroll to top of page"
            aria-label="Scroll to top"
          >
            <span>Back to top</span>
            <ArrowUp size={14} className="arrow-bounce" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
