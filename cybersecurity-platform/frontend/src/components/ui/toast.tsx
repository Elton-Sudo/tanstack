'use client';

import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration (default 5s)
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  };

  const error = (title: string, message?: string) => {
    addToast({ type: 'error', title, message, duration: 7000 });
  };

  const warning = (title: string, message?: string) => {
    addToast({ type: 'warning', title, message, duration: 6000 });
  };

  const info = (title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      className="fixed top-4 right-4 z-toast space-y-2 max-w-md w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => onRemove(toast.id)} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: () => void;
}

const toastStyles = {
  success: {
    container:
      'bg-brand-green-50 border-brand-green-200 dark:bg-brand-green-950 dark:border-brand-green-800',
    icon: 'text-brand-green-600 dark:text-brand-green-400',
    title: 'text-brand-green-900 dark:text-brand-green-100',
    message: 'text-brand-green-700 dark:text-brand-green-300',
  },
  error: {
    container:
      'bg-brand-orangeRed-50 border-brand-orangeRed-200 dark:bg-brand-orangeRed-950 dark:border-brand-orangeRed-800',
    icon: 'text-brand-orangeRed-600 dark:text-brand-orangeRed-400',
    title: 'text-brand-orangeRed-900 dark:text-brand-orangeRed-100',
    message: 'text-brand-orangeRed-700 dark:text-brand-orangeRed-300',
  },
  warning: {
    container:
      'bg-brand-yellowGold-50 border-brand-yellowGold-200 dark:bg-brand-yellowGold-950 dark:border-brand-yellowGold-800',
    icon: 'text-brand-yellowGold-700 dark:text-brand-yellowGold-400',
    title: 'text-brand-yellowGold-900 dark:text-brand-yellowGold-100',
    message: 'text-brand-yellowGold-800 dark:text-brand-yellowGold-300',
  },
  info: {
    container:
      'bg-brand-blue-50 border-brand-blue-200 dark:bg-brand-blue-950 dark:border-brand-blue-800',
    icon: 'text-brand-blue-600 dark:text-brand-blue-400',
    title: 'text-brand-blue-900 dark:text-brand-blue-100',
    message: 'text-brand-blue-700 dark:text-brand-blue-300',
  },
} as const;

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const styles = toastStyles[toast.type];

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(onRemove, 200);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsExiting(false), 50);
    return () => clearTimeout(timer);
  }, []);

  const Icon = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }[toast.type];

  return (
    <div
      className={cn(
        'pointer-events-auto rounded-lg border shadow-lg p-4 transition-all duration-200',
        styles.container,
        isExiting ? 'animate-slide-out-right opacity-0' : 'animate-slide-in-right',
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', styles.icon)} />
        <div className="flex-1 min-w-0">
          <p className={cn('font-semibold text-sm', styles.title)}>{toast.title}</p>
          {toast.message && <p className={cn('text-sm mt-1', styles.message)}>{toast.message}</p>}
          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick();
                handleRemove();
              }}
              className={cn('text-sm font-medium underline mt-2 hover:no-underline', styles.title)}
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleRemove}
          className={cn('p-1 rounded hover:bg-black/5 dark:hover:bg-white/5', styles.icon)}
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
