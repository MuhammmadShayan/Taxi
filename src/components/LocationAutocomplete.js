'use client';
import { useState, useEffect, useRef } from 'react';
import { useI18n } from '../i18n/I18nProvider';

const LocationAutocomplete = ({ 
  placeholder = "Enter location", 
  onPlaceSelect = () => {}, 
  value = "",
  onChange = () => {},
  className = "form-control",
  required = false
}) => {
  const { lang } = useI18n();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceRef = useRef(null);

  // Update input value when prop changes or language changes
  useEffect(() => {
    setInputValue(value);
  }, [value, lang]);

  // Fetch suggestions from OpenStreetMap Nominatim API
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      // Add country bias to get more relevant results (can be configured)
      const countryBias = '&countrycodes=ma,fr,es,us,gb'; // Morocco, France, Spain, US, UK
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&q=${encodeURIComponent(query)}${countryBias}`,
        {
          headers: {
            'User-Agent': 'KIRASTAY-RentalPlatform/1.0'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const formattedSuggestions = data
          .map(item => ({
            id: item.place_id,
            display_name: item.display_name,
            formatted_address: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            type: item.type,
            importance: item.importance || 0,
            category: item.category
          }))
          // Sort by importance and prioritize cities, airports
          .sort((a, b) => {
            const aIsPriority = ['city', 'town', 'airport', 'aerodrome'].includes(a.type) || 
                               ['place', 'aeroway'].includes(a.category);
            const bIsPriority = ['city', 'town', 'airport', 'aerodrome'].includes(b.type) || 
                               ['place', 'aeroway'].includes(b.category);
            
            if (aIsPriority && !bIsPriority) return -1;
            if (!aIsPriority && bIsPriority) return 1;
            
            return b.importance - a.importance;
          })
          .slice(0, 5); // Limit to top 5 results
        
        setSuggestions(formattedSuggestions);
        setShowDropdown(formattedSuggestions.length > 0);
      } else {
        console.warn('Nominatim API response not OK:', response.status);
        setSuggestions([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (inputValue && inputValue.length >= 3) {
        fetchSuggestions(inputValue);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    const selectedAddress = suggestion.formatted_address;
    setInputValue(selectedAddress);
    onChange(selectedAddress);
    onPlaceSelect({
      formatted_address: suggestion.formatted_address,
      name: suggestion.display_name,
      place_id: suggestion.id,
      geometry: {
        location: {
          lat: () => suggestion.lat,
          lng: () => suggestion.lon
        }
      }
    });
    setShowDropdown(false);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="position-relative" style={{ width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        className={className}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowDropdown(true);
          }
        }}
        required={required}
        autoComplete="off"
      />
      
      {isLoading && (
        <div className="position-absolute" style={{right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 1001}}>
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {showDropdown && suggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="dropdown-menu show position-absolute w-100 mt-1"
          style={{ 
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #ced4da',
            borderRadius: '0.375rem',
            backgroundColor: '#fff',
            boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
          }}
        >
          {suggestions.map((suggestion, index) => {
            // Format display name to be more readable
            const parts = suggestion.display_name.split(',');
            const mainLocation = parts[0];
            const additionalInfo = parts.slice(1, 3).join(',');
            
            // Determine location type for display
            const getLocationType = (type, category) => {
              if (type === 'aerodrome' || category === 'aeroway') return '✈️';
              if (type === 'city' || type === 'town') return '🏙️';
              if (type === 'village') return '🏘️';
              if (category === 'tourism') return '🏨';
              if (category === 'highway') return '🛣️';
              return '📍';
            };
            
            return (
              <button
                key={suggestion.id}
                type="button"
                className={`dropdown-item px-3 py-2 text-start ${
                  index === selectedIndex ? 'active' : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  whiteSpace: 'normal',
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <div className="d-flex align-items-center">
                  <span className="me-2">{getLocationType(suggestion.type, suggestion.category)}</span>
                  <div className="flex-grow-1">
                    <div className="fw-semibold text-truncate">{mainLocation}</div>
                    {additionalInfo && (
                      <small className="text-muted text-truncate d-block">
                        {additionalInfo}
                      </small>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;