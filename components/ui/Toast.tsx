'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const STYLES: Record<ToastType, { bg: string; border: string; icon: React.ReactNode }> = {
  success: {
    bg: '#F0FDF4',
    border: '#86EFAC',
    icon: <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />,
  },
  error: {
    bg: '#FEF2F2',
    border: '#FCA5A5',
    icon: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
  },
  info: {
    bg: '#EFF6FF',
    border: '#93C5FD',
    icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev.slice(-3), { id, type, title, message }]);
    setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);

  const success = useCallback((title: string, message?: string) => toast('success', title, message), [toast]);
  const error = useCallback((title: string, message?: string) => toast('error', title, message), [toast]);
  const info = useCallback((title: string, message?: string) => toast('info', title, message), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      {/* Toast container */}
      <div
        className="fixed bottom-20 md:bottom-5 right-4 z-[100] flex flex-col gap-2.5 items-end pointer-events-none"
        style={{ maxWidth: 360 }}
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const s = STYLES[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92, x: 40 }}
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                className="pointer-events-auto w-full"
              >
                <div
                  className="flex items-start gap-3 p-4 rounded-2xl shadow-xl"
                  style={{
                    background: s.bg,
                    border: `1.5px solid ${s.border}`,
                    minWidth: 280,
                  }}
                >
                  {s.icon}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{t.title}</p>
                    {t.message && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t.message}</p>}
                  </div>
                  <button
                    onClick={() => dismiss(t.id)}
                    className="w-6 h-6 rounded-full bg-black/8 flex items-center justify-center hover:bg-black/15 transition-colors flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}
