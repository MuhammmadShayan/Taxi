'use client';
import { useState, useEffect, useRef } from 'react';

/**
 * LocationAutocomplete using OpenStreetMap (Nominatim API)
 * This is free and does not require an API key.
 */

const LocationAutocomplete = ({
  label,
  placeholder = "Enter location",
  value = "",
  onChange,
  onLocationChange,
  onPlaceSelect,
  className = "",
  name,
  required = false
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  // Track if the change was from a selection to avoid re-fetching
  const isSelectedRef = useRef(false);
  // Track previous typed value to trigger fetch
  const lastTypedValueRef = useRef("");

  // Sync with prop value (important for initial load and external resets)
  useEffect(() => {
    // Only update internal input if it's different from current state
    // AND we didn't just select this value ourselves
    if (value !== inputValue && !isSelectedRef.current) {
      setInputValue(value || "");
    }
    // Always clear the selection flag after sync
    if (value === inputValue) {
      isSelectedRef.current = false;
    }
  }, [value]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // OpenStreetMap Nominatim API
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'TaxiRentalPlatform/1.0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const results = Array.isArray(data) ? data : [];
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setSelectedIndex(-1);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("OSM Nominatim Error:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce API calls based on internal typing state
  useEffect(() => {
    // Don't fetch if it was a selection or if value is too short
    if (isSelectedRef.current || !inputValue || inputValue.length < 3) {
      return;
    }

    // Don't fetch if we already fetched for this exact string
    if (inputValue === lastTypedValueRef.current) {
      return;
    }

    const timeOutId = setTimeout(() => {
      lastTypedValueRef.current = inputValue;
      fetchSuggestions(inputValue);
    }, 500); // 500ms for OSM stability

    return () => clearTimeout(timeOutId);
  }, [inputValue]);

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    isSelectedRef.current = false; // Reset selection flag on typing
    setInputValue(newVal);

    // Notify parent immediately
    if (onChange) onChange(newVal);

    if (newVal === '') {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectPlace = (place) => {
    const formatted = place.display_name;
    isSelectedRef.current = true; // Block subsequent fetch for this value
    lastTypedValueRef.current = formatted;

    setInputValue(formatted);
    setShowSuggestions(false);
    setSuggestions([]);

    const locationData = {
      address: formatted,
      formatted_address: formatted,
      lat: place.lat,
      lng: place.lon,
      place_id: place.place_id,
      name: place.display_name.split(',')[0],
      raw: place
    };

    if (onChange) onChange(formatted);
    if (onLocationChange) onLocationChange(locationData);
    if (onPlaceSelect) onPlaceSelect(locationData);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        selectPlace(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="location-autocomplete-wrapper w-full" ref={wrapperRef} style={{ position: 'relative' }}>
      {label && <label className="label-text" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>{label}</label>}
      <div className="form-group relative mb-0">
        <span className="la la-map-marker form-icon" style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#888',
          zIndex: 5
        }}></span>
        <input
          type="text"
          name={name}
          className={`form-control ${className}`}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          required={required}
          autoComplete="off"
          style={{
            width: '100%',
            paddingLeft: '40px',
            paddingTop: '12px',
            paddingBottom: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            backgroundColor: '#fff'
          }}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
            <div className="spinner-border spinner-border-sm text-primary" role="status" style={{ width: '1rem', height: '1rem' }}>
              <span className="visually-hidden">...</span>
            </div>
          </div>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            className="autocomplete-dropdown shadow-lg"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              border: '1px solid #eee',
              borderRadius: '8px',
              zIndex: 1000,
              overflow: 'hidden',
              marginTop: '5px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
            }}
          >
            <ul className="list-unstyled mb-0" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {suggestions.map((place, index) => (
                <li
                  key={`${place.place_id}-${index}`}
                  onClick={() => selectPlace(place)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    padding: '12px 15px',
                    cursor: 'pointer',
                    backgroundColor: selectedIndex === index ? '#f0f4f8' : '#fff',
                    borderBottom: '1px solid #f1f1f1',
                    transition: 'background 0.2s',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <i className="la la-map-marker" style={{ marginTop: '3px', marginRight: '10px', color: '#007bff' }}></i>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#222', lineHeight: '1.4' }}>
                        {place.display_name.split(',')[0]}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {place.display_name}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              <li style={{ padding: '8px 15px', textAlign: 'right', backgroundColor: '#fdfdfd', borderTop: '1px solid #eee' }}>
                <small style={{ fontSize: '10px', color: '#aaa', fontStyle: 'italic' }}>
                  © OpenStreetMap contributors
                </small>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationAutocomplete;