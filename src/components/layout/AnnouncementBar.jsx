import React from 'react';
import { Leaf, Truck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const AnnouncementBar = () => {
  const { settings } = useSettings();

  return (
    <div className="bg-[#06180E] text-white text-[11px] sm:text-xs select-none py-2 px-4 sm:px-6 lg:px-8 border-b border-[#0f3422] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Dynamic Announcement Text */}
        <div className="flex items-center gap-2 font-medium text-gray-300">
          <Leaf className="w-3.5 h-3.5 text-[#4ade80] shrink-0" />
          <span className="truncate">
            {settings.announcementText}
          </span>
        </div>

        {/* Right: Dynamic Free Delivery Threshold */}
        <div className="hidden sm:flex items-center gap-2 font-semibold text-gray-300">
          <Truck className="w-3.5 h-3.5 text-[#84CC16] shrink-0" />
          <span>
            <strong className="text-[#84CC16] font-bold">Free Delivery</strong> on Orders Above ₹{settings.freeShippingThreshold}
          </span>
        </div>

      </div>
    </div>
  );
};


