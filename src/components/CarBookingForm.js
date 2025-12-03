'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '../i18n/I18nProvider';

export default function CarBookingForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    pickupDate: '',
    pickupTime: '09:00',
    dropoffDate: '',
    dropoffTime: '09:00'
  });

  const timeOptions = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
    '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.pickupLocation.trim()) {
      alert('Please enter a pickup location');
      return false;
    }
    if (!formData.pickupDate) {
      alert('Please select a pickup date');
      return false;
    }
    if (!formData.dropoffDate) {
      alert('Please select a drop-off date');
      return false;
    }
    
    const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const dropoffDateTime = new Date(`${formData.dropoffDate}T${formData.dropoffTime}`);
    const now = new Date();
    
    if (pickupDateTime < now) {
      alert('Pickup date and time cannot be in the past');
      return false;
    }
    
    if (dropoffDateTime <= pickupDateTime) {
      alert('Drop-off date and time must be after pickup date and time');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Save search data to database
      const response = await fetch('/api/car-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickup_location: formData.pickupLocation,
          pickup_date: formData.pickupDate,
          pickup_time: formData.pickupTime,
          dropoff_date: formData.dropoffDate,
          dropoff_time: formData.dropoffTime
        }),
      });

      if (response.ok) {
        // Create query parameters for the car listing page
        const queryParams = new URLSearchParams({
          pickup_location: formData.pickupLocation,
          pickup_date: formData.pickupDate,
          pickup_time: formData.pickupTime,
          dropoff_date: formData.dropoffDate,
          dropoff_time: formData.dropoffTime
        });
        
        // Navigate to car listing page with search parameters
        router.push(`/cars?${queryParams.toString()}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to search for cars'}`);
      }
    } catch (error) {
      console.error('Car search error:', error);
      alert('An error occurred while searching for cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="contact-form-action">
      <form onSubmit={handleSubmit} className="row">
        <div className="col-lg-12">
          <div className="input-box">
            <label className="label-text">{t('hero.pickup_location')}</label>
            <div className="form-group">
              <span className="la la-map-marker form-icon"></span>
              <input
                className="form-control"
                placeholder={t('hero.pickup_location')}
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="col-lg-8 col-sm-7">
          <div className="input-box">
            <label className="label-text">{t('hero.pickup_date')}</label>
            <div className="form-group">
              <span className="la la-calendar form-icon"></span>
              <input
                className="form-control"
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleInputChange}
                min={today}
                required
              />
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-sm-5 ps-0">
          <div className="input-box">
            <label className="label-text">{t('hero.pickup_time')}</label>
            <div className="form-group select2-container-wrapper">
              <div className="select-contain select-contain-shadow w-auto">
                <select
                  className="select-contain-select"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleInputChange}
                  required
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

        <div className="col-lg-8 col-sm-7">
          <div className="input-box">
            <label className="label-text">{t('hero.dropoff_date')}</label>
            <div className="form-group">
              <span className="la la-calendar form-icon"></span>
              <input
                className="form-control"
                type="date"
                name="dropoffDate"
                value={formData.dropoffDate}
                onChange={handleInputChange}
                min={formData.pickupDate || today}
                required
              />
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-sm-5 ps-0">
          <div className="input-box">
            <label className="label-text">{t('hero.dropoff_time')}</label>
            <div className="form-group select2-container-wrapper">
              <div className="select-contain select-contain-shadow w-auto">
                <select
                  className="select-contain-select"
                  name="dropoffTime"
                  value={formData.dropoffTime}
                  onChange={handleInputChange}
                  required
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

        <div className="col-lg-12">
          <div className="btn-box pt-3">
            <button
              type="submit"
              className="theme-btn w-100 text-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  t('common.loading')
                </>
              ) : (
                t('hero.search_cars')
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
