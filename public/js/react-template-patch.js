/**
 * React Template Patch
 * Prevents conflicts between React components and template JavaScript
 */

(function() {
  'use strict';
  
  console.log('🔧 React Template Patch loaded');

  // Store original main.js functions to prevent conflicts
  const originalFunctions = {};

  // Prevent main.js from adding drop-menu-toggler buttons to React components
  function preventDropMenuTogglers() {
    // Find existing drop-menu-toggler buttons that might conflict
    const existingButtons = document.querySelectorAll('.drop-menu-toggler');
    existingButtons.forEach(button => {
      // Check if this button is interfering with React navigation
      const parentLi = button.closest('li');
      const reactLink = parentLi && parentLi.querySelector('a[href]');
      
      if (reactLink && reactLink.innerHTML.includes('la-angle-down')) {
        console.log('🗑️ Removing conflicting drop-menu-toggler button');
        button.remove();
      }
    });
  }

  // Debounced function to prevent excessive calls
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedPreventTogglers = debounce(preventDropMenuTogglers, 100);

  // Set up mutation observer to catch dynamic changes
  function setupObserver() {
    if (window.reactTemplateObserver) {
      window.reactTemplateObserver.disconnect();
    }

    window.reactTemplateObserver = new MutationObserver((mutations) => {
      let shouldCheck = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any added nodes contain drop-menu-toggler
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              if (node.classList && node.classList.contains('drop-menu-toggler')) {
                shouldCheck = true;
              } else if (node.querySelector && node.querySelector('.drop-menu-toggler')) {
                shouldCheck = true;
              }
            }
          });
        }
      });

      if (shouldCheck) {
        console.log('👀 Detected drop-menu-toggler addition, preventing conflicts...');
        debouncedPreventTogglers();
      }
    });

    window.reactTemplateObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    });

    console.log('👁️ Template conflict observer active');
  }

  // Initialize when DOM is ready
  function initialize() {
    console.log('🚀 Initializing React Template Patch');
    
    // Initial cleanup
    preventDropMenuTogglers();
    
    // Set up observer
    setupObserver();
    
    // Periodic cleanup (fallback)
    setInterval(preventDropMenuTogglers, 2000);
    
    console.log('✅ React Template Patch initialized successfully');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // DOM is already ready
    setTimeout(initialize, 100);
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (window.reactTemplateObserver) {
      window.reactTemplateObserver.disconnect();
    }
  });

})();
