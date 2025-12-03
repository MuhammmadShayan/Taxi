import { NextResponse } from 'next/server';
import { query } from '../../lib/database.js';
import { createBookingWithTransaction, getBookingWithDetails } from '../../lib/optimizedQueries.js';
import { sanitizeObject } from '../../lib/sanitizer.js';
import { validateInput, bookingDetailsSchema, customerDetailsSchema, paymentDetailsSchema } from '../../lib/validator.js';
import { AppError, ValidationError } from '../../lib/errorHandler.js';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Sanitize input data
    const sanitizedData = sanitizeObject(body, {
      customerDetails: customerDetailsSchema,
      bookingDetails: bookingDetailsSchema,
      paymentDetails: paymentDetailsSchema
    });
    
    const {
      car_id,
      booking_details,
      customer_details,
      payment_details,
      extras,
      pricing,
      newsletter_subscribe
    } = sanitizedData;

    // Validate input schemas
    validateInput(customer_details, customerDetailsSchema);
    validateInput(booking_details, bookingDetailsSchema);
    if (payment_details) {
      validateInput(payment_details, paymentDetailsSchema);
    }

    // Use optimized booking creation with transaction and batch operations
    const bookingData = {
      customerDetails: {
        email: customer_details.email,
        firstName: customer_details.firstName,
        lastName: customer_details.lastName,
        phone: customer_details.phone,
        license: customer_details.license,
        address: customer_details.address,
        city: customer_details.city,
        country: customer_details.country,
        specialRequests: customer_details.specialRequests
      },
      bookingDetails: {
        pickup_date: booking_details.pickup_date,
        dropoff_date: booking_details.dropoff_date,
        pickup_time: booking_details.pickup_time,
        dropoff_time: booking_details.dropoff_time
      },
      paymentDetails: payment_details,
      extras: extras || {},
      pricing: pricing || {},
      vehicleId: car_id,
      newsletterSubscribe: newsletter_subscribe
    };

    const result = await createBookingWithTransaction(bookingData);
    
    // Update car booking count
    await query(
      'UPDATE cars SET total_bookings = total_bookings + 1 WHERE id = ?',
      [car_id]
    );

    // Get car details for the email
    const carDetails = await query(
      'SELECT make, model, category, price_per_day, images FROM cars WHERE id = ?',
      [car_id]
    );
    const car = carDetails[0];

    // Send booking confirmation email
    try {
      await sendBookingConfirmationEmail({
        customerEmail: customer_details.email,
        customerName: `${customer_details.firstName} ${customer_details.lastName}`,
        bookingReference: result.bookingReference,
        bookingDetails: booking_details,
        car,
        pricing,
        extras
      });
      console.log(`✅ Booking confirmation email sent to: ${customer_details.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send booking confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      booking_id: result.reservationId,
      booking_reference: result.bookingReference,
      extras_inserted: result.extrasInserted,
      message: 'Booking created successfully with optimized batch operations'
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
      // Use optimized single-query booking retrieval
      try {
        const booking = await getBookingWithDetails(bookingId);
        
        return NextResponse.json({
          success: true,
          booking: booking
        });
        
      } catch (detailError) {
        if (detailError.message.includes('not found')) {
          return NextResponse.json({
            success: false,
            message: 'Booking not found'
          }, { status: 404 });
        }
        throw detailError;
      }

    } else {
      // Get bookings list with filters
      let bookingQuery = `
        SELECT b.*, c.make, c.model, c.category, c.images
        FROM bookings b
        LEFT JOIN cars c ON b.car_id = c.id
        WHERE 1=1
      `;
      const queryParams = [];

      if (customerEmail) {
        bookingQuery += ' AND b.customer_email = ?';
        queryParams.push(customerEmail);
      }

      if (status) {
        bookingQuery += ' AND b.booking_status = ?';
        queryParams.push(status);
      }

      bookingQuery += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
      queryParams.push(limit, offset);

      const rows = await query(bookingQuery, queryParams);

      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE 1=1';
      const countParams = [];

      if (customerEmail) {
        countQuery += ' AND customer_email = ?';
        countParams.push(customerEmail);
      }

      if (status) {
        countQuery += ' AND booking_status = ?';
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

    // Build dynamic update query
    const allowedFields = [
      'booking_status', 'payment_status', 'driver_assigned', 'driver_name', 
      'driver_phone', 'pickup_location', 'dropoff_location', 'pickup_date', 
      'pickup_time', 'dropoff_date', 'dropoff_time', 'special_requests'
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

    updateFields.push('updated_at = ?');
    updateValues.push(new Date());
    updateValues.push(booking_id);

    const updateQuery = `UPDATE bookings SET ${updateFields.join(', ')} WHERE id = ?`;
    
    const result = await query(updateQuery, updateValues);

    if (result.affectedRows === 0) {
      return NextResponse.json({
        success: false,
        message: 'Booking not found'
      }, { status: 404 });
    }

    // Send status update email if status changed
    // if (updates.booking_status) {
    //   await sendStatusUpdateEmail(booking_id, updates.booking_status);
    // }

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

// Create Gmail SMTP transporter
function createEmailTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // false for 587, true for 465
    auth: {
      user: process.env.SMTP_USER, // Your Gmail address
      pass: process.env.SMTP_PASS,  // Your Gmail App Password
    },
    tls: {
      rejectUnauthorized: false // For development only
    }
  });
}

// Helper function to send booking confirmation email
async function sendBookingConfirmationEmail({
  customerEmail,
  customerName,
  bookingReference,
  bookingDetails,
  car,
  pricing,
  extras
}) {
  try {
    const transporter = createEmailTransporter();
    
    // Verify SMTP connection
    await transporter.verify();
    console.log('Gmail SMTP connection verified for booking confirmation');
    
    // Format extras list
    const extrasList = [];
    if (extras.gps) extrasList.push('GPS Navigation');
    if (extras.childSeat) extrasList.push('Child Seat');
    if (extras.additionalDriver) extrasList.push('Additional Driver');
    if (extras.insurance) extrasList.push('Insurance Coverage');
    if (extras.wifi) extrasList.push('WiFi Hotspot');
    if (extras.fuelService) extrasList.push('Fuel Service');
    
    const mailOptions = {
      from: {
        name: process.env.APP_NAME || 'KIRASTAY',
        address: process.env.SMTP_USER
      },
      to: customerEmail,
      subject: `Booking Confirmed - ${bookingReference} | KIRASTAY Car Rental`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🚗 KIRASTAY</h1>
            <p style="color: #f0f0f0; margin: 5px 0 0 0; font-size: 16px;">Car Rental Platform</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #28a745; color: white; padding: 15px; border-radius: 50px; display: inline-block; margin-bottom: 15px;">
                <span style="font-size: 24px;">✅</span>
              </div>
              <h2 style="color: #28a745; margin: 0; font-size: 24px;">Booking Confirmed!</h2>
              <p style="color: #666; margin: 10px 0 0 0;">Your car rental has been successfully reserved</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Booking Details</h3>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <strong>Booking Reference:</strong>
                <span style="color: #667eea; font-weight: bold;">${bookingReference}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <strong>Customer:</strong>
                <span>${customerName}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <strong>Vehicle:</strong>
                <span>${car.make} ${car.model} (${car.category})</span>
              </div>
            </div>
            
            <div style="background: #fff; border: 1px solid #e9ecef; border-radius: 10px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #333; margin: 0 0 20px 0; font-size: 18px;">🗓️ Rental Period</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <h4 style="color: #28a745; margin: 0 0 5px 0; font-size: 16px;">📍 Pickup</h4>
                  <p style="margin: 0; color: #666;">
                    <strong>Date:</strong> ${bookingDetails.pickup_date}<br>
                    <strong>Time:</strong> ${bookingDetails.pickup_time}<br>
                    <strong>Location:</strong> ${bookingDetails.pickup_location}
                  </p>
                </div>
                <div>
                  <h4 style="color: #dc3545; margin: 0 0 5px 0; font-size: 16px;">🏁 Dropoff</h4>
                  <p style="margin: 0; color: #666;">
                    <strong>Date:</strong> ${bookingDetails.dropoff_date}<br>
                    <strong>Time:</strong> ${bookingDetails.dropoff_time}<br>
                    <strong>Location:</strong> ${bookingDetails.dropoff_location}
                  </p>
                </div>
              </div>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e9ecef;">
                <strong>Passengers:</strong> ${bookingDetails.passengers} people
              </div>
            </div>
            
            ${extrasList.length > 0 ? `
            <div style="background: #e3f2fd; border: 1px solid #bbdefb; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #1976d2; margin: 0 0 15px 0; font-size: 16px;">🎯 Selected Extras</h4>
              <ul style="margin: 0; padding-left: 20px; color: #666;">
                ${extrasList.map(extra => `<li>${extra}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px;">💰 Payment Summary</h3>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Subtotal (${pricing.days} days):</span>
                <span>$${pricing.subtotal}</span>
              </div>
              ${pricing.extras_total > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Extras:</span>
                <span>$${pricing.extras_total}</span>
              </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Tax:</span>
                <span>$${pricing.tax}</span>
              </div>
              <hr style="margin: 15px 0; border: 1px solid #ffeaa7;">
              <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #856404;">
                <span>Total Amount:</span>
                <span>$${pricing.total}</span>
              </div>
            </div>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 10px; padding: 20px; margin: 25px 0;">
              <h4 style="color: #155724; margin: 0 0 10px 0; font-size: 16px;">📋 Next Steps</h4>
              <ul style="margin: 0; padding-left: 20px; color: #155724;">
                <li>You will receive a confirmation call within 24 hours</li>
                <li>Please have your driving license ready for pickup</li>
                <li>Arrive 15 minutes early for vehicle inspection</li>
                <li>Contact us if you need to modify your booking</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL || 'http://localhost:3000'}/booking-confirmation/${bookingReference}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-size: 16px; font-weight: 600;">
                View Booking Details
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e9ecef;">
            <div style="text-align: center;">
              <p style="color: #6c757d; font-size: 12px; margin: 0 0 10px 0;">
                This email was sent from KIRASTAY Car Rental Platform
              </p>
              <p style="color: #6c757d; font-size: 12px; margin: 0;">
                Need help? Contact us at <a href="mailto:support@kirastay.com" style="color: #667eea;">support@kirastay.com</a>
                or call us at +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
KIRASTAY Booking Confirmation

Booking Reference: ${bookingReference}
Customer: ${customerName}
Vehicle: ${car.make} ${car.model} (${car.category})

Pickup:
Date: ${bookingDetails.pickup_date}
Time: ${bookingDetails.pickup_time}
Location: ${bookingDetails.pickup_location}

Dropoff:
Date: ${bookingDetails.dropoff_date}
Time: ${bookingDetails.dropoff_time}
Location: ${bookingDetails.dropoff_location}

Passengers: ${bookingDetails.passengers}

${extrasList.length > 0 ? `Selected Extras:\n${extrasList.map(extra => `- ${extra}`).join('\n')}\n\n` : ''}
Payment Summary:
Subtotal (${pricing.days} days): $${pricing.subtotal}
${pricing.extras_total > 0 ? `Extras: $${pricing.extras_total}\n` : ''}Tax: $${pricing.tax}
Total Amount: $${pricing.total}

Next Steps:
- You will receive a confirmation call within 24 hours
- Please have your driving license ready for pickup
- Arrive 15 minutes early for vehicle inspection
- Contact us if you need to modify your booking

Best regards,
KIRASTAY Team
      `
    };
    
    console.log('Sending booking confirmation email to:', customerEmail);
    const result = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent successfully:', result.messageId);
    
    return true;
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    throw new Error('Failed to send confirmation email. Please check your email configuration.');
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

    // Check if booking exists and can be cancelled
    const bookingRows = await query(
      'SELECT booking_status FROM bookings WHERE id = ?',
      [bookingId]
    );

    if (bookingRows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Booking not found'
      }, { status: 404 });
    }

    const currentStatus = bookingRows[0].booking_status;
    
    if (['completed', 'cancelled'].includes(currentStatus)) {
      return NextResponse.json({
        success: false,
        message: `Cannot cancel booking with status: ${currentStatus}`
      }, { status: 400 });
    }

    // Update booking status to cancelled
    await query(
      'UPDATE bookings SET booking_status = ?, updated_at = ? WHERE id = ?',
      ['cancelled', new Date(), bookingId]
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

