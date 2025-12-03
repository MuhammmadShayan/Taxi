import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database.js';
import { sendEmail } from '../../../../lib/email.js';
import tokenStorage from '../../../../lib/reset-tokens.js';

export async function POST(request) {
  try {
    const { email, returnUrl } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json({
        error: 'Email address is required'
      }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: 'Please enter a valid email address'
      }, { status: 400 });
    }

    // Check if user exists in database
    let userExists = false;
    let userData = null;
    try {
      // Try to find user with this email - using a simple query that should work
      const users = await query(`SELECT user_id, first_name, last_name, email FROM users WHERE email = ? LIMIT 1`, [email]);
      userExists = users && users.length > 0;
      if (userExists) {
        userData = users[0];
      }
      
      console.log('User lookup result:', { email, userExists, userCount: users?.length || 0 });
    } catch (dbError) {
      console.error('Database error checking user:', dbError);
      // Even if database check fails, we'll proceed to avoid revealing if email exists
    }

    // Only proceed if user exists (but don't reveal this in response for security)
    if (!userExists) {
      // Still return success to prevent email enumeration, but don't actually send email
      console.log(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email address, you will receive password reset instructions shortly.'
      });
    }

    // Generate a reset token and store it
    const resetToken = generateResetToken();
    
    // Store the token with email association (expires in 1 hour)
    tokenStorage.storeToken(resetToken, email, 60);
    
    // Debug: Check environment variables
    console.log('SMTP Configuration Check:');
    console.log('SMTP_USER:', process.env.SMTP_USER ? 'Set' : 'Not set');
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Set' : 'Not set');
    console.log('SMTP_HOST:', process.env.SMTP_HOST || 'Not set');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || 'Not set');
    
    try {
      console.log(`Password reset requested for email: ${email}`);
      
      // Send password reset email using existing email service
      console.log('📧 Sending password reset email...');
      
      const resetLink = `${process.env.APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
      
      const resetEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset Request - KIRASTAY</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2c5aa0; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .warning-box { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 25px 0; }
            .reset-button { display: inline-block; background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .link-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${userData ? userData.first_name + ' ' + userData.last_name : 'User'}</strong>,</p>
              
              <p>We received a request to reset your password for your KIRASTAY account.</p>
              
              <div class="warning-box">
                <h3>Important:</h3>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${resetLink}" class="reset-button">Reset Your Password</a>
              </div>
              
              <p>Or copy and paste this link in your browser:</p>
              <div class="link-box">
                <code>${resetLink}</code>
              </div>
              
              <p>If you continue to have problems, please contact our support team.</p>
              <p>Best regards,<br>The KIRASTAY Team</p>
            </div>
            <div class="footer">
              <p>© 2025 KIRASTAY Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      const resetEmailText = `
        KIRASTAY Password Reset Request
        
        Hi ${userData ? userData.first_name : 'there'}!
        
        We received a request to reset your password for your KIRASTAY account.
        
        To reset your password, visit this link:
        ${resetLink}
        
        This link will expire in 1 hour for your security.
        
        If you didn't request this password reset, please ignore this email.
        
        Best regards,
        KIRASTAY Team
      `;
      
      const emailResult = await sendEmail({
        to: email,
        subject: 'Password Reset Request - KIRASTAY',
        html: resetEmailHtml,
        text: resetEmailText
      });
      
      console.log('Password reset email result:', emailResult.success ? '✅ Sent' : '❌ Failed');
      
      if (!emailResult.success) {
        console.error('Failed to send reset email:', emailResult.error);
        return NextResponse.json({
          error: 'Failed to send reset email. Please check server configuration.'
        }, { status: 500 });
      }
      
      // Send admin notification about password reset request
      console.log('📧 Sending password reset notification to admin...');
      try {
        const { sendAdminEmail } = await import('../../../../lib/email.js');
        
        const adminNotificationHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Password Reset Request - KIRASTAY Admin</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
              .content { padding: 30px 20px; background: #f9f9f9; }
              .user-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
              .detail-label { font-weight: bold; color: #555; }
              .detail-value { color: #333; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
              .security-note { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
                <p>Admin Notification</p>
              </div>
              <div class="content">
                <p>Dear Admin,</p>
                
                <p>A password reset request has been made on the KIRASTAY platform.</p>
                
                <div class="user-info">
                  <h3>User Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${userData ? userData.first_name + ' ' + userData.last_name : 'Unknown'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${email}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Request Time:</span>
                    <span class="detail-value">${new Date().toLocaleString()}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Token Expiry:</span>
                    <span class="detail-value">1 hour from request</span>
                  </div>
                </div>
                
                <div class="security-note">
                  <h4>Security Information:</h4>
                  <ul>
                    <li>Password reset email has been sent to the user</li>
                    <li>Reset token will expire in 1 hour</li>
                    <li>Monitor for any suspicious activity</li>
                  </ul>
                </div>
                
                <p>This is an automated notification for security monitoring purposes.</p>
                
                <p>Best regards,<br>KIRASTAY Platform System</p>
              </div>
              <div class="footer">
                <p>© 2025 KIRASTAY Platform. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;
        
        const adminNotificationText = `
          KIRASTAY Admin Notification - Password Reset Request
          
          A password reset request has been made:
          
          User: ${userData ? userData.first_name + ' ' + userData.last_name : 'Unknown'}
          Email: ${email}
          Request Time: ${new Date().toLocaleString()}
          Token Expiry: 1 hour from request
          
          The user has been sent a password reset email.
          Please monitor for any suspicious activity.
          
          KIRASTAY Platform System
        `;
        
        const adminEmailResult = await sendAdminEmail(
          'Password Reset Request - KIRASTAY Admin',
          adminNotificationHtml,
          adminNotificationText
        );
        
        console.log('Admin notification result:', adminEmailResult.success ? '✅ Sent' : '❌ Failed');
        
      } catch (adminEmailError) {
        console.error('📧 Failed to send admin notification (but reset email sent):', adminEmailError);
        // Don't fail the password reset if admin email fails
      }
      
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return NextResponse.json({
        error: 'Failed to send reset email. Please check server configuration.'
      }, { status: 500 });
    }

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email address, you will receive password reset instructions shortly.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({
      error: 'Internal server error. Please try again later.'
    }, { status: 500 });
  }
}

// Helper function to generate reset token
function generateResetToken() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}
