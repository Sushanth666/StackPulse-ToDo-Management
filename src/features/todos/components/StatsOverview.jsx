import React from 'react';
import { ListTodo, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useTodos } from '../context/TodoContext';

export const StatsOverview = () => {
  const { stats, loading } = useTodos();
  const { total, completed, pending, rate } = stats;

  return (
    <div className="stats-grid">
      {/* Total Deliverables */}
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-indigo">
          <ListTodo size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-label">Total Deliverables</div>
          <div key={`tot-${total}`} className="stat-value animate-spring-pop">{loading ? '—' : total}</div>
        </div>
      </div>

      {/* Delivered Tasks */}
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-emerald">
          <CheckCircle size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-label">Delivered / Done</div>
          <div key={`comp-${completed}`} className="stat-value animate-spring-pop" style={{ color: 'var(--success-500)' }}>
            {loading ? '—' : completed}
          </div>
        </div>
      </div>

      {/* Active Workload */}
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-amber">
          <Clock size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-label">Active In Progress</div>
          <div key={`pend-${pending}`} className="stat-value animate-spring-pop" style={{ color: 'var(--warning-500)' }}>
            {loading ? '—' : pending}
          </div>
        </div>
      </div>

      {/* Engineering Velocity */}
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-purple">
          <TrendingUp size={24} />
        </div>
        <div className="stat-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Sprint Velocity</span>
            <span key={`rate-${rate}`} className="animate-spring-pop" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-600)' }}>
              {loading ? '0%' : `${rate}%`}
            </span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${loading ? 0 : rate}%` }}
              role="progressbar"
              aria-valuenow={rate}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
