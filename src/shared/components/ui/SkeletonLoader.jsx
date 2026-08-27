import React from 'react';

export const SkeletonLoader = ({ count = 6, viewMode = 'grid' }) => {
  const items = Array.from({ length: count });

  if (viewMode === 'list') {
    return (
      <div className="todo-list">
        {items.map((_, index) => (
          <div
            key={index}
            className="todo-row"
            style={{ pointerEvents: 'none' }}
          >
            <div className="row-left" style={{ width: '70%' }}>
              <div className="skeleton" style={{ width: 18, height: 18, borderRadius: 4 }} />
              <div className="skeleton" style={{ width: 45, height: 22, borderRadius: 12 }} />
              <div className="skeleton" style={{ width: '65%', height: 20, borderRadius: 4 }} />
            </div>
            <div className="row-right">
              <div className="skeleton" style={{ width: 65, height: 22, borderRadius: 12 }} />
              <div className="skeleton" style={{ width: 75, height: 22, borderRadius: 12 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="todo-grid">
      {items.map((_, index) => (
        <div
          key={index}
          className="todo-card"
          style={{ height: '175px', pointerEvents: 'none' }}
        >
          <div className="todo-card-header">
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <div className="skeleton" style={{ width: 45, height: 22, borderRadius: 12 }} />
              <div className="skeleton" style={{ width: 75, height: 22, borderRadius: 12 }} />
            </div>
            <div className="skeleton" style={{ width: 70, height: 22, borderRadius: 12 }} />
          </div>

          <div style={{ margin: '1rem 0', display: 'flex', gap: '0.6rem' }}>
            <div className="skeleton" style={{ width: 22, height: 22, borderRadius: 4, flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div className="skeleton" style={{ width: '90%', height: 16 }} />
              <div className="skeleton" style={{ width: '60%', height: 16 }} />
            </div>
          </div>

          <div className="todo-card-footer" style={{ borderTop: 'none', padding: 0 }}>
            <div className="skeleton" style={{ width: 80, height: 14 }} />
            <div className="skeleton" style={{ width: 60, height: 24, borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
