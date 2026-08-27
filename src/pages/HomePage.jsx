import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { TrustBar } from '../components/home/TrustBar';
import { CategorySection } from '../components/home/CategorySection';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { FarmStorySection } from '../components/home/FarmStorySection';
import { DealsBanner } from '../components/home/DealsBanner';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { AppDownloadSection } from '../components/home/AppDownloadSection';

export const HomePage = () => {
  return (
    <div className="space-y-2 sm:space-y-4 animate-fadeIn pb-12">
      {/* 1. Hero Section — Asymmetric Editorial 3D Produce Visual */}
      <HeroSection />

      {/* 2. Trust & Quality Promises Bar */}
      <TrustBar />

      {/* 3. Quick Category Navigation (Organic Circular Cards) */}
      <CategorySection />

      {/* 4. "Fresh Today" Product Showcase with Category Tabs */}
      <FeaturedSection />

      {/* 5. Farm-to-Home Story Section (5-Step Visual Journey) */}
      <FarmStorySection />

      {/* 6. Seasonal Promotional Deals & Countdown Flash Banner */}
      <DealsBanner />

      {/* 7. Community Customer Reviews & Verified Testimonials */}
      <TestimonialsSection />

      {/* 8. Mobile App & Express 2-Hour Delivery Section */}
      <AppDownloadSection />
    </div>
  );
};
