import { useState, useCallback } from 'react';

let toastListeners = [];
let toastIdCounter = 0;

export const showGlobalToast = (toast) => {
  const newToast = {
    id: ++toastIdCounter,
    type: toast.type || 'info', // 'success' | 'error' | 'warning' | 'info'
    title: toast.title || '',
    message: toast.message || '',
    duration: toast.duration || 4000,
    action: toast.action || null,
  };
  toastListeners.forEach((listener) => listener(newToast));
  return newToast.id;
};

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    return showGlobalToast(toast);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message, title = 'Success', options = {}) => {
    return addToast({ type: 'success', title, message, ...options });
  }, [addToast]);

  const error = useCallback((message, title = 'Error', options = {}) => {
    return addToast({ type: 'error', title, message, ...options });
  }, [addToast]);

  const warning = useCallback((message, title = 'Warning', options = {}) => {
    return addToast({ type: 'warning', title, message, ...options });
  }, [addToast]);

  const info = useCallback((message, title = 'Info', options = {}) => {
    return addToast({ type: 'info', title, message, ...options });
  }, [addToast]);

  return {
    toasts,
    setToasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};

export const subscribeToToasts = (listener) => {
  toastListeners.push(listener);
  return () => {
    toastListeners = toastListeners.filter((l) => l !== listener);
  };
};
