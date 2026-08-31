import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export const ServerErrorPage = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fadeIn text-center text-charcoal-900 dark:text-ivory-100 min-h-[70vh] flex flex-col justify-center">
      <div className="bg-white dark:bg-forest-900 border border-gray-200 dark:border-forest-800 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 relative overflow-hidden">
        
        {/* Server Error Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/30 text-red-500 shadow-md">
          <AlertTriangle className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-charcoal-950 dark:text-white">
            Unexpected Exception
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Error Code: 500 (Internal Server Error)
          </p>
        </div>

        <p className="text-xs text-charcoal-600 dark:text-gray-400 leading-relaxed">
          The server is experiencing temporary connection lags or is down for administrative database schema updates. Please try reloading the page.
        </p>

        {/* Action Panel */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleReload}
            className="w-full py-3.5 bg-leaf-gradient hover:brightness-110 text-forest-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>

          <Link
            to="/"
            className="w-full py-3.5 bg-gray-50 dark:bg-forest-850 hover:bg-gray-100 dark:hover:bg-forest-800 text-charcoal-950 dark:text-white font-bold text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-forest-700 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-leaf-500" />
            <span>Return storefront home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;
