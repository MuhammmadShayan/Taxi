import { NextResponse } from 'next/server';
import { query, getDbPool } from '../../../../../lib/db.js';
import { sendEmail, getAdminEmail } from '../../../../../lib/email.js';
import { 
  bookingSuccessCustomerConfirmation, 
  bookingSuccessAdminNotification,
  bookingSuccessAgencyNotification
} from '../../../../../utils/emailTemplates.js';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { payment_status } = body;

    console.log(`📧 Processing booking success emails for booking ID: ${id}`);
    console.log(`Payment status: ${payment_status}`);

    if (payment_status !== 'success') {
      return NextResponse.json({
        success: false,
        message: 'Email notifications are only sent for successful payments'
      }, { status: 400 });
    }

    // Get complete booking details with customer, vehicle, and agency information
    const bookingRows = await query(`
      SELECT 
        r.*,
        v.make as brand, v.model, v.year, v.images,
        u.first_name as customer_first_name, 
        u.last_name as customer_last_name,
        u.email as customer_email, 
        u.phone as customer_phone,
        u.address as customer_address, 
        u.city as customer_city,
        u.country as customer_country,
        pl.location_name as pickup_location_name, 
        pl.address as pickup_address,
        dl.location_name as dropoff_location_name, 
        dl.address as dropoff_address,
        a.business_name as agency_name,
        a.contact_name as agency_contact_name,
        a.business_email as agency_email,
        a.business_phone as agency_phone
      FROM reservations r
      LEFT JOIN vehicles v ON r.vehicle_id = v.id
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN pickup_locations pl ON r.pickup_location_id = pl.location_id
      LEFT JOIN pickup_locations dl ON r.dropoff_location_id = dl.location_id
      LEFT JOIN agencies a ON r.agency_id = a.agency_id
      WHERE r.reservation_id = ?
    `, [id]);

    if (bookingRows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Booking not found'
      }, { status: 404 });
    }

    const booking = bookingRows[0];
    console.log('📋 Booking details found:', {
      id: booking.reservation_id,
      customer: booking.customer_email,
      vehicle: `${booking.make} ${booking.model}`
    });

    // Prepare booking data for emails
    const bookingData = {
      id: booking.reservation_id,
      vehicle_name: `${booking.brand || 'Unknown'} ${booking.model || 'Vehicle'} ${booking.year || ''}`.trim(),
      pickup_date: booking.start_date,
      return_date: booking.end_date,
      pickup_time: booking.pickup_time,
      pickup_location: booking.pickup_location_name || 'To be confirmed',
      total_amount: booking.total_price || '0.00',
      total_days: booking.total_days,
      status: booking.status || 'pending'
    };

    const userData = {
      full_name: `${booking.customer_first_name || ''} ${booking.customer_last_name || ''}`.trim() || 'Valued Customer',
      email: booking.customer_email,
      phone: booking.customer_phone
    };

    const agencyData = {
      agency_name: booking.agency_name || 'KIRASTAY Partner Agency',
      contact_full_name: booking.agency_contact_name || 'Agency Contact',
      contact_email: booking.agency_email || 'support@kirastay.com',
      contact_phone: booking.agency_phone || 'Contact agency for phone'
    };

    console.log('📧 Prepared email data:', {
      customer: userData.email,
      agency: agencyData.contact_email,
      booking_ref: `BK${bookingData.id}`
    });

    // Update booking payment status to 'pending' (not 'paid' until agency confirms)
    await query(
      'UPDATE reservations SET payment_status = ?, updated_at = NOW() WHERE reservation_id = ?',
      ['pending', id]
    );

    console.log('✅ Updated booking payment status to paid');

    const emailResults = [];

    // 1. Send success confirmation email to customer
    try {
      console.log('📧 Sending booking success email to customer:', userData.email);
      
      const customerEmailHtml = bookingSuccessCustomerConfirmation(bookingData, userData, agencyData);
      
        const customerEmailResult = await sendEmail({
          to: userData.email,
          subject: 'Reservation Successful - Awaiting Agency Confirmation',
          html: customerEmailHtml,
        text: `KIRASTAY - Payment Successful!
        
Dear ${userData.full_name},

Your payment has been processed successfully! Your booking is now awaiting confirmation from the rental agency.

Booking Reference: BK${bookingData.id}${Date.now().toString().slice(-6)}
Vehicle: ${bookingData.vehicle_name}
Pickup: ${new Date(bookingData.pickup_date).toLocaleDateString()}
Return: ${new Date(bookingData.return_date).toLocaleDateString()}
Total Paid: $${bookingData.total_amount}

Next Steps:
- The rental agency will review and confirm your booking
- You will receive another email once confirmed
- Payment has been secured and will be processed upon confirmation

Agency Contact: ${agencyData.agency_name}
Phone: ${agencyData.contact_phone}
Email: ${agencyData.contact_email}

Thank you for choosing KIRASTAY!

Best regards,
KIRASTAY Team`
      });
      
      emailResults.push({
        type: 'customer',
        email: userData.email,
        success: customerEmailResult.success,
        error: customerEmailResult.error || null
      });
      
      console.log('Customer email result:', customerEmailResult.success ? '✅ Sent' : '❌ Failed', customerEmailResult.error || '');
      
    } catch (customerEmailError) {
      console.error('❌ Failed to send customer success email:', customerEmailError);
      emailResults.push({
        type: 'customer',
        email: userData.email,
        success: false,
        error: customerEmailError.message
      });
    }

    // 2. Send notification to admin
    try {
      console.log('📧 Sending booking success notification to admin');
      
      const adminEmail = await getAdminEmail();
      const adminEmailHtml = bookingSuccessAdminNotification(bookingData, userData, agencyData);
      
        const adminEmailResult = await sendEmail({
          to: adminEmail,
          subject: 'Reservation Created - Pending Agency Confirmation',
          html: adminEmailHtml,
        text: `KIRASTAY Admin - Payment Received
        
A customer has successfully completed payment for their booking. The booking is now awaiting agency confirmation.

Booking Reference: BK${bookingData.id}${Date.now().toString().slice(-6)}
Payment Status: PAID
Amount Paid: $${bookingData.total_amount}
Payment Date: ${new Date().toLocaleString()}

Customer: ${userData.full_name} (${userData.email})
Vehicle: ${bookingData.vehicle_name}
Agency: ${agencyData.agency_name}

Next Steps:
- Agency needs to confirm the reservation
- Customer will be notified upon agency confirmation
- Booking status will change from 'pending' to 'confirmed'

KIRASTAY Platform System`
      });
      
      emailResults.push({
        type: 'admin',
        email: adminEmail,
        success: adminEmailResult.success,
        error: adminEmailResult.error || null
      });
      
      console.log('Admin email result:', adminEmailResult.success ? '✅ Sent' : '❌ Failed', adminEmailResult.error || '');
      
    } catch (adminEmailError) {
      console.error('❌ Failed to send admin success email:', adminEmailError);
      const adminEmail = await getAdminEmail();
      emailResults.push({
        type: 'admin',
        email: adminEmail,
        success: false,
        error: adminEmailError.message
      });
    }

    // 3. Send notification to agency (optional - they already got initial booking notification)
    try {
      if (agencyData.contact_email && agencyData.contact_email !== 'support@kirastay.com') {
        console.log('📧 Sending payment success notification to agency:', agencyData.contact_email);
        
        const agencyEmailHtml = bookingSuccessAgencyNotification(bookingData, userData, agencyData);
        
        const agencyEmailResult = await sendEmail({
          to: agencyData.contact_email,
          subject: 'Customer Reservation - Confirmation Required',
          html: agencyEmailHtml,
          text: `KIRASTAY - Payment Received

Dear ${agencyData.contact_full_name},

The customer has successfully completed payment for their booking. Please confirm the reservation to finalize the booking.

Booking Reference: BK${bookingData.id}
Customer: ${userData.full_name}
Vehicle: ${bookingData.vehicle_name}
Pickup Date: ${new Date(bookingData.pickup_date).toLocaleDateString()}
Amount Paid: $${bookingData.total_amount}
Payment Status: PAID
Booking Status: AWAITING YOUR CONFIRMATION

Action Required: Please log in to your dashboard and confirm this booking.

Best regards,
KIRASTAY Team`
        });
        
        emailResults.push({
          type: 'agency',
          email: agencyData.contact_email,
          success: agencyEmailResult.success,
          error: agencyEmailResult.error || null
        });
        
        console.log('Agency email result:', agencyEmailResult.success ? '✅ Sent' : '❌ Failed', agencyEmailResult.error || '');
      }
      
    } catch (agencyEmailError) {
      console.error('❌ Failed to send agency success email:', agencyEmailError);
      emailResults.push({
        type: 'agency',
        email: agencyData.contact_email,
        success: false,
        error: agencyEmailError.message
      });
    }

    // Count successful emails
    const successfulEmails = emailResults.filter(result => result.success).length;
    const totalEmails = emailResults.length;

    console.log(`📧 Email sending completed: ${successfulEmails}/${totalEmails} emails sent successfully`);

    return NextResponse.json({
      success: true,
      message: `Booking success emails processed. ${successfulEmails}/${totalEmails} emails sent successfully.`,
      email_results: emailResults,
      booking_updated: true
    });

  } catch (error) {
    console.error('❌ Error processing booking success emails:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process booking success emails',
      error: error.message
    }, { status: 500 });
  }
}
