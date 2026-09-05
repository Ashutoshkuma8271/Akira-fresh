import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../utils/currency';
import { generateInvoice } from '../utils/invoiceGenerator';
import { MyOrders } from '../components/account/MyOrders';
import { ProfileSkeleton } from '../components/common/SkeletonLoader';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  Edit2,
  Lock,
  ArrowRight,
  Phone,
  Mail,
  Home,
  Briefcase,
  Building,
  Check,
  Eye,
  EyeOff,
  ShoppingBag,
  Camera,
  AlertTriangle,
  FileText,
  Truck
} from 'lucide-react';
import { PageTransition } from '../components/common/PageTransition';

export const AccountPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const {
    user,
    isAuthenticated,
    setIsAuthModalOpen,
    setAuthMode,
    logout,
    deleteAccount,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAuth();
  const { orders } = useOrder();
  const { wishlistCount } = useWishlist();

  // Determine active tab from URL
  const path = location.pathname.toLowerCase();
  const activeTab = path.includes('/orders')
    ? 'orders'
    : path.includes('/addresses')
    ? 'addresses'
    : path.includes('/profile')
    ? 'profile'
    : path.includes('/security')
    ? 'security'
    : 'dashboard';

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

  // Password Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Add Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({
    title: 'Home',
    name: user?.name || '',
    phone: user?.phone || '',
    company: '',
    landmark: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  // Avatar Upload State
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  // Delete Account Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fadeIn">
        <div className="max-w-md mx-auto bg-white dark:bg-forest-900 rounded-3xl p-10 border border-gray-200 dark:border-forest-750 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#0E3723]/10 dark:bg-forest-800 mx-auto flex items-center justify-center border border-[#84CC16]/30 shadow-xs">
            <User className="w-8 h-8 text-[#0E3723] dark:text-[#84CC16]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-950 dark:text-white">Customer Account</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Sign in to view your organic orders, manage saved delivery destinations, and track live shipments in real time.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 py-3 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs rounded-xl shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setIsAuthModalOpen(true);
              }}
              className="flex-1 py-3 bg-[#0E3723] dark:bg-forest-800 text-[#84CC16] font-bold text-xs rounded-xl hover:bg-[#092417] active:scale-98 transition-all cursor-pointer border border-[#84CC16]/30"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      addToast('Name cannot be blank', 'error');
      return;
    }
    updateProfile({ name: profileName.trim(), phone: profilePhone.trim() });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast('Please enter your current password.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      addToast('New password must be at least 8 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('as_commerce_token') || ''}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword: confirmNewPassword }),
      });
      const data = await res.json();
      if (!data.success) {
        addToast(data.message || 'Failed to update password.', 'error');
        return;
      }
      addToast('Password updated securely!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      addToast('Connection error. Could not change password.', 'error');
    }
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.pincode) {
      addToast('Please fill all address fields', 'error');
      return;
    }
    addAddress(newAddr);
    setIsAddressModalOpen(false);
    setNewAddr({
      title: 'Home',
      name: user.name,
      phone: user.phone || '',
      company: '',
      landmark: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (JPEG, PNG, WebP)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('Image must be under 10MB', 'error');
      return;
    }

    setUploadingAvatar(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        updateProfile({ avatar: dataUrl }, { notify: false });
        addToast('Profile picture updated successfully!', 'success');
      }

      try {
        const formData = new FormData();
        formData.append('avatar', file);
        const res = await fetch('/api/users/upload-avatar', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('as_commerce_token') || ''}`,
          },
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            updateProfile({ avatar: data.url }, { notify: false });
          }
        }
      } catch (err) {
        console.log('Saved avatar locally via base64 data URL');
      } finally {
        setUploadingAvatar(false);
      }
    };

    reader.onerror = () => {
      addToast('Failed to read image file. Please try another image.', 'error');
      setUploadingAvatar(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDeleteAccountSubmit = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      addToast('Please type "DELETE" to confirm account deletion.', 'error');
      return;
    }

    setIsDeletingAccount(true);
    const res = await deleteAccount();
    setIsDeletingAccount(false);
    if (res.success) {
      setIsDeleteModalOpen(false);
      navigate('/');
    }
  };

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-charcoal-900 dark:text-ivory-100">
      
      {/* 1. Mobile Top Banner: User Header Profile Card */}
      <div className="lg:hidden mb-6 bg-white dark:bg-forest-900 rounded-3xl p-5 border border-gray-200/80 dark:border-forest-750 shadow-sm flex items-center gap-4">
        <div className="relative group shrink-0">
          <input
            type="file"
            ref={avatarInputRef}
            onChange={handleAvatarFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="w-14 h-14 rounded-full bg-forest-900 dark:bg-forest-800 border-2 border-[#84CC16] overflow-hidden shadow-xs flex items-center justify-center text-white font-serif font-bold text-lg">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name || 'Customer'} className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'C'}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingAvatar}
            title="Upload profile photo"
            className="absolute inset-0 bg-forest-950/70 rounded-full opacity-0 hover:opacity-100 flex items-center justify-center text-[#84CC16] transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-charcoal-950 dark:text-white text-base truncate">{user?.name || 'Valued Patron'}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ''}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-[#0E3723] dark:text-[#84CC16] bg-[#ECFCCB] dark:bg-forest-800/80 px-2.5 py-0.5 rounded-full border border-[#84CC16]/40 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#65A30D] dark:text-[#84CC16]" />
              <span>{user?.membershipTier || 'Fresh VIP Member'}</span>
            </span>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-[#0E3723] dark:hover:text-[#84CC16] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <Camera className="w-3 h-3" />
              <span>{uploadingAvatar ? 'Uploading...' : 'Change Photo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Mobile Horizontal Scrollable Tab Switcher */}
      <div className="lg:hidden mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          to="/account"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
            activeTab === 'dashboard'
              ? 'bg-[#0E3723] dark:bg-forest-800 text-[#84CC16] border border-[#84CC16]/40 shadow-xs'
              : 'bg-white dark:bg-forest-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-forest-750'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/account/orders"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
            activeTab === 'orders'
              ? 'bg-[#0E3723] dark:bg-forest-800 text-[#84CC16] border border-[#84CC16]/40 shadow-xs'
              : 'bg-white dark:bg-forest-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-forest-750'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Orders ({orders.length})</span>
        </Link>

        <Link
          to="/account/addresses"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
            activeTab === 'addresses'
              ? 'bg-[#0E3723] dark:bg-forest-800 text-[#84CC16] border border-[#84CC16]/40 shadow-xs'
              : 'bg-white dark:bg-forest-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-forest-750'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Addresses ({user.addresses?.length || 0})</span>
        </Link>

        <Link
          to="/account/profile"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
            activeTab === 'profile'
              ? 'bg-[#0E3723] dark:bg-forest-800 text-[#84CC16] border border-[#84CC16]/40 shadow-xs'
              : 'bg-white dark:bg-forest-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-forest-750'
          }`}
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Profile</span>
        </Link>

        <Link
          to="/account/security"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
            activeTab === 'security'
              ? 'bg-[#0E3723] dark:bg-forest-800 text-[#84CC16] border border-[#84CC16]/40 shadow-xs'
              : 'bg-white dark:bg-forest-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-forest-750'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Security</span>
        </Link>

        <Link
          to="/track-order"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-white dark:bg-forest-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-forest-750 shrink-0 hover:text-[#84CC16]"
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Track Live</span>
        </Link>
      </div>

      {/* Main Grid: Left Sidebar (Desktop) + Right Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Navigation Card (Desktop Col 4) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 border border-gray-200/80 dark:border-forest-750 shadow-sm space-y-6">
            
            {/* User Profile Banner with Avatar Upload */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-forest-800">
              <div className="relative group shrink-0">
                <div className="w-16 h-16 rounded-full bg-forest-900 dark:bg-forest-800 border-2 border-[#84CC16] overflow-hidden shadow-xs flex items-center justify-center text-white font-serif font-bold text-xl">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  title="Upload profile photo"
                  className="absolute inset-0 bg-forest-950/70 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#84CC16] transition-all cursor-pointer backdrop-blur-xs"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-charcoal-950 dark:text-white text-base truncate">{user.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-[#0E3723] dark:text-[#84CC16] bg-[#ECFCCB] dark:bg-forest-800/80 px-2.5 py-0.5 rounded-full border border-[#84CC16]/40 inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#65A30D] dark:text-[#84CC16]" />
                    <span>{user?.membershipTier || 'Fresh VIP Member'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-[#0E3723] dark:hover:text-[#84CC16] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Camera className="w-3 h-3" />
                    <span>{uploadingAvatar ? 'Uploading...' : 'Change Photo'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5 text-xs font-semibold">
              <Link
                to="/account"
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-[#0E3723] dark:bg-forest-800 text-[#84CC16] font-bold shadow-xs border border-[#84CC16]/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-[#84CC16]" />
                  <span>Dashboard Overview</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </Link>

              <Link
                to="/account/orders"
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                  activeTab === 'orders'
                    ? 'bg-[#0E3723] dark:bg-forest-800 text-[#84CC16] font-bold shadow-xs border border-[#84CC16]/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-[#84CC16]" />
                  <span>Orders & Delivery</span>
                </div>
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-forest-800 text-charcoal-950 dark:text-white rounded-full text-[10px]">
                  {orders.length}
                </span>
              </Link>

              <Link
                to="/account/addresses"
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-[#0E3723] dark:bg-forest-800 text-[#84CC16] font-bold shadow-xs border border-[#84CC16]/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#84CC16]" />
                  <span>Saved Addresses</span>
                </div>
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-forest-800 text-charcoal-950 dark:text-white rounded-full text-[10px]">
                  {user.addresses?.length || 0}
                </span>
              </Link>

              <Link
                to="/account/profile"
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#0E3723] dark:bg-forest-800 text-[#84CC16] font-bold shadow-xs border border-[#84CC16]/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Edit2 className="w-4 h-4 text-[#84CC16]" />
                  <span>Profile Information</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </Link>

              <Link
                to="/account/security"
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                  activeTab === 'security'
                    ? 'bg-[#0E3723] dark:bg-forest-800 text-[#84CC16] font-bold shadow-xs border border-[#84CC16]/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#84CC16]" />
                  <span>Account Security</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-800 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Wishlist Items</span>
                </div>
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-forest-800 text-charcoal-950 dark:text-white rounded-full text-[10px]">
                  {wishlistCount}
                </span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/', { replace: true });
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all text-left pt-3 border-t border-gray-100 dark:border-forest-800 mt-2 cursor-pointer font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Right Content Area (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TAB 1: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Customer Greeting Banner */}
              <div className="rounded-3xl bg-gradient-to-br from-[#0E3723] via-[#144d32] to-[#092417] text-white p-6 sm:p-8 border border-[#84CC16]/30 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2 z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84CC16]/20 border border-[#84CC16]/40 text-[#84CC16] text-[11px] font-bold uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Welcome to Akira Fresh</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {user.name}
                  </h2>
                  <p className="text-xs text-gray-300">
                    Manage your delivery destinations, track organic consignments in real-time, and explore farm-fresh harvests.
                  </p>
                </div>
                <Link
                  to="/shop"
                  className="z-10 px-5 py-2.5 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs rounded-xl shadow-md hover:brightness-110 shrink-0 cursor-pointer"
                >
                  Explore Catalog →
                </Link>
              </div>

              {/* Quick Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-forest-900 p-5 rounded-3xl border border-gray-200/80 dark:border-forest-750 shadow-sm space-y-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Orders</span>
                  <p className="text-2xl font-bold text-charcoal-950 dark:text-white font-serif">{orders.length}</p>
                  <Link to="/account/orders" className="text-[11px] text-[#0E3723] dark:text-[#84CC16] font-bold hover:underline block pt-1">
                    View Orders →
                  </Link>
                </div>

                <div className="bg-white dark:bg-forest-900 p-5 rounded-3xl border border-gray-200/80 dark:border-forest-750 shadow-sm space-y-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Saved Addresses</span>
                  <p className="text-2xl font-bold text-charcoal-950 dark:text-white font-serif">{user.addresses?.length || 0}</p>
                  <Link to="/account/addresses" className="text-[11px] text-[#0E3723] dark:text-[#84CC16] font-bold hover:underline block pt-1">
                    Manage Addresses →
                  </Link>
                </div>

                <div className="bg-white dark:bg-forest-900 p-5 rounded-3xl border border-gray-200/80 dark:border-forest-750 shadow-sm space-y-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Wishlisted Items</span>
                  <p className="text-2xl font-bold text-charcoal-950 dark:text-white font-serif">{wishlistCount}</p>
                  <Link to="/wishlist" className="text-[11px] text-[#0E3723] dark:text-[#84CC16] font-bold hover:underline block pt-1">
                    View Wishlist →
                  </Link>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 border border-gray-200/80 dark:border-forest-750 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-forest-800">
                  <h3 className="font-serif text-lg font-bold text-charcoal-950 dark:text-white">Recent Purchases</h3>
                  <Link to="/account/orders" className="text-xs text-[#0E3723] dark:text-[#84CC16] font-bold hover:underline">
                    View All Orders →
                  </Link>
                </div>

                <MyOrders limit={2} showHeader={false} />
              </div>
            </div>
          )}

          {/* TAB 2: Orders History & Tax Invoices */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-forest-750 shadow-sm space-y-6 animate-fadeIn">
              <MyOrders showHeader={true} />
            </div>
          )}

          {/* TAB 3: Saved Addresses */}
          {activeTab === 'addresses' && (
            <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-forest-750 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-forest-800">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal-950 dark:text-white">
                    Saved Delivery Addresses
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Manage your shipping locations for 1-click checkout.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="px-4 py-2.5 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs rounded-xl shadow-md hover:brightness-105 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Address</span>
                </button>
              </div>

              {!user.addresses || user.addresses.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0E3723]/10 dark:bg-forest-800 text-[#84CC16] flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-charcoal-950 dark:text-white">No saved addresses yet</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    Add your home or office address to enable swift, seamless checkout on your fresh orders.
                  </p>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="inline-block px-4 py-2 bg-[#0E3723] dark:bg-forest-800 text-[#84CC16] font-bold text-xs rounded-xl border border-[#84CC16]/30 cursor-pointer"
                  >
                    + Add First Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => {
                    const isOffice = addr.title?.toLowerCase() === 'office';
                    const isHome = addr.title?.toLowerCase() === 'home';
                    return (
                      <div
                        key={addr.id}
                        className="p-5 rounded-2xl border border-gray-200 dark:border-forest-750 bg-gray-50/60 dark:bg-forest-850 space-y-3 relative transition-all hover:border-[#84CC16]/40"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-[#84CC16]/15 text-[#65A30D] dark:text-[#84CC16]">
                              {isHome ? <Home className="w-3.5 h-3.5" /> : isOffice ? <Briefcase className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                            </span>
                            <span className="font-bold text-xs text-charcoal-950 dark:text-[#84CC16] uppercase tracking-wider">{addr.title || 'Address'}</span>
                          </div>
                          {addr.isDefault ? (
                            <span className="px-2 py-0.5 bg-[#84CC16]/15 text-[#0E3723] dark:text-[#84CC16] text-[10px] font-bold rounded-md border border-[#84CC16]/30">
                              Default Address
                            </span>
                          ) : (
                            <button
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-[10px] text-gray-400 hover:text-[#84CC16] underline cursor-pointer"
                            >
                              Set as default
                            </button>
                          )}
                        </div>

                        <div>
                          <p className="font-bold text-sm text-charcoal-950 dark:text-white">{addr.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-0.5">
                            {addr.company ? `${addr.company}, ` : ''}{addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          {addr.landmark && (
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 italic mt-0.5">
                              Landmark: {addr.landmark}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">📞 {addr.phone}</p>
                        </div>

                        {/* Real-World Delivery Window Indicator */}
                        <div className="pt-2 border-t border-gray-200/60 dark:border-forest-750 flex items-center justify-between text-[11px]">
                          <span className={`px-2 py-0.5 rounded-md font-medium ${
                            isHome 
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' 
                              : isOffice 
                              ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400' 
                              : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                          }`}>
                            {isHome ? '⚡ All 7 Days (7 AM - 9 PM)' : isOffice ? '🏢 Mon - Fri (9 AM - 6 PM)' : '📍 Safe Drop / Concierge'}
                          </span>

                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="text-xs text-red-500 hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Profile Settings & Danger Zone */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-forest-750 shadow-sm space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-gray-100 dark:border-forest-800">
                <h2 className="font-serif text-2xl font-bold text-charcoal-950 dark:text-white">
                  Personal Information
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Update your contact details for invoices, shipping & fresh arrivals.
                </p>
              </div>

              {/* Profile Photo Box */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-forest-950/80 border border-gray-200 dark:border-forest-700 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 dark:text-white">
                  Profile Photo
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative group shrink-0">
                    <div className="w-20 h-20 rounded-full bg-forest-900 dark:bg-forest-800 border-2 border-[#84CC16] overflow-hidden shadow-md flex items-center justify-center text-white font-serif font-bold text-2xl">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="px-4 py-2 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{uploadingAvatar ? 'Uploading...' : 'Upload New Picture'}</span>
                      </button>
                      {user.avatar && (
                        <button
                          type="button"
                          onClick={() => {
                            updateProfile({ avatar: '' });
                            addToast('Profile picture removed', 'info');
                          }}
                          className="px-3.5 py-2 bg-gray-200 dark:bg-forest-800 text-charcoal-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-300 dark:hover:bg-forest-750 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Supports JPG, PNG, WebP up to 10MB.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#84CC16] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-forest-950 text-charcoal-950 dark:text-white text-xs rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-[#84CC16]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#84CC16] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-forest-950/50 text-gray-500 dark:text-gray-400 text-xs rounded-xl border border-gray-200 dark:border-forest-700 cursor-not-allowed"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-1">Email is permanently tied to your customer verification</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#84CC16] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-forest-950 text-charcoal-950 dark:text-white text-xs rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-[#84CC16]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer hover:scale-102 active:scale-98"
                >
                  Save Profile Changes
                </button>
              </form>

              {/* Danger Zone: Delete Account */}
              <div className="pt-8 mt-8 border-t border-red-500/20 max-w-xl">
                <div className="rounded-2xl bg-red-500/5 dark:bg-red-950/20 border border-red-500/20 p-5 space-y-3">
                  <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <h3 className="font-serif font-bold text-base text-red-600 dark:text-red-400">Delete Customer Account</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Permanently delete your profile data, saved addresses, and active orders from Akira Fresh. You can re-register anytime in the future.
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmText('');
                        setIsDeleteModalOpen(true);
                      }}
                      className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete My Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Account Security */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-forest-750 shadow-sm space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-gray-100 dark:border-forest-800">
                <h2 className="font-serif text-2xl font-bold text-charcoal-950 dark:text-white">
                  Account Security
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Update your password to keep your account safe and encrypted.
                </p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#84CC16] absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-forest-950 text-charcoal-950 dark:text-white text-xs rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-[#84CC16]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#84CC16] absolute left-3.5 top-3" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-forest-950 text-charcoal-950 dark:text-white text-xs rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-[#84CC16]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-[#84CC16] cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#84CC16] absolute left-3.5 top-3" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-forest-950 text-charcoal-950 dark:text-white text-xs rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-[#84CC16]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-[#84CC16] cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs rounded-xl shadow-xs hover:brightness-110 cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddressModalOpen(false)} className="fixed inset-0 bg-forest-950/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-8 z-10 border border-gray-200 dark:border-forest-750 shadow-2xl space-y-4 animate-fadeIn">
            <h3 className="font-serif text-xl font-bold text-charcoal-950 dark:text-white">Add Delivery Address</h3>
            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1.5 font-semibold">Address Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Home', label: 'Home', icon: Home },
                    { id: 'Office', label: 'Office', icon: Briefcase },
                    { id: 'Other', label: 'Other', icon: MapPin },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = newAddr.title === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setNewAddr({ ...newAddr, title: t.id })}
                        className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#84CC16] text-forest-950 shadow-xs'
                            : 'bg-gray-100 dark:bg-forest-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-forest-750'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-semibold">Recipient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-forest-950 text-charcoal-950 dark:text-white rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-[#84CC16]"
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-semibold">Mobile No. *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-forest-950 text-charcoal-950 dark:text-white rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-[#84CC16]"
                />
              </div>

              {newAddr.title === 'Office' ? (
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 mb-1 font-semibold">Company / Office / Floor (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. GreenTech Labs, 5th Floor"
                    value={newAddr.company || ''}
                    onChange={(e) => setNewAddr({ ...newAddr, company: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-forest-950 text-charcoal-950 dark:text-white rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-[#84CC16]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 mb-1 font-semibold">Nearby Landmark (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Opposite Central Park"
                    value={newAddr.landmark || ''}
                    onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-forest-950 text-charcoal-950 dark:text-white rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-[#84CC16]"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-semibold">Street Address / House / Flat</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 301, Orchard Heights"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-forest-950 text-charcoal-950 dark:text-white rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-[#84CC16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-forest-950 text-charcoal-950 dark:text-white rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-[#84CC16]"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 mb-1 font-semibold">State</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharashtra"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-forest-950 text-charcoal-950 dark:text-white rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-[#84CC16]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-semibold">Pincode *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 400001"
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-forest-950 text-charcoal-950 dark:text-white rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-[#84CC16]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-forest-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black rounded-xl shadow-xs cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !isDeletingAccount && setIsDeleteModalOpen(false)}
            className="fixed inset-0 bg-forest-950/85 backdrop-blur-md transition-opacity"
          />
          <div className="relative w-full max-w-md bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-8 z-10 border border-red-500/30 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal-950 dark:text-white">Delete Account</h3>
                <p className="text-xs text-red-500 font-medium">Irreversible customer action</p>
              </div>
            </div>

            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-2 leading-relaxed bg-red-500/5 dark:bg-forest-800/50 p-4 rounded-2xl border border-red-500/15">
              <p>
                Are you sure you want to permanently delete your account for <strong>{user?.email}</strong>?
              </p>
              <ul className="list-disc pl-4 space-y-1 text-gray-500 dark:text-gray-400 text-[11px]">
                <li>All profile information and saved delivery destinations will be permanently erased.</li>
                <li>You will be signed out immediately across all active browser sessions.</li>
                <li>You may re-register with this email at any time in the future.</li>
              </ul>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Type <span className="font-mono font-bold text-red-600 dark:text-red-400">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-forest-950 text-charcoal-950 dark:text-white font-mono text-sm rounded-xl border border-gray-200 dark:border-forest-700 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 dark:bg-forest-800 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingAccount || deleteConfirmText.trim().toUpperCase() !== 'DELETE'}
                onClick={handleDeleteAccountSubmit}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeletingAccount ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </PageTransition>
  );
};
