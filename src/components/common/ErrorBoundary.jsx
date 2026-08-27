import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 text-center text-charcoal-900 dark:text-ivory-100 animate-fadeIn">
          <div className="max-w-md w-full bg-white dark:bg-forest-900 rounded-3xl p-8 border border-gray-200 dark:border-forest-800 shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-300 dark:border-amber-700">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-charcoal-950 dark:text-white">
              Something went wrong
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 dark:text-gray-300 leading-relaxed">
              We encountered a temporary display issue. Please reload the page or return to the home collection.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="px-6 py-2.5 bg-[#18392b] hover:bg-[#112a1f] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false })}
                className="px-6 py-2.5 bg-gray-100 dark:bg-forest-800 text-charcoal-900 dark:text-white font-bold text-xs rounded-xl border border-gray-300 dark:border-forest-700 hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Go to Home</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
