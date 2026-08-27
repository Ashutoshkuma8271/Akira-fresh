import React, { useState } from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { MainHeader } from './MainHeader';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { CartDrawer } from '../common/CartDrawer';
import { AuthModal } from '../common/AuthModal';

export const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100 dark:bg-forest-950 text-charcoal-900 dark:text-ivory-100 selection:bg-leaf-500 selection:text-forest-950 transition-colors">
      {/* Sticky Header Stack */}
      <header className="sticky top-0 z-40 shadow-sm">
        <AnnouncementBar />
        <MainHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      </header>

      {/* Mobile Drawer */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Auth Modal */}
      <AuthModal />

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};


