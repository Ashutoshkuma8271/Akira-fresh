import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/common/ScrollToTop';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Lazy Loaded Customer Storefront Pages for high-speed performance & code splitting
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const CategoriesHubPage = lazy(() => import('./pages/CategoriesHubPage').then(m => ({ default: m.CategoriesHubPage })));
const BestsellersPage = lazy(() => import('./pages/BestsellersPage').then(m => ({ default: m.BestsellersPage })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage').then(m => ({ default: m.ProductDetailsPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then(m => ({ default: m.WishlistPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage').then(m => ({ default: m.TrackOrderPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then(m => ({ default: m.AccountPage })));
const OffersPage = lazy(() => import('./pages/OffersPage').then(m => ({ default: m.OffersPage })));
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage').then(m => ({ default: m.NewArrivalsPage })));
const HelpPage = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.HelpPage })));
const ContactPage = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.ContactPage })));
const CustomerResetPasswordPage = lazy(() => import('./pages/CustomerResetPasswordPage').then(m => ({ default: m.CustomerResetPasswordPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const StaticLegalPages = lazy(() => import('./pages/StaticLegalPages').then(m => ({ default: m.StaticLegalPages })));
const PaymentFailedPage = lazy(() => import('./pages/PaymentFailedPage').then(m => ({ default: m.PaymentFailedPage })));
const PaymentPendingPage = lazy(() => import('./pages/PaymentPendingPage').then(m => ({ default: m.PaymentPendingPage })));
const ForbiddenPage = lazy(() => import('./pages/ForbiddenPage').then(m => ({ default: m.ForbiddenPage })));
const ServerErrorPage = lazy(() => import('./pages/ServerErrorPage').then(m => ({ default: m.ServerErrorPage })));
const SessionExpiredPage = lazy(() => import('./pages/SessionExpiredPage').then(m => ({ default: m.SessionExpiredPage })));
const MaintenancePage = lazy(() => import('./pages/MaintenancePage').then(m => ({ default: m.MaintenancePage })));

// Lazy Loaded Single-Admin Control Pages
const AdminSignupPage = lazy(() => import('./pages/admin/AdminSignupPage').then(m => ({ default: m.AdminSignupPage })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminForgotPasswordPage = lazy(() => import('./pages/admin/AdminForgotPasswordPage').then(m => ({ default: m.AdminForgotPasswordPage })));
const AdminResetPasswordPage = lazy(() => import('./pages/admin/AdminResetPasswordPage').then(m => ({ default: m.AdminResetPasswordPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));

// Luxury Page Loading Skeleton
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-8">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-600 animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
      </div>
    </div>
    <p className="text-xs font-serif font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 animate-pulse">
      Curating Gourmet Experience...
    </p>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      {/* React Hot Toast Notifications Container */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={6}
        containerStyle={{
          top: 20,
        }}
        toastOptions={{
          duration: 2400,
          style: {
            background: 'rgba(11, 25, 44, 0.96)',
            color: '#F8FAFC',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 6px 16px -2px rgba(0, 0, 0, 0.5), 0 0 8px rgba(16, 185, 129, 0.1)',
            borderRadius: '9999px',
            padding: '6px 13px',
            fontSize: '12px',
            fontWeight: '500',
            lineHeight: '1.3',
            maxWidth: '360px',
          },
        }}
      />


      <ThemeProvider>
        <SettingsProvider>
          <ToastProvider>
            <AuthProvider>
            <AdminAuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <OrderProvider>
                    <ScrollToTop />
                    
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        {/* Dedicated Single-Admin Routes */}
                        <Route path="/admin/signup" element={<AdminSignupPage />} />
                        <Route path="/admin/login" element={<AdminLoginPage />} />
                        <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
                        <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
                        <Route
                          path="/admin/dashboard"
                          element={
                            <AdminProtectedRoute>
                              <AdminDashboardPage />
                            </AdminProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin/profile"
                          element={
                            <AdminProtectedRoute>
                              <AdminDashboardPage />
                            </AdminProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin"
                          element={
                            <AdminProtectedRoute>
                              <AdminDashboardPage />
                            </AdminProtectedRoute>
                          }
                        />

                        {/* Customer Storefront Routes (wrapped in Storefront Layout) */}
                        <Route
                          path="/*"
                          element={
                            <Layout>
                              <ErrorBoundary>
                                <Suspense fallback={<PageLoader />}>
                                  <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/shop" element={<ShopPage />} />
                                    <Route path="/collections/all" element={<ShopPage />} />
                                    <Route path="/categories" element={<CategoriesHubPage />} />
                                    <Route path="/collections" element={<CategoriesHubPage />} />
                                    <Route path="/bestsellers" element={<BestsellersPage />} />
                                    <Route path="/collections/bestsellers" element={<BestsellersPage />} />
                                    <Route path="/category/:slug" element={<CategoryPage />} />
                                    <Route path="/product/:id" element={<ProductDetailsPage />} />
                                    <Route path="/cart" element={<CartPage />} />
                                    <Route path="/wishlist" element={<WishlistPage />} />
                                    <Route path="/checkout" element={<CheckoutPage />} />
                                    <Route path="/order-success" element={<OrderSuccessPage />} />
                                    <Route path="/track-order" element={<TrackOrderPage />} />
                                    
                                    {/* Account & Password Recovery Routes */}
                                    <Route path="/reset-password" element={<CustomerResetPasswordPage />} />
                                    <Route path="/account" element={<AccountPage />} />
                                    <Route path="/account/orders" element={<AccountPage />} />
                                    <Route path="/account/addresses" element={<AccountPage />} />
                                    <Route path="/account/profile" element={<AccountPage />} />
                                    <Route path="/account/security" element={<AccountPage />} />
                                    <Route path="/account/wishlist" element={<WishlistPage />} />

                                    {/* Offers & New Arrivals */}
                                    <Route path="/offers" element={<OffersPage />} />
                                    <Route path="/new-arrivals" element={<NewArrivalsPage />} />

                                    {/* Static / Customer Care */}
                                    <Route path="/help" element={<HelpPage />} />
                                    <Route path="/pages/about-as-foody" element={<HelpPage />} />
                                    <Route path="/about" element={<HelpPage />} />
                                    <Route path="/shipping" element={<StaticLegalPages />} />
                                    <Route path="/returns" element={<StaticLegalPages />} />
                                    <Route path="/contact" element={<ContactPage />} />
                                    <Route path="/pages/contact" element={<ContactPage />} />

                                    {/* Legal Policies */}
                                    <Route path="/privacy" element={<StaticLegalPages />} />
                                    <Route path="/terms" element={<StaticLegalPages />} />
                                    <Route path="/cookies" element={<StaticLegalPages />} />
                                    <Route path="/refund-policy" element={<StaticLegalPages />} />
                                    <Route path="/cancellation-policy" element={<StaticLegalPages />} />
                                    <Route path="/shipping-policy" element={<StaticLegalPages />} />
                                    <Route path="/return-policy" element={<StaticLegalPages />} />
                                    <Route path="/disclaimer" element={<StaticLegalPages />} />
                                    <Route path="/accessibility" element={<StaticLegalPages />} />
                                    <Route path="/security-policy" element={<StaticLegalPages />} />
                                    <Route path="/responsible-disclosure" element={<StaticLegalPages />} />

                                    {/* Customer Lifecycle & UX States */}
                                    <Route path="/payment-failed" element={<PaymentFailedPage />} />
                                    <Route path="/payment-pending" element={<PaymentPendingPage />} />
                                    <Route path="/403" element={<ForbiddenPage />} />
                                    <Route path="/500" element={<ServerErrorPage />} />
                                    <Route path="/session-expired" element={<SessionExpiredPage />} />
                                    <Route path="/maintenance" element={<MaintenancePage />} />

                                    {/* Fallback */}
                                    <Route path="*" element={<NotFoundPage />} />
                                  </Routes>
                                </Suspense>
                              </ErrorBoundary>
                            </Layout>
                          }
                        />
                      </Routes>
                    </Suspense>

                  </OrderProvider>
                </WishlistProvider>
              </CartProvider>
            </AdminAuthProvider>
          </AuthProvider>
        </ToastProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
