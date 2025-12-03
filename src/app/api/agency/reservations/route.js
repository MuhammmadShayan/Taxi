import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';
import { sendStatusUpdateEmail } from '../../../../lib/emailService';

export async function GET(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    console.log('Decoded token:', decoded);
    if (!decoded || !['agency_owner', 'agency_admin', 'driver'].includes(decoded.user_type)) {
      console.log('Authorization failed:', { decoded: !!decoded, user_type: decoded?.user_type });
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Resolve the agency_id for the logged-in user (agency owner/admin)
    let agencyId = decoded.agency_id;
    if (!agencyId) {
      const rows = await query('SELECT agency_id FROM agencies WHERE user_id = ? LIMIT 1', [decoded.user_id]);
      agencyId = rows?.[0]?.agency_id || decoded.user_id; // fallback for legacy data
    }
    
    console.log('Using agency ID:', { user_type: decoded.user_type, resolved_agency_id: agencyId });

    // Get reservations for this agency
    const reservations = await query(`
      SELECT 
        r.*,
        u.first_name, u.last_name, u.email,
        av.brand as make, av.model, av.year, av.vehicle_number as license_plate,
        av.type as color, av.seats,
        av.type as category_name
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agency_vehicles av ON r.vehicle_id = av.vehicle_id
      WHERE r.agency_id = ?
      ORDER BY r.updated_at DESC
    `, [agencyId]);

    // Format the data
    const formattedReservations = (reservations || []).map(reservation => ({
      ...reservation,
      customer_name: `${reservation.first_name || ''} ${reservation.last_name || ''}`.trim() || 'Unknown Customer',
      vehicle_name: `${reservation.make || ''} ${reservation.model || ''}`.trim() || 'Unknown Vehicle',
      start_date_formatted: reservation.start_date ? new Date(reservation.start_date).toLocaleDateString() : 'N/A',
      end_date_formatted: reservation.end_date ? new Date(reservation.end_date).toLocaleDateString() : 'N/A',
      total_price_formatted: `$${parseFloat(reservation.total_price || 0).toFixed(2)}`
    }));

    return NextResponse.json({
      success: true,
      reservations: formattedReservations
    });

  } catch (error) {
    console.error('Error fetching agency reservations:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message,
      success: false 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !['agency_owner', 'agency_admin', 'driver'].includes(decoded.user_type)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { reservation_id, status } = await request.json();

    if (!reservation_id || !status) {
      return NextResponse.json({ error: 'Reservation ID and status are required' }, { status: 400 });
    }

    // Resolve agency_id like in GET
    let agencyId = decoded.agency_id;
    if (!agencyId) {
      const rows = await query('SELECT agency_id FROM agencies WHERE user_id = ? LIMIT 1', [decoded.user_id]);
      agencyId = rows?.[0]?.agency_id || decoded.user_id; // fallback
    }

    // Get reservation details including customer email before updating
    const reservationDetails = await query(`
      SELECT 
        r.reservation_id, r.status as current_status,
        u.email as customer_email, u.first_name, u.last_name,
        av.brand, av.model
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agency_vehicles av ON r.vehicle_id = av.vehicle_id
      WHERE r.reservation_id = ? AND r.agency_id = ?
    `, [reservation_id, agencyId]);

    if (!reservationDetails || reservationDetails.length === 0) {
      return NextResponse.json({ error: 'Reservation not found or not authorized' }, { status: 404 });
    }

    const reservation = reservationDetails[0];

    // Prevent updating completed or cancelled bookings
    if (['completed', 'cancelled'].includes(reservation.current_status?.toLowerCase())) {
      return NextResponse.json({ 
        error: `Cannot update ${reservation.current_status} booking. This booking is final and cannot be modified.`,
        success: false 
      }, { status: 400 });
    }

    // Normalize status
    const normalizedStatus = status.toLowerCase() === 'cancelled' ? 'canceled' : status.toLowerCase();

    // Update reservation status
    const result = await query(
      'UPDATE reservations SET status = ?, updated_at = NOW() WHERE reservation_id = ? AND agency_id = ?',
      [normalizedStatus, reservation_id, agencyId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Failed to update reservation status' }, { status: 500 });
    }

    // Send email notification if customer email exists
    let emailResult = null;
    if (reservation.customer_email) {
      try {
        const customerName = `${reservation.first_name || ''} ${reservation.last_name || ''}`.trim() || 'Valued Customer';
        const vehicleInfo = `${reservation.brand || ''} ${reservation.model || ''}`.trim() || 'Vehicle';
        const bookingReference = `#${reservation_id}`;
        
        // Enhanced status messages with vehicle info
        const statusMessages = {
          confirmed: `Great news! Your booking for the ${vehicleInfo} has been confirmed by the agency. We look forward to serving you!`,
          canceled: `Your booking for the ${vehicleInfo} has been cancelled by the agency. If you have any questions, please contact us.`,
          cancelled: `Your booking for the ${vehicleInfo} has been cancelled by the agency. If you have any questions, please contact us.`,
          completed: `Thank you for choosing us! Your rental of the ${vehicleInfo} has been completed. We hope you had a great experience.`,
          pending: `Your booking for the ${vehicleInfo} is currently being processed by the agency. We'll update you soon.`,
          active: `Your rental of the ${vehicleInfo} is now active. Enjoy your trip!`,
          no_show: `We noticed you didn't show up for your ${vehicleInfo} rental. Please contact us if you need assistance.`
        };
        
        const statusMessage = statusMessages[status] || `Your booking status has been updated to: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        
        // Create detailed email content
        const emailContent = {
          customerEmail: reservation.customer_email,
          customerName,
          bookingReference,
          newStatus: status,
          statusMessage,
          vehicleInfo
        };
        
        // Use existing email service
        emailResult = await sendStatusUpdateEmail(
          reservation.customer_email,
          bookingReference,
          status
        );
        console.log('Email notification result:', emailResult);
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the status update if email fails
        emailResult = { success: false, error: emailError.message };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Reservation status updated successfully',
      emailSent: emailResult?.success || false,
      emailError: emailResult?.success ? null : emailResult?.error
    });

  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
