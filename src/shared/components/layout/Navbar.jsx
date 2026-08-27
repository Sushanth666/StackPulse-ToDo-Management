import React from 'react';
import { RefreshCw, Sun, Moon, Users, Search, Zap, ZapOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTodos } from '../../../features/todos/context/TodoContext';
import BrandLogo from './BrandLogo';

export const Navbar = ({ onOpenCommandPalette, onOpenTeamDrawer }) => {
  const { isDark, toggleTheme } = useTheme();
  const { refreshing, fetchTodos, isLiveSync, toggleLiveSync } = useTodos();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand-group">
          <div className="brand-logo" title="StackPulse Workspace">
            <BrandLogo size={26} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span className="brand-title">StackPulse</span>

            {/* API Live/Off Symbol Button */}
            <button
              id="api-status-toggle-btn"
              type="button"
              className={`api-toggle-symbol-btn ${isLiveSync ? 'live' : 'offline'}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleLiveSync();
              }}
              title={
                isLiveSync
                  ? 'REST API: LIVE ON (Click to switch to Offline Sandbox)'
                  : 'REST API: OFFLINE (Click to switch to Live REST API)'
              }
              aria-label="Toggle REST API Live Mode"
            >
              <span className={`api-symbol-dot ${isLiveSync ? 'live' : 'offline'}`} />
              {isLiveSync ? (
                <Zap size={12} className="api-symbol-icon" />
              ) : (
                <ZapOff size={12} className="api-symbol-icon" />
              )}
              <span className="api-symbol-name">API</span>
              <span className="api-symbol-state">{isLiveSync ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Prominent Wide Search Bar */}
          <button
            id="open-cmd-palette-btn"
            className="cmd-k-trigger"
            onClick={onOpenCommandPalette}
            title="Open Command Palette (Ctrl + K)"
            aria-label="Open command palette"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Search size={17} />
              <span>Search tasks, commands, filters...</span>
            </div>
            <span className="kbd-badge">Ctrl K</span>
          </button>

          {/* Team Drawer Trigger */}
          <button
            id="team-drawer-btn"
            className="btn btn-secondary btn-icon"
            onClick={() => onOpenTeamDrawer(1)}
            title="View Team Members Directory"
            aria-label="View team directory"
          >
            <Users size={16} />
          </button>

          {/* Refresh Button */}
          <button
            id="refresh-todos-btn"
            className="btn btn-secondary btn-icon"
            onClick={() => fetchTodos(true)}
            disabled={refreshing}
            title="Refresh from JSONPlaceholder API"
            aria-label="Refresh todos"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            className="btn btn-secondary btn-icon"
            onClick={toggleTheme}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={16} color="var(--warning-500)" className="theme-icon-sun animate-spring-pop" />
            ) : (
              <Moon size={16} className="theme-icon-moon animate-spring-pop" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
