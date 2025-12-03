import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database.js';
import bcrypt from 'bcryptjs';
import { signSession } from '../../../../lib/auth';
import { sendEmail, sendAdminEmail, sendVerificationEmail } from '../../../../lib/email.js';
import tokenStorage from '../../../../lib/reset-tokens.js';

export async function POST(request) {
	try {
		console.log('👤 Registration attempt started');
		const body = await request.json();
		console.log('📧 Registration email:', body.email);
		const { 
			username, 
			email, 
			password, 
			first_name, 
			last_name, 
			phone_number, 
			date_of_birth,
			driving_license_number,
			user_type = 'client' 
		} = body;

		// Basic validation
		if (!email || !password) {
			return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
		}

		if (password.length < 6) {
			return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
		}

		// Check if user already exists
		console.log('🔍 Checking if user already exists...');
		let existingUsers;
		try {
			existingUsers = await query(
				'SELECT user_id FROM users WHERE email = ?',
				[email]
			);
			console.log('✅ Database check successful, found', existingUsers?.length || 0, 'existing users');
		} catch (dbError) {
			console.error('🔥 Database query error during user check:', dbError);
			console.error('🔥 Database config:', {
				host: process.env.DB_HOST || 'localhost',
				database: process.env.DB_NAME || 'my_travel_app',
				port: process.env.DB_PORT || 3306
			});
			return NextResponse.json({ 
				error: 'Database connection failed. Please ensure MySQL is running.',
				details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
			}, { status: 500 });
		}

		if (existingUsers.length > 0) {
			return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Prepare user data with required fields matching database schema
		const userData = {
			role: user_type === 'client' ? 'customer' : user_type, // Map to enum values: customer, admin, agency_owner
			first_name: first_name || username || email.split('@')[0],
			last_name: last_name || 'User',
			email: email,
			password_hash: hashedPassword, // Column name is password_hash, not password
			phone: phone_number || null, // Column name is phone, not phone_number
			date_of_birth: date_of_birth || null,
			address: null,
			city: null,
			state: null,
			country: null,
			postal_code: null,
			profile_image: null,
			status: 'active' // Enum: active, inactive, suspended
		};

		// Insert user into database with correct schema
		console.log('💾 Inserting new user into database...');
		let result;
		try {
			result = await query(
			`INSERT INTO users (
				role, first_name, last_name, email, password_hash, phone, 
				date_of_birth, address, city, state, country, 
				postal_code, profile_image, status
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				userData.role,
				userData.first_name,
				userData.last_name,
				userData.email,
				userData.password_hash,
				userData.phone,
				userData.date_of_birth,
				userData.address,
				userData.city,
				userData.state,
				userData.country,
				userData.postal_code,
				userData.profile_image,
				userData.status
			]
			);
			console.log('✅ User inserted successfully with ID:', result.insertId);
		} catch (insertError) {
			console.error('🔥 Database insert error:', insertError);
			return NextResponse.json({ 
				error: 'Failed to create user account',
				details: process.env.NODE_ENV === 'development' ? insertError.message : undefined
			}, { status: 500 });
		}

		const userId = result.insertId;

		// Return success response with both role and user_type for compatibility
		const user = {
			user_id: userId, // Use correct column name
			email: userData.email,
			first_name: userData.first_name,
			last_name: userData.last_name,
			role: userData.role,
			user_type: userData.role // Add user_type field for AuthContext compatibility
		};

    // Send email notifications
		console.log('📧 Sending email notifications...');
		try {
      // Send welcome email to user
			console.log('📧 Sending welcome email to user:', userData.email);
			const welcomeEmailHtml = `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<title>Welcome to KIRASTAY!</title>
					<style>
						body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
						.container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
						.header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
						.logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; letter-spacing: 2px; }
						.content { padding: 30px 20px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
						.welcome-message { font-size: 18px; color: #1e40af; margin-bottom: 20px; }
						.features { margin: 25px 0; }
						.feature { display: flex; align-items: center; margin: 15px 0; padding: 15px; background: #f8fafc; border-radius: 8px; }
						.feature-icon { width: 24px; height: 24px; margin-right: 15px; color: #1e40af; }
						.cta-button { display: inline-block; background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; text-align: center; }
						.footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
					</style>
				</head>
				<body>
					<div class="container">
						<div class="header">
            <div class="logo">KIRASTAY</div>
							<p>Your Journey Starts Here</p>
						</div>
						
						<div class="content">
							<h2 class="welcome-message">Welcome to KIRASTAY, ${userData.first_name}!</h2>
							
							<p>Congratulations! Your account has been successfully created. You're now part of Morocco's leading multi-vendor vehicle rental platform.</p>
							
							<div class="features">
                <div class="feature">
                    <div><strong>Instant Access:</strong> Your account is ready to use immediately</div>
                </div>
                <div class="feature">
                    <div><strong>Wide Selection:</strong> Choose from hundreds of verified vehicles</div>
                </div>
                <div class="feature">
                    <div><strong>Secure Platform:</strong> Safe and encrypted transactions</div>
                </div>
                <div class="feature">
                    <div><strong>Mobile Friendly:</strong> Book anywhere, anytime</div>
                </div>
							</div>
							
							<p><strong>What's Next?</strong></p>
							<ul>
								<li>Browse our extensive vehicle collection</li>
								<li>Book your first rental with instant confirmation</li>
								<li>Enjoy 24/7 customer support</li>
								<li>Rate and review your experience</li>
							</ul>
							
							<a href="${process.env.APP_URL}" class="cta-button">Start Exploring KIRASTAY</a>
							
							<p>If you have any questions, our support team is here to help 24/7 at <strong>support@kirastay.com</strong></p>
							
							<p>Welcome aboard!</p>
							<p><strong>The KIRASTAY Team</strong></p>
						</div>
						
						<div class="footer">
							<p>© 2025 KIRASTAY Platform. All rights reserved.</p>
							<p>This email was sent to ${userData.email}</p>
							<p>Morocco's Premier Vehicle Rental Platform</p>
						</div>
					</div>
				</body>
				</html>
			`;

            const welcomeEmailText = `
                Welcome to KIRASTAY, ${userData.first_name}!
                
                Your account has been successfully created. You're now part of Morocco's leading vehicle rental platform.
                
                Features:
                - Instant Access - Your account is ready to use
                - Wide Selection - Hundreds of verified vehicles
                - Secure Platform - Safe transactions
                - Mobile Friendly - Book anywhere, anytime
                
                Start exploring: ${process.env.APP_URL}
                
                Support: support@kirastay.com
                
                Welcome aboard!
                The KIRASTAY Team
            `;

			// Send welcome email to user
			console.log('📧 Sending welcome email to user:', userData.email);
            const userEmailResult = await sendEmail({
                to: userData.email,
                subject: 'Welcome to KIRASTAY! Your account is ready',
                html: welcomeEmailHtml,
                text: welcomeEmailText
            });
			console.log('User welcome email result:', userEmailResult.success ? '✅ Sent' : '❌ Failed');

      // Optionally send verification email
      if (process.env.REQUIRE_EMAIL_VERIFICATION === 'true') {
        const verificationToken = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        tokenStorage.storeToken(verificationToken, userData.email, 24 * 60);
        await sendVerificationEmail(userData.email, verificationToken);
      }

      // Send notification email to admin
			console.log('📧 Sending notification email to admin');
			const adminEmailHtml = `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<title>New User Registration - KIRASTAY</title>
					<style>
						body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
						.container { max-width: 600px; margin: 0 auto; padding: 20px; }
						.header { background: #2c5aa0; color: white; padding: 20px; text-align: center; }
						.content { padding: 30px 20px; background: #f9f9f9; }
						.user-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
						.detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
						.footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
					</style>
				</head>
				<body>
					<div class="container">
                        <div class="header">
                            <h1>New User Registration</h1>
                        </div>
						<div class="content">
							<p>A new user has registered on the KIRASTAY platform.</p>
							
							<div class="user-details">
								<h3>User Details</h3>
								<div class="detail-row">
									<strong>Full Name:</strong>
									<span>${userData.first_name} ${userData.last_name}</span>
								</div>
								<div class="detail-row">
									<strong>Email:</strong>
									<span>${userData.email}</span>
								</div>
								<div class="detail-row">
									<strong>Phone:</strong>
									<span>${userData.phone || 'Not provided'}</span>
								</div>
								<div class="detail-row">
									<strong>Role:</strong>
									<span>${userData.role}</span>
								</div>
								<div class="detail-row">
									<strong>Registration Date:</strong>
									<span>${new Date().toLocaleString()}</span>
								</div>
							</div>
							
							<p>You can view and manage all users in the admin panel.</p>
						</div>
						<div class="footer">
							<p>© 2025 KIRASTAY Platform. All rights reserved.</p>
						</div>
					</div>
				</body>
				</html>
			`;

			const adminEmailText = `
				New User Registration - KIRASTAY
				
				A new user has registered:
				
				- Name: ${userData.first_name} ${userData.last_name}
				- Email: ${userData.email}
				- Phone: ${userData.phone || 'Not provided'}
				- Role: ${userData.role}
				- Registration Date: ${new Date().toLocaleString()}
				
				View admin panel: ${process.env.APP_URL}/admin
			`;
			
			// Send notification email to admin
			console.log('📧 Sending notification email to admin');
			const adminEmailResult = await sendAdminEmail(
				'New User Registration - KIRASTAY',
				adminEmailHtml,
				adminEmailText
			);
			console.log('Admin email result:', adminEmailResult.success ? '✅ Sent' : '❌ Failed');

		} catch (emailError) {
			console.error('📧 Email sending failed (but registration successful):', emailError);
			// Don't fail registration if email fails
		}

		// Generate session token
		const token = signSession(user);
		const response = NextResponse.json({ 
			success: true,
			message: 'User registered successfully',
			user 
		}, { status: 201 });

		// Set session cookie
		response.cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		return response;

	} catch (error) {
		if (error && error.code === 'ER_DUP_ENTRY') {
			console.error('❌ Duplicate email entry:', error.message);
			return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
		}
		console.error('🔥 POST /api/auth/register error:', error);
		console.error('🔥 Error stack:', error.stack);
		return NextResponse.json({ 
			error: 'Registration failed. Please try again.',
			details: process.env.NODE_ENV === 'development' ? error.message : undefined
		}, { status: 500 });
	}
}

// This function is no longer needed as we're using the new email service

