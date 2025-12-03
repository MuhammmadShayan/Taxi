import { NextResponse } from 'next/server';
import { query, getDbPool } from '../../../lib/db.js';
import bcrypt from 'bcryptjs';
import { sendEmail, sendAdminEmail } from '../../../lib/email.js';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received booking request:', JSON.stringify(body, null, 2));
    
    const {
      vehicle_id,
      car_id, // fallback for old requests
      booking_details,
      customer_details,
      payment_details,
      extras,
      pricing,
      newsletter_subscribe
    } = body;
    
    // Use vehicle_id if available, fallback to car_id
    const vehicleId = vehicle_id || car_id;
    
    // Validate required fields
    if (!customer_details?.email) {
      return NextResponse.json({
        success: false,
        message: 'Customer email is required'
      }, { status: 400 });
    }
    
    if (!booking_details?.pickup_date || !booking_details?.dropoff_date) {
      return NextResponse.json({
        success: false,
        message: 'Pickup and dropoff dates are required'
      }, { status: 400 });
    }

    let passengerId = null;
    let customerId = null;

    // Check if user exists by email (for logged-in users)
    const existingUsers = await query(
      'SELECT user_id FROM users WHERE email = ?',
      [customer_details.email]
    );

    if (existingUsers.length > 0) {
      // Use existing user
      passengerId = existingUsers[0].user_id;
      
      // Update user info with any new details provided
      await query(`
        UPDATE users SET 
          first_name = COALESCE(NULLIF(?, ''), first_name),
          last_name = COALESCE(NULLIF(?, ''), last_name),
          phone = COALESCE(NULLIF(?, ''), phone),
          address = COALESCE(NULLIF(?, ''), address),
          city = COALESCE(NULLIF(?, ''), city),
          country = COALESCE(NULLIF(?, ''), country),
          updated_at = NOW()
        WHERE user_id = ?
      `, [
        customer_details.firstName,
        customer_details.lastName,
        customer_details.phone,
        customer_details.address,
        customer_details.city,
        customer_details.country,
        passengerId
      ]);
    } else {
      // Create new user for guest booking using query function
      const tempPassword = Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(tempPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
      
      const userResult = await query(`
        INSERT INTO users (
          email, password_hash, role, first_name, last_name, 
          phone, address, city, country, status
        ) VALUES (?, ?, 'customer', ?, ?, ?, ?, ?, ?, 'active')
      `, [
        customer_details.email,
        hashedPassword, // Properly hashed temporary password
        customer_details.firstName,
        customer_details.lastName,
        customer_details.phone,
        customer_details.address || null,
        customer_details.city || null,
        customer_details.country || null
      ]);
      passengerId = userResult.insertId;
    }

    // Check if customer record exists for this user
    const existingCustomers = await query(
      'SELECT customer_id FROM customers WHERE user_id = ?',
      [passengerId]
    );

    if (existingCustomers.length > 0) {
      // Use existing customer record
      customerId = existingCustomers[0].customer_id;
    } else {
      // Create new customer record
      const customerResult = await query(`
        INSERT INTO customers (
          user_id, driving_license_number, created_at, updated_at
        ) VALUES (?, ?, NOW(), NOW())
      `, [
        passengerId,
        customer_details.license || null
      ]);
      customerId = customerResult.insertId;
    }

    // Calculate rental days
    const pickupDate = new Date(booking_details.pickup_date);
    const dropoffDate = new Date(booking_details.dropoff_date);
    const diffTime = Math.abs(dropoffDate - pickupDate);
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Normalize time to HH:MM:SS for MySQL TIME columns
    const normalizeTime = (t) => {
      if (!t) return '09:00:00';
      // If already HH:MM:SS or HH:MM, pad to HH:MM:SS
      const hm = /^\d{1,2}:\d{2}(:\d{2})?$/;
      if (hm.test(t)) return t.length === 5 ? `${t}:00` : t;
      // Try parsing formats like 9:00AM, 09:00 PM, etc.
      const m = t.toString().trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (m) {
        let h = parseInt(m[1], 10);
        const minutes = m[2];
        const ap = m[3].toUpperCase();
        if (ap === 'AM') {
          if (h === 12) h = 0;
        } else {
          if (h !== 12) h += 12;
        }
        return `${String(h).padStart(2, '0')}:${minutes}:00`;
      }
      // Fallback default
      return '09:00:00';
    };

    const pickupTime = normalizeTime(booking_details.pickup_time);
    const dropoffTime = normalizeTime(booking_details.dropoff_time);

    // Verify vehicle exists
    const vehicleRows = await query(
      'SELECT id FROM vehicles WHERE id = ?',
      [vehicleId]
    );
    if (vehicleRows.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid vehicle selected' }, { status: 400 });
    }

    // Use default agency ID = 1 or create pickup locations without agency dependency
    const defaultAgencyId = 1;
    
    // Find any active pickup location or create a default one
    let pickupLocationId = null;
    let dropoffLocationId = null;
    
    // First try to find any existing active pickup location
    const locRows = await query(
      'SELECT location_id FROM pickup_locations WHERE status = "active" LIMIT 1'
    );

    if (locRows.length > 0) {
      pickupLocationId = locRows[0].location_id;
      dropoffLocationId = pickupLocationId;
    } else {
      // Create a default pickup location
      const locResult = await query(`
        INSERT INTO pickup_locations (
          agency_id, location_name, type, address, city, country, status, created_at
        ) VALUES (?, ?, 'agency', ?, ?, ?, 'active', NOW())
      `, [
        defaultAgencyId,
        'Default Agency Location',
        customer_details.address || 'Default Address',
        customer_details.city || 'City',
        customer_details.country || 'Country'
      ]);
      pickupLocationId = locResult.insertId;
      dropoffLocationId = pickupLocationId;
    }

    // Insert reservation record with correct schema
    const reservationQuery = `
      INSERT INTO reservations (
        customer_id, agency_id, vehicle_id, pickup_location_id, dropoff_location_id,
        start_date, end_date, pickup_time, dropoff_time,
        status, total_days, subtotal, extras_total, tax_amount, total_price,
        payment_status, special_requests
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, 'pending', ?)
    `;

    const reservationValues = [
      customerId, // customer_id from customers table
      defaultAgencyId, // agency_id (using default)
      vehicleId || null, // vehicle_id
      pickupLocationId, // pickup_location_id
      dropoffLocationId, // dropoff_location_id
      booking_details.pickup_date || null, // start_date
      booking_details.dropoff_date || null, // end_date  
      pickupTime, // pickup_time (HH:MM:SS)
      dropoffTime, // dropoff_time (HH:MM:SS)
      totalDays, // total_days
      pricing?.subtotal || 0, // subtotal
      pricing?.extras_total || 0, // extras_total
      pricing?.tax || 0, // tax_amount
      pricing?.total || 0, // total_price
      customer_details?.specialRequests || null // special_requests
    ];
    
    
    console.log('Reservation values:', reservationValues);
    console.log('Reservation values types:', reservationValues.map((val, i) => `${i}: ${typeof val} - ${val}`));
    
    // Check for undefined values
    const undefinedIndexes = reservationValues.map((val, i) => val === undefined ? i : null).filter(i => i !== null);
    if (undefinedIndexes.length > 0) {
      console.error('Undefined values at indexes:', undefinedIndexes);
      return NextResponse.json({
        success: false,
        message: `Invalid reservation data at positions: ${undefinedIndexes.join(', ')}`
      }, { status: 400 });
    }

    const result = await query(reservationQuery, reservationValues);
    const reservationId = result.insertId;
    
    // Generate booking reference for response
    const bookingReference = `BK${reservationId}${Date.now().toString().slice(-6)}`;
    
    // Insert reservation extras if any
    if (extras && Object.keys(extras).some(key => extras[key])) {
      const extrasList = [
        { key: 'gps', name: 'GPS Navigation', price: 5 },
        { key: 'childSeat', name: 'Child Safety Seat', price: 8 },
        { key: 'additionalDriver', name: 'Additional Driver', price: 15 },
        { key: 'insurance', name: 'Comprehensive Insurance', price: 12 },
        { key: 'wifi', name: 'WiFi Hotspot', price: 4 },
        { key: 'fuelService', name: 'Fuel Service', price: 10 }
      ];
      
      for (const extra of extrasList) {
        if (extras[extra.key]) {
          await query(`
            INSERT INTO reservation_extras (reservation_id, extra_id, quantity, unit_price, total_price)
            SELECT ?, e.extra_id, 1, ?, ?
            FROM extras e WHERE e.name LIKE ?
            LIMIT 1
          `, [reservationId, extra.price, extra.price, `%${extra.name.split(' ')[0]}%`]);
        }
      }
    }

    // Store payment details if credit card
    if (payment_details.method === 'credit_card') {
      const paymentQuery = `
        INSERT INTO booking_payments (
          booking_id, card_number_masked, cardholder_name, expiry_date,
          billing_address, billing_city, billing_country, billing_postal_code,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const maskedCardNumber = payment_details.cardNumber.replace(/\d(?=\d{4})/g, '*');
      
      const paymentValues = [
        reservationId,
        maskedCardNumber,
        payment_details.cardName,
        payment_details.expiryDate,
        payment_details.billingAddress || null,
        payment_details.billingCity || null,
        payment_details.billingCountry || null,
        payment_details.billingPostalCode || null,
        new Date()
      ];

      await query(paymentQuery, paymentValues);
    }

    // Note: Skip updating car booking count for now as table structure may differ
    // TODO: Update vehicle booking count if needed
    // await connection.execute(
    //   'UPDATE vehicles SET total_bookings = total_bookings + 1 WHERE vehicle_id = ?',
    //   [car_id]
    // );

    // Subscribe to newsletter if requested
    if (newsletter_subscribe) {
      try {
        const newsletterQuery = `
          INSERT INTO newsletter_subscribers (email, subscribed_at)
          VALUES (?, ?) 
          ON DUPLICATE KEY UPDATE subscribed_at = VALUES(subscribed_at)
        `;
        
        await query(newsletterQuery, [
          customer_details.email,
          new Date()
        ]);
      } catch (newsletterError) {
        // Newsletter table doesn't exist, skip newsletter subscription
        console.log('Newsletter subscription skipped - table does not exist:', newsletterError.message);
      }
    }

    // NOTE: Email notifications are now handled by the send-success-emails endpoint
    // This prevents duplicate emails from being sent during booking creation
    console.log('📧 Booking created successfully. Email notifications will be sent after payment confirmation.');

    return NextResponse.json({
      success: true,
      booking_id: reservationId,
      booking_reference: bookingReference,
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create booking. Please try again.'
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('booking_id');
    const customerEmail = searchParams.get('customer_email');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    if (bookingId) {
      // Get specific reservation/booking
      const bookingQuery = `
        SELECT r.*, v.make as brand, v.model, v.year,
               u.first_name as customer_first_name, u.last_name as customer_last_name,
               u.email as customer_email, u.phone as customer_phone,
               u.address as customer_address, u.city as customer_city,
               u.country as customer_country,
               pl.location_name as pickup_location_name, pl.address as pickup_address,
               dl.location_name as dropoff_location_name, dl.address as dropoff_address,
               a.business_name as agency_name
        FROM reservations r
        LEFT JOIN vehicles v ON r.vehicle_id = v.id
        LEFT JOIN customers c ON r.customer_id = c.customer_id
        LEFT JOIN users u ON c.user_id = u.user_id
        LEFT JOIN pickup_locations pl ON r.pickup_location_id = pl.location_id
        LEFT JOIN pickup_locations dl ON r.dropoff_location_id = dl.location_id
        LEFT JOIN agencies a ON r.agency_id = a.agency_id
        WHERE r.reservation_id = ?
      `;
      
      const rows = await query(bookingQuery, [bookingId]);
      
      if (rows.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'Booking not found'
        }, { status: 404 });
      }

      const booking = rows[0];
      
      // Get reservation extras if any
      try {
        const extrasRows = await query(`
          SELECT re.*, e.name as extra_name, e.description as extra_description
          FROM reservation_extras re
          LEFT JOIN extras e ON re.extra_id = e.extra_id
          WHERE re.reservation_id = ?
        `, [bookingId]);

        if (extrasRows.length > 0) {
          booking.extras = extrasRows;
        }
      } catch (extrasError) {
        console.log('No extras found or table does not exist:', extrasError.message);
      }

      // Get payment details if exists
      try {
        const paymentRows = await query(
          'SELECT * FROM payments WHERE reservation_id = ?',
          [bookingId]
        );

        if (paymentRows.length > 0) {
          booking.payment_details = paymentRows[0];
        }
      } catch (paymentError) {
        console.log('No payment details found or table does not exist:', paymentError.message);
      }

      return NextResponse.json({
        success: true,
        booking: booking
      });

    } else {
      // Get reservations/bookings list with filters
      let bookingsQuery = `
        SELECT r.*, v.make as brand, v.model, v.year,
               u.first_name as customer_first_name, u.last_name as customer_last_name,
               u.email as customer_email, u.phone as customer_phone,
               u.address as customer_address, u.city as customer_city,
               u.country as customer_country,
               a.business_name as agency_name
        FROM reservations r
        LEFT JOIN vehicles v ON r.vehicle_id = v.id
        LEFT JOIN customers c ON r.customer_id = c.customer_id
        LEFT JOIN users u ON c.user_id = u.user_id
        LEFT JOIN agencies a ON r.agency_id = a.agency_id
        WHERE 1=1
      `;
      const queryParams = [];

      if (customerEmail) {
        bookingsQuery += ' AND u.email = ?';
        queryParams.push(customerEmail);
      }

      if (status) {
        bookingsQuery += ' AND r.status = ?';
        queryParams.push(status);
      }

      bookingsQuery += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
      queryParams.push(limit, offset);

      const rows = await query(bookingsQuery, queryParams);

      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) as total FROM reservations r
        LEFT JOIN customers c ON r.customer_id = c.customer_id
        LEFT JOIN users u ON c.user_id = u.user_id
        WHERE 1=1
      `;
      const countParams = [];

      if (customerEmail) {
        countQuery += ' AND u.email = ?';
        countParams.push(customerEmail);
      }

      if (status) {
        countQuery += ' AND r.status = ?';
        countParams.push(status);
      }

      const countRows = await query(countQuery, countParams);
      const total = countRows[0].total;

      return NextResponse.json({
        success: true,
        bookings: rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch bookings'
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { booking_id, updates } = body;

    if (!booking_id) {
      return NextResponse.json({
        success: false,
        message: 'Booking ID is required'
      }, { status: 400 });
    }

    // Build dynamic update query for reservations table
    const allowedFields = [
      'status', 'payment_status', 'start_date', 'end_date',
      'pickup_time', 'dropoff_time', 'special_requests',
      'total_days', 'subtotal', 'extras_total', 'tax_amount', 'total_price'
    ];

    const updateFields = [];
    const updateValues = [];

    Object.keys(updates).forEach(field => {
      if (allowedFields.includes(field)) {
        updateFields.push(`${field} = ?`);
        updateValues.push(updates[field]);
      }
    });

    if (updateFields.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No valid fields to update'
      }, { status: 400 });
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(booking_id);

    const updateQuery = `UPDATE reservations SET ${updateFields.join(', ')} WHERE reservation_id = ?`;
    
    const result = await query(updateQuery, updateValues);

    if (result.affectedRows === 0) {
      return NextResponse.json({
        success: false,
        message: 'Booking not found'
      }, { status: 404 });
    }

    // Connection will be automatically returned to pool

    // Send status update email if status changed
    if (updates.status) {
      console.log('📧 Sending status update email notifications...');
      try {
        // Get booking details for email
        const bookingDetails = await query(`
          SELECT r.*, v.make, v.model, v.year,
                 u.first_name, u.last_name, u.email, u.phone,
                 a.business_name, a.contact_name, a.business_email, a.business_phone
          FROM reservations r
          LEFT JOIN vehicles v ON r.vehicle_id = v.id
          LEFT JOIN customers c ON r.customer_id = c.customer_id
          LEFT JOIN users u ON c.user_id = u.user_id
          LEFT JOIN agencies a ON v.agency_id = a.agency_id
          WHERE r.reservation_id = ?
        `, [booking_id]);
        
        if (bookingDetails.length > 0) {
          const booking = bookingDetails[0];
          
          const bookingData = {
            id: booking_id,
            vehicle_name: `${booking.make} ${booking.model} ${booking.year}`,
            pickup_date: booking.start_date,
            return_date: booking.end_date,
            pickup_location: booking.pickup_location || 'TBD',
            total_amount: booking.total_price,
            status: updates.status
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
                .status-update { background: ${updates.status === 'confirmed' ? '#d4edda' : updates.status === 'canceled' ? '#f8d7da' : '#fff3cd'}; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid ${updates.status === 'confirmed' ? '#c3e6cb' : updates.status === 'canceled' ? '#f5c6cb' : '#ffeaa7'}; }
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
                  <p>Booking Reference: #BK${booking_id}</p>
                </div>
                <div class="content">
                  <p>Dear <strong>${userData.full_name}</strong>,</p>
                  
                  <div class="status-update">
                    <h3>Status Update</h3>
                    <p>Your booking status has been updated to: <strong>${updates.status.toUpperCase()}</strong></p>
                    ${updates.status === 'confirmed' ? '<p style="color: #155724;">Great news! Your booking has been confirmed by the agency.</p>' : ''}
                    ${updates.status === 'canceled' ? '<p style="color: #721c24;">Your booking has been canceled. Please contact us if you have questions.</p>' : ''}
                    ${updates.status === 'completed' ? '<p style="color: #155724;">Your rental has been completed. Thank you for choosing KIRASTAY!</p>' : ''}
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
                      <span class="detail-value">${updates.status.toUpperCase()}</span>
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
            
            Booking Reference: #BK${booking_id}
            Vehicle: ${bookingData.vehicle_name}
            New Status: ${updates.status.toUpperCase()}
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
          
          // Send notification to admin
          console.log('📧 Sending status update notification to admin');
          
          const adminStatusEmailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Booking Status Updated - KIRASTAY Admin</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #6c757d; color: white; padding: 20px; text-align: center; }
                .content { padding: 30px 20px; background: #f9f9f9; }
                .status-update { background: ${updates.status === 'confirmed' ? '#d4edda' : updates.status === 'canceled' ? '#f8d7da' : '#fff3cd'}; padding: 20px; border-radius: 8px; margin: 20px 0; }
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
                  <h1>Booking Status Updated</h1>
                  <p>Admin Notification</p>
                </div>
                <div class="content">
                  <p>Dear Admin,</p>
                  
                  <div class="status-update">
                    <h3>Status Change Notification</h3>
                    <p>Booking #BK${booking_id} status has been updated to: <strong>${updates.status.toUpperCase()}</strong></p>
                  </div>
                  
                  <div class="booking-details">
                    <h3>Booking Details</h3>
                    <div class="detail-row">
                      <span class="detail-label">Booking ID:</span>
                      <span class="detail-value">#BK${booking_id}</span>
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
                      <span class="detail-label">New Status:</span>
                      <span class="detail-value">${updates.status.toUpperCase()}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Total Amount:</span>
                      <span class="detail-value">$${bookingData.total_amount}</span>
                    </div>
                  </div>
                  
                  <p>The customer has been notified of this status change.</p>
                  
                  <p>Best regards,<br>KIRASTAY Platform System</p>
                </div>
                <div class="footer">
                  <p>© 2025 KIRASTAY Platform. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `;
          
          const adminStatusEmailText = `
            KIRASTAY Admin Notification - Booking Status Updated
            
            Booking #BK${booking_id} status has been updated to: ${updates.status.toUpperCase()}
            
            Vehicle: ${bookingData.vehicle_name}
            Customer: ${userData.full_name} (${userData.email})
            Agency: ${agencyData.agency_name}
            Total: $${bookingData.total_amount}
            
            The customer has been notified of this change.
            
            KIRASTAY Platform System
          `;
          
          const adminEmailResult = await sendAdminEmail(
            'Booking Status Updated - KIRASTAY Admin',
            adminStatusEmailHtml,
            adminStatusEmailText
          );
          console.log('Admin status email result:', adminEmailResult.success ? '✅ Sent' : '❌ Failed');
        }
        
      } catch (emailError) {
        console.error('📧 Failed to send status update emails:', emailError);
        // Don't fail the update if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully'
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update booking'
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('booking_id');

    if (!bookingId) {
      return NextResponse.json({
        success: false,
        message: 'Booking ID is required'
      }, { status: 400 });
    }

    // Check if reservation exists and can be cancelled
    const reservationRows = await query(
      'SELECT status FROM reservations WHERE reservation_id = ?',
      [bookingId]
    );

    if (reservationRows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Booking not found'
      }, { status: 404 });
    }

    const currentStatus = reservationRows[0].status;
    
    if (['completed', 'canceled'].includes(currentStatus)) {
      return NextResponse.json({
        success: false,
        message: `Cannot cancel booking with status: ${currentStatus}`
      }, { status: 400 });
    }

    // Update reservation status to cancelled
    await query(
      'UPDATE reservations SET status = ?, updated_at = NOW() WHERE reservation_id = ?',
      ['canceled', bookingId]
    );

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to cancel booking'
    }, { status: 500 });
  }
}
