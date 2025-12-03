/**
 * jQuery and Owl Carousel Loader for Next.js
 * This utility handles loading jQuery and Owl Carousel in the correct order
 * for client-side components in Next.js environment
 */

class JQueryLoader {
  constructor() {
    this.isLoaded = false;
    this.isLoading = false;
    this.loadPromise = null;
  }

  /**
   * Load jQuery and Owl Carousel scripts dynamically
   * @returns {Promise} Promise that resolves when scripts are loaded
   */
  async loadScripts() {
    // If already loaded, return immediately
    if (this.isLoaded) {
      return Promise.resolve();
    }

    // If currently loading, return the existing promise
    if (this.isLoading) {
      return this.loadPromise;
    }

    // Start loading
    this.isLoading = true;
    this.loadPromise = this._loadScriptsInternal();

    try {
      await this.loadPromise;
      this.isLoaded = true;
      this.isLoading = false;
      return Promise.resolve();
    } catch (error) {
      this.isLoading = false;
      this.loadPromise = null;
      throw error;
    }
  }

  async _loadScriptsInternal() {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    // Check if jQuery is already available
    if (!window.jQuery && !window.$) {
      await this._loadScript('/html-folder/js/jquery-3.7.1.min.js');
    }

    // Ensure jQuery is available before loading plugins
    if (!window.jQuery || !window.$) {
      // Fallback: load from CDN if local jQuery fails
      await this._loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
    }

    // Load Owl Carousel after jQuery is confirmed to be loaded
    if (window.jQuery && !window.jQuery.fn.owlCarousel) {
      await this._loadScript('/html-folder/js/owl.carousel.min.js');
    }

    // Load other jQuery plugins if needed
    await this._loadAdditionalPlugins();

    // Verify that owlCarousel is available
    if (!window.jQuery.fn.owlCarousel) {
      throw new Error('Failed to load Owl Carousel plugin');
    }

    return Promise.resolve();
  }

  async _loadAdditionalPlugins() {
    const pluginsToLoad = [
      '/html-folder/js/bootstrap.bundle.min.js',
      '/html-folder/js/jquery.fancybox.min.js',
      '/html-folder/js/daterangepicker.js',
      '/html-folder/js/jquery-ui.js',
      '/html-folder/js/select2.min.js'
    ];

    // Load plugins in parallel (they don't depend on each other)
    const loadPromises = pluginsToLoad.map(src => 
      this._loadScript(src).catch(error => {
        console.warn(`Failed to load plugin: ${src}`, error);
        // Don't throw error for optional plugins
      })
    );

    await Promise.all(loadPromises);
  }

  /**
   * Load a single script dynamically
   * @param {string} src - Script source URL
   * @returns {Promise} Promise that resolves when script is loaded
   */
  _loadScript(src) {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = false; // Maintain load order
      script.defer = false;
      
      script.onload = () => {
        console.log(`✅ Loaded: ${src}`);
        resolve();
      };

      script.onerror = (error) => {
        console.error(`❌ Failed to load: ${src}`, error);
        reject(new Error(`Failed to load script: ${src}`));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Initialize Owl Carousel on a jQuery element
   * @param {string|jQuery} selector - Element selector or jQuery object
   * @param {object} options - Owl Carousel options
   * @returns {Promise} Promise that resolves when carousel is initialized
   */
  async initializeOwlCarousel(selector, options = {}) {
    await this.loadScripts();

    return new Promise((resolve, reject) => {
      try {
        const $element = window.jQuery(selector);
        
        if ($element.length === 0) {
          reject(new Error(`Element not found: ${selector}`));
          return;
        }

        // Default Owl Carousel options
        const defaultOptions = {
          items: 1,
          loop: true,
          margin: 10,
          nav: true,
          dots: true,
          autoplay: false,
          responsive: {
            0: { items: 1 },
            600: { items: 2 },
            1000: { items: 3 }
          }
        };

        const finalOptions = { ...defaultOptions, ...options };
        
        // Initialize Owl Carousel
        $element.owlCarousel(finalOptions);
        
        console.log('✅ Owl Carousel initialized successfully');
        resolve($element);
      } catch (error) {
        console.error('❌ Failed to initialize Owl Carousel:', error);
        reject(error);
      }
    });
  }

  /**
   * Destroy Owl Carousel instance
   * @param {string|jQuery} selector - Element selector or jQuery object
   */
  async destroyOwlCarousel(selector) {
    if (!this.isLoaded || typeof window === 'undefined' || !window.jQuery) {
      return;
    }

    try {
      const $element = window.jQuery(selector);
      if ($element.length > 0 && $element.data('owl.carousel')) {
        // Pause autoplay first
        $element.trigger('stop.owl.autoplay');
        
        // Destroy the carousel instance
        $element.trigger('destroy.owl.carousel');
        
        // Clean up classes more safely
        $element.removeClass('owl-carousel owl-loaded owl-drag');
        
        // Remove owl-specific attributes
        $element.removeAttr('style');
        
        // Clean up owl-stage wrapper more safely
        const $stageOuter = $element.find('.owl-stage-outer');
        if ($stageOuter.length > 0) {
          const $stage = $stageOuter.find('.owl-stage');
          if ($stage.length > 0) {
            const $items = $stage.children();
            if ($items.length > 0) {
              // Move items back to original container
              $element.append($items);
            }
          }
          // Remove the stage wrapper
          $stageOuter.remove();
        }
        
        // Remove other owl elements
        $element.siblings('.owl-nav, .owl-dots').remove();
        
        console.log('✅ Owl Carousel destroyed successfully');
      }
    } catch (error) {
      console.error('❌ Failed to destroy Owl Carousel:', error);
      // Don't re-throw the error to prevent breaking the app
    }
  }

  /**
   * Check if scripts are loaded
   * @returns {boolean} True if scripts are loaded
   */
  isReady() {
    return this.isLoaded && 
           typeof window !== 'undefined' && 
           window.jQuery && 
           window.jQuery.fn.owlCarousel;
  }
}

// Create a singleton instance
const jqueryLoader = new JQueryLoader();

export default jqueryLoader;

// Export utility functions for easier usage
export const loadJQueryPlugins = () => jqueryLoader.loadScripts();
export const initOwlCarousel = (selector, options) => jqueryLoader.initializeOwlCarousel(selector, options);
export const destroyOwlCarousel = (selector) => jqueryLoader.destroyOwlCarousel(selector);
export const isJQueryReady = () => jqueryLoader.isReady();
