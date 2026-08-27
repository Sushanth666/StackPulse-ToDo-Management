import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './shared/context/ThemeContext';
import { TodoProvider, useTodos } from './features/todos/context/TodoContext';
import Navbar from './shared/components/layout/Navbar';
import StatsOverview from './features/todos/components/StatsOverview';
import FilterBar from './features/todos/components/FilterBar';
import TodoList from './features/todos/components/TodoList';
import TodoModal from './features/todos/components/TodoModal';
import UserDrawer from './features/team/UserDrawer';
import ActivityDrawer from './features/activity/ActivityDrawer';
import AnalyticsModal from './features/analytics/AnalyticsModal';
import CommandPalette from './shared/components/ui/CommandPalette';
import ToastContainer from './shared/components/ui/ToastContainer';
import Footer from './shared/components/layout/Footer';
import {
  Sparkles,
  Plus,
  BarChart3,
  History,
  CheckCircle2,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import './styles/App.css';
import './styles/components.css';

function MainLayout() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [editingTodoFromCmd, setEditingTodoFromCmd] = useState(null);
  const [isEditModalFromCmdOpen, setIsEditModalFromCmdOpen] = useState(false);

  const {
    stats,
    activities,
    activeUserDrawerId,
    setActiveUserDrawerId,
    isActivityDrawerOpen,
    setIsActivityDrawerOpen,
    isAnalyticsModalOpen,
    setIsAnalyticsModalOpen,
    isLiveSync,
    toggleLiveSync,
  } = useTodos();

  useEffect(() => {
    const handleOpenCmd = () => setIsCommandPaletteOpen(true);
    window.addEventListener('open-command-palette', handleOpenCmd);
    return () => window.removeEventListener('open-command-palette', handleOpenCmd);
  }, []);

  const handleEditFromCmd = (todo) => {
    setEditingTodoFromCmd(todo);
    setIsEditModalFromCmdOpen(true);
  };

  return (
    <div className="app-container">
      {/* Global Navbar */}
      <Navbar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenTeamDrawer={(uid) => setActiveUserDrawerId(uid || 1)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Executive Workspace Hero Header */}
        <section className="hero-banner">
          <div className="hero-header-left">
            {/* Breadcrumb & Live API Pulse */}
            <div className="hero-breadcrumb">
              <span className="breadcrumb-tag">ENGINEERING WORKSPACE</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">ACTIVE SPRINT</span>
              <span
                className={`hero-live-pill ${isLiveSync ? 'live' : 'offline'}`}
                title="REST API Status"
              >
                <span className={`hero-pulse-dot ${isLiveSync ? 'live' : 'offline'}`} />
                <span>{isLiveSync ? 'REST API 200 OK' : 'REST API OFFLINE'}</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              <span>Sprint Deliverables & Execution Engine</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle">
              Orchestrate team tasks, track sprint velocity in real-time, and manage full-lifecycle CRUD operations across interactive boards.
            </p>
          </div>

          {/* Quick Action Hub on the Right */}
          <div className="hero-actions-hub">
            <button
              id="hero-new-task-btn"
              className="btn btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Create Task</span>
            </button>

            <button
              id="hero-analytics-btn"
              className="btn btn-secondary"
              onClick={() => setIsAnalyticsModalOpen(true)}
              title="Open Sprint Analytics Dashboard"
            >
              <BarChart3 size={15} color="var(--primary-600)" />
              <span>Analytics</span>
            </button>

            <button
              id="hero-activity-btn"
              className="btn btn-secondary"
              onClick={() => setIsActivityDrawerOpen(true)}
              title="Open Activity & Audit Log"
            >
              <History size={15} color="var(--text-secondary)" />
              <span>Audit Trail</span>
              {activities.length > 0 && (
                <span className="tab-count" style={{ marginLeft: '0.2rem' }}>
                  {activities.length}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* Real-time Productivity & Status Overview */}
        <StatsOverview />

        {/* Filter, Search & View Controls */}
        <FilterBar />

        {/* Todo List / Grid / Kanban */}
        <TodoList
          onOpenNewModal={() => setIsCreateModalOpen(true)}
          onOpenUserDrawer={(uid) => setActiveUserDrawerId(uid)}
        />
      </main>

      {/* Create Todo Modal */}
      <TodoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Todo Modal (triggered from Command Palette search) */}
      <TodoModal
        isOpen={isEditModalFromCmdOpen}
        onClose={() => {
          setIsEditModalFromCmdOpen(false);
          setEditingTodoFromCmd(null);
        }}
        todoToEdit={editingTodoFromCmd}
      />

      {/* User Profile & Tasks Drawer */}
      <UserDrawer
        userId={activeUserDrawerId}
        isOpen={Boolean(activeUserDrawerId)}
        onClose={() => setActiveUserDrawerId(null)}
      />

      {/* Activity Log & Audit Trail Drawer */}
      <ActivityDrawer
        isOpen={isActivityDrawerOpen}
        onClose={() => setIsActivityDrawerOpen(false)}
      />

      {/* Sprint Analytics Dashboard Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />

      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenNewTaskModal={() => setIsCreateModalOpen(true)}
        onEditTask={handleEditFromCmd}
      />

      {/* Global Toast System */}
      <ToastContainer />

      {/* Interactive Footer */}
      <Footer
        onOpenNewModal={() => setIsCreateModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenTeamDrawer={(uid) => setActiveUserDrawerId(uid || 1)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TodoProvider>
        <MainLayout />
      </TodoProvider>
    </ThemeProvider>
  );
}
