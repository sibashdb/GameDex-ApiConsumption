import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let nextId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts(prev =>
            prev.map(t => (t.id === id ? { ...t, leaving: true } : t))
        );
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3500) => {
        const id = ++nextId;
        setToasts(prev => [...prev, { id, message, type, leaving: false }]);
        setTimeout(() => dismiss(id), duration);
        return id;
    }, [dismiss]);

    const toast = {
        success: (msg, dur) => addToast(msg, 'success', dur),
        error:   (msg, dur) => addToast(msg, 'error',   dur),
        info:    (msg, dur) => addToast(msg, 'info',    dur),
        warning: (msg, dur) => addToast(msg, 'warning', dur),
    };

    const ICONS = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="toast-wrapper">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`toast toast-${t.type}${t.leaving ? ' leaving' : ''}`}
                        onClick={() => dismiss(t.id)}
                        title="Click para cerrar"
                    >
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>{ICONS[t.type]}</span>
                        <span>{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
    return ctx;
};
