import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Leaf, Star, Zap } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const HeroSlider = () => {
  const { settings } = useSettings();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoPlayRef = useRef(null);

  // Countdown timer for Slide 3
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 35,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return { days: 2, hours: 14, minutes: 35, seconds: 45 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Infinite Auto-slide Every 6 Seconds
  useEffect(() => {
    if (isPaused) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, currentSlide]);

  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % 4);
  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + 4) % 4);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) handleNext();
    if (touchStartX.current - touchEndX.current < -50) handlePrev();
  };

  const slides = [
    {
      id: 0,
      badge: settings.heroBadge || 'PREMIUM FRESH MEAT',
      badgeIcon: Leaf,
      titleLine1: settings.heroHeadline ? settings.heroHeadline.split(',')[0] || 'Fresh Quality.' : 'Fresh Quality.',
      titleLine2: settings.heroHeadline ? settings.heroHeadline.split(',')[1] || 'Delivered Better.' : 'Delivered Better.',
      subtitle: settings.heroSubheadline || 'Premium products, carefully selected and delivered with freshness you can trust.',
      primaryBtnText: 'Shop Now',
      primaryBtnLink: '/shop',
      secondaryBtnText: 'Explore Collection',
      secondaryBtnLink: '/categories',
      // High-res dark culinary raw meat photography on stone slate matching uploaded mockup
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1800&auto=format&fit=crop&q=85',
    },
    {
      id: 1,
      badge: 'CUSTOMER FAVORITES',
      badgeIcon: Star,
      titleLine1: 'Your Favorites,',
      titleLine2: 'Elevated.',
      subtitle: 'Discover our award-winning Awadhi kebabs, juicy momos, and artisan non-veg platters.',
      primaryBtnText: 'Shop Best Sellers',
      primaryBtnLink: '/bestsellers',
      secondaryBtnText: 'View All Products',
      secondaryBtnLink: '/shop',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1800&auto=format&fit=crop&q=85',
    },
    {
      id: 2,
      badge: 'LIMITED TIME OFFER',
      badgeIcon: Zap,
      titleLine1: 'Premium Taste.',
      titleLine2: 'Better Value.',
      subtitle: 'Enjoy up to 35% OFF on weekend non-veg party packs and marinated barbecue specials.',
      primaryBtnText: 'Explore Offers',
      primaryBtnLink: '/offers',
      secondaryBtnText: 'Shop Now',
      secondaryBtnLink: '/shop',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=1800&auto=format&fit=crop&q=85',
      countdown: true,
    },
    {
      id: 3,
      badge: 'WHOLESOME & TRUSTED',
      badgeIcon: Leaf,
      titleLine1: 'Good Food.',
      titleLine2: 'Better Living.',
      subtitle: 'Antibiotic-free, farm-sourced premium poultry, mutton, and ready-to-grill delicacies.',
      primaryBtnText: 'Shop Now',
      primaryBtnLink: '/shop',
      secondaryBtnText: 'About A_S FOODY',
      secondaryBtnLink: '/help',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1800&auto=format&fit=crop&q=85',
    },
  ];

  return (
    <div
      className="w-full relative select-none overflow-hidden bg-black text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hero Slides Container */}
      <div className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] w-full flex items-center">
        
        {slides.map((slide, idx) => {
          const Icon = slide.badgeIcon;
          const isActive = currentSlide === idx;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 flex items-center transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Cinematic Dark Scrim */}
              <div className="absolute inset-0 z-0">
                <img
                  src={slide.image}
                  alt={slide.titleLine1}
                  className="w-full h-full object-cover object-center brightness-[0.78] contrast-[1.08]"
                />
                {/* Dark Vignette and Gradient Overlay for 100% Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
              </div>

              {/* Slide Content */}
              <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-12 relative z-10 w-full">
                <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-6 text-left">
                  
                  {/* Pill Tag (Matching Mockup: Dark Capsule + Lime Border/Text) */}
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#0a2316]/90 border border-[#84CC16]/60 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#84CC16] backdrop-blur-md shadow-lg">
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#84CC16]" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Main Headline (Matching Mockup: White Line 1, Lime Green Line 2) */}
                  <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl lg:text-[62px] font-black tracking-tight text-white leading-[1.12] sm:leading-[1.08] drop-shadow-md">
                    {slide.titleLine1} <br />
                    <span className="text-[#84CC16] sm:text-[#9ae62e]">{slide.titleLine2}</span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed font-sans max-w-lg drop-shadow-sm font-medium line-clamp-3 sm:line-clamp-none">
                    {slide.subtitle}
                  </p>

                  {/* Optional Countdown on Slide 3 */}
                  {slide.countdown && (
                    <div className="flex items-center gap-1.5 sm:gap-2 pt-1">
                      <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 text-center min-w-[42px] sm:min-w-[50px]">
                        <div className="font-mono text-xs sm:text-base font-black text-white">{String(timeLeft.days).padStart(2, '0')}</div>
                        <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 font-sans">Days</div>
                      </div>
                      <span className="font-bold text-white text-xs sm:text-base">:</span>
                      <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 text-center min-w-[42px] sm:min-w-[50px]">
                        <div className="font-mono text-xs sm:text-base font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                        <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 font-sans">Hours</div>
                      </div>
                      <span className="font-bold text-white text-xs sm:text-base">:</span>
                      <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 text-center min-w-[42px] sm:min-w-[50px]">
                        <div className="font-mono text-xs sm:text-base font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                        <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 font-sans">Mins</div>
                      </div>
                      <span className="font-bold text-white text-xs sm:text-base">:</span>
                      <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 text-center min-w-[42px] sm:min-w-[50px]">
                        <div className="font-mono text-xs sm:text-base font-black text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                        <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 font-sans">Secs</div>
                      </div>
                    </div>
                  )}

                  {/* CTA Buttons (Exact match to Mockup: Lime Green Shop Now + Translucent Dark Explore Collection) */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
                    <Link
                      to={slide.primaryBtnLink}
                      className="px-5 sm:px-8 py-2.5 sm:py-3.5 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs sm:text-sm rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
                    >
                      <span>{slide.primaryBtnText}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                    </Link>

                    <Link
                      to={slide.secondaryBtnLink}
                      className="px-4 sm:px-7 py-2.5 sm:py-3.5 bg-black/40 hover:bg-black/60 text-white font-bold text-xs sm:text-sm rounded-full border border-white/30 backdrop-blur-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
                    >
                      <span>{slide.secondaryBtnText}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          );
        })}

        {/* Floating Left / Right Circular Navigation Buttons (Matching Mockup) */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95 backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95 backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Slide Indicator Bars (Clean Sleek Pill Indicators Without 01/04 text) */}
        <div className="absolute bottom-6 left-6 sm:left-16 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx ? 'w-10 bg-[#84CC16]' : 'w-7 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};


