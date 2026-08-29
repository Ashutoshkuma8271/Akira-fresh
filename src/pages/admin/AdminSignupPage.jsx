import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldCheck, Lock, Mail, User, ShieldAlert, ArrowRight, Sparkles, CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Logo } from '../../components/common/Logo';

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
  const [registeredEmail, setRegisteredEmail] = useState('');
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

  // Password Security Strength Calculation
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

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!strength.isStrong) {
      setErrorMessage('Please use a strong master password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special symbol).');
      return;
    }

    setIsSubmitting(true);
    const result = await signup(name, email, password, confirmPassword);
    setIsSubmitting(false);

    if (result.success) {
      setRegisteredEmail(result.email || email.trim().toLowerCase());
      setStep('otp');
    } else {
      setErrorMessage(result.message || 'Failed to create administrator account.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!otp || otp.trim().length !== 6) {
      setErrorMessage('Please enter the valid 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    const result = await verifySignupOtp(registeredEmail, otp.trim());
    setIsSubmitting(false);

    if (result.success) {
      setStep('verified');
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } else {
      setErrorMessage(result.message || 'Invalid or expired OTP code. Please check your email.');
    }
  };

  // If the backend database reports an administrator already exists:
  if (adminExists === true && step === 'form') {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center p-4 selection:bg-gold-500/30">
        <div className="w-full max-w-md bg-navy-900 border border-gold-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-fadeIn relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-gold-500/40 mx-auto flex items-center justify-center shadow-gold-sm">
            <ShieldAlert className="w-8 h-8 text-gold-400" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/30">
              Single-Admin Security Policy Active
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Admin account already exists.
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed pt-2">
              A_S FOODY enforces a strict single-administrator policy at the database level. New administrator registrations are permanently closed.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <Link
              to="/admin/login"
              className="w-full py-3.5 bg-gold-gradient text-navy-950 font-bold text-xs sm:text-sm rounded-xl shadow-gold-sm hover:brightness-105 flex items-center justify-center gap-2 transition-all"
            >
              <span>Go to Admin Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/"
              className="block text-xs text-gray-400 hover:text-gold-400 transition-colors pt-2"
            >
              Return to Storefront
            </Link>
          </div>

          <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>
    );
  }

  // Step 2: 6-Digit Email OTP Verification Screen
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center p-4 selection:bg-gold-500/30">
        <div className="w-full max-w-md bg-navy-900 border border-gold-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-fadeIn relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-gold-500/40 mx-auto flex items-center justify-center shadow-gold-sm">
            <KeyRound className="w-8 h-8 text-gold-400" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/30">
              Email Security Passcode
            </span>
            <h1 className="font-serif text-2xl font-bold text-white">
              Verify Administrator Email
            </h1>
            <p className="text-xs text-gray-300 leading-relaxed">
              We sent a 6-digit one-time passcode to <strong className="text-gold-400 font-mono">{registeredEmail}</strong>. Please enter it below to activate your administrator account:
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
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••••"
                className="w-full py-4 bg-navy-850 text-gold-400 text-center text-3xl font-mono tracking-[12px] rounded-2xl border-2 border-gold-500/40 focus:outline-none focus:border-gold-500 transition-colors shadow-inner"
              />
              <p className="text-[10px] text-gray-500 mt-2">
                ⏱️ Passcode is valid for 15 minutes.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otp.length !== 6}
              className="w-full py-3.5 bg-gold-gradient text-navy-950 font-bold text-xs sm:text-sm rounded-xl shadow-gold-sm hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying...' : 'Verify & Activate Account'}</span>
            </button>
          </form>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStep('form')}
              className="text-xs text-gray-400 hover:text-gold-400 transition-colors"
            >
              ← Back to Registration Form
            </button>
          </div>

          <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>
    );
  }

  // Step 3: Verified Success Screen
  if (step === 'verified') {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center p-4 selection:bg-gold-500/30">
        <div className="w-full max-w-md bg-navy-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-fadeIn relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Activation Complete
            </span>
            <h1 className="font-serif text-2xl font-bold text-white">
              Administrator Activated!
            </h1>
            <p className="text-xs text-gray-300 leading-relaxed">
              Your administrator account has been verified. Redirecting you to the Admin Login page...
            </p>
          </div>

          <Link
            to="/admin/login"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-gold-gradient text-navy-950 font-bold text-xs rounded-xl shadow-gold-sm hover:brightness-105"
          >
            <span>Click here to Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Step 1: Initial Administrator Registration Form
  return (
    <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center p-4 selection:bg-gold-500/30">
      <div className="w-full max-w-lg bg-navy-900 border border-gold-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 animate-fadeIn relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy-800 border border-gold-500/40 mb-2 shadow-gold-sm">
            <ShieldCheck className="w-7 h-7 text-gold-400" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/30 block w-max mx-auto">
            Initial Administrator Bootstrap
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Create A_S FOODY Admin
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            The first registered account will become the sole administrator of A_S FOODY. A 6-digit verification code will be sent to your email to confirm registration.
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
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Administrator Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gold-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full pl-10 pr-4 py-3 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Administrator Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="w-full pl-10 pr-4 py-3 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Master Password (min 8 chars)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gold-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-gold-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gold-400 transition-colors cursor-pointer p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gold-400 absolute left-3.5 top-3.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-gold-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gold-400 transition-colors cursor-pointer p-0.5"
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
            className="w-full py-3.5 bg-gold-gradient text-navy-950 font-bold text-xs sm:text-sm rounded-xl shadow-gold-sm hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Sending 6-Digit OTP...' : 'Send Verification OTP'}</span>
          </button>
        </form>

        <div className="pt-2 text-center border-t border-navy-800">
          <Link
            to="/admin/login"
            className="text-xs text-gold-400 hover:underline font-semibold"
          >
            Already registered? Go to Admin Login
          </Link>
        </div>

      </div>
    </div>
  );
};
