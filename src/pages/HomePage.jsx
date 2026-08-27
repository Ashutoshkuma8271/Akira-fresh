import React from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { CategorySection } from '../components/home/CategorySection';
import { BestsellersSection } from '../components/home/BestsellersSection';
import { DealsBanner } from '../components/home/DealsBanner';
import { FamilyPacksSection } from '../components/home/FamilyPacksSection';
import { CategoryCollectionsSection } from '../components/home/CategoryCollectionsSection';
import { FarmStorySection } from '../components/home/FarmStorySection';
import { WhyChooseUsSection } from '../components/home/WhyChooseUsSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { NewsletterSection } from '../components/home/NewsletterSection';

export const HomePage = () => {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn pb-12">
      {/* 1. 4-Slide Cinematic Hero Section */}
      <HeroSlider />

      {/* 2. Shop by Category (8 Rounded Cards, Mobile Horizontal Scroll) */}
      <CategorySection />

      {/* 3. Bestsellers Showcase (Top-Rated Delicacies) */}
      <BestsellersSection />

      {/* 4. Flash Sale / Weekend Offers with Live Ticking Countdown */}
      <DealsBanner />

      {/* 5. Family & Value Packs Editorial Section */}
      <FamilyPacksSection />

      {/* 6. Curated Category Product Collections (Tabbed Interactive Showcase) */}
      <CategoryCollectionsSection />

      {/* 7. Premium Brand Story & 5-Step Quality Journey */}
      <FarmStorySection />

      {/* 8. Why Choose Us (4 Pillar Distinction Cards) */}
      <WhyChooseUsSection />

      {/* 9. Customer Testimonials & Verified Reviews */}
      <TestimonialsSection />

      {/* 10. VIP Harvest Club / Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};


