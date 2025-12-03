import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { sendEmail, sendAdminEmail } from '../../../../lib/email.js';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      // Basic Info
      agency_name,
      
      // Payment Methods
      payment_pay_all = false,
      payment_20_percent = false,
      
      // Address
      street_number,
      city,
      postal_code,
      country = 'Morocco',
      
      // Seats
      baby_seat = false,
      baby_seat_price = null,
      child_seat = false,
      child_seat_price = null,
      booster_seat = false,
      booster_seat_price = null,
      
      // Contact Info
      contact_full_name,
      contact_email,
      contact_phone,
      
      // Navigation System
      navigation_system,
      
      // Pickup Locations
      agency_as_pickup = false,
      default_pickup_location = 'Marrakech',
      additional_pickup_locations = [],
      
      // Role
      role = '',
      
      // Login Info
      username,
      password,
      
      // Insurance
      all_risks_insurance = false,
      insurance_price = null,
      
      // Other Services
      other_services = '',
      
      // Comment
      comment = ''
    } = body;

    console.log('\n=== AGENCY REGISTRATION START ===');
    console.log('Received agency registration:', {
      agency_name,
      contact_email,
      username,
      city,
      timestamp: new Date().toISOString()
    });
    console.log('Full form data received:', Object.keys(body));

    // Validate required fields
    if (!agency_name || !contact_full_name || !contact_email || !contact_phone || 
        !street_number || !city || !username || !password) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    console.log('Checking if email exists:', contact_email);
    const existingUser = await query(
      'SELECT user_id FROM users WHERE email = ?',
      [contact_email]
    );
    console.log('Existing user check result:', existingUser.length);

    if (existingUser.length > 0) {
      console.log('❌ Email already exists, registration aborted');
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Prepare payment methods
    const paymentMethods = [];
    if (payment_pay_all) paymentMethods.push('pay_all');
    if (payment_20_percent) paymentMethods.push('20_percent');

    // Prepare pickup locations
    const pickupLocations = [default_pickup_location];
    if (agency_as_pickup) {
      pickupLocations.push(`${street_number}, ${city}, ${country}`);
    }
    if (additional_pickup_locations && additional_pickup_locations.length > 0) {
      pickupLocations.push(...additional_pickup_locations);
    }

    // Get database connection for transaction
    const { getDbPool } = await import('../../../../lib/db');
    const pool = getDbPool();
    const connection = await pool.getConnection();

    try {
      // Start transaction
      console.log('🔄 Starting database transaction...');
      await connection.beginTransaction();
      console.log('✅ Transaction started successfully');

      // First create user record for agency admin
      console.log('👤 Creating user record with email:', contact_email);
      const [userResult] = await connection.execute(`
        INSERT INTO users (
          role, first_name, last_name, email, password_hash, phone, address, city, country, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'agency_owner', // role (matches enum in your schema)
        contact_full_name.split(' ')[0] || contact_full_name, // first_name
        contact_full_name.split(' ').slice(1).join(' ') || '', // last_name
        contact_email, // email
        hashedPassword, // password_hash (not password)
        contact_phone, // phone
        street_number, // address
        city, // city
        country, // country
        'active' // status
      ]);
      console.log('✅ User created with ID:', userResult.insertId);

      const userId = userResult.insertId;

      // Create agency record
      console.log('🏢 Creating agency record for user ID:', userId);
      const [agencyResult] = await connection.execute(`
        INSERT INTO agencies (
          user_id, business_name, description, contact_name, business_phone, 
          business_email, business_address, business_city, business_state, 
          business_country, business_postal_code, payment_methods, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId, // user_id (foreign key to users table)
        agency_name, // business_name
        comment || `${agency_name} - Role: ${role}. Services: ${other_services}. Navigation: ${navigation_system}. Seats: ${baby_seat ? 'Baby ' : ''}${child_seat ? 'Child ' : ''}${booster_seat ? 'Booster' : ''}`, // description
        contact_full_name, // contact_name
        contact_phone, // business_phone
        contact_email, // business_email
        street_number, // business_address
        city, // business_city
        '', // business_state
        country, // business_country
        postal_code || '', // business_postal_code
        JSON.stringify(paymentMethods), // payment_methods
        'pending' // status - pending admin approval
      ]);
      console.log('✅ Agency created with ID:', agencyResult.insertId);

      const agencyId = agencyResult.insertId;

      // Commit transaction
      console.log('💾 Committing transaction...');
      await connection.commit();
      console.log('✅ Transaction committed successfully!');

      console.log('🎉 Agency registration completed successfully:', {
        agencyId,
        userId,
        email: contact_email,
        timestamp: new Date().toISOString()
      });

      // Send email notifications
      console.log('📧 Sending email notifications...');
      try {
        // Send confirmation email to agency
        console.log('📧 Sending confirmation email to agency:', contact_email);
        
        const agencyConfirmationHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Agency Registration Confirmation - KIRASTAY</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #2c5aa0; color: white; padding: 20px; text-align: center; }
              .content { padding: 30px 20px; background: #f9f9f9; }
              .agency-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
              .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
              .warning-box { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 25px 0; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to KIRASTAY!</h1>
              </div>
              <div class="content">
                <p>Dear <strong>${contact_full_name}</strong>,</p>
                
                <p>Thank you for registering <strong>${agency_name}</strong> with KIRASTAY. Your application has been received and is currently under review.</p>
                
                <div class="agency-details">
                  <h3>Registration Details:</h3>
                  <div class="detail-row"><strong>Agency Name:</strong><span>${agency_name}</span></div>
                  <div class="detail-row"><strong>Contact Person:</strong><span>${contact_full_name}</span></div>
                  <div class="detail-row"><strong>Email:</strong><span>${contact_email}</span></div>
                  <div class="detail-row"><strong>Phone:</strong><span>${contact_phone}</span></div>
                  <div class="detail-row"><strong>Address:</strong><span>${street_number}, ${city}, ${country}</span></div>
                  <div class="detail-row"><strong>Username:</strong><span>${username}</span></div>
                </div>
                
                <div class="warning-box">
                  <h3>What happens next?</h3>
                  <ul>
                    <li>Our admin team will review your application within 2-3 business days</li>
                    <li>You will receive an email notification once your application is approved</li>
                    <li>After approval, you can start adding vehicles and accepting bookings</li>
                  </ul>
                </div>
                
                <p>If you have any questions, please don't hesitate to contact our support team.</p>
                <p>Best regards,<br>The KIRASTAY Team</p>
              </div>
              <div class="footer">
                <p>© 2025 KIRASTAY Platform. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;
        
        const agencyEmailResult = await sendEmail({
          to: contact_email,
          subject: 'Agency Registration Confirmation - KIRASTAY',
          html: agencyConfirmationHtml,
          text: `Welcome to KIRASTAY!\n\nDear ${contact_full_name},\n\nThank you for registering ${agency_name} with KIRASTAY. Your application is under review.\n\nWe'll notify you within 2-3 business days.\n\nBest regards,\nKIRASTAY Team`
        });
        console.log('Agency email result:', agencyEmailResult.success ? '✅ Sent' : '❌ Failed');

        // Send notification email to admin
        console.log('📧 Sending notification email to admin');
        
        const adminNotificationHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>New Agency Registration - KIRASTAY</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
              .content { padding: 30px 20px; background: #f9f9f9; }
              .agency-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
              .detail-row { margin: 10px 0; }
              .label { font-weight: bold; display: inline-block; width: 150px; }
              .review-button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Agency Registration</h1>
              </div>
              <div class="content">
                <p>A new agency has registered and requires admin review.</p>
                
                <div class="agency-details">
                  <h3>Agency Information:</h3>
                  <div class="detail-row"><span class="label">Agency Name:</span>${agency_name}</div>
                  <div class="detail-row"><span class="label">Contact:</span>${contact_full_name}</div>
                  <div class="detail-row"><span class="label">Email:</span>${contact_email}</div>
                  <div class="detail-row"><span class="label">Phone:</span>${contact_phone}</div>
                  <div class="detail-row"><span class="label">Address:</span>${street_number}, ${city}, ${country}</div>
                  <div class="detail-row"><span class="label">Username:</span>${username}</div>
                  <div class="detail-row"><span class="label">Role:</span>${role || 'Not specified'}</div>
                  <div class="detail-row"><span class="label">Payment:</span>${payment_pay_all ? 'Full Payment ' : ''}${payment_20_percent ? '20% Advance' : ''}</div>
                  <div class="detail-row"><span class="label">GPS:</span>${navigation_system === 'yes' ? 'Available' : 'Not Available'}</div>
                  ${other_services ? `<div class="detail-row"><span class="label">Services:</span>${other_services}</div>` : ''}
                  ${comment ? `<div class="detail-row"><span class="label">Comments:</span>${comment}</div>` : ''}
                </div>
                
                <a href="${process.env.APP_URL}/admin/agencies" class="review-button">Review Application</a>
                
                <p>Please review this application and approve or reject as appropriate.</p>
              </div>
              <div class="footer">
                <p>© 2025 KIRASTAY Platform. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;
        
        const adminEmailResult = await sendAdminEmail({
          subject: 'New Agency Registration - Review Required',
          html: adminNotificationHtml,
          text: `New Agency Registration\n\nAgency: ${agency_name}\nContact: ${contact_full_name}\nEmail: ${contact_email}\nAddress: ${street_number}, ${city}, ${country}\n\nPlease review in admin panel: ${process.env.APP_URL}/admin/agencies`
        });
        console.log('Admin email result:', adminEmailResult.success ? '✅ Sent' : '❌ Failed');

      } catch (emailError) {
        console.error('📧 Email sending failed (but registration successful):', emailError);
        // Don't fail the registration if email fails
      }

      console.log('=== AGENCY REGISTRATION END ===\n');

      return NextResponse.json({
        success: true,
        message: 'Agency registration submitted successfully! Your application is pending admin approval. Confirmation emails have been sent.',
        data: {
          agencyId,
          email: contact_email,
          status: 'pending'
        }
      }, { status: 201 });

    } catch (dbError) {
      // Rollback transaction on error
      console.log('❌ Database error occurred, rolling back transaction:', dbError.message);
      await connection.rollback();
      console.log('🔄 Transaction rolled back');
      throw dbError;
    } finally {
      // Always release the connection
      console.log('🔌 Releasing database connection');
      connection.release();
    }

  } catch (error) {
    console.error('Agency registration error:', error);
    
    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Email or agency name already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Registration failed', 
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Agency registration endpoint is ready',
    endpoints: {
      POST: 'Register a new agency'
    }
  });
}
