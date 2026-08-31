import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { MainHeader } from './MainHeader';
import { MobileNav } from './MobileNav';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { CartDrawer } from '../common/CartDrawer';
import { AuthModal } from '../common/AuthModal';
import { SearchModal } from '../common/SearchModal';
import { WifiOff } from 'lucide-react';

export const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100 dark:bg-forest-950 text-charcoal-900 dark:text-ivory-100 selection:bg-leaf-500 selection:text-forest-950 transition-colors overflow-x-hidden max-w-full">
      {isOffline && (
        <div className="bg-red-600 text-white text-xs font-bold text-center py-2.5 animate-fadeIn flex items-center justify-center gap-2 relative z-50 shadow-md">
          <WifiOff className="w-4 h-4 animate-pulse text-red-100" />
          <span>Internet Connection Lost. Storefront operations will resume once connection is restored.</span>
        </div>
      )}
      {/* Sticky Header Stack */}
      <header className="sticky top-0 z-40 shadow-sm">
        <AnnouncementBar />
        <MainHeader
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSearch={() => setIsSearchModalOpen(true)}
        />
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <BottomNav onOpenSearch={() => setIsSearchModalOpen(true)} />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Auth Modal */}
      <AuthModal />

      {/* Page Content with mobile bottom nav safe offset */}
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>

      {/* Footer with mobile bottom spacing */}
      <div className="pb-12 lg:pb-0">
        <Footer />
      </div>
    </div>
  );
};


