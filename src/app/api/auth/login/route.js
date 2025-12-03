import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { signSessionEdge } from '../../../../lib/jwt-edge';
import { sendEmail, sendAdminEmail } from '../../../../lib/email.js';

export async function POST(request) {
	try {
		console.log('🔐 Login attempt started');
		const { email, password } = await request.json();
		console.log('📧 Login email:', email);
		
		if (!email || !password) {
			console.error('❌ Missing email or password');
			return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
		}
		console.log('📦 Querying database for user...');
		let rows;
		try {
			rows = await query(`SELECT user_id, email, password_hash, first_name, last_name, role FROM users WHERE email = ? LIMIT 1`, [email]);
			console.log('✅ Database query successful, found', rows?.length || 0, 'users');
		} catch (dbError) {
			console.error('🔥 Database query error:', dbError);
			console.error('🔥 Database config:', {
				host: process.env.DB_HOST || '127.0.0.1',
				database: process.env.DB_NAME || 'my_travel_app',
				port: process.env.DB_PORT || 3306
			});
			return NextResponse.json({ 
				error: 'Database connection failed. Please ensure MySQL is running.',
				details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
			}, { status: 500 });
		}
		
    if (!rows || rows.length === 0) {
      console.log('❌ User not found with email:', email);
      await recordLoginAttempt(email, request, false);
      await maybeNotifyLockout(email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
		const dbUser = rows[0];
		console.log('🔑 Comparing passwords...');
		const ok = await bcrypt.compare(password, dbUser.password_hash);
    if (!ok) {
      console.log('❌ Password mismatch');
      await recordLoginAttempt(email, request, false);
      await maybeNotifyLockout(email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
		console.log('✅ Password verified successfully');
	
	// Create user object with user_type field for session signing
	const user = {
		id: dbUser.user_id,
		user_id: dbUser.user_id,
		email: dbUser.email,
		first_name: dbUser.first_name,
		last_name: dbUser.last_name,
		user_type: dbUser.role, // Map role to user_type
		role: dbUser.role // Keep role for backward compatibility
	};
	
		console.log('🔐 Generating session token...');
		const token = await signSessionEdge(user);
		console.log('✅ Token generated successfully');
		
    const response = NextResponse.json({
      user: {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        user_type: user.user_type,
        role: user.role,
      },
    });
		console.log('🎉 Login successful for:', user.email);
    response.cookies.set('session', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    await recordLoginAttempt(email, request, true);
    if (process.env.EMAIL_NOTIFY_LOGIN_SUCCESS === 'true') {
      await sendEmail({ to: email, subject: 'New Login to Your Account', html: `<div style="font-family:Arial,sans-serif"><h2>Login Notification</h2><p>We noticed a login to your account on ${new Date().toLocaleString()}.</p><p>If this wasn’t you, please reset your password immediately.</p></div>`, text: `Login to your account on ${new Date().toLocaleString()}. If this wasn’t you, reset your password.`, templateKey: 'login_success' });
    }
    return response;
  } catch (error) {
		console.error('🔥 POST /api/auth/login error:', error);
		console.error('🔥 Error stack:', error.stack);
		return NextResponse.json({ 
			error: 'Login failed',
			details: process.env.NODE_ENV === 'development' ? error.message : undefined
		}, { status: 500 });
  }
}

async function ensureLoginAttemptsTable() {
  await query(`CREATE TABLE IF NOT EXISTS login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip VARCHAR(64) NOT NULL,
    success TINYINT(1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email_created_at (email, created_at)
  )`);
}

async function recordLoginAttempt(email, request, success) {
  try {
    await ensureLoginAttemptsTable();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    await query('INSERT INTO login_attempts (email, ip, success) VALUES (?, ?, ?)', [email, ip, success ? 1 : 0]);
  } catch {}
}

async function maybeNotifyLockout(email) {
  try {
    await ensureLoginAttemptsTable();
    const rows = await query('SELECT COUNT(*) as failures FROM login_attempts WHERE email = ? AND success = 0 AND created_at >= DATE_SUB(NOW(), INTERVAL 15 MINUTE)', [email]);
    const failures = rows?.[0]?.failures || 0;
    if (failures >= 5) {
      await sendAdminEmail('Account Lockout Warning', `<div style="font-family:Arial,sans-serif"><h2>Excessive Failed Logins</h2><p>Email: ${email}</p><p>Failed attempts in last 15 minutes: ${failures}</p></div>`, `Excessive failed logins for ${email}. Count: ${failures}`);
      const userRows = await query('SELECT email FROM users WHERE email = ? LIMIT 1', [email]);
      if (userRows.length > 0) {
        await sendEmail({ to: email, subject: 'Security Alert: Too Many Failed Logins', html: `<div style="font-family:Arial,sans-serif"><h2>Security Alert</h2><p>We detected multiple failed login attempts to your account.</p><p>If this wasn’t you, please reset your password.</p></div>`, text: 'Multiple failed login attempts detected. If this wasn’t you, reset your password.', templateKey: 'lockout_warning' });
      }
    }
  } catch {}
}


