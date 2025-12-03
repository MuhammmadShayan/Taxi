import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database.js';
import bcrypt from 'bcryptjs';
import tokenStorage from '../../../../lib/reset-tokens.js';

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    // Validate inputs
    if (!token) {
      return NextResponse.json({
        error: 'Reset token is required'
      }, { status: 400 });
    }

    if (!newPassword) {
      return NextResponse.json({
        error: 'New password is required'
      }, { status: 400 });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json({
        error: 'Password must be at least 6 characters long'
      }, { status: 400 });
    }

    
    console.log('New password length:', newPassword ? newPassword.length : 'undefined');

    // First validate the token without consuming it
    const tokenData = tokenStorage.getToken(token);
    
    
    if (!tokenData) {
      return NextResponse.json({
        error: 'Invalid or expired reset token'
      }, { status: 400 });
    }

    const { email } = tokenData;
    

    try {
      // Check if user exists
      const users = await query('SELECT user_id, email FROM users WHERE email = ? LIMIT 1', [email]);
      
      if (!users || users.length === 0) {
        return NextResponse.json({
          error: 'Invalid reset token or user not found'
        }, { status: 400 });
      }

      const user = users[0];
      
      // Hash the new password
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update user's password
      const updateResult = await query(
        'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE user_id = ?',
        [hashedPassword, user.user_id]
      );

      if (updateResult.affectedRows === 0) {
        return NextResponse.json({
          error: 'Failed to update password'
        }, { status: 500 });
      }

      console.log(`Password successfully reset for user: ${user.email}`);

      // Now consume the token since password update was successful
      tokenStorage.useToken(token);
      

      return NextResponse.json({
        success: true,
        message: 'Password has been reset successfully. You can now login with your new password.'
      });

    } catch (dbError) {
      console.error('Database error during password reset:', dbError);
      return NextResponse.json({
        error: 'Database error. Please try again later.'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({
      error: 'Internal server error. Please try again later.'
    }, { status: 500 });
  }
}

export async function GET(request) {
  // Handle token validation endpoint to check if token is valid
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({
        error: 'Token is required'
      }, { status: 400 });
    }

    // Check if token exists in our storage and is not expired
    const tokenData = tokenStorage.getToken(token);
    
    
    if (!tokenData) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid or expired token'
      }, { status: 400 });
    }
    
    // Token is valid, return success with associated email (masked for security)
    const emailParts = tokenData.email.split('@');
    const maskedEmail = `${emailParts[0].substring(0, 3)}***@${emailParts[1]}`;
    
    return NextResponse.json({
      valid: true,
      email: maskedEmail,
      message: 'Token is valid'
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}
