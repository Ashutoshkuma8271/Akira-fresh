import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);
const STORAGE_KEY = 'as_commerce_user';

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authNotice, setAuthNotice] = useState('');

  // Default to null (unauthenticated by default)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role === 'customer') {
          return parsed;
        }
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to load user auth', e);
    }
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save user auth', e);
    }
  }, [user]);

  const requireAuth = (callback, noticeText = 'Please sign in to proceed with this action') => {
    if (!user) {
      setAuthNotice(noticeText);
      setAuthMode('login');
      setIsAuthModalOpen(true);
      addToast(noticeText, 'info');
      return false;
    }
    if (callback) callback();
    return true;
  };

  const login = async (email, password) => {
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return { success: false };
    }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!data.success) {
        if (data.isAdminAccount || res.status === 403) {
          addToast('Admin account — use Admin Portal', 'info');
          return { success: false, isAdminAccount: true, message: data.message };
        }
        if (data.requireOtp) {
          addToast('Verification code sent', 'info');
          return { success: false, requireOtp: true, email: data.email };
        }
        addToast(data.message || 'Invalid email or password', 'error');
        return { success: false, message: data.message };
      }

      setUser(data.user);
      if (data.token) {
        localStorage.setItem('as_commerce_token', data.token);
      }
      setIsAuthModalOpen(false);
      setAuthNotice('');
      addToast(`Welcome, ${data.user.name.split(' ')[0]}!`, 'success');
      return { success: true };
    } catch (e) {
      addToast('Connection error. Please try again.', 'error');
      return { success: false };
    }
  };

  const register = async (name, email, password, phone = '') => {
    if (!name || !email || !password) {
      addToast('Please fill all required fields', 'error');
      return { success: false };
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, phone: phone.trim() }),
      });
      const data = await res.json();
      if (!data.success) {
        addToast(data.message || 'Registration failed', 'error');
        return { success: false, message: data.message };
      }

      if (data.requireOtp) {
        addToast('Verification code sent', 'info');
        return { success: true, requireOtp: true, email: data.email };
      }

      setUser(data.user);
      setIsAuthModalOpen(false);
      setAuthNotice('');
      addToast('Account created', 'success');
      return { success: true };
    } catch (e) {
      addToast('Connection error', 'error');
      return { success: false };
    }
  };

  const verifySignupOtp = async (email, otp) => {
    if (!email || !otp) {
      addToast('Please enter the 6-digit code', 'error');
      return { success: false };
    }
    try {
      const res = await fetch('/api/auth/verify-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (!data.success) {
        addToast(data.message || 'Verification failed', 'error');
        return { success: false, message: data.message };
      }

      if (data.user) {
        setUser(data.user);
        if (data.token) {
          localStorage.setItem('as_commerce_token', data.token);
        }
      }
      setIsAuthModalOpen(false);
      setAuthNotice('');
      addToast(`Welcome, ${data.user ? data.user.name.split(' ')[0] : 'User'}!`, 'success');
      return { success: true, user: data.user, token: data.token };
    } catch (e) {
      addToast('Verification failed', 'error');
      return { success: false };
    }
  };


  const resendSignupOtp = async (email) => {
    if (!email) {
      addToast('Email address is required', 'error');
      return { success: false };
    }
    try {
      const res = await fetch('/api/auth/resend-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!data.success) {
        addToast(data.message || 'Failed to resend OTP', 'error');
        return { success: false };
      }
      addToast('OTP resent to your email', 'success');
      return { success: true };
    } catch (e) {
      addToast('Failed to connect to server', 'error');
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('as_commerce_token');
    addToast('Logged out successfully', 'info');
  };

  const syncUserToBackend = async (payload) => {
    if (!user?.email) return null;
    try {
      return await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('as_commerce_token') || ''}`
        },
        body: JSON.stringify({ email: user.email, ...payload }),
      });
    } catch (error) {
      return null;
    }
  };

  const updateProfile = async (data, options = { notify: true }) => {
    const previousUser = user;
    setUser((prev) => ({ ...prev, ...data }));

    try {
      const response = await syncUserToBackend(data);
      if (!response?.ok) {
        setUser(previousUser);
        if (response?.status === 401) {
          setAuthNotice('Please sign in again to update your profile.');
          setAuthMode('login');
          setIsAuthModalOpen(true);
        }
        addToast(response?.status === 401 ? 'Your session expired. Please sign in again.' : 'Profile update failed.', 'error');
        return false;
      }
      if (options?.notify !== false) {
        addToast('Profile updated successfully', 'success');
      }
      return true;
    } catch (error) {
      setUser(previousUser);
      addToast('Could not save your profile changes. Please try again.', 'error');
      return false;
    }
  };

  const addAddress = (address) => {
    const newAddr = {
      id: `addr-${Date.now()}`,
      ...address,
      isDefault: !user?.addresses || user?.addresses?.length === 0 ? true : address.isDefault || false,
    };
    setUser((prev) => {
      const updatedAddresses = [...(prev?.addresses || []), newAddr];
      syncUserToBackend({ addresses: updatedAddresses });
      return {
        ...prev,
        addresses: updatedAddresses,
      };
    });
    addToast('New address saved', 'success');
  };

  const deleteAddress = (addressId) => {
    setUser((prev) => {
      const updatedAddresses = (prev?.addresses || []).filter((a) => a.id !== addressId);
      syncUserToBackend({ addresses: updatedAddresses });
      return {
        ...prev,
        addresses: updatedAddresses,
      };
    });
    addToast('Address removed', 'info');
  };

  const setDefaultAddress = (addressId) => {
    setUser((prev) => {
      const updatedAddresses = (prev?.addresses || []).map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      }));
      syncUserToBackend({ addresses: updatedAddresses });
      return {
        ...prev,
        addresses: updatedAddresses,
      };
    });
    addToast('Default address updated', 'success');
  };

  const requestPasswordReset = async (email) => {
    if (!email) {
      addToast('Please enter your registered email', 'error');
      return { success: false };
    }
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!data.success) {
        addToast(data.message || 'Request failed', 'error');
        return { success: false, message: data.message };
      }
      addToast('Recovery code sent', 'success');
      return { success: true, message: data.message, resetToken: data.resetToken, otp: data.otp };
    } catch (err) {
      addToast('Connection error', 'error');
      return { success: false };
    }
  };

  const resetPasswordWithToken = async (token, email, newPassword) => {
    if (!newPassword) {
      addToast('Please enter a new password', 'error');
      return { success: false, message: 'Please enter a new password' };
    }
    try {
      const res = await fetch('/api/auth/reset-password-with-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email: email ? email.trim() : undefined, newPassword }),
      });
      const data = await res.json();
      if (!data.success) {
        addToast(data.message || 'Reset failed', 'error');
        return { success: false, message: data.message };
      }
      addToast('Password updated', 'success');
      return { success: true };
    } catch (err) {
      addToast('Reset failed', 'error');
      return { success: false, message: 'Connection error' };
    }
  };

  const resetPasswordWithOtp = async (email, otp, newPassword) => {
    if (!email || !otp || !newPassword) {
      addToast('Please fill all fields', 'error');
      return { success: false, message: 'Missing required fields' };
    }
    try {
      const res = await fetch('/api/auth/reset-password-with-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim(), newPassword }),
      });
      const data = await res.json();
      if (!data.success) {
        addToast(data.message || 'Reset failed', 'error');
        return { success: false, message: data.message };
      }
      addToast('Password updated', 'success');
      return { success: true };
    } catch (err) {
      addToast('Reset failed', 'error');
      return { success: false, message: 'Connection error' };
    }
  };

  const resetPasswordDirect = async (email, newPassword) => {
    return resetPasswordWithToken(null, email, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        authNotice,
        setAuthNotice,
        requireAuth,
        login,
        register,
        verifySignupOtp,
        resendSignupOtp,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        requestPasswordReset,
        resetPasswordWithToken,
        resetPasswordDirect,
        resetPasswordWithOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
