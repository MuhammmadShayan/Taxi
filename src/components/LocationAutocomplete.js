'use client';
import { useState, useEffect, useRef } from 'react';

// START: API Configuration
// Get your free API key from https://locationiq.com/
const LOCATIONIQ_API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY || 'pk.replace_with_your_locationiq_key';
// END: API Configuration

const LocationAutocomplete = ({
  label,
  placeholder = "Enter location",
  value = "",
  onChange,
  onLocationChange, // Callback with { address, lat, lng, display_name }
  onPlaceSelect,    // Alias for onLocationChange
  className,
  name,
  required = false
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Sync internal state with prop value
  useEffect(() => {
    setInputValue(value);
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
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    if (LOCATIONIQ_API_KEY === 'pk.replace_with_your_locationiq_key') {
      console.warn("LocationIQ API Key is missing. Please add it to your environment variables.");
    }

    setIsLoading(true);
    try {
      // LocationIQ Autocomplete API
      // Limit to 5 results, format JSON
      // tag=place:city,aeroway:aerodrome,railway:station can be used to filter, 
      // but general search is usually better for UX if specific tags miss some spots.
      // We will rely on relevance.
      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(query)}&limit=5&format=json`
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce helper
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (inputValue && inputValue !== value) {
        fetchSuggestions(inputValue);
      }
    }, 300);
    return () => clearTimeout(timeOutId);
  }, [inputValue]);

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    if (onChange) onChange(newVal);

    if (newVal === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      // Clear selection if cleared
      if (onLocationChange) onLocationChange(null);
      if (onPlaceSelect) onPlaceSelect(null);
    }
  };

  const handleSuggestionClick = (place) => {
    const displayName = place.display_name;
    setInputValue(displayName);
    setShowSuggestions(false);

    // Construct the object expected by parent components
    const locationData = {
      address: displayName,
      formatted_address: displayName, // Compatibility with Google Maps format
      lat: place.lat,
      lng: place.lon, // LocationIQ returns 'lon'
      place_id: place.place_id,
      raw: place
    };

    if (onChange) onChange(displayName);
    if (onLocationChange) onLocationChange(locationData);
    if (onPlaceSelect) onPlaceSelect(locationData);
  };

  return (
    <div className="input-box w-full relative" ref={wrapperRef}>
      {label && <label className="label-text text-gray-700 font-medium mb-2">{label}</label>}
      <div className="form-group relative">
        <span className="la la-map-marker form-icon absolute left-3 top-3 text-gray-400 z-10"></span>

        <input
          type="text"
          name={name}
          className={`form-control w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className || ''}`}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          required={required}
          autoComplete="off"
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="spinner-border spinner-border-sm text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto list-none p-0 m-0 text-left">
            {suggestions.map((place) => (
              <li
                key={place.place_id}
                onClick={() => handleSuggestionClick(place)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0 text-sm text-gray-700"
              >
                <div className="font-medium text-gray-900">
                  {place.display_name.split(',')[0]}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {place.display_name}
                </div>
              </li>
            ))}
            {/* Attribution required by LocationIQ Free Tier */}
            <li className="px-2 py-1 text-right bg-gray-50">
              <small className="text-gray-400 text-xs">Search by LocationIQ.com</small>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default LocationAutocomplete;