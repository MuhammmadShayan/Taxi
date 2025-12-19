'use client';

import { useEffect, useRef } from 'react';

/**
 * GooglePlacesScript
 * 
 * This component loads the Google Maps API Script and attaches Places Autocomplete
 * to all "Pickup" and "Drop-off" input fields on the page.
 * 
 * Features:
 * - Loads script asynchronously only once (singleton pattern).
 * - Uses MutationObserver to handle dynamically loaded forms (modals, client-side nav).
 * - Identifies fields by robust placeholder and label matching.
 * - Updates visible inputs with formatted addresses.
 * - Stores lat/lng in data attributes and hidden inputs for form submission.
 */
export default function GooglePlacesScript() {
  const observerRef = useRef(null);
  const attachedInputsRef = useRef(new Set());
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // 1. Load Google Maps Script
    const loadScript = () => {
      if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
        scriptLoadedRef.current = true;
        initAutocomplete();
        return;
      }

      const script = document.createElement('script');
      // Using the user provided API key
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAC9IhpN0ggVpnvBYOkwMvwKzcZuPxuXX0&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        initAutocomplete();
      };
      document.body.appendChild(script);
    };

    // 2. Main Logic to find attached inputs
    const initAutocomplete = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) return;

      // Initial search for inputs
      checkForInputs();

      // Observe DOM for new inputs (Next.js navigation / React state changes)
      if (!observerRef.current) {
        observerRef.current = new MutationObserver((mutations) => {
          checkForInputs();
        });
        observerRef.current.observe(document.body, { childList: true, subtree: true });
      }
    };

    const checkForInputs = () => {
      const allInputs = document.querySelectorAll('input[type="text"]:not([data-gplaces-attached])');
      
      allInputs.forEach(input => {
        if (isPickupOrDropoffField(input)) {
          attachAutocomplete(input);
        }
      });
    };

    const isPickupOrDropoffField = (input) => {
      // Robust detection logic based on inspection findings
      // 1. Check Placeholder
      const ph = (input.placeholder || '').toLowerCase();
      const isPickupPlaceholder = ph.includes('city') || ph.includes('airport') || ph.includes('station') || ph.includes('destination') || ph.includes('pick');
      const isDropoffPlaceholder = ph.includes('different location') || ph.includes('drop');
      
      // 2. Check Associated Label
      let labelText = '';
      const parentLabel = input.closest('label') || input.closest('.input-box')?.querySelector('label') || input.parentElement?.querySelector('label');
      if (parentLabel) {
        labelText = parentLabel.textContent.toLowerCase();
      }
      
      const isPickupLabel = labelText.includes('pick') || labelText.includes('from') || labelText.includes('start');
      const isDropoffLabel = labelText.includes('drop') || labelText.includes('to') || labelText.includes('end');

      // Determination
      if (isPickupPlaceholder || isPickupLabel) return 'pickup';
      if (isDropoffPlaceholder || isDropoffLabel) return 'dropoff';
      
      return null;
    };

    const attachAutocomplete = (input) => {
      if (attachedInputsRef.current.has(input)) return;
      
      const fieldType = isPickupOrDropoffField(input); // 'pickup' or 'dropoff'
      if (!fieldType) return;

      // Mark as attached to avoid duplicate generic listeners (optional, though Google API handles multiple attach calls gracefully usually, better to be safe)
      input.setAttribute('data-gplaces-attached', 'true');
      attachedInputsRef.current.add(input);

      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        types: ['geocode'],
        fields: ['formatted_address', 'geometry'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry || !place.geometry.location) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address;

        // 1. Update Input Value
        input.value = address;
        // Trigger React change event manually if needed (for controlled components)
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);

        // 2. Store Data Attributes
        input.setAttribute('data-lat', lat);
        input.setAttribute('data-lng', lng);

        // 3. Update Hidden Inputs in Form
        updateHiddenInputs(input, fieldType, lat, lng);
      });
      
      // Handle "clear" - invalidation
      input.addEventListener('input', (e) => {
        if (!e.target.value) {
            input.removeAttribute('data-lat');
            input.removeAttribute('data-lng');
            clearHiddenInputs(input, fieldType);
        }
      });
    };

    const updateHiddenInputs = (visibleInput, fieldType, lat, lng) => {
      const form = visibleInput.closest('form');
      if (!form) return;

      const latName = `${fieldType}_latitude`;
      const lngName = `${fieldType}_longitude`;

      let latInput = form.querySelector(`input[name="${latName}"]`);
      if (!latInput) {
        latInput = document.createElement('input');
        latInput.type = 'hidden';
        latInput.name = latName;
        form.appendChild(latInput);
      }
      latInput.value = lat;

      let lngInput = form.querySelector(`input[name="${lngName}"]`);
      if (!lngInput) {
        lngInput = document.createElement('input');
        lngInput.type = 'hidden';
        lngInput.name = lngName;
        form.appendChild(lngInput);
      }
      lngInput.value = lng;
    };

    const clearHiddenInputs = (visibleInput, fieldType) => {
        const form = visibleInput.closest('form');
        if (!form) return;
  
        const latName = `${fieldType}_latitude`;
        const lngName = `${fieldType}_longitude`;
        
        const latInput = form.querySelector(`input[name="${latName}"]`);
        if (latInput) latInput.value = '';

        const lngInput = form.querySelector(`input[name="${lngName}"]`);
        if (lngInput) lngInput.value = '';
    }

    // Start
    loadScript();

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return null; // This component does not render visible UI
}
