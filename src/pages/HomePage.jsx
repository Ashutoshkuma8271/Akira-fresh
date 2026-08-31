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
import { AnimatedSection } from '../components/common/AnimatedSection';
import { PageTransition } from '../components/common/PageTransition';

export const HomePage = () => {
  return (
    <PageTransition className="space-y-4 sm:space-y-6 pb-12">
      {/* 1. 4-Slide Cinematic Hero Section */}
      <HeroSlider />

      {/* 2. Shop by Category (8 Rounded Cards, Mobile Horizontal Scroll) */}
      <AnimatedSection>
        <CategorySection />
      </AnimatedSection>

      {/* 3. Bestsellers Showcase (Top-Rated Delicacies) */}
      <AnimatedSection>
        <BestsellersSection />
      </AnimatedSection>

      {/* 4. Flash Sale / Weekend Offers with Live Ticking Countdown */}
      <AnimatedSection>
        <DealsBanner />
      </AnimatedSection>

      {/* 5. Family & Value Packs Editorial Section */}
      <AnimatedSection>
        <FamilyPacksSection />
      </AnimatedSection>

      {/* 6. Curated Category Product Collections (Tabbed Interactive Showcase) */}
      <AnimatedSection>
        <CategoryCollectionsSection />
      </AnimatedSection>

      {/* 7. Premium Brand Story & 5-Step Quality Journey */}
      <AnimatedSection>
        <FarmStorySection />
      </AnimatedSection>

      {/* 8. Why Choose Us (4 Pillar Distinction Cards) */}
      <AnimatedSection>
        <WhyChooseUsSection />
      </AnimatedSection>

      {/* 9. Customer Testimonials & Verified Reviews */}
      <AnimatedSection>
        <TestimonialsSection />
      </AnimatedSection>

      {/* 10. VIP Harvest Club / Newsletter Section */}
      <AnimatedSection>
        <NewsletterSection />
      </AnimatedSection>
    </PageTransition>
  );
};
