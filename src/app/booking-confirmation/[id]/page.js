'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumb from '../../../components/Breadcrumb';
import LoginModal from '../../../components/LoginModal';
import SignupModal from '../../../components/SignupModal';
import { I18nProvider, useI18n } from '../../../i18n/I18nProvider';
import Head from 'next/head';
import { generateBookingPDFClientSide } from '../../../utils/pdfGenerator';

function BookingConfirmationContent() {
  const { t } = useI18n();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [emailsSent, setEmailsSent] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  // Handle sending success emails when payment status is success
  useEffect(() => {
    if (booking && paymentStatus === 'success' && booking.payment_status === 'pending' && !emailsSent) {
      sendBookingSuccessEmails();
    }
  }, [booking, paymentStatus, emailsSent]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching booking details for ID:', id);
      
      const response = await fetch(`/api/bookings/${id}`);
      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response data:', data);
        
        if (data.success && data.booking) {
          console.log('Booking data received:', data.booking);
          setBooking(data.booking);
        } else {
          console.error('API returned unsuccessful response:', data);
          // Try to show more specific error
          if (data.message) {
            console.error('API Error message:', data.message);
          }
        }
      } else {
        // Get error details from response
        console.error('API returned non-OK status:', response.status, response.statusText);
        
        let errorData = {};
        const responseText = await response.text();
        console.error('Raw API response:', responseText);
        
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Could not parse error response as JSON:', parseError);
          errorData = { message: responseText || 'Unknown error' };
        }
        
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          error: errorData
        });
        console.error('Failed to fetch booking details - Status:', response.status);
      }
    } catch (error) {
      console.error('Network error fetching booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge bg-warning text-dark';
      case 'confirmed': return 'badge bg-success';
      case 'assigned': return 'badge bg-info';
      case 'in_progress': return 'badge bg-primary';
      case 'completed': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  const sendBookingSuccessEmails = async () => {
    try {
      console.log('📧 Sending booking success emails for booking ID:', id);
      setEmailsSent(true); // Prevent multiple sends
      
      const response = await fetch(`/api/bookings/${id}/send-success-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_status: 'success'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Booking success emails sent successfully:', result.message);
        console.log('Email results:', result.email_results);
        
        // Update local booking state to reflect payment status change
        setBooking(prev => ({
          ...prev,
          payment_status: 'pending'
        }));
      } else {
        console.error('❌ Failed to send booking success emails:', result.message);
        setEmailsSent(false); // Reset flag on failure to allow retry
      }
      
    } catch (error) {
      console.error('❌ Error sending booking success emails:', error);
      setEmailsSent(false); // Reset flag on error to allow retry
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setPdfLoading(true);
      
      // Try server-side PDF generation first
      try {
        const response = await fetch(`/api/bookings/${id}/generate-pdf`);
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `booking-confirmation-${id}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          return;
        }
      } catch (serverError) {
        console.warn('Server-side PDF generation failed, trying client-side:', serverError);
      }
      
      // Fallback to client-side PDF generation
      console.log('Falling back to client-side PDF generation');
      const result = await generateBookingPDFClientSide(booking);
      
      if (!result.success) {
        throw new Error(result.error || 'Client-side PDF generation failed');
      }
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error generating PDF. Please try again or use the print option.');
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading booking confirmation...</p>
          </div>
        </div>
        <Footer />
        <LoginModal />
        <SignupModal />
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="text-center py-5">
            <h4>Booking Not Found</h4>
            <p>The requested booking could not be found.</p>
            <Link href="/cars" className="theme-btn">
              Browse Cars
            </Link>
          </div>
        </div>
        <Footer />
        <LoginModal />
        <SignupModal />
      </>
    );
  }

  return (
    <>
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 0.5in !important;
            size: A4;
          }
          /* Reset all margins and padding */
          * {
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
          /* Hide everything except print content */
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            padding: 15px !important;
            font-size: 11px !important;
            line-height: 1.2 !important;
            overflow: hidden;
          }
          .no-print {
            display: none !important;
          }
          /* Print header */
          .print-header {
            display: block !important;
            text-align: center;
            margin-bottom: 10px !important;
            border-bottom: 2px solid #007bff;
            padding-bottom: 8px !important;
          }
          .print-logo {
            width: 60px !important;
            height: auto;
          }
          .print-invoice {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.2 !important;
            font-size: 11px !important;
          }
          .print-invoice h1 {
            font-size: 16px !important;
            margin: 3px 0 !important;
            color: #007bff;
          }
          .print-invoice h3 {
            font-size: 13px !important;
            margin: 8px 0 4px 0 !important;
          }
          .print-invoice h4, .print-invoice h5 {
            font-size: 12px !important;
            margin: 6px 0 3px 0 !important;
          }
          .print-invoice h6 {
            font-size: 11px !important;
            margin: 4px 0 2px 0 !important;
          }
          .print-invoice p {
            margin: 1px 0 !important;
            font-size: 10px !important;
          }
          .print-invoice .container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .print-invoice .row {
            margin: 0 !important;
            display: flex;
            flex-wrap: wrap;
          }
          .print-invoice .col-lg-8 {
            width: 65% !important;
            padding: 3px !important;
            float: left;
          }
          .print-invoice .col-lg-4 {
            width: 35% !important;
            padding: 3px !important;
            float: right;
          }
          .print-invoice .col-md-6 {
            width: 50% !important;
            padding: 2px !important;
          }
          .print-invoice .col-md-4 {
            width: 33.333% !important;
            padding: 2px !important;
          }
          .print-invoice .col-md-8 {
            width: 66.666% !important;
            padding: 2px !important;
          }
          .print-invoice .form-box {
            border: 1px solid #ccc !important;
            margin: 3px 0 !important;
            padding: 5px !important;
            break-inside: avoid;
          }
          .print-invoice .section-block {
            margin: 4px 0 !important;
            border-bottom: 1px solid #eee;
            height: 1px;
          }
          .print-invoice .car-image img {
            width: 60px !important;
            height: 45px !important;
            object-fit: cover;
          }
          .print-invoice .alert {
            display: none !important;
          }
          .print-invoice .badge {
            font-size: 8px !important;
            padding: 1px 4px !important;
          }
          .print-invoice .important-info-section {
            display: none !important;
          }
          .booking-confirmation-area {
            padding: 0 !important;
          }
          .padding-top-100px, .padding-bottom-70px {
            padding: 0 !important;
          }
          /* Reduce spacing for compact layout */
          .mb-4, .mb-3, .mb-2, .mb-1 {
            margin-bottom: 3px !important;
          }
          .mt-4, .mt-3, .mt-2, .mt-1 {
            margin-top: 2px !important;
          }
          .pt-4, .pt-3, .pt-2 {
            padding-top: 2px !important;
          }
          .pb-4, .pb-3, .pb-2 {
            padding-bottom: 2px !important;
          }
          /* Hide extras section for space */
          .extras-section {
            display: none !important;
          }
        }
        .print-header {
          display: none;
        }
      `}</style>
      
      {/* Screen View */}
      <div className="no-print">
        <Header />
        
        <Breadcrumb 
          title="Booking Confirmation" 
          breadcrumbItems={[
            { label: 'Home', href: '/' },
            { label: 'Booking Confirmation' }
          ]}
        />
      </div>

      {/* Print Content */}
      <div className="print-content">
        {/* Print Header with Logo */}
        <div className="print-header">
          <img 
            src="/html-folder/images/logo.png" 
            alt="Kirastay Logo" 
            className="print-logo"
          />
          <h1 style={{color: '#007bff', margin: '15px 0 5px 0'}}>KIRASTAY</h1>
          <p style={{margin: 0, color: '#666'}}>Premium Car Rental Services</p>
        </div>

        <section className="booking-confirmation-area padding-top-100px padding-bottom-70px print-invoice">
        <div className="container">
          {/* Success Message */}
          {paymentStatus === 'success' && (
            <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
              <div className="d-flex align-items-center">
                <i className="la la-check-circle me-2 font-size-24"></i>
                <div>
                  <strong>🚗 Reservation Created!</strong>
                  <p className="mb-0">Your reservation has been created successfully. Your booking is now <strong>awaiting confirmation from the rental agency</strong>. You will receive another email once the agency confirms your reservation within 24 hours.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Awaiting Confirmation Status */}
          {paymentStatus === 'success' && booking?.payment_status === 'pending' && booking?.status === 'pending' && (
            <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
              <div className="d-flex align-items-center">
                <i className="la la-clock-o me-2 font-size-24"></i>
                <div>
                  <strong>⏳ Awaiting Agency Confirmation</strong>
                  <p className="mb-0">Your reservation is secure and the rental agency has been notified. They will review and confirm your booking soon. Most agencies respond within 24 hours.</p>
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-lg-8">
              <div className="form-box">
                <div className="form-title-wrap">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="title">Booking Details</h3>
                    <span className={getStatusBadgeClass(booking.status)}>
                      {booking.status ? booking.status.replace('_', ' ').toUpperCase() : 'PENDING'}
                    </span>
                  </div>
                </div>
                
                <div className="form-content">
                  {/* Booking Reference */}
                  <div className="booking-ref-section mb-4">
                    <div className="row">
                      <div className="col-md-6">
                        <h5>Booking Reference</h5>
                        <p className="font-weight-bold text-primary font-size-18">BK{booking.reservation_id}{Date.now().toString().slice(-6)}</p>
                      </div>
                      <div className="col-md-6">
                        <h5>Booking Date</h5>
                        <p>{new Date(booking.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="section-block"></div>

                  {/* Car Details */}
                  <div className="car-details-section mb-4">
                    <h4 className="section-title">Car Details</h4>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="car-image">
                          <img 
                            src={booking.images ? JSON.parse(booking.images)[0] : '/html-folder/images/car-img.png'} 
                            alt={`${booking.brand || booking.vehicle_make} ${booking.model}`}
                            className="img-fluid rounded"
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <h5 className="car-title">{booking.brand || booking.vehicle_make || 'N/A'} {booking.model || 'N/A'}</h5>
                        <p className="car-category text-muted mb-2">{booking.category}</p>
                        <div className="agency-info mb-3">
                          <span className="badge bg-light text-primary border border-primary">
                            <i className="la la-building me-1"></i>
                            {booking.agency_name || 'Premium Car Rental'}
                          </span>
                        </div>
                        <div className="car-features">
                          <div className="d-flex flex-wrap">
                            <div className="feature-item me-3 mb-2">
                              <i className="la la-calendar me-1"></i>
                              <span>{booking.total_days} day{booking.total_days > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="section-block"></div>

                  {/* Rental Period */}
                  <div className="rental-period-section mb-4">
                    <h4 className="section-title">Rental Period</h4>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="pickup-details">
                          <h6><i className="la la-calendar-check-o me-2"></i>Pick-up</h6>
                          <p className="mb-1"><strong>Date:</strong> {formatDate(booking.start_date)}</p>
                          <p className="mb-1"><strong>Time:</strong> {booking.pickup_time}</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="dropoff-details">
                          <h6><i className="la la-calendar-times-o me-2"></i>Drop-off</h6>
                          <p className="mb-1"><strong>Date:</strong> {formatDate(booking.end_date)}</p>
                          <p className="mb-1"><strong>Time:</strong> {booking.dropoff_time}</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="location-details">
                          <h6><i className="la la-map-marker me-2"></i>Locations</h6>
                          <p className="mb-1"><strong>Pick-up:</strong> {booking.pickup_location_name || 'N/A'}</p>
                          <p className="mb-1"><strong>Drop-off:</strong> {booking.dropoff_location_name || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="section-block"></div>

                  {/* Customer Information */}
                  <div className="customer-info-section mb-4">
                    <h4 className="section-title">Customer Information</h4>
                    <div className="row">
                      <div className="col-md-4">
                        <p className="mb-1"><strong>Name:</strong> {booking.customer_first_name || 'N/A'} {booking.customer_last_name || ''}</p>
                        <p className="mb-1"><strong>Email:</strong> {booking.customer_email || 'N/A'}</p>
                      </div>
                      <div className="col-md-4">
                        <p className="mb-1"><strong>Phone:</strong> {booking.customer_phone || 'N/A'}</p>
                        <p className="mb-1"><strong>City:</strong> {booking.customer_city || 'N/A'}</p>
                      </div>
                      <div className="col-md-4">
                        <p className="mb-1"><strong>Country:</strong> {booking.customer_country || 'N/A'}</p>
                        <p className="mb-1"><strong>Address:</strong> {booking.customer_address || 'N/A'}</p>
                      </div>
                    </div>
                    {booking.special_requests && (
                      <div className="mt-1">
                        <p className="mb-1"><strong>Special Requests:</strong> {booking.special_requests}</p>
                      </div>
                    )}
                  </div>

                  <div className="section-block"></div>

                  {/* Additional Services */}
                  <div className="extras-section mb-4">
                    <h4 className="section-title">Additional Services</h4>
                    <div className="row">
                      <p className="text-muted">No additional services information available</p>
                    </div>
                  </div>

                  {/* Driver Information */}
                  {booking.driver_assigned && (
                    <>
                      <div className="section-block"></div>
                      <div className="driver-info-section mb-4">
                        <h4 className="section-title">Assigned Driver</h4>
                        <div className="driver-card p-3 border rounded">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <h6 className="mb-1">{booking.driver_name}</h6>
                              <p className="mb-1"><i className="la la-phone me-2"></i>{booking.driver_phone}</p>
                            </div>
                            <div className="col-md-4 text-end">
                              <button className="btn btn-sm btn-outline-primary">
                                <i className="la la-phone me-1"></i>Contact Driver
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Important Information */}
                  <div className="section-block"></div>
                  <div className="important-info-section">
                    <h4 className="section-title">Important Information</h4>
                    <div className="alert alert-info">
                      <h6><i className="la la-info-circle me-2"></i>Please Note:</h6>
                      <ul className="mb-0">
                        <li>Please arrive at the pick-up location 15 minutes before your scheduled time</li>
                        <li>Bring a valid driver's license and credit card for security deposit</li>
                        <li>Contact us immediately if you need to make any changes to your booking</li>
                        <li>Cancellation is allowed up to 24 hours before pick-up time</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary Sidebar */}
            <div className="col-lg-4">
              <div className="form-box booking-detail-form">
                <div className="form-title-wrap">
                  <h3 className="title">Payment Summary</h3>
                </div>
                
                <div className="form-content">
                  {/* Payment Status */}
                  <div className="payment-status mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Payment Status:</span>
                      <span className={booking.payment_status === 'paid' ? 'badge bg-success' : 'badge bg-warning text-dark'}>
                        {booking.payment_status === 'paid' ? 'PAID' : 'PENDING'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span>Payment Method:</span>
                      <span className="text-capitalize">{booking.payment_method ? booking.payment_method.replace('_', ' ') : 'Cash'}</span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="price-breakdown">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Car rental ({booking.total_days} day{booking.total_days > 1 ? 's' : ''})</span>
                      <span>${booking.subtotal || '0.00'}</span>
                    </div>
                    {booking.extras_total > 0 && (
                      <div className="d-flex justify-content-between mb-2">
                        <span>Additional Services</span>
                        <span>${booking.extras_total}</span>
                      </div>
                    )}
                    {booking.tax_amount > 0 && (
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tax</span>
                        <span>${booking.tax_amount}</span>
                      </div>
                    )}

                    <hr />

                    <div className="d-flex justify-content-between total-price">
                      <strong>Total Paid</strong>
                      <strong>${booking.total_price || '0.00'}</strong>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="contact-info mt-4 pt-4 border-top">
                    <h6>Need Help?</h6>
                    <div className="contact-details">
                      <div className="d-flex align-items-center mb-2">
                        <i className="la la-phone me-2"></i>
                        <a href="tel:+41782149795">+41 78 214 97 95</a>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="la la-envelope me-2"></i>
                        <a href="mailto:support@kirastay.com">support@kirastay.com</a>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="action-buttons mt-4">
                    <button 
                      className="btn theme-btn w-100 mb-2"
                      onClick={handleDownloadPDF}
                      disabled={pdfLoading}
                    >
                      {pdfLoading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <i className="la la-file-pdf-o me-2"></i>Download PDF
                        </>
                      )}
                    </button>
                    <button 
                      className="btn btn-outline-primary w-100 mb-2"
                      onClick={() => window.print()}
                    >
                      <i className="la la-print me-2"></i>Print Confirmation
                    </button>
                    <Link href="/cars" className="btn btn-outline-secondary w-100">
                      <i className="la la-car me-2"></i>Book Another Car
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>
      </div>

      {/* Footer - only show on screen */}
      <div className="no-print">
        <Footer />
      </div>

      {/* Modal Components */}
      <LoginModal />
      <SignupModal />
    </>
  );
}

export default function BookingConfirmation() {
  return (
    <I18nProvider>
      <BookingConfirmationContent />
    </I18nProvider>
  );
}
