import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTodos } from '../context/TodoContext';

export const Pagination = () => {
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    filteredTodos,
  } = useTodos();

  if (filteredTodos.length === 0) return null;

  const totalCount = filteredTodos.length;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxButtons - 1);
      
      if (end - start < maxButtons - 1) {
        start = Math.max(1, end - maxButtons + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="pagination-container">
      {/* Range summary & Items per page dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{startItem}–{endItem}</strong> of{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{totalCount}</strong> tasks
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <label htmlFor="per-page-select" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            Per page:
          </label>
          <select
            id="per-page-select"
            className="select-control"
            style={{ padding: '0.25rem 1.5rem 0.25rem 0.5rem', fontSize: '0.8rem' }}
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pagination-pages">
        {/* First Page */}
        <button
          id="pagination-first-btn"
          className="page-btn"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          title="First Page"
          aria-label="First page"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous Page */}
        <button
          id="pagination-prev-btn"
          className="page-btn"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          title="Previous Page"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Numbered Pages */}
        {getPageNumbers().map((page, idx) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                style={{ padding: '0 0.3rem', color: 'var(--text-tertiary)' }}
              >
                …
              </span>
            );
          }
          return (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}

        {/* Next Page */}
        <button
          id="pagination-next-btn"
          className="page-btn"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          title="Next Page"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last Page */}
        <button
          id="pagination-last-btn"
          className="page-btn"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          title="Last Page"
          aria-label="Last page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
