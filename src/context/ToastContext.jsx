import React, { createContext, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const addToast = useCallback((message, type = 'success', duration = 2400) => {
    const baseStyle = {
      background: 'rgba(11, 25, 44, 0.96)',
      color: '#F8FAFC',
      backdropFilter: 'blur(12px)',
      borderRadius: '9999px',
      padding: '6px 13px',
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: '1.3',
      maxWidth: '360px',
      letterSpacing: '0.01em',
    };

    if (type === 'success') {
      toast(message, {
        duration,
        style: {
          ...baseStyle,
          border: '1px solid rgba(16, 185, 129, 0.35)',
          boxShadow: '0 6px 16px -2px rgba(0, 0, 0, 0.5), 0 0 10px rgba(16, 185, 129, 0.15)',
        },
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
      });
    } else if (type === 'error') {
      toast(message, {
        duration: duration + 600,
        style: {
          ...baseStyle,
          border: '1px solid rgba(239, 68, 68, 0.4)',
          boxShadow: '0 6px 16px -2px rgba(0, 0, 0, 0.5), 0 0 10px rgba(239, 68, 68, 0.15)',
        },
        icon: <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />,
      });
    } else if (type === 'info') {
      toast(message, {
        duration,
        style: {
          ...baseStyle,
          border: '1px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 6px 16px -2px rgba(0, 0, 0, 0.5), 0 0 10px rgba(56, 189, 248, 0.15)',
        },
        icon: <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />,
      });
    } else {
      toast(message, {
        duration,
        style: {
          ...baseStyle,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 6px 16px -2px rgba(0, 0, 0, 0.5)',
        },
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
