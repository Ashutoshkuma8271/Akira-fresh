import React from 'react';
import { Leaf, Truck } from 'lucide-react';

export const AnnouncementBar = () => {
  return (
    <div className="bg-[#06180E] text-white text-[11px] sm:text-xs select-none py-2 px-4 sm:px-6 lg:px-8 border-b border-[#0f3422] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Freshness Delivered • Premium Quality • Secure Checkout */}
        <div className="flex items-center gap-2 font-medium text-gray-300">
          <Leaf className="w-3.5 h-3.5 text-[#4ade80] shrink-0" />
          <span className="truncate">
            <span className="font-semibold text-white">Freshness Delivered</span> &bull; Premium Quality &bull; Secure Checkout
          </span>
        </div>

        {/* Right: Free Delivery on Orders Above ₹999 */}
        <div className="hidden sm:flex items-center gap-2 font-semibold text-gray-300">
          <Truck className="w-3.5 h-3.5 text-[#84CC16] shrink-0" />
          <span>
            <strong className="text-[#84CC16] font-bold">Free Delivery</strong> on Orders Above ₹999
          </span>
        </div>

      </div>
    </div>
  );
};


