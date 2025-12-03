/**
 * React Hook for Owl Carousel in Next.js
 * This hook handles the lifecycle of Owl Carousel in React components
 */

import { useEffect, useRef, useState } from 'react';
import jqueryLoader, { initOwlCarousel, destroyOwlCarousel } from '../lib/jquery-loader';

/**
 * Custom hook for using Owl Carousel in React components
 * @param {object} options - Owl Carousel configuration options
 * @param {array} dependencies - Dependencies that trigger carousel re-initialization
 * @returns {object} Hook return object with ref, loading state, and error
 */
export function useOwlCarousel(options = {}, dependencies = []) {
  const carouselRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Default Owl Carousel options optimized for most use cases
  const defaultOptions = {
    items: 1,
    loop: true,
    margin: 10,
    nav: true,
    dots: true,
    autoplay: false,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 }
    },
    navText: [
      '<i class="la la-angle-left"></i>', 
      '<i class="la la-angle-right"></i>'
    ],
    ...options
  };

  /**
   * Initialize Owl Carousel
   */
  const initializeCarousel = async () => {
    if (!carouselRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // Wait for scripts to load and initialize carousel
      await initOwlCarousel(carouselRef.current, defaultOptions);
      
      setIsInitialized(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to initialize Owl Carousel:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  /**
   * Destroy Owl Carousel
   */
  const destroyCarousel = async () => {
    if (!carouselRef.current || !isInitialized) return;

    try {
      await destroyOwlCarousel(carouselRef.current);
      setIsInitialized(false);
    } catch (err) {
      console.error('Failed to destroy Owl Carousel:', err);
    }
  };

  /**
   * Re-initialize carousel (useful when content changes)
   */
  const reinitializeCarousel = async () => {
    if (isLoading) return; // Prevent concurrent operations
    
    try {
      setIsLoading(true);
      await destroyCarousel();
      // Add a small delay to ensure DOM is clean before reinit
      await new Promise(resolve => setTimeout(resolve, 100));
      await initializeCarousel();
    } catch (error) {
      console.error('Failed to reinitialize carousel:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  // Initialize carousel on mount and when dependencies change
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeCarousel();
    }, 100); // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(timer);
    };
  }, dependencies);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      destroyCarousel();
    };
  }, []);

  return {
    carouselRef,
    isLoading,
    error,
    isInitialized,
    reinitialize: reinitializeCarousel,
    destroy: destroyCarousel
  };
}

/**
 * Hook specifically for car/vehicle carousels with optimized settings
 * @param {array} dependencies - Dependencies that trigger carousel re-initialization
 * @returns {object} Hook return object
 */
export function useCarCarousel(dependencies = []) {
  const carOptions = {
    items: 3,
    loop: true,
    margin: 30,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4000,
    responsive: {
      0: { items: 1, margin: 15 },
      600: { items: 2, margin: 20 },
      1000: { items: 3, margin: 30 }
    },
    navText: [
      '<i class="la la-angle-left"></i>', 
      '<i class="la la-angle-right"></i>'
    ]
  };

  return useOwlCarousel(carOptions, dependencies);
}

/**
 * Hook for testimonial/review carousels
 * @param {array} dependencies - Dependencies that trigger carousel re-initialization
 * @returns {object} Hook return object
 */
export function useTestimonialCarousel(dependencies = []) {
  const testimonialOptions = {
    items: 1,
    loop: true,
    margin: 0,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 6000,
    fadeOut: true,
    responsive: {
      0: { items: 1 },
      768: { items: 1 },
      1000: { items: 1 }
    }
  };

  return useOwlCarousel(testimonialOptions, dependencies);
}

/**
 * Hook for hero/banner carousels
 * @param {array} dependencies - Dependencies that trigger carousel re-initialization
 * @returns {object} Hook return object
 */
export function useHeroCarousel(dependencies = []) {
  const heroOptions = {
    items: 1,
    loop: true,
    margin: 0,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 8000,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    responsive: {
      0: { items: 1 },
      768: { items: 1 },
      1000: { items: 1 }
    },
    navText: [
      '<i class="la la-angle-left"></i>', 
      '<i class="la la-angle-right"></i>'
    ]
  };

  return useOwlCarousel(heroOptions, dependencies);
}

/**
 * Hook for logo/client carousels
 * @param {array} dependencies - Dependencies that trigger carousel re-initialization
 * @returns {object} Hook return object
 */
export function useLogoCarousel(dependencies = []) {
  const logoOptions = {
    items: 6,
    loop: true,
    margin: 30,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
      0: { items: 2, margin: 15 },
      400: { items: 3, margin: 20 },
      600: { items: 4, margin: 25 },
      800: { items: 5, margin: 30 },
      1000: { items: 6, margin: 30 }
    }
  };

  return useOwlCarousel(logoOptions, dependencies);
}

export default useOwlCarousel;
