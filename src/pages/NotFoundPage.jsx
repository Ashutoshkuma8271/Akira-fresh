import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, UtensilsCrossed } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fadeIn text-charcoal-900 dark:text-ivory-100">
      <div className="bg-white dark:bg-forest-900 rounded-3xl p-10 sm:p-14 border border-gray-200 dark:border-forest-800 shadow-sm max-w-md mx-auto space-y-4">
        <div className="w-20 h-20 rounded-full bg-sage-100 dark:bg-forest-800 mx-auto flex items-center justify-center border border-leaf-500/20">
          <UtensilsCrossed className="w-10 h-10 text-leaf-600 dark:text-lime-400" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-charcoal-950 dark:text-white">404 - Page Not Found</h1>
        <p className="text-xs sm:text-sm text-charcoal-600 dark:text-gray-400">
          The delicacy or page you are looking for has been moved or does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs rounded-xl shadow-sm hover:scale-105 transition-all cursor-pointer"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      </div>
    </div>
  );
};

