import React, { createContext, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

const ToastContext = createContext(null);

const condenseMessage = (msg) => {
  if (!msg || typeof msg !== 'string') return msg;
  const clean = msg.trim();
  
  // Direct mappings for all potential wordy notifications across app & backend
  const mappings = {
    // Auth & Accounts
    'User account not found. Please create an account first.': 'Account not found',
    'User account not found. Please register first.': 'Account not found',
    'User account not found.': 'Account not found',
    'User not found': 'Account not found',
    'Administrator record not found. Please register at /admin/signup': 'Admin record not found',
    'Administrator record not found.': 'Admin record not found',
    'This email belongs to a customer account. Please sign in on the Customer Storefront (/)': 'Customer account — use Storefront',
    'This email belongs to an Administrator. Please verify on the Admin Portal at /admin/signup': 'Admin account — use Admin Portal',
    'Admin account — please use Admin Portal.': 'Admin account — use Admin Portal',
    'Admin account — use Admin Portal': 'Admin account — use Admin Portal',
    'Invalid email or password.': 'Invalid email or password',
    'Please enter both email and password': 'Email and password required',
    'Password must be at least 6 characters.': 'Password min 6 characters',
    'Password must be at least 6 characters long.': 'Password min 6 characters',
    'Please enter the full 6-digit verification OTP': '6-digit OTP required',
    'Please enter a valid registered email address': 'Valid email required',
    'Please enter the 6-digit OTP code received in your email': 'Enter 6-digit OTP',
    'Password must be at least 8 chars with uppercase, lowercase, numbers, and symbols.': 'Password min 8 characters',
    'New passwords do not match. Please verify.': 'Passwords do not match',
    'New passwords do not match.': 'Passwords do not match',
    'Please enter your email above first': 'Enter your email first',
    'Admin password reset successful. Please log in.': 'Password reset successful',
    'Admin password updated successfully.': 'Password updated',
    'Master password updated successfully.': 'Password updated',
    'Password updated securely!': 'Password updated',
    'Invalid 6-digit verification code. Please check your email and enter the code sent to you.': 'Invalid verification code',
    'Invalid 6-digit verification code. Please check and try again.': 'Invalid verification code',
    'Invalid 6-digit verification code. Please check your email.': 'Invalid verification code',
    'Invalid or expired OTP.': 'Invalid or expired OTP',
    'Account is already verified': 'Account already verified',
    'OTP resent to your email': 'OTP resent to email',
    'Verification code sent': 'Verification code sent',
    'Connection error. Please try again.': 'Connection error',
    'Connection error during password reset.': 'Connection error',
    'No account found with this email. Please check your spelling.': 'Account not found',

    // Static & Contact
    'Thank you! Your message has been received. Our team will contact you shortly.': 'Message sent successfully',
    'Thank you! Your verified patron review has been published.': 'Review published',
    'We are still waiting for the gateway to confirm the payment receipt. Please check back in a few minutes.': 'Awaiting payment confirmation',
    'Welcome to A_S FOODY! 15% OFF coupon sent to your email.': '15% OFF coupon sent to email',
    'Please enter a valid email address.': 'Valid email required',
    'Coupon code FRESH15 applied! (15% OFF your fresh basket)': 'Coupon FRESH15 applied',

    // Profile & Account
    'Profile information updated successfully!': 'Profile updated',
    'Profile picture updated successfully!': 'Avatar updated',
    'Profile picture removed': 'Avatar removed',
    'Name cannot be blank': 'Name required',
    'Please fill all address fields': 'All fields required',
    'Please select a valid image file (JPEG, PNG, WebP, GIF)': 'Invalid image format',
    'Image must be under 10MB': 'Image max 10MB',
    'Failed to read image file. Please try another image.': 'Image load failed',

    // Checkout & Cart
    'Payment was cancelled or could not be completed.': 'Payment cancelled',
    'Enter recipient name': 'Recipient name required',
    'Invalid mobile number': 'Valid mobile required',
    'Invalid email address': 'Valid email required',
    'Enter street address': 'Street address required',
    'City & state required': 'City and state required',
    'Invalid 6-digit pincode': 'Valid pincode required',
    'Select delivery option': 'Delivery option required',
    'Select payment method': 'Payment method required',
    'Added to cart': 'Added to cart',
    'Removed from cart': 'Removed from cart',
    'Invalid coupon code': 'Invalid coupon code',
    'Coupon removed': 'Coupon removed',
  };

  if (mappings[clean]) return mappings[clean];

  // If unmapped, extract first concise sentence without adding any dots
  if (clean.includes('.')) {
    const firstSentence = clean.split('.')[0].trim();
    if (firstSentence.length > 0 && firstSentence.length <= 36) {
      return firstSentence;
    }
  }

  // If still long, take the first 4 words cleanly
  const words = clean.split(/\s+/);
  if (words.length > 5) {
    return words.slice(0, 4).join(' ');
  }

  return clean;
};


// In-memory debounce cache to prevent duplicate toast messages within 1.8 seconds
const recentToasts = new Map();

export const ToastProvider = ({ children }) => {
  const addToast = useCallback((message, type = 'success', duration = 2200) => {
    const compactMessage = condenseMessage(message);
    if (!compactMessage) return;

    // Deduplication check: ignore duplicate toast message within 1800ms
    const now = Date.now();
    const key = `${type}:${compactMessage.toLowerCase()}`;
    if (recentToasts.has(key) && now - recentToasts.get(key) < 1800) {
      return;
    }
    recentToasts.set(key, now);

    // Garbage-collect old keys
    if (recentToasts.size > 25) {
      for (const [k, timestamp] of recentToasts.entries()) {
        if (now - timestamp > 4000) recentToasts.delete(k);
      }
    }

    const baseStyle = {
      background: 'rgba(13, 21, 18, 0.96)',
      color: '#FBFBF9',
      backdropFilter: 'blur(14px)',
      borderRadius: '9999px',
      padding: '6px 14px',
      fontSize: '12px',
      fontWeight: '600',
      lineHeight: '1.25',
      maxWidth: '320px',
      letterSpacing: '0.01em',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
    };

    if (type === 'success') {
      toast(compactMessage, {
        duration,
        style: {
          ...baseStyle,
          border: '1px solid rgba(21, 128, 61, 0.45)',
          boxShadow: '0 4px 14px -2px rgba(0, 0, 0, 0.6), 0 0 10px rgba(21, 128, 61, 0.25)',
        },
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
      });
    } else if (type === 'error') {
      toast(compactMessage, {
        duration: duration + 400,
        style: {
          ...baseStyle,
          border: '1px solid rgba(220, 38, 38, 0.45)',
          boxShadow: '0 4px 14px -2px rgba(0, 0, 0, 0.6), 0 0 10px rgba(220, 38, 38, 0.2)',
        },
        icon: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
      });
    } else if (type === 'info') {
      toast(compactMessage, {
        duration,
        style: {
          ...baseStyle,
          border: '1px solid rgba(217, 119, 6, 0.45)',
          boxShadow: '0 4px 14px -2px rgba(0, 0, 0, 0.6), 0 0 10px rgba(217, 119, 6, 0.2)',
        },
        icon: <Info className="w-4 h-4 text-amber-400 shrink-0" />,
      });
    } else {
      toast(compactMessage, {
        duration,
        style: {
          ...baseStyle,
          border: '1px solid rgba(217, 119, 6, 0.4)',
          boxShadow: '0 4px 14px -2px rgba(0, 0, 0, 0.6), 0 0 10px rgba(217, 119, 6, 0.2)',
        },
        icon: <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />,
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
