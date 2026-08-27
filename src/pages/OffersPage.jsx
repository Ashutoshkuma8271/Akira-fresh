import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { COUPONS } from '../data/coupons';
import { ProductCard } from '../components/common/ProductCard';
import { useCart } from '../context/CartContext';
import { Tag, Sparkles, Flame, Copy, Check } from 'lucide-react';

export const OffersPage = () => {
  const { applyCoupon } = useCart();
  const [copiedCode, setCopiedCode] = useState(null);

  const offerProducts = PRODUCTS.filter((p) => p.isSpecialOffer || p.discountPercent >= 15);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn text-charcoal-900 dark:text-ivory-100">
      
      {/* Header Banner */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-[#061e14] via-[#092b1d] to-[#0d3b27] text-white p-8 sm:p-12 mb-10 border border-leaf-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#072418] border border-leaf-500/40 text-lime-300 text-xs font-bold uppercase">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Weekend Non-Veg Combos & Savings</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Exclusive Deals & Vouchers
          </h1>
          <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed font-sans">
            Enjoy up to 35% discount on curated party packs, mega non-veg platters, and redeem member discount codes.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-leaf-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Available Coupons Grid */}
      <div className="mb-12">
        <h3 className="font-serif text-xl font-bold text-charcoal-950 dark:text-white mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-leaf-600 dark:text-leaf-400" />
          <span>Active Promo Coupons</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COUPONS.map((c) => (
            <div
              key={c.code}
              className="bg-white dark:bg-forest-900 p-5 rounded-2xl border-2 border-dashed border-leaf-500/40 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-base text-leaf-800 dark:text-lime-300 bg-leaf-500/15 px-3 py-1 rounded-lg">
                    {c.code}
                  </span>
                  <span className="text-xs font-black text-leaf-600 dark:text-lime-400">
                    {c.discountPercent ? `${c.discountPercent}% OFF` : `₹${c.discountAmount} OFF`}
                  </span>
                </div>
                <p className="text-xs text-charcoal-600 dark:text-gray-300 mt-2">{c.description}</p>
              </div>

              <button
                onClick={() => handleCopy(c.code)}
                className="w-full py-2 bg-[#0E3723] dark:bg-[#84CC16] text-white dark:text-forest-950 font-bold text-xs rounded-xl hover:opacity-90 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-lime-400 dark:text-forest-950" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === c.code ? 'Applied to Cart!' : 'Copy & Apply'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Discounted Products Grid */}
      <div>
        <h3 className="font-serif text-xl font-bold text-charcoal-950 dark:text-white mb-6">
          Featured Non-Veg Offers ({offerProducts.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {offerProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

    </div>
  );
};

