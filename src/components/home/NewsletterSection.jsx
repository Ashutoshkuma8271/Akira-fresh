import React, { useState } from 'react';
import { Mail, ArrowRight, Check, Sparkles, ShieldCheck, Flame, Tag } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const NewsletterSection = () => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      addToast('Welcome to the Akira Fresh Club! 15% OFF coupon sent to your inbox.', 'success');
      setEmail('');
    }, 600);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 select-none">
      <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden bg-gradient-to-r from-forest-950 via-forest-900 to-forest-850 border border-leaf-500/30 text-white shadow-2xl p-6 sm:p-10 lg:p-12 text-center">
        
        {/* Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-leaf-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-5 relative z-10">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-900 border border-leaf-500/40 text-xs font-bold text-lime-300">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>AKIRA VIP HARVEST CLUB</span>
          </div>

          {/* Headline */}
          <div className="space-y-1">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Fresh Drops. Exclusive Offers.
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg mx-auto">
              Be the first to savor limited-batch chef kebabs, weekend party bundles, and special subscriber discounts.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto pt-2">
            <div className="relative w-full">
              <Mail className="w-4 h-4 text-leaf-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for 15% OFF..."
                disabled={isSubmitting || isSubscribed}
                className="w-full pl-11 pr-4 py-3 bg-forest-950/90 text-white placeholder-gray-400 text-xs sm:text-sm rounded-full border border-forest-700 focus:outline-none focus:border-leaf-400 focus:ring-2 focus:ring-leaf-500/20 transition-all shadow-inner"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || isSubscribed}
              className="w-full sm:w-auto px-7 py-3 bg-leaf-gradient hover:brightness-110 disabled:opacity-75 text-forest-950 font-bold text-xs sm:text-sm rounded-full transition-all flex items-center justify-center gap-2 shadow-leaf-glow shrink-0 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 rounded-full border-2 border-forest-950 border-t-transparent animate-spin" />
              ) : isSubscribed ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <span>Join Club</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Perks Bar */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-leaf-300">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-lime-400" />
              <span>Instant 15% Welcome Coupon</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-leaf-400" />
              <span>Zero Spam • Unsubscribe Anytime</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Early Access to New Recipes</span>
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
