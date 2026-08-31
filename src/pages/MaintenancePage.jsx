import React from 'react';
import { Snowflake, ShieldAlert } from 'lucide-react';

export const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F4] dark:bg-forest-950 text-charcoal-900 dark:text-ivory-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-forest-900 border border-gray-200 dark:border-forest-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
        
        {/* Logo and Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-leaf-500/10 border border-leaf-500/30 text-leaf-500 shadow-md">
          <Snowflake className="w-8 h-8 animate-spin-slow" style={{ animationDuration: '8s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-leaf-600 dark:text-leaf-400 bg-leaf-500/10 px-3 py-1 rounded-full border border-leaf-500/30 inline-block font-bold">
            Cold-Chain Operations Updates
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-charcoal-950 dark:text-white">
            System Maintenance
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Storefront services are briefly suspended for catalog optimizations.
          </p>
        </div>

        <p className="text-xs text-charcoal-600 dark:text-gray-400 leading-relaxed">
          We are upgrading our sub-zero logistics database to speed up express delivery integrations. All placed orders remain secure and are currently being dispatched on-schedule.
        </p>

        <div className="p-4 bg-leaf-500/5 rounded-2xl border border-leaf-500/20 text-[11px] font-mono text-leaf-700 dark:text-leaf-400 space-y-1">
          <p className="font-bold">⏰ Estimated Completion Time:</p>
          <p>Within 30 Minutes</p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
