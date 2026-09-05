import React from 'react';

/**
 * Shimmer base skeleton element with smooth animation and dark mode support
 */
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200/80 dark:bg-forest-800/60 rounded-xl before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 dark:before:via-white/5 before:to-transparent ${className}`}
      {...props}
    />
  );
};

/**
 * ProductCardSkeleton — Matches exact dimensions and aspect-ratio of ProductCard
 * to completely eliminate Cumulative Layout Shift (CLS).
 */
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-forest-900/90 rounded-3xl border border-sage-200/80 dark:border-leaf-500/20 overflow-hidden shadow-sm flex flex-col justify-between p-0 animate-pulse">
      {/* Product Image Placeholder */}
      <div className="relative aspect-square w-full bg-sage-100/70 dark:bg-forest-950 flex items-center justify-center p-4">
        <Skeleton className="w-full h-full rounded-2xl" />
        {/* Top Badges Skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton className="w-14 h-5 rounded-full" />
        </div>
        <div className="absolute top-3 right-3">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3 bg-white dark:bg-forest-900/90">
        <div className="space-y-2">
          {/* Brand & Weight */}
          <div className="flex items-center justify-between">
            <Skeleton className="w-20 h-3 rounded-md" />
            <Skeleton className="w-12 h-3 rounded-md" />
          </div>

          {/* Product Title */}
          <Skeleton className="w-full h-4 rounded-md" />
          <Skeleton className="w-3/4 h-4 rounded-md" />

          {/* Rating Stars */}
          <div className="flex items-center gap-1.5 pt-1">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="w-8 h-3 rounded-md" />
            <Skeleton className="w-10 h-3 rounded-md" />
          </div>
        </div>

        {/* Pricing & Add to Cart Button */}
        <div className="pt-2 border-t border-gray-100 dark:border-forest-800 flex items-center justify-between gap-2">
          <div className="space-y-1">
            <Skeleton className="w-16 h-5 rounded-md" />
            <Skeleton className="w-10 h-2.5 rounded-md" />
          </div>
          <Skeleton className="w-24 h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

/**
 * ProductGallerySkeleton — Responsive grid of ProductCardSkeleton loaders
 */
export const ProductGallerySkeleton = ({ count = 8, className = '' }) => {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

/**
 * ProductDetailSkeleton — Full-Page YouTube/Shopify-style Product Details Skeleton
 */
export const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-12 h-3 rounded-md" />
        <Skeleton className="w-3 h-3 rounded-full" />
        <Skeleton className="w-16 h-3 rounded-md" />
        <Skeleton className="w-3 h-3 rounded-full" />
        <Skeleton className="w-32 h-3 rounded-md" />
      </div>

      {/* Main Product Stage: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery Skeleton (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-3xl bg-gray-100 dark:bg-forest-900 border border-gray-200 dark:border-forest-800 overflow-hidden relative">
            <Skeleton className="w-full h-full" />
          </div>
          {/* Thumbnails Row */}
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gray-100 dark:bg-forest-900 border border-gray-200 dark:border-forest-800 overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Details & CTA Stack (Col 6) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Badges & Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-20 h-5 rounded-full" />
              <Skeleton className="w-24 h-5 rounded-full" />
            </div>
            <Skeleton className="w-4/5 h-8 rounded-lg" />
            <Skeleton className="w-3/5 h-8 rounded-lg" />
            
            {/* Rating Stars & Reviews */}
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="w-24 h-4 rounded-md" />
              <Skeleton className="w-16 h-3 rounded-md" />
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-forest-900/60 border border-gray-200/80 dark:border-forest-800 space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="w-28 h-8 rounded-lg" />
              <Skeleton className="w-16 h-5 rounded-md" />
              <Skeleton className="w-14 h-5 rounded-full" />
            </div>
            <Skeleton className="w-48 h-3 rounded-md" />
          </div>

          {/* Portion/Size Options */}
          <div className="space-y-2">
            <Skeleton className="w-24 h-3.5 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="w-24 h-10 rounded-xl" />
              <Skeleton className="w-24 h-10 rounded-xl" />
              <Skeleton className="w-24 h-10 rounded-xl" />
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <Skeleton className="w-32 h-12 rounded-2xl" />
              <Skeleton className="flex-1 h-12 rounded-2xl" />
              <Skeleton className="w-12 h-12 rounded-2xl" />
            </div>
            <Skeleton className="w-full h-12 rounded-2xl" />
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-forest-800 space-y-2">
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-10 rounded-xl" />
              <Skeleton className="w-24 h-10 rounded-xl" />
            </div>
            <Skeleton className="w-3/4 h-3 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * SearchItemSkeleton — Auto-complete search result shimmer item
 */
export const SearchItemSkeleton = () => {
  return (
    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 animate-pulse">
      <div className="flex items-center gap-3 min-w-0">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="space-y-1.5 min-w-0">
          <Skeleton className="w-36 h-3.5 rounded-md" />
          <Skeleton className="w-20 h-2.5 rounded-md" />
        </div>
      </div>
      <Skeleton className="w-16 h-5 rounded-md shrink-0" />
    </div>
  );
};

/**
 * CategoryCardSkeleton — Shimmer for category grid tiles
 */
export const CategoryCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 border border-gray-200 dark:border-forest-800 space-y-4 animate-pulse">
      <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-forest-850">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-28 h-5 rounded-md" />
        <Skeleton className="w-full h-3 rounded-md" />
        <Skeleton className="w-3/4 h-3 rounded-md" />
      </div>
      <div className="flex gap-1.5 pt-2">
        <Skeleton className="w-16 h-4 rounded-full" />
        <Skeleton className="w-16 h-4 rounded-full" />
      </div>
    </div>
  );
};

/**
 * TimelineSkeleton — Logistics live tracking timeline skeleton
 */
export const TimelineSkeleton = () => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-gray-200 dark:border-forest-800 space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-forest-800">
        <div className="space-y-1">
          <Skeleton className="w-32 h-4 rounded-md" />
          <Skeleton className="w-48 h-3 rounded-md" />
        </div>
        <Skeleton className="w-24 h-6 rounded-full" />
      </div>
      {/* 4 Steps Timeline */}
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-start">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between items-center">
                <Skeleton className="w-32 h-4 rounded-md" />
                <Skeleton className="w-20 h-3 rounded-md" />
              </div>
              <Skeleton className="w-48 h-3 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * OrderCardSkeleton — Shimmer skeleton for Supabase Orders fetching
 */
export const OrderCardSkeleton = () => {
  return (
    <div className="p-5 rounded-3xl border border-gray-200 dark:border-forest-800 bg-white dark:bg-forest-900/80 space-y-4 shadow-sm animate-pulse">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-forest-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="w-24 h-4 rounded-md" />
            <Skeleton className="w-20 h-5 rounded-full" />
          </div>
          <Skeleton className="w-32 h-3 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-8 rounded-xl" />
          <Skeleton className="w-24 h-8 rounded-xl" />
        </div>
      </div>

      {/* Items Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
            <div className="space-y-1">
              <Skeleton className="w-36 h-3.5 rounded-md" />
              <Skeleton className="w-20 h-2.5 rounded-md" />
            </div>
          </div>
          <Skeleton className="w-16 h-4 rounded-md" />
        </div>
      </div>

      {/* Footer Details */}
      <div className="pt-3 border-t border-gray-100 dark:border-forest-800 flex items-center justify-between">
        <Skeleton className="w-28 h-3 rounded-md" />
        <Skeleton className="w-24 h-5 rounded-md" />
      </div>
    </div>
  );
};

/**
 * ProfileSkeleton — Shimmer skeleton for Account & Profile page
 */
export const ProfileSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Banner / Header Skeleton */}
      <div className="rounded-3xl bg-forest-950 p-6 sm:p-8 border border-forest-800 space-y-4">
        <Skeleton className="w-32 h-5 rounded-full" />
        <Skeleton className="w-48 h-8 rounded-md" />
        <Skeleton className="w-72 h-3 rounded-md" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-forest-900 p-5 rounded-3xl border border-gray-200 dark:border-forest-800 space-y-2"
          >
            <Skeleton className="w-20 h-3 rounded-md" />
            <Skeleton className="w-12 h-7 rounded-md" />
            <Skeleton className="w-24 h-3 rounded-md" />
          </div>
        ))}
      </div>

      {/* Content Box Skeleton */}
      <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 border border-gray-200 dark:border-forest-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-forest-800">
          <Skeleton className="w-36 h-5 rounded-md" />
          <Skeleton className="w-20 h-4 rounded-md" />
        </div>
        <div className="space-y-3">
          <Skeleton className="w-full h-16 rounded-2xl" />
          <Skeleton className="w-full h-16 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
