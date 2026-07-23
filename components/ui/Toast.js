'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon';

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider.');
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);
  const timers = useRef(new Map());
  const dismiss = useCallback((id) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);
  const notify = useCallback((message, options = {}) => {
    nextId.current += 1;
    const toast = { id: nextId.current, message, tone: options.tone || 'neutral', duration: options.duration ?? 4000 };
    setToasts((current) => [...current, toast]);
    timers.current.set(toast.id, window.setTimeout(() => dismiss(toast.id), toast.duration));
    return toast.id;
  }, [dismiss]);
  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
  }, []);
  const value = useMemo(() => ({ notify, dismiss }), [dismiss, notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed inset-x-4 bottom-[calc(var(--mobile-nav-height)+1rem)] z-[90] flex flex-col items-end gap-3 lg:bottom-5" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} role={toast.tone === 'danger' ? 'alert' : 'status'} className={`flex w-full max-w-sm items-start gap-3 rounded-card border p-4 shadow-3 ${toast.tone === 'danger' ? 'border-danger/30 bg-danger-subtle text-danger' : toast.tone === 'success' ? 'border-success/30 bg-success-subtle text-success' : toast.tone === 'warning' ? 'border-warning/30 bg-warning-subtle text-warning' : 'border-border bg-surface-elevated text-foreground'}`}>
            <Icon name={toast.tone === 'success' ? 'check' : toast.tone === 'danger' || toast.tone === 'warning' ? 'alert' : 'info'} size="sm" className="mt-0.5 shrink-0" />
            <p className="min-w-0 flex-1 text-sm font-medium leading-6">{toast.message}</p>
            <button type="button" onClick={() => dismiss(toast.id)} className="rounded-control p-1 text-current opacity-70 hover:opacity-100" aria-label="Dismiss notification"><Icon name="close" size="sm" /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
