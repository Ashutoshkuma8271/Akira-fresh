import React, { createContext, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const addToast = useCallback((message, type = 'success', duration = 2500) => {
    const toastStyle = {
      background: '#0B192C',
      color: '#F1F5F9',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.6), 0 0 10px rgba(16, 185, 129, 0.15)',
      borderRadius: '12px',
      padding: '8px 14px',
      fontSize: '12px',
      fontWeight: '600',
    };

    if (type === 'success') {
      toast.success(message, {
        duration,
        style: toastStyle,
        iconTheme: {
          primary: '#10B981',
          secondary: '#0B192C',
        },
      });
    } else if (type === 'error') {
      toast.error(message, {
        duration,
        style: {
          ...toastStyle,
          border: '1px solid rgba(239, 68, 68, 0.4)',
          boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.6), 0 0 10px rgba(239, 68, 68, 0.15)',
        },
        iconTheme: {
          primary: '#EF4444',
          secondary: '#0B192C',
        },
      });
    } else {
      toast(message, {
        duration,
        style: toastStyle,
        icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
      });
    }
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
