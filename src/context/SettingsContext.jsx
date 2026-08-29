import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  announcementText: '✨ Complimentary Sub-Zero Delivery Across Delhi NCR on Orders Above ₹999',
  freeShippingThreshold: 999,
  heroBadge: 'GOURMET PARTY COLLECTION 2026',
  heroHeadline: 'Gourmet Chicken & Mutton Snacks, Delivered Cold.',
  heroSubheadline: 'Discover premium ready-to-cook kebabs, marinated cuts, and sub-zero cold-chain delicacies delivered to your doorstep.',
  heroDiscount: '15% OFF',
  supportPhone: '+91 63862 56770',
  supportEmail: 'ashukumarfbg8271@gmail.com',
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load dynamic site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = () => {
    fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
