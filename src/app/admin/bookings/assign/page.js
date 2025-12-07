'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '../../../../components/AdminLayout';

function AssignBookingContent() {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedBooking, setSelectedBooking] = useState('');
  
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('vehicle_id');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch available vehicles
      const vehiclesResponse = await fetch('/api/admin/agency_vehicles?status=available');
      const vehiclesData = await vehiclesResponse.json();
      setVehicles(vehiclesData.vehicles || []);

      // Fetch pending bookings
      const bookingsResponse = await fetch('/api/admin/bookings?status=pending');
      const bookingsData = await bookingsResponse.json();
      setBookings(bookingsData.bookings || []);

      // Pre-select if coming from URL params
      if (vehicleId) setSelectedVehicle(vehicleId);
      if (bookingId) setSelectedBooking(bookingId);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = async (e) => {
    e.preventDefault();
    
    if (!selectedVehicle || !selectedBooking) {
      alert('Please select both vehicle and booking');
      return;
    }

    try {
      const response = await fetch('/api/admin/bookings/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vehicle_id: selectedVehicle,
          booking_id: selectedBooking
        })
      });

      if (response.ok) {
        alert('Booking assigned successfully!');
        window.location.href = '/admin/bookings';
      } else {
        const error = await response.json();
        alert('Failed to assign: ' + error.message);
      }
    } catch (error) {
      console.error('Assignment error:', error);
      alert('Failed to assign booking');
    }
  };

  return (
    <AdminLayout
      pageTitle="Assign Vehicle to Booking"
      breadcrumbItems={[
        { label: 'Admin', href: '/admin' },
        { label: 'Bookings', href: '/admin/bookings' },
        { label: 'Assign' }
      ]}
    >
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="form-box">
            <div className="form-title-wrap">
              <h3 className="title">Assign Vehicle to Booking</h3>
            </div>
            <div className="form-content">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAssignment}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Select Vehicle *</label>
                      <select
                        className="form-select"
                        value={selectedVehicle}
                        onChange={(e) => setSelectedVehicle(e.target.value)}
                        required
                      >
                        <option value="">Choose a vehicle...</option>
                        {vehicles.map(vehicle => (
                          <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                            {vehicle.brand} {vehicle.model} - {vehicle.vehicle_number} ({vehicle.agency_name})
                          </option>
                        ))}
                      </select>
                      <small className="text-muted">Only available vehicles are shown</small>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Select Booking *</label>
                      <select
                        className="form-select"
                        value={selectedBooking}
                        onChange={(e) => setSelectedBooking(e.target.value)}
                        required
                      >
                        <option value="">Choose a booking...</option>
                        {bookings.map(booking => (
                          <option key={booking.reservation_id} value={booking.reservation_id}>
                            #{booking.reservation_id} - {booking.customer_name} ({booking.start_date} to {booking.end_date})
                          </option>
                        ))}
                      </select>
                      <small className="text-muted">Only pending bookings are shown</small>
                    </div>
                  </div>
                  
                  <div className="form-group mt-4">
                    <button type="submit" className="btn btn-primary me-2">
                      <i className="la la-check me-1"></i>Assign Vehicle
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => window.location.href = '/admin/bookings'}
                    >
                      <i className="la la-times me-1"></i>Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AssignBooking() {
  return (
    <Suspense fallback={<div />}>
      <AssignBookingContent />
    </Suspense>
  );
}
export const dynamic = 'force-dynamic';
