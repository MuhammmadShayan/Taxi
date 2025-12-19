'use client';
import { useState, useEffect, useRef } from 'react';
import Script from 'next/script'; // Import Script from next/script
import { useI18n } from '../i18n/I18nProvider';

const LocationAutocomplete = ({
  placeholder = "Enter location",
  onPlaceSelect = () => { },
  value = "",
  onChange = () => { },
  className = "form-control",
  required = false,
  ...props
}) => {
  const { lang } = useI18n();
  const inputRef = useRef(null);
  const autoCompleteRef = useRef(null);
  const [inputValue, setInputValue] = useState(value);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (!scriptLoaded) return;

    console.log("LocationAutocomplete: Script loaded, checking for google object...");

    if (window.google && window.google.maps && window.google.maps.places && inputRef.current) {
      // Check if autocomplete is already initialized
      if (!autoCompleteRef.current) {
        console.log("LocationAutocomplete: Initializing Google Maps Autocomplete...");

        try {
          autoCompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            fields: ["formatted_address", "geometry", "name", "place_id"],
            strictBounds: false,
          });

          console.log("LocationAutocomplete: Autocomplete initialized successfully");

          autoCompleteRef.current.addListener("place_changed", () => {
            console.log("LocationAutocomplete: place_changed event triggered");
            const place = autoCompleteRef.current.getPlace();
            console.log("LocationAutocomplete: Place data received:", place);

            if (place.formatted_address) {
              setInputValue(place.formatted_address);
              onChange(place.formatted_address);
              onPlaceSelect(place);
            } else if (place.name) {
              // Fallback if formatted_address is missing (rare)
              setInputValue(place.name);
              onChange(place.name);
              onPlaceSelect(place);
            } else {
              console.warn("LocationAutocomplete: Place result has no address or name", place);
            }
          });
        } catch (error) {
          console.error("LocationAutocomplete: Error initializing Autocomplete:", error);
        }
      }
    } else {
      console.warn("LocationAutocomplete: window.google or places library not available yet");
    }
  }, [scriptLoaded]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="position-relative" style={{ width: '100%' }}>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAC9IhpN0ggVpnvBYOkwMvwKzcZuPxuXX0'}&libraries=places&loading=async`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log("LocationAutocomplete: Google Maps Script loading finished successfully");
          setScriptLoaded(true);
        }}
        onError={(e) => console.error("LocationAutocomplete: Error loading Google Maps script", e)}
      />

      <input
        ref={inputRef}
        type="text"
        className={className}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        required={required}
        autoComplete="off"
        {...props}
      />
    </div>
  );
};

export default LocationAutocomplete;