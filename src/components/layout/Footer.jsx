import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Heart, Leaf, Award, Truck, Check, Sparkles, MessageCircle, Lock } from 'lucide-react';
import { Logo } from '../common/Logo';
import { CATEGORIES } from '../../data/categories';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';

export const Footer = () => {
  const { addToast } = useToast();
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    addToast('Welcome to Akira Fresh! 15% OFF coupon sent to your email.', 'success');
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <footer className="bg-forest-950 text-ivory-100 border-t border-forest-800/80 select-none relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-leaf-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-12 border-b border-forest-800/80">
          
          {/* Col 1: Brand Info & Newsletter (Col span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="normal" />
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pr-4">
              A_S FOODY delivers restaurant-grade Awadhi Galouti kebabs, Afghani tikkas, gourmet patties, and sub-zero cold-chain delicacies directly to your kitchen across Delhi NCR.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-leaf-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                Get Gourmet Drops & Member Deals
              </h4>
              <form onSubmit={handleSubscribe} className="relative flex items-center max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email for 15% OFF..."
                  className="w-full pl-4 pr-24 py-2.5 bg-forest-900 text-ivory-100 placeholder-gray-500 text-xs rounded-full border border-forest-700 focus:outline-none focus:border-leaf-400 focus:ring-1 focus:ring-leaf-400/30 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-4 py-1.5 bg-leaf-gradient hover:brightness-110 text-forest-950 font-bold text-xs rounded-full transition-all flex items-center gap-1 shadow-leaf-sm cursor-pointer"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>
              {isSubscribed && (
                <p className="text-xs text-leaf-400 mt-2 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Subscribed! Check your inbox for your 15% promo code.</span>
                </p>
              )}
            </div>

            {/* Certifications / Food Safety */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-forest-900 border border-forest-800 text-[11px] text-gray-300">
                <ShieldCheck className="w-3.5 h-3.5 text-leaf-400" />
                <span>100% Antibiotic-Free</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-forest-900 border border-forest-800 text-[11px] text-gray-300">
                <Leaf className="w-3.5 h-3.5 text-leaf-400" />
                <span>FSSAI Certified Safe</span>
              </div>
            </div>
          </div>

          {/* Col 2: Shop Delicacies Categories (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white tracking-wide border-b border-forest-800/80 pb-2">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-leaf-400 transition-colors flex items-center justify-between group"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-gray-500 group-hover:text-leaf-400/80">&rarr;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care & Order Help (Col span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white tracking-wide border-b border-forest-800/80 pb-2">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/track-order" className="hover:text-leaf-400 transition-colors">
                  Track Live Order
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-leaf-400 transition-colors">
                  Cold-Chain & Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-leaf-400 transition-colors">
                  100% Taste Guarantee
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-leaf-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-leaf-400 transition-colors">
                  Party Combos & Coupons
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Reach Us / Delivery Zones (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white tracking-wide border-b border-forest-800/80 pb-2">
              A_S FOODY Cold Hub
            </h4>
            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-leaf-400 shrink-0 mt-0.5" />
                <span>H no 132 2nd floor Dhaka Village near kumar tailor Pin code 110009</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-leaf-400 shrink-0" />
                <span>{settings.supportPhone} (8 AM – 10 PM)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-leaf-400 shrink-0" />
                <span>{settings.supportEmail}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-lime-400 shrink-0" />
                <span className="text-lime-300 font-medium">WhatsApp: {settings.supportPhone}</span>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest-900 border border-leaf-500/30 text-[11px] text-leaf-300 font-semibold">
                  <Truck className="w-3.5 h-3.5 text-lime-400" />
                  Express 2-Hr Sub-Zero Delivery Active
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-leaf-400" />
            <span>&copy; {new Date().getFullYear()} Akira Fresh Private Limited. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-4 text-gray-400">
            <Link to="/privacy" className="hover:text-leaf-400 transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-leaf-400 transition-colors">Terms of Service</Link>
            <span>&bull;</span>
            <Link to="/disclaimer" className="hover:text-leaf-400 transition-colors">FSSAI Compliance</Link>
            <span>&bull;</span>
            <Link to="/admin/login" className="hover:text-leaf-400 transition-colors flex items-center gap-1">
              <Lock className="w-3 h-3 text-leaf-400" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

