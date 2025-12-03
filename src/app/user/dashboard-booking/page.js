'use client';
import { useState, useEffect } from 'react';
import CustomerLayout from '../../../components/CustomerLayout';

export default function CustomerDashboardBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/customer/bookings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        
        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  const getServiceIcon = (serviceType) => {
    switch (serviceType?.toLowerCase()) {
      case 'hotel':
        return 'la la-hotel';
      case 'flight':
        return 'la la-plane';
      case 'car':
      case 'car rental':
        return 'la la-car';
      case 'tour':
      case 'package':
        return 'la la-map-marker';
      default:
        return 'la la-calendar';
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'completed':
        return 'bg-info';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };
  
  // Download PDF for booking
  const downloadBookingPDF = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/generate-pdf`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `booking-confirmation-${bookingId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to generate PDF. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    }
  };
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Customer', href: '/customer' },
    { label: 'My Bookings' }
  ];

  return (
    <CustomerLayout
      pageTitle="My Bookings"
      breadcrumbItems={breadcrumbItems}
      showStats={false}
    >
      <div className="row">
        <div className="col-lg-12">
          <div className="form-box">
            <div className="form-title-wrap">
              <h3 className="title">My Booking History</h3>
            </div>
            <div className="form-content">
              <div className="table-form table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Service</th>
                      <th scope="col">Date</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length > 0 ? (
                      bookings.map((booking, index) => (
                        <tr key={booking.id || index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="icon-element icon-element-xs flex-shrink-0 me-3">
                                <i className={getServiceIcon(booking.serviceType || booking.booking_type)}></i>
                              </div>
                              <div>
                                <h6 className="font-weight-bold">{booking.serviceName || booking.car_make_model || booking.service || 'Car Rental Service'}</h6>
                                <span className="font-size-13 text-muted">
                                  {booking.serviceDate || (booking.pickup_date && booking.dropoff_date ? 
                                    `${new Date(booking.pickup_date).toLocaleDateString()} - ${new Date(booking.dropoff_date).toLocaleDateString()}` : 
                                    new Date(booking.created_at).toLocaleDateString()
                                  )}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>{new Date(booking.bookingDate || booking.pickup_date || booking.created_at).toLocaleDateString()}</td>
                          <td>${(booking.amount || booking.total_amount || 0).toFixed(2)}</td>
                          <td>
                            <span className={`badge ${getStatusBadge(booking.status || booking.booking_status)} text-white`}>
                              {(booking.status || booking.booking_status || 'pending').charAt(0).toUpperCase() + (booking.status || booking.booking_status || 'pending').slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <a href={`/customer/dashboard-booking-detail?id=${booking.id}`} className="theme-btn theme-btn-small">
                                <i className="la la-eye me-1"></i>View
                              </a>
                              <button 
                                onClick={() => downloadBookingPDF(booking.id || booking.reservation_id)}
                                className="theme-btn theme-btn-small theme-btn-transparent"
                                title="Download PDF"
                              >
                                <i className="la la-file-pdf-o text-danger"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          <i className="la la-calendar" style={{fontSize: '48px', color: '#ccc'}}></i>
                          <p className="text-muted mt-2">No bookings found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
