/**
 * Image CDN & Format Optimizer Utility
 * Automatically injects Next-Gen Formats (WebP, AVIF), auto-compression,
 * and responsive width parameters for Cloudinary & Unsplash CDN images.
 */
export const optimizeImage = (url, { width = 800, quality = 80, format = 'auto' } = {}) => {
  if (!url || typeof url !== 'string') return url;

  // 1. Cloudinary Optimization
  if (url.includes('res.cloudinary.com')) {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const prefix = url.slice(0, uploadIndex + 8);
      const rest = url.slice(uploadIndex + 8);
      // Avoid duplicate transformations
      if (!rest.startsWith('f_auto') && !rest.startsWith('q_auto')) {
        return `${prefix}f_${format},q_${quality},w_${width},c_limit/${rest}`;
      }
    }
    return url;
  }

  // 2. Unsplash Optimization (auto=format, q=80, w=width)
  if (url.includes('images.unsplash.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    urlObj.searchParams.set('w', width.toString());
    urlObj.searchParams.set('q', quality.toString());
    return urlObj.toString();
  }

  return url;
};

/**
 * Generate srcset for responsive HTML img / picture tags
 */
export const generateSrcSet = (url, widths = [320, 640, 960, 1200]) => {
  if (!url) return '';
  return widths
    .map((w) => `${optimizeImage(url, { width: w })} ${w}w`)
    .join(', ');
};
