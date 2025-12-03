/**
 * Prevent Select2 from hijacking React-controlled select elements
 * This script runs before main.js to protect React select components
 */

(function() {
  'use strict';
  
  // Wait for jQuery and Select2 to be available
  function preventSelect2OnReactSelects() {
    if (typeof jQuery === 'undefined') {
      setTimeout(preventSelect2OnReactSelects, 50);
      return;
    }
    
    // Store original select2 function (may be undefined)
    const originalSelect2 = jQuery.fn.select2;
    
    // Override select2 initialization
    jQuery.fn.select2 = function(options) {
      // Filter out elements that should not use Select2
      const $filtered = this.filter(function() {
        const $el = jQuery(this);
        
        // Don't initialize Select2 on:
        // 1. Elements with data-no-select2 attribute
        // 2. Elements inside React root or with React-specific classes
        // 3. Language selector specifically
        if ($el.attr('data-no-select2') === 'true') {
          return false;
        }
        
        if ($el.hasClass('lang-select') || $el.attr('aria-label') === 'Language selector') {
          return false;
        }
        
        // Check if element is inside a React component
        if ($el.closest('[data-reactroot], [data-react-root], .header-right-action').length > 0) {
          return false;
        }
        
        return true;
      });
      
      // Only call original select2 on filtered elements when available
      if ($filtered.length > 0 && typeof originalSelect2 === 'function') {
        return originalSelect2.call($filtered, options);
      }
      
      return this;
    };
    
    // Copy over any properties from the original function (guarded)
    if (originalSelect2 && originalSelect2.amd) {
      jQuery.fn.select2.amd = originalSelect2.amd;
    }
    
    console.log('✅ Select2 protection enabled for React components');
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preventSelect2OnReactSelects);
  } else {
    preventSelect2OnReactSelects();
  }
  
  // Also run after a short delay to catch late initializations
  setTimeout(preventSelect2OnReactSelects, 100);
  setTimeout(preventSelect2OnReactSelects, 500);
})();
