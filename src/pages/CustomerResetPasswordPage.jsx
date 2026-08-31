import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, Sparkles, KeyRound, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';

export const CustomerResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { resetPasswordWithToken, resetPasswordWithOtp, setIsAuthModalOpen, setAuthMode } = useAuth();

  // Support token from query param, code param (PKCE), or Supabase recovery hash (#access_token=...)
  const hashParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.hash.replace(/^#/, '')) : new URLSearchParams();
  const tokenParam = searchParams.get('token') || searchParams.get('code') || hashParams.get('access_token') || '';
  const emailParam = searchParams.get('email') || '';

  const [activeTab, setActiveTab] = useState(tokenParam ? 'token' : 'otp'); // 'token' | 'otp'
  const [token, setToken] = useState(tokenParam);
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const strength = checkPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === 'token' && !token) {
      addToast('Invalid reset token', 'error');
      return;
    }

    if (activeTab === 'otp') {
      if (!email || !email.includes('@')) {
        addToast('Please enter your email', 'error');
        return;
      }
      if (!otp || otp.length < 6) {
        addToast('Please enter the 6-digit code', 'error');
        return;
      }
    }

    if (!strength.isStrong) {
      addToast('Password too weak', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    setSubmitting(true);
    let res = null;
    if (activeTab === 'token') {
      res = await resetPasswordWithToken(token.trim(), email.trim(), newPassword);
    } else {
      res = await resetPasswordWithOtp(email.trim(), otp.trim(), newPassword);
    }
    setSubmitting(false);

    if (res && res.success) {
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F5B83D', '#061A27', '#FFD36A', '#ffffff'],
        });
      } catch (err) {}
    }
  };

  const handleGoToLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-emerald-500/30 shadow-2xl space-y-6">
        
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy-800 border border-emerald-500/30 text-emerald-400 shadow-sm">
            {isSuccess ? <CheckCircle2 className="w-7 h-7 text-emerald-400" /> : <ShieldCheck className="w-7 h-7 text-emerald-400" />}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy-950 dark:text-white">
            {isSuccess ? 'Password Reset Complete!' : 'Set New Password'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            {isSuccess
              ? 'Your account password has been updated securely with 10-round Bcrypt encryption.'
              : 'Choose a strong, unique password for your account.'}
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-4 text-center animate-fadeIn">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 leading-relaxed">
              You can now sign in using your new credentials.
            </div>

            <button
              onClick={handleGoToLogin}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Mode Switcher Tabs */}
            <div className="flex bg-navy-850 p-1 rounded-2xl border border-navy-700">
              <button
                type="button"
                onClick={() => setActiveTab('token')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'token'
                    ? 'bg-navy-950 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                1-Click Magic Link
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('otp')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'otp'
                    ? 'bg-navy-950 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                6-Digit OTP Code
              </button>
            </div>

            {activeTab === 'token' ? (
              token ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">Magic Recovery Link Authenticated</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide">
                    Recovery Token
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste 32-byte recovery token"
                    className="w-full px-4 py-2.5 bg-navy-850 text-white text-xs font-mono rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )
            ) : (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-1">
                    Account Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-navy-850 text-white text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-1">
                    6-Digit Reset OTP *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-navy-850 text-emerald-400 text-xs tracking-widest font-mono font-bold rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500 placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-1">
                New Strong Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-navy-850 text-white text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-400 cursor-pointer p-0.5"
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {newPassword && (
                <div className="mt-2 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Strength:</span>
                    <span className={`font-semibold ${strength.color.split(' ')[1]}`}>{strength.label}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1.5">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`h-full rounded-full transition-all duration-300 ${
                          s <= strength.score ? strength.color.split(' ')[0] : 'bg-navy-750'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-navy-850 text-white text-xs rounded-xl border border-navy-700 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-400 cursor-pointer p-0.5"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {submitting ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-navy-800">
          <Link
            to="/"
            className="text-xs text-gray-400 hover:text-emerald-400 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
export default CustomerResetPasswordPage;
