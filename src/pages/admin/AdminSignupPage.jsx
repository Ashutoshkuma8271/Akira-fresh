import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldCheck, Lock, Mail, User, ShieldAlert, ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react';

export const AdminSignupPage = () => {
  const navigate = useNavigate();
  const { adminExists, checkAdminStatus, signup, verifySignupOtp, isAdminAuthenticated } = useAdminAuth();

  const [step, setStep] = useState('form'); // 'form' | 'otp' | 'verified'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState(() => {
    try {
      return sessionStorage.getItem('as_admin_pending_email') || '';
    } catch (e) {
      return '';
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  // Real-time password strength validation
  const checkPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-gray-700', isStrong: false };
    let score = 0;
    const hasMinLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (hasMinLength) score++;
    if (hasUpper && hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    const isStrong = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

    if (score <= 1) return { score: 1, label: 'Very Weak', color: 'bg-red-500 text-red-400', isStrong };
    if (score === 2) return { score: 2, label: 'Weak (add numbers & symbols)', color: 'bg-amber-500 text-amber-400', isStrong };
    if (score === 3) return { score: 3, label: 'Good (add special characters)', color: 'bg-blue-400 text-blue-300', isStrong };
    return { score: 4, label: 'Strong & Secure', color: 'bg-emerald-500 text-emerald-400', isStrong: true };
  };

  const strength = checkPasswordStrength(password);

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full administrator name.');
      return;
    }

    if (!strength.isStrong) {
      setErrorMessage('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const cleanEmail = email.trim().toLowerCase();
    const result = await signup(name.trim(), cleanEmail, password);
    setIsSubmitting(false);

    if (result.success) {
      const emailToUse = result.email || cleanEmail;
      setRegisteredEmail(emailToUse);
      try {
        sessionStorage.setItem('as_admin_pending_email', emailToUse);
      } catch (e) {}
      setStep('otp');
    } else {
      setErrorMessage(result.message || 'Registration failed. Administrator may already exist.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const emailToVerify = (registeredEmail || email || sessionStorage.getItem('as_admin_pending_email') || '').trim();
    if (!emailToVerify) {
      setErrorMessage('Email address missing. Please go back to registration.');
      return;
    }

    if (!otp || otp.trim().length !== 6) {
      setErrorMessage('Please enter the valid 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    const result = await verifySignupOtp(emailToVerify, otp.trim());
    setIsSubmitting(false);

    if (result.success) {
      setStep('verified');
      try {
        sessionStorage.removeItem('as_admin_pending_email');
      } catch (e) {}
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 1200);
    } else {
      setErrorMessage(result.message || 'Invalid or expired OTP code. Please check your email.');
    }
  };


  // If backend reports an administrator already exists:
  if (adminExists === true && step === 'form') {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center p-4 selection:bg-emerald-500/30">
        <div className="w-full max-w-md bg-navy-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-fadeIn relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Admin Portal Security Active
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Administrator Configured
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed pt-2">
              A_S FOODY has an active administrator account. Please log in with your credentials to manage your store.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <Link
              to="/admin/login"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:brightness-110 flex items-center justify-center transition-all cursor-pointer"
            >
              <span>Go to Admin Login</span>
            </Link>

            <Link
              to="/"
              className="block text-xs text-gray-400 hover:text-emerald-400 transition-colors pt-2"
            >
              Return to Customer Storefront
            </Link>
          </div>

          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>
    );
  }

  // Step 2: 6-Digit Email OTP Verification Screen
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center p-4 selection:bg-emerald-500/30">
        <div className="w-full max-w-md bg-navy-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-fadeIn relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-sm">
            <KeyRound className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Two-Factor Authentication
            </span>
            <h1 className="font-serif text-2xl font-bold text-white">
              Verify Administrator Email
            </h1>
            <p className="text-xs text-gray-300 leading-relaxed">
              We sent a 6-digit one-time passcode to <strong className="text-emerald-400 font-mono">{registeredEmail}</strong>. Enter it below to activate your account:
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-900/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 text-left">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label htmlFor="admin-signup-otp" className="sr-only">
                6-digit Verification Passcode
              </label>
              <input
                id="admin-signup-otp"
                name="admin_otp"
                autoComplete="one-time-code"
                type="text"
                maxLength={6}
                required
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className="w-full py-4 bg-navy-850 text-emerald-400 text-center text-3xl font-mono tracking-[12px] font-bold rounded-2xl border-2 border-emerald-500/50 focus:outline-none focus:border-emerald-400 transition-colors shadow-inner placeholder:text-gray-600"
              />
              <p className="text-[11px] text-gray-400 mt-2">
                ⏱️ Passcode is valid for 15 minutes.
              </p>
            </div>


            <button
              type="submit"
              disabled={isSubmitting || otp.length !== 6}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Verifying...' : 'Verify & Activate'}</span>
            </button>
          </form>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStep('form')}
              className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Back to Registration
            </button>
          </div>

          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>
    );
  }

  // Step 3: Verified Success Screen
  if (step === 'verified') {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center p-4 selection:bg-emerald-500/30">
        <div className="w-full max-w-md bg-navy-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-fadeIn relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Account Activated
            </span>
            <h1 className="font-serif text-2xl font-bold text-white">
              Verification Successful!
            </h1>
            <p className="text-xs text-gray-300 leading-relaxed">
              Redirecting you to the Administrator Control Panel...
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="inline-flex items-center justify-center py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs rounded-xl shadow-lg hover:brightness-110"
          >
            <span>Proceed to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  // Step 1: Administrator Registration Form
  return (
    <div className="min-h-screen bg-navy-950 text-white flex flex-col justify-center items-center p-4 selection:bg-emerald-500/30">
      <div className="w-full max-w-lg bg-navy-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 animate-fadeIn relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy-800 border border-emerald-500/40 mb-2 shadow-sm">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 block w-max mx-auto">
            A_S FOODY Administration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Create Admin Account
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Register your administrator credentials. A 6-digit verification code will be sent to your email to activate your account.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-900/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmitSignup} className="space-y-4">
          <div>
            <label htmlFor="admin-signup-name" className="block text-xs font-semibold text-gray-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
              <input
                id="admin-signup-name"
                name="admin_name"
                autoComplete="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Administrator Name"
                className="w-full pl-10 pr-4 py-3 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-signup-email" className="block text-xs font-semibold text-gray-300 mb-1.5">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
              <input
                id="admin-signup-email"
                name="admin_email"
                autoComplete="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                className="w-full pl-10 pr-4 py-3 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-signup-password" className="block text-xs font-semibold text-gray-300 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                <input
                  id="admin-signup-password"
                  name="admin_password"
                  autoComplete="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="admin-signup-confirm-password" className="block text-xs font-semibold text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                <input
                  id="admin-signup-confirm-password"
                  name="admin_confirm_password"
                  autoComplete="new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer p-0.5"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>


          {/* Real-time Password Strength Meter */}
          {password && (
            <div className="space-y-1.5 p-3 rounded-2xl bg-navy-850 border border-navy-700 animate-fadeIn">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Password Security Score:</span>
                <span className={`font-semibold ${strength.color.split(' ')[1]}`}>{strength.label}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`h-full rounded-full transition-all duration-300 ${
                      stepNumber <= strength.score ? strength.color.split(' ')[0] : 'bg-navy-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">
                Must contain at least 8 characters including uppercase, lowercase, number, and special character.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center cursor-pointer mt-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Sending OTP...' : 'Send Verification OTP'}</span>
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link
            to="/admin/login"
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            Already registered? Sign In to Admin Panel
          </Link>
        </div>

        <div className="pt-3 border-t border-navy-800 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-400 transition-colors font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Customer Storefront</span>
          </Link>
        </div>

        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>
    </div>
  );
};
