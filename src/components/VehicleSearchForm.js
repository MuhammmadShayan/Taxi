'use client';
import { useState } from 'react';

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

  const carTypes = [
    { value: '1', label: 'No preference' },
    { value: '2', label: 'Economy' },
    { value: '3', label: 'Compact' },
    { value: '4', label: 'Midsize' },
    { value: '5', label: 'Standard' },
    { value: '6', label: 'Fullsize' },
    { value: '7', label: 'Premium' },
    { value: '8', label: 'Luxury' },
    { value: '9', label: 'Convertible' },
    { value: '10', label: 'Minivan' },
    { value: '11', label: 'Sport Utility' },
    { value: '12', label: 'Sports car' }
  ];

  const rentalCompanies = [
    { value: '', label: 'No preference' },
    { value: 'AC', label: 'ACE Rent A Car' },
    { value: 'AD', label: 'Advantage Rent-A-Car' },
    { value: 'AL', label: 'Alamo Rent A Car' },
    { value: 'ZI', label: 'Avis' },
    { value: 'ZD', label: 'Budget' },
    { value: 'ZR', label: 'Dollar Rent A Car' },
    { value: 'EY', label: 'Economy Rent a Car' },
    { value: 'ET', label: 'Enterprise' },
    { value: 'EP', label: 'Europcar' },
    { value: 'FX', label: 'Fox Rental Cars' },
    { value: 'ZE', label: 'Hertz' },
    { value: 'MW', label: 'Midway Car Rental' },
    { value: 'ZL', label: 'National Car Rental' },
    { value: 'NU', label: 'Nü Car' },
    { value: 'ZA', label: 'Payless' },
    { value: 'RO', label: 'Routes Car Rental' },
    { value: 'SX', label: 'Sixt' },
    { value: 'ZT', label: 'Thrifty Car Rental' },
    { value: 'SV', label: 'U-Save' },
    { value: 'SC', label: 'Silvercar' }
  ];

  const discountCodes = [
    { value: '0', label: 'I don\'t have a code' },
    { value: '1', label: 'Corporate or contracted' },
    { value: '2', label: 'Special or advertised' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="contact-form-action pt-3">
      <form onSubmit={handleSearch} className="row">
        {/* Pick-up Location */}
        <div className="col-lg-12 mb-4">
          <div className="input-box">
            <label className="label-text text-gray-700 font-medium mb-2">Pick-up Location</label>
            <div className="form-group relative">
              <span className="la la-map-marker form-icon absolute left-3 top-3 text-gray-400"></span>
              <input
                className="form-control w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="text"
                placeholder="City, airport, station or address"
                value={formData.pickup_location}
                onChange={(e) => handleInputChange('pickup_location', e.target.value)}
                required
              />
            </div>
          </div>
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

        {/* Advanced Options removed as requested */}

        {/* Search Button */}
        <div className="btn-box pt-3">
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
