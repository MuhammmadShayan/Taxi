import { NextResponse } from 'next/server';
import { getDbPool } from '../../../../../../lib/db';
const pool = getDbPool();
import { sendEmail, sendAdminEmail } from '../../../../../../lib/email.js';

export async function PUT(request, { params }) {
  try {
    const { id: bookingId } = await params;
    const { status } = await request.json();

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'canceled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status provided' },
        { status: 400 }
      );
    }

    // Check if booking exists
    const checkQuery = 'SELECT * FROM reservations WHERE reservation_id = ?';
    const [existingBookings] = await pool.execute(checkQuery, [bookingId]);
    
    if (existingBookings.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    const currentBooking = existingBookings[0];

    // Validate status transitions
    const statusTransitions = {
      'pending': ['confirmed', 'canceled'],
      'confirmed': ['active', 'canceled'],
      'active': ['completed', 'canceled'],
      'completed': [], // Cannot change completed status
      'canceled': [] // Cannot change canceled status
    };

    const allowedTransitions = statusTransitions[currentBooking.status] || [];
    if (!allowedTransitions.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Cannot change status from ${currentBooking.status} to ${status}` },
        { status: 400 }
      );
    }

    // Update booking status
    const updateQuery = `
      UPDATE reservations 
      SET status = ?, updated_at = NOW() 
      WHERE reservation_id = ?
    `;
    
    await pool.execute(updateQuery, [status, bookingId]);

    // If confirming a booking, update vehicle status
    if (status === 'confirmed') {
      await pool.execute(
        'UPDATE vehicles SET status = ? WHERE id = ?',
        ['booked', currentBooking.vehicle_id]
      );
    }
    
    // If completing or canceling, make vehicle available again
    if (status === 'completed' || status === 'canceled') {
      await pool.execute(
        'UPDATE vehicles SET status = ? WHERE id = ?',
        ['available', currentBooking.vehicle_id]
      );
    }

    // Send email notifications for status change
    console.log('📧 Sending status update email notifications...');
    try {
      // Get detailed booking information for emails
      const [bookingDetails] = await pool.execute(`
        SELECT r.*, v.make, v.model, v.year,
               u.first_name, u.last_name, u.email, u.phone,
               a.business_name, a.contact_name, a.business_email, a.business_phone
        FROM reservations r
        LEFT JOIN agency_vehicles v ON r.vehicle_id = v.vehicle_id
        LEFT JOIN customers c ON r.customer_id = c.customer_id
        LEFT JOIN users u ON c.user_id = u.user_id
        LEFT JOIN agencies a ON v.agency_id = a.agency_id
        WHERE r.reservation_id = ?
      `, [bookingId]);
      
      if (bookingDetails.length > 0) {
        const booking = bookingDetails[0];
        
        const bookingData = {
          id: bookingId,
          vehicle_name: `${booking.make} ${booking.model} ${booking.year}`,
          pickup_date: booking.start_date,
          return_date: booking.end_date,
          pickup_location: booking.pickup_location || 'TBD',
          total_amount: booking.total_price,
          status: status
        };
        
        const userData = {
          full_name: `${booking.first_name} ${booking.last_name}`.trim(),
          email: booking.email,
          phone: booking.phone
        };
        
        const agencyData = {
          agency_name: booking.business_name || 'KIRASTAY Agency',
          contact_full_name: booking.contact_name || 'Agency Contact',
          contact_email: booking.business_email || 'agency@kirastay.com',
          contact_phone: booking.business_phone || 'N/A'
        };
        
        // Send status update email to customer
        console.log('📧 Sending status update to customer:', booking.email);
        
        const statusUpdateEmailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Booking Status Update - KIRASTAY</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #17a2b8; color: white; padding: 20px; text-align: center; }
              .content { padding: 30px 20px; background: #f9f9f9; }
              .status-update { background: ${status === 'confirmed' ? '#d4edda' : status === 'canceled' ? '#f8d7da' : '#fff3cd'}; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid ${status === 'confirmed' ? '#c3e6cb' : status === 'canceled' ? '#f5c6cb' : '#ffeaa7'}; }
              .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
              .detail-label { font-weight: bold; color: #555; }
              .detail-value { color: #333; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
              .contact-info { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Booking Status Update</h1>
                <p>Booking Reference: #BK${bookingId}</p>
              </div>
              <div class="content">
                <p>Dear <strong>${userData.full_name}</strong>,</p>
                
                <div class="status-update">
                  <h3>Status Update</h3>
                  <p>Your booking status has been updated to: <strong>${status.toUpperCase()}</strong></p>
                  ${status === 'confirmed' ? '<p style="color: #155724;">Great news! Your booking has been confirmed by the agency.</p>' : ''}
                  ${status === 'canceled' ? '<p style="color: #721c24;">Your booking has been canceled. Please contact us if you have questions.</p>' : ''}
                  ${status === 'completed' ? '<p style="color: #155724;">Your rental has been completed. Thank you for choosing KIRASTAY!</p>' : ''}
                  ${status === 'active' ? '<p style="color: #155724;">Your rental is now active. Enjoy your trip!</p>' : ''}
                </div>
                
                <div class="booking-details">
                  <h3>Booking Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">Vehicle:</span>
                    <span class="detail-value">${bookingData.vehicle_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Pickup Date:</span>
                    <span class="detail-value">${new Date(bookingData.pickup_date).toLocaleDateString()}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Return Date:</span>
                    <span class="detail-value">${new Date(bookingData.return_date).toLocaleDateString()}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value">$${bookingData.total_amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Current Status:</span>
                    <span class="detail-value">${status.toUpperCase()}</span>
                  </div>
                </div>
                
                <div class="contact-info">
                  <h4>${agencyData.agency_name}</h4>
                  <p><strong>Contact:</strong> ${agencyData.contact_full_name}</p>
                  <p><strong>Email:</strong> ${agencyData.contact_email}</p>
                  <p><strong>Phone:</strong> ${agencyData.contact_phone}</p>
                </div>
                
                <p>If you have any questions about this update, please contact the agency or our support team.</p>
                
                <p>Best regards,<br>The KIRASTAY Team</p>
              </div>
              <div class="footer">
                <p>© 2025 KIRASTAY Platform. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;
        
        const statusUpdateEmailText = `
          KIRASTAY Booking Status Update
          
          Dear ${userData.full_name},
          
          Your booking status has been updated.
          
          Booking Reference: #BK${bookingId}
          Vehicle: ${bookingData.vehicle_name}
          Previous Status: ${currentBooking.status.toUpperCase()}
          New Status: ${status.toUpperCase()}
          Total Amount: $${bookingData.total_amount}
          
          Agency Contact: ${agencyData.agency_name}
          Email: ${agencyData.contact_email}
          Phone: ${agencyData.contact_phone}
          
          If you have questions, please contact the agency or our support team.
          
          Best regards,
          KIRASTAY Team
        `;
        
        
        const customerEmailResult = await sendEmail({
          to: booking.email,
          subject: 'Booking Status Update - KIRASTAY',
          html: statusUpdateEmailHtml,
          text: statusUpdateEmailText
        });
        console.log('Customer status email result:', customerEmailResult.success ? '✅ Sent' : '❌ Failed');
        
        // Send notification to agency if they have email
        if (booking.business_email) {
          console.log('📧 Sending status update to agency:', booking.business_email);
          
          const agencyStatusEmailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Booking Status Update - KIRASTAY Agency</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #fd7e14; color: white; padding: 20px; text-align: center; }
                .content { padding: 30px 20px; background: #f9f9f9; }
                .status-update { background: ${status === 'confirmed' ? '#d4edda' : status === 'canceled' ? '#f8d7da' : '#fff3cd'}; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
                .detail-label { font-weight: bold; color: #555; }
                .detail-value { color: #333; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Booking Status Update</h1>
                  <p>Agency Notification</p>
                </div>
                <div class="content">
                  <p>Dear <strong>${agencyData.contact_full_name}</strong>,</p>
                  
                  <div class="status-update">
                    <h3>Status Updated by Admin</h3>
                    <p>Booking #BK${bookingId} status has been updated to: <strong>${status.toUpperCase()}</strong></p>
                  </div>
                  
                  <div class="booking-details">
                    <h3>Booking Details</h3>
                    <div class="detail-row">
                      <span class="detail-label">Booking ID:</span>
                      <span class="detail-value">#BK${bookingId}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Vehicle:</span>
                      <span class="detail-value">${bookingData.vehicle_name}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Customer:</span>
                      <span class="detail-value">${userData.full_name} (${userData.email})</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">New Status:</span>
                      <span class="detail-value">${status.toUpperCase()}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Total Amount:</span>
                      <span class="detail-value">$${bookingData.total_amount}</span>
                    </div>
                  </div>
                  
                  <p>The customer has been notified of this status change.</p>
                  
                  <p>Best regards,<br>KIRASTAY Platform</p>
                </div>
                <div class="footer">
                  <p>© 2025 KIRASTAY Platform. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `;
          
          const agencyStatusEmailText = `
            KIRASTAY Agency Notification - Booking Status Update
            
            Dear ${agencyData.contact_full_name},
            
            Booking #BK${bookingId} status has been updated by admin to: ${status.toUpperCase()}
            
            Vehicle: ${bookingData.vehicle_name}
            Customer: ${userData.full_name} (${userData.email})
            Total: $${bookingData.total_amount}
            
            The customer has been notified of this change.
            
            Best regards,
            KIRASTAY Platform
          `;
          
          const agencyEmailResult = await sendEmail({
            to: booking.business_email,
            subject: 'Booking Status Update - KIRASTAY Agency',
            html: agencyStatusEmailHtml,
            text: agencyStatusEmailText
          });
          console.log('Agency status email result:', agencyEmailResult.success ? '✅ Sent' : '❌ Failed');
        }
        
        // Send audit notification to admin
        console.log('📧 Sending audit notification to admin');
        
        const adminAuditEmailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Admin Action: Booking Status Updated - KIRASTAY</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #6c757d; color: white; padding: 20px; text-align: center; }
              .content { padding: 30px 20px; background: #f9f9f9; }
              .audit-info { background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #b3d7ff; }
              .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
              .detail-label { font-weight: bold; color: #555; }
              .detail-value { color: #333; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Admin Action: Status Updated</h1>
                <p>Audit Trail Notification</p>
              </div>
              <div class="content">
                <p>Dear Admin,</p>
                
                <div class="audit-info">
                  <h3>Audit Information</h3>
                  <p>An admin has updated booking status via the admin panel.</p>
                  <p><strong>Action:</strong> Status changed from <span style="background: #f8d7da; padding: 2px 6px; border-radius: 3px;">${currentBooking.status.toUpperCase()}</span> to <span style="background: #d4edda; padding: 2px 6px; border-radius: 3px;">${status.toUpperCase()}</span></p>
                  <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                </div>
                
                <div class="booking-details">
                  <h3>Booking Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">Booking ID:</span>
                    <span class="detail-value">#BK${bookingId}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Vehicle:</span>
                    <span class="detail-value">${bookingData.vehicle_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Customer:</span>
                    <span class="detail-value">${userData.full_name} (${userData.email})</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Agency:</span>
                    <span class="detail-value">${agencyData.agency_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value">$${bookingData.total_amount}</span>
                  </div>
                </div>
                
                <p>Both the customer and agency have been notified of this status change.</p>
                
                <p>Best regards,<br>KIRASTAY Platform System</p>
              </div>
              <div class="footer">
                <p>© 2025 KIRASTAY Platform. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;
        
        const adminAuditEmailText = `
          KIRASTAY Admin Audit - Booking Status Updated
          
          An admin has updated booking status:
          
          Booking ID: #BK${bookingId}
          Previous Status: ${currentBooking.status.toUpperCase()}
          New Status: ${status.toUpperCase()}
          Updated at: ${new Date().toLocaleString()}
          
          Vehicle: ${bookingData.vehicle_name}
          Customer: ${userData.full_name} (${userData.email})
          Agency: ${agencyData.agency_name}
          Total: $${bookingData.total_amount}
          
          Both customer and agency have been notified.
          
          KIRASTAY Platform System
        `;
        
        const adminEmailResult = await sendAdminEmail(
          'Admin Action: Booking Status Updated - KIRASTAY',
          adminAuditEmailHtml,
          adminAuditEmailText
        );
        console.log('Admin audit email result:', adminEmailResult.success ? '✅ Sent' : '❌ Failed');
      }
      
    } catch (emailError) {
      console.error('📧 Failed to send status update emails:', emailError);
      // Don't fail the status update if email fails
    }

    // Log the status change (you might want to create an audit table)
    const logQuery = `
      INSERT INTO booking_status_logs (reservation_id, old_status, new_status, changed_by, changed_at)
      VALUES (?, ?, ?, 'admin', NOW())
    `;
    
    try {
      await pool.execute(logQuery, [bookingId, currentBooking.status, status]);
    } catch (logError) {
      // If logging fails, don't fail the main operation
      console.warn('Failed to log status change:', logError);
    }

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking_id: bookingId,
      old_status: currentBooking.status,
      new_status: status
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
