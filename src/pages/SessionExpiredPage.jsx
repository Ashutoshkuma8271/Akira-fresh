import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogIn, Home } from 'lucide-react';

export const SessionExpiredPage = () => {
  const { setUser, setIsAuthModalOpen, setAuthMode } = useAuth();

  // Clear local storage and user context to log out safely on mount
  useEffect(() => {
    setUser(null);
    localStorage.removeItem('as_commerce_user');
    localStorage.removeItem('as_commerce_token');
  }, [setUser]);

  const handleSignIn = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fadeIn text-center text-charcoal-900 dark:text-ivory-100 min-h-[70vh] flex flex-col justify-center">
      <div className="bg-white dark:bg-forest-900 border border-gray-200 dark:border-forest-800 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 relative overflow-hidden">
        
        {/* Expired Session Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-500 shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-charcoal-950 dark:text-white">
            Session Expired
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            For security, authorization tokens expire periodically.
          </p>
        </div>

        <p className="text-xs text-charcoal-600 dark:text-gray-400 leading-relaxed">
          Please sign in again to re-authorize your checkout operations, shopping cart lists, and address management.
        </p>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleSignIn}
            className="w-full py-3.5 bg-leaf-gradient hover:brightness-110 text-forest-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In Again</span>
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3.5 bg-gray-50 dark:bg-forest-850 hover:bg-gray-100 dark:hover:bg-forest-800 text-charcoal-950 dark:text-white font-bold text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-forest-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4 text-leaf-500" />
            <span>Go to Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
};
