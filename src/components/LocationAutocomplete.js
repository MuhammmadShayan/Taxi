'use client';
import { useState, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

const LocationAutocomplete = ({
  label,
  placeholder = "Enter pick-up city, airport, or station",
  value,
  onChange,
  onLocationChange, // Callback for Full place object
  onPlaceSelect, // Alias for onLocationChange to support existing usage
  className,
  name,
  required = false
}) => {
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      const formattedAddress = place.formatted_address || place.name;
      const placeId = place.place_id;

      // Call the specialized callback with all details if provided
      if (onLocationChange) {
        onLocationChange(place);
      }

      if (onPlaceSelect) {
        onPlaceSelect(place);
      }

      // Call the standard onChange with just the string value
      if (onChange) {
        onChange(formattedAddress);
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  // Bias results toward cities, airports, and train stations
  const options = {
    types: ['(cities)', 'airport', 'train_station'],
    componentRestrictions: { country: [] }, // Global search by default
    fields: ["formatted_address", "geometry", "name", "place_id"]
  };

  return (
    <div className="input-box w-full">
      {label && <label className="label-text text-gray-700 font-medium mb-2">{label}</label>}
      <div className="form-group relative">
        <span className="la la-map-marker form-icon absolute left-3 top-3 text-gray-400 z-10"></span>

        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={options}
          className="w-full"
        >
          <input
            type="text"
            name={name}
            className={`form-control w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className || ''}`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            required={required}
            autoComplete="off"
          />
        </Autocomplete>
      </div>
    </div>
  );
};

export default LocationAutocomplete;