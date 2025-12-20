'use client';
import { useState } from 'react';
import LocationAutocomplete from './LocationAutocomplete';

export default function VehicleSearchForm({ formData, setFormData, handleSearch }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const timeOptions = [
    '12:00AM', '12:30AM', '1:00AM', '1:30AM', '2:00AM', '2:30AM',
    '3:00AM', '3:30AM', '4:00AM', '4:30AM', '5:00AM', '5:30AM',
    '6:00AM', '6:30AM', '7:00AM', '7:30AM', '8:00AM', '8:30AM',
    '9:00AM', '9:30AM', '10:00AM', '10:30AM', '11:00AM', '11:30AM',
    '12:00PM', '12:30PM', '1:00PM', '1:30PM', '2:00PM', '2:30PM',
    '3:00PM', '3:30PM', '4:00PM', '4:30PM', '5:00PM', '5:30PM',
    '6:00PM', '6:30PM', '7:00PM', '7:30PM', '8:00PM', '8:30PM',
    '9:00PM', '9:30PM', '10:00PM', '10:30PM', '11:00PM', '11:30PM'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceSelect = (field, placeData) => {
    if (!placeData) return;

    setFormData(prev => ({
      ...prev,
      [`${field}_location`]: placeData.formatted_address || placeData.address,
      [`${field}_latitude`]: placeData.lat,
      [`${field}_longitude`]: placeData.lng
    }));
  };

  return (
    <div className="contact-form-action pt-3">
      <form onSubmit={handleSearch} className="row">
        {/* Pick-up Location */}
        <div className="col-lg-6 mb-4">
          <LocationAutocomplete
            label="Pick-up Location"
            placeholder="City, airport, station..."
            value={formData.pickup_location}
            onChange={(val) => handleInputChange('pickup_location', val)}
            onPlaceSelect={(place) => handlePlaceSelect('pickup', place)}
            required
          />
        </div>

        {/* Drop-off Location */}
        <div className="col-lg-6 mb-4">
          <LocationAutocomplete
            label="Drop-off Location"
            placeholder="Different location (optional)"
            value={formData.dropoff_location}
            onChange={(val) => handleInputChange('dropoff_location', val)}
            onPlaceSelect={(place) => handlePlaceSelect('dropoff', place)}
          />
        </div>

        {/* Pick-up Date and Time */}
        <div className="col-lg-8 col-sm-7 mb-4">
          <div className="input-box">
            <label className="label-text text-gray-700 font-medium mb-2">Pick-up Date</label>
            <div className="form-group relative">
              <span className="la la-calendar form-icon absolute left-3 top-3 text-gray-400"></span>
              <input
                className="form-control w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="date"
                value={formData.pickup_date}
                onChange={(e) => handleInputChange('pickup_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-sm-5 ps-0 mb-4">
          <div className="input-box">
            <label className="label-text text-gray-700 font-medium mb-2">Time</label>
            <div className="form-group select2-container-wrapper">
              <div className="select-contain select-contain-shadow w-auto">
                <select
                  className="select-contain-select w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.pickup_time}
                  onChange={(e) => handleInputChange('pickup_time', e.target.value)}
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Drop-off Date and Time */}
        <div className="col-lg-8 col-sm-7 mb-4">
          <div className="input-box">
            <label className="label-text text-gray-700 font-medium mb-2">Drop-off Date</label>
            <div className="form-group relative">
              <span className="la la-calendar form-icon absolute left-3 top-3 text-gray-400"></span>
              <input
                className="form-control w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="date"
                value={formData.dropoff_date}
                onChange={(e) => handleInputChange('dropoff_date', e.target.value)}
                min={formData.pickup_date || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-sm-5 ps-0 mb-4">
          <div className="input-box">
            <label className="label-text text-gray-700 font-medium mb-2">Time</label>
            <div className="form-group select2-container-wrapper">
              <div className="select-contain select-contain-shadow w-auto">
                <select
                  className="select-contain-select w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.dropoff_time}
                  onChange={(e) => handleInputChange('dropoff_time', e.target.value)}
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="btn-box pt-3 w-100">
          <button
            type="submit"
            className="theme-btn w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300 flex items-center justify-center"
          >
            <i className="la la-search mr-2"></i>
            Search Now
          </button>
        </div>
      </form>
    </div>
  );
}
