/**
 * Date formatting & comparison utilities for task due dates
 */

export function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}

export function getDueDateStatus(dateString, isCompleted = false) {
  if (!dateString || isCompleted) return { label: formatDate(dateString), status: 'normal' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dateString);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `Overdue (${Math.abs(diffDays)}d)`,
      status: 'overdue',
    };
  }
  if (diffDays === 0) {
    return {
      label: 'Due Today',
      status: 'today',
    };
  }
  if (diffDays === 1) {
    return {
      label: 'Due Tomorrow',
      status: 'tomorrow',
    };
  }
  if (diffDays <= 7) {
    return {
      label: `In ${diffDays} days`,
      status: 'upcoming',
    };
  }

  return {
    label: formatDate(dateString),
    status: 'normal',
  };
}

export function getTodayDateString(offsetDays = 0) {
  const date = new Date();
  if (offsetDays !== 0) {
    date.setDate(date.getDate() + offsetDays);
  }
  return date.toISOString().split('T')[0];
}
