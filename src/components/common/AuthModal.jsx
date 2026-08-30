import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  AlertTriangle,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    authNotice,
    login,
    register,
    verifySignupOtp,
    resendSignupOtp,
    requestPasswordReset,
    resetPasswordWithOtp,
  } = useAuth();
  const { addToast } = useToast();

  // Login / Register Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // OTP Verification State
  const [verificationEmail, setVerificationEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot / Reset Password Link Flow State
  const [resetEmail, setResetEmail] = useState('');
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [resetModeStep, setResetModeStep] = useState('request'); // 'request' | 'enterOtp' | 'success'

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

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

  const registerStrength = checkPasswordStrength(password);
  const resetStrength = checkPasswordStrength(resetNewPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (authMode === 'register') {
      if (!password || password.length < 6) {
        addToast('Password must be at least 6 characters.', 'error');
        return;
      }
    }


    setSubmitting(true);
    if (authMode === 'login') {
      const res = await login(email, password);
      if (res && res.requireOtp) {
        setVerificationEmail(res.email || email);
        setOtpCode('');
        setResendCooldown(60);
        setAuthMode('verifyOtp');
      }
    } else {
      const res = await register(name, email, password, phone);
      if (res && res.requireOtp) {
        setVerificationEmail(res.email || email);
        setOtpCode('');
        setResendCooldown(60);
        setAuthMode('verifyOtp');
      }
    }
    setSubmitting(false);
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      addToast('Please enter the full 6-digit verification OTP', 'error');
      return;
    }

    setSubmitting(true);
    const res = await verifySignupOtp(verificationEmail, otpCode);
    setSubmitting(false);

    if (res && res.success) {
      setEmail(verificationEmail);
      setPassword('');
      setOtpCode('');
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setSubmitting(true);
    const res = await resendSignupOtp(verificationEmail);
    if (res && res.success) {
      setResendCooldown(60);
    }
    setSubmitting(false);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(resetEmail.trim())) {
      addToast('Please enter a valid registered email address', 'error');
      return;
    }

    setSubmitting(true);
    const res = await requestPasswordReset(resetEmail.trim());
    setSubmitting(false);

    if (res && res.success) {
      setResetLinkSent(true);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
      setResetModeStep('enterOtp');
    }
  };

  const handleResetWithOtpSubmit = async (e) => {
    e.preventDefault();
    if (!resetOtp || resetOtp.length < 6) {
      addToast('Please enter the 6-digit OTP code received in your email', 'error');
      return;
    }

    if (!resetStrength.isStrong) {
      addToast('Password must be at least 8 chars with uppercase, lowercase, numbers, and symbols.', 'error');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      addToast('New passwords do not match. Please verify.', 'error');
      return;
    }

    setSubmitting(true);
    const res = await resetPasswordWithOtp(resetEmail.trim(), resetOtp.trim(), resetNewPassword);
    setSubmitting(false);

    if (res && res.success) {
      setResetModeStep('success');
      setEmail(resetEmail.trim());
      setPassword('');
      setTimeout(() => {
        setAuthMode('login');
        setResetModeStep('request');
        setResetLinkSent(false);
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-navy-900 text-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-emerald-500/30">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-navy-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-2 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-navy-800 border border-emerald-500/40 mb-3 shadow-sm">
            {authMode === 'verifyOtp' ? (
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            ) : authMode === 'forgot' ? (
              <KeyRound className="w-6 h-6 text-emerald-400" />
            ) : (
              <Sparkles className="w-6 h-6 text-emerald-400" />
            )}
          </div>
          <h3 className="font-serif text-2xl font-bold text-white mb-1">
            {authMode === 'login'
              ? 'Sign In to Your Account'
              : authMode === 'register'
              ? 'Create Customer Account'
              : authMode === 'verifyOtp'
              ? 'Verify Email'
              : 'Reset Your Password'}
          </h3>
          <p className="text-xs text-gray-400">
            {authMode === 'login'
              ? 'Enter your credentials to access your cart, orders & wishlist'
              : authMode === 'register'
              ? 'Create your account to start ordering gourmet delicacies'
              : authMode === 'verifyOtp'
              ? 'Enter the 6-digit code sent to your email to continue'
              : 'Verify your identity and update your password securely'}
          </p>
        </div>

        {/* Action Notice Alert */}
        {authNotice && authMode !== 'forgot' && (
          <div className="mx-6 my-2 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium leading-tight">{authNotice}</span>
          </div>
        )}

        {/* VERIFY SIGNUP OTP WORKFLOW */}
        {authMode === 'verifyOtp' ? (
          <div className="p-6 pt-2 space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xs text-gray-300">
                Code sent to <strong className="text-emerald-400">{verificationEmail}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div>
                <label htmlFor="auth-otp-code" className="sr-only">
                  6-digit Verification Code
                </label>
                <input
                  id="auth-otp-code"
                  name="otp_code"
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  autoComplete="one-time-code"
                  className="w-full text-center tracking-[12px] font-mono text-2xl py-3.5 bg-navy-850 text-emerald-400 font-bold rounded-2xl border-2 border-emerald-500/50 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600 shadow-inner"
                />
                <p className="text-[11px] text-gray-400 text-center mt-2">
                  ⏱️ Code is valid for 15 minutes
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting || otpCode.length < 6}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs rounded-xl shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Verifying...' : 'Continue'}
              </button>
            </form>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-navy-800">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || submitting}
                className="text-emerald-400 hover:underline disabled:no-underline disabled:text-gray-600 cursor-pointer font-medium"
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                Back to Sign Up
              </button>
            </div>
          </div>
        ) : authMode === 'forgot' ? (
          /* DUAL-MODE FORGOT PASSWORD (MAGIC LINK OR 6-DIGIT OTP) */
          <div className="p-6 pt-2">
            {resetModeStep === 'success' ? (
              <div className="space-y-4 text-center animate-fadeIn py-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-base">Password Reset Successfully!</h4>
                  <p className="text-xs text-gray-300">
                    Your password has been updated securely. Redirecting you to sign in...
                  </p>
                </div>
              </div>
            ) : resetModeStep === 'enterOtp' ? (
              <form onSubmit={handleResetWithOtpSubmit} className="space-y-3.5 animate-fadeIn">
                <div className="p-3 bg-navy-850 rounded-2xl border border-emerald-500/30 text-xs text-emerald-300">
                  <p className="font-semibold text-center text-white">Reset Code Sent to {resetEmail}</p>
                  <p className="text-[11px] text-gray-300 mt-1 text-center leading-relaxed">
                    Click the 1-click link in your email or enter the 6-digit code below:
                  </p>
                </div>

                <div>
                  <label htmlFor="auth-reset-otp" className="block text-xs font-semibold text-gray-300 mb-1">6-Digit Reset Code *</label>
                  <input
                    id="auth-reset-otp"
                    name="reset_otp"
                    autoComplete="one-time-code"
                    type="text"
                    required
                    maxLength={6}
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    className="w-full text-center tracking-[8px] font-mono text-xl py-2.5 bg-navy-850 text-emerald-400 font-bold rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor="auth-reset-new-password" className="block text-xs font-semibold text-gray-300 mb-1">New Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                    <input
                      id="auth-reset-new-password"
                      name="reset_new_password"
                      autoComplete="new-password"
                      type={showResetPassword ? 'text' : 'password'}
                      required
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer p-0.5"
                    >
                      {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {resetNewPassword && (
                    <div className="mt-2 space-y-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">Security Strength:</span>
                        <span className={`font-semibold ${resetStrength.color.split(' ')[1]}`}>{resetStrength.label}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5">
                        {[1, 2, 3, 4].map((s) => (
                          <div
                            key={s}
                            className={`h-full rounded-full transition-all duration-300 ${
                              s <= resetStrength.score ? resetStrength.color.split(' ')[0] : 'bg-navy-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="auth-reset-confirm-password" className="block text-xs font-semibold text-gray-300 mb-1">Confirm New Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                    <input
                      id="auth-reset-confirm-password"
                      name="reset_confirm_password"
                      autoComplete="new-password"
                      type={showResetConfirmPassword ? 'text' : 'password'}
                      required
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer p-0.5"
                    >
                      {showResetConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || resetOtp.length < 6}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs rounded-xl shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-50 mt-2"
                >
                  {submitting ? 'Updating Password...' : 'Save New Password'}
                </button>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-navy-800">
                  <button
                    type="button"
                    onClick={handleForgotSubmit}
                    disabled={submitting}
                    className="text-emerald-400 hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResetModeStep('request');
                      setResetLinkSent(false);
                    }}
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3.5 animate-fadeIn">
                <div>
                  <label htmlFor="auth-forgot-email" className="block text-xs font-semibold text-gray-300 mb-1">Account Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                    <input
                      id="auth-forgot-email"
                      name="forgot_email"
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                    We'll email you a secure recovery link and 6-digit passcode.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs rounded-xl shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-50 mt-2"
                >
                  {submitting ? 'Sending...' : 'Continue'}
                </button>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-navy-800">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!resetEmail) {
                        addToast('Please enter your email above first', 'info');
                        return;
                      }
                      setResetModeStep('enterOtp');
                    }}
                    className="text-emerald-400 hover:underline cursor-pointer"
                  >
                    Already have code?
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* LOGIN & REGISTER WORKFLOW */
          <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-3.5">
            {authMode === 'register' && (
              <div>
                <label htmlFor="auth-register-name" className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                  <input
                    id="auth-register-name"
                    name="customer_name"
                    autoComplete="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-customer-email" className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                <input
                  id="auth-customer-email"
                  name="customer_email"
                  autoComplete="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label htmlFor="auth-register-phone" className="block text-xs font-semibold text-gray-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                  <input
                    id="auth-register-phone"
                    name="customer_phone"
                    autoComplete="tel"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="auth-customer-password" className="block text-xs font-semibold text-gray-300">Password</label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setAuthMode('forgot');
                    }}
                    className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                <input
                  id="auth-customer-password"
                  name="customer_password"
                  autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-navy-850 text-white placeholder-gray-500 text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Real-time Password Strength Meter on Registration */}
              {authMode === 'register' && password && (
                <div className="mt-2 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Password Strength:</span>
                    <span className={`font-semibold ${registerStrength.color.split(' ')[1]}`}>{registerStrength.label}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full rounded-full transition-all duration-300 ${
                          step <= registerStrength.score ? registerStrength.color.split(' ')[0] : 'bg-navy-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    Must be at least 8 characters with uppercase, lowercase, number, and special character.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs rounded-xl shadow-lg hover:brightness-110 active:scale-98 transition-all mt-2 cursor-pointer disabled:opacity-50"
            >
              {submitting
                ? (authMode === 'login' ? 'Signing In...' : 'Creating Account...')
                : authMode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>
        )}

        {/* Footer Toggle */}
        <div className="p-4 bg-navy-950 text-center border-t border-navy-800 text-xs text-gray-400">
          {authMode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                onClick={() => setAuthMode('register')}
                className="text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Register Here
              </button>
            </p>
          ) : authMode === 'register' ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('login')}
                className="text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : authMode === 'verifyOtp' ? (
            <p>
              Already verified your account?{' '}
              <button
                onClick={() => setAuthMode('login')}
                className="text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Sign In Here
              </button>
            </p>
          ) : (
            <p>
              Remember your password?{' '}
              <button
                onClick={() => setAuthMode('login')}
                className="text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
