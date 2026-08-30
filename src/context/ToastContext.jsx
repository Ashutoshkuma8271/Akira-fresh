import React, { createContext, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

const ToastContext = createContext(null);

const condenseMessage = (msg) => {
  if (!msg || typeof msg !== 'string') return msg;
  const clean = msg.trim();
  
  // Direct mappings for wordy notifications
  const mappings = {
    'Thank you! Your message has been received. Our team will contact you shortly.': 'Message sent successfully',
    'Thank you! Your verified patron review has been published.': 'Review published',
    'We are still waiting for the gateway to confirm the payment receipt. Please check back in a few minutes.': 'Awaiting payment confirmation',
    'Welcome to A_S FOODY! 15% OFF coupon sent to your email.': '15% OFF coupon sent to email',
    'Profile information updated successfully!': 'Profile updated',
    'Profile picture updated successfully!': 'Avatar updated',
    'Profile picture removed': 'Avatar removed',
    'Password updated securely!': 'Password updated',
    'New password must be at least 8 characters with letters, numbers and symbols.': 'Password must be 8+ characters',
    'Please select a valid image file (JPEG, PNG, WebP, GIF)': 'Invalid image format',
    'Please fill all address fields': 'All fields required',
    'Payment was cancelled or could not be completed.': 'Payment cancelled',
    'Invalid 6-digit verification code. Please check your email or enter 123456.': 'Invalid verification code',
    'Invalid 6-digit verification code. Please check and try again.': 'Invalid verification code',
    'This email belongs to a customer account. Please sign in on the Customer Storefront (/)': 'Customer account — use Storefront',
    'This email belongs to an Administrator. Please verify on the Admin Portal at /admin/signup': 'Admin account — use Admin Portal',
  };

  if (mappings[clean]) return mappings[clean];

  // If longer than 45 characters, truncate cleanly
  if (clean.length > 45) {
    return clean.slice(0, 42).trim() + '...';
  }
  return clean;
};

export const ToastProvider = ({ children }) => {
  const addToast = useCallback((message, type = 'success', duration = 2200) => {
    const compactMessage = condenseMessage(message);

    const baseStyle = {
      background: 'rgba(4, 28, 21, 0.96)',
      color: '#FAF7F0',
      backdropFilter: 'blur(14px)',
      borderRadius: '9999px',
      padding: '5px 12px',
      fontSize: '11.5px',
      fontWeight: '600',
      lineHeight: '1.25',
      maxWidth: '300px',
      letterSpacing: '0.01em',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    };

    if (type === 'success') {
      toast(compactMessage, {
        duration,
        style: {
          ...baseStyle,
          border: '1px solid rgba(16, 185, 129, 0.45)',
          boxShadow: '0 4px 14px -2px rgba(0, 0, 0, 0.6), 0 0 10px rgba(16, 185, 129, 0.25)',
        },
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
      });
    } else if (type === 'error') {
      toast(compactMessage, {
        duration: duration + 400,
        style: {
          ...baseStyle,
          border: '1px solid rgba(239, 68, 68, 0.45)',
          boxShadow: '0 4px 14px -2px rgba(0, 0, 0, 0.6), 0 0 10px rgba(239, 68, 68, 0.2)',
        },
        icon: <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />,
      });
    } else if (type === 'info') {
      toast(compactMessage, {
        duration,
        style: {
          ...baseStyle,
          border: '1px solid rgba(132, 204, 22, 0.45)',
          boxShadow: '0 4px 14px -2px rgba(0, 0, 0, 0.6), 0 0 10px rgba(132, 204, 22, 0.2)',
        },
        icon: <Info className="w-3.5 h-3.5 text-lime-400 shrink-0" />,
      });
    } else {
      toast(compactMessage, {
        duration,
        style: {
          ...baseStyle,
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 4px 14px -2px rgba(0, 0, 0, 0.6), 0 0 10px rgba(245, 158, 11, 0.2)',
        },
        icon: <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
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
