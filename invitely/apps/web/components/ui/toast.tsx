'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastContextType {
  toast: (opts: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...opts, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9998, display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 360 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: t.variant === 'destructive' ? '#1C0D0D' : 'var(--ink-surface)',
              border: `1px solid ${t.variant === 'destructive' ? 'rgba(224,112,112,0.25)' : 'var(--ink-border-strong)'}`,
              borderRadius: 10,
              padding: '0.875rem 1rem',
              display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              animation: 'fadeUp 0.3s ease forwards',
            }}
          >
            {/* Accent line */}
            <div style={{
              width: 3, borderRadius: 3, alignSelf: 'stretch', flexShrink: 0,
              background: t.variant === 'destructive' ? '#E07070' : 'var(--gold)',
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--champagne)', marginBottom: t.description ? '0.2rem' : 0 }}>
                {t.title}
              </p>
              {t.description && (
                <p style={{ fontSize: '0.78rem', color: 'var(--mist)', lineHeight: 1.5 }}>{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              style={{ color: 'var(--dust)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--mist)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--dust)')}
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
