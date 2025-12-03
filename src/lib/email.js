import nodemailer from 'nodemailer';
import { query } from './database.js';
import crypto from 'crypto';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Get admin email from database
export async function getAdminEmail() {
  try {
    console.log('🔍 Fetching admin email from database...');
    const adminUsers = await query(
      'SELECT email FROM users WHERE role = ? AND status = ? LIMIT 1',
      ['admin', 'active']
    );
    
    console.log('Admin users found:', adminUsers?.length || 0);
    
    if (adminUsers.length > 0) {
      console.log('✅ Admin email found:', adminUsers[0].email);
      return adminUsers[0].email;
    }
    
    // Fallback to environment variable or default
    const fallbackEmail = process.env.ADMIN_EMAIL || 'smartestdevelopers@gmail.com';
    console.log('⚠️ Using fallback admin email:', fallbackEmail);
    return fallbackEmail;
  } catch (error) {
    console.error('Error getting admin email:', error);
    const fallbackEmail = process.env.ADMIN_EMAIL || 'smartestdevelopers@gmail.com';
    console.log('❌ Using fallback admin email due to error:', fallbackEmail);
    return fallbackEmail;
  }
}

// Send email to admin
export async function sendAdminEmail(subject, html, text) {
  try {
    const adminEmail = await getAdminEmail();
    console.log('📧 Sending email to admin:', adminEmail);
    
    return await sendEmail({
      to: adminEmail,
      subject,
      html,
      text
    });
  } catch (error) {
    console.error('Failed to send admin email:', error);
    return { success: false, error: error.message };
  }
}

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

export async function sendEmail({ to, subject, html, text, templateKey = null, payload = {} }) {
  await ensureEmailTables();
  const unsubscribed = await isUnsubscribed(to);
  if (unsubscribed) {
    return { success: false, error: 'Unsubscribed' };
  }
  const canSend = await checkRateLimit(to, templateKey, 100);
  if (!canSend) {
    return { success: false, error: 'Rate limited' };
  }
  let finalSubject = subject;
  let finalHtml = html;
  if (!finalHtml && templateKey) {
    const tpl = await getTemplateByKey(templateKey);
    if (tpl) {
      finalSubject = tpl.subject || subject;
      finalHtml = interpolateTemplate(tpl.html, payload);
    }
  }
  const footer = generateFooter(to);
  finalHtml = finalHtml ? finalHtml + footer : undefined;
  const logId = await logEmailAttempt({ to, subject, template_key: templateKey, html: finalHtml });
  let attempt = 0;
  let lastError = null;
  let info = null;
  while (attempt < 3) {
    try {
      info = await transporter.sendMail({
        from: `"KIRASTAY Platform" <${process.env.SMTP_USER}>`,
        to,
        subject: finalSubject,
        text,
        html: finalHtml
      });
      break;
    } catch (e) {
      lastError = e;
      attempt++;
      await new Promise(r => setTimeout(r, Math.min(2000 * attempt, 5000)));
    }
  }
  if (info) {
    await updateEmailLogStatus(logId, 'sent', info.messageId, null);
    await incrementRateLimit(to, templateKey);
    return { success: true, messageId: info.messageId };
  }
  await updateEmailLogStatus(logId, 'failed', null, lastError ? lastError.message : 'Unknown');
  return { success: false, error: lastError ? lastError.message : 'Unknown' };
}

export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.APP_URL}/auth/verify?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your KIRASTAY Account</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c5aa0; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #2c5aa0; color: white; padding: 12px 30px; 
                 text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to KIRASTAY!</h1>
        </div>
        <div class="content">
          <h2>Please verify your email address</h2>
          <p>Thank you for joining KIRASTAY, Morocco's premier multi-vendor vehicle rental platform.</p>
          <p>To complete your registration and start booking vehicles, please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>This link will expire in 24 hours for security reasons.</p>
          <p>If you didn't create an account with KIRASTAY, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2025 KIRASTAY Platform. All rights reserved.</p>
          <p>This email was sent to ${email}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Welcome to KIRASTAY!
    
    Please verify your email address by visiting: ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you didn't create an account with KIRASTAY, you can safely ignore this email.
  `;

  return sendEmail({
    to: email,
    subject: 'Verify Your KIRASTAY Account',
    html,
    text
  });
}

export async function sendReservationConfirmation(reservation, isFirstConfirmation = true) {
  const subject = isFirstConfirmation 
    ? 'Reservation Pending - KIRASTAY'
    : 'Reservation Confirmed - KIRASTAY';

  const statusText = isFirstConfirmation
    ? 'Your reservation has been submitted and is pending approval from the rental agency.'
    : 'Your reservation has been confirmed by the rental agency!';

  const cancelUrl = `${process.env.APP_URL}/reservations/cancel?number=${reservation.number}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c5aa0; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .reservation-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .button { display: inline-block; background: #d32f2f; color: white; padding: 12px 30px; 
                 text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>KIRASTAY Reservation ${isFirstConfirmation ? 'Submitted' : 'Confirmed'}</h1>
        </div>
        <div class="content">
          <p>${statusText}</p>
          
          <div class="reservation-details">
            <h3>Reservation Details</h3>
            <div class="detail-row">
              <strong>Reservation Number:</strong>
              <span>${reservation.number}</span>
            </div>
            <div class="detail-row">
              <strong>Vehicle:</strong>
              <span>${reservation.vehicle_brand} ${reservation.vehicle_model}</span>
            </div>
            <div class="detail-row">
              <strong>Agency:</strong>
              <span>${reservation.agency_name}</span>
            </div>
            <div class="detail-row">
              <strong>Pickup Location:</strong>
              <span>${reservation.pickup_location}</span>
            </div>
            <div class="detail-row">
              <strong>Start Date:</strong>
              <span>${new Date(reservation.start_date).toLocaleDateString()} at ${reservation.pickup_time}</span>
            </div>
            <div class="detail-row">
              <strong>End Date:</strong>
              <span>${new Date(reservation.end_date).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <strong>Total Price:</strong>
              <span>${reservation.total_price} MAD</span>
            </div>
          </div>

          ${isFirstConfirmation ? 
            '<p>You will receive another confirmation email once the agency approves your reservation.</p>' :
            '<p>Your payment has been processed and your booking is confirmed!</p>'
          }

          <p>You can cancel your reservation until ${reservation.cancellation_deadline || 2} days before the start date:</p>
          <a href="${cancelUrl}" class="button">Cancel Reservation</a>

          <p><strong>Contact Information:</strong></p>
          <p>Agency: ${reservation.agency_phone}<br/>
          KIRASTAY Support: +212 600 123 456</p>
        </div>
        <div class="footer">
          <p>© 2025 KIRASTAY Platform. All rights reserved.</p>
          <p>Reservation Number: ${reservation.number}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: reservation.client_email,
    subject,
    html,
    text: `KIRASTAY Reservation ${isFirstConfirmation ? 'Submitted' : 'Confirmed'}
    
Reservation Number: ${reservation.number}
Vehicle: ${reservation.vehicle_brand} ${reservation.vehicle_model}
Agency: ${reservation.agency_name}
Dates: ${reservation.start_date} to ${reservation.end_date}
Total: ${reservation.total_price} MAD

Cancel: ${cancelUrl}`
  });
}

export async function sendAgencyNotification(reservation) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
        <title>New Reservation - KIRASTAY</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c5aa0; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .reservation-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .button { display: inline-block; background: #4caf50; color: white; padding: 12px 30px; 
                 text-decoration: none; border-radius: 5px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Reservation Request</h1>
        </div>
        <div class="content">
          <p>You have received a new reservation request on KIRASTAY platform.</p>
          
          <div class="reservation-details">
            <h3>Reservation Details</h3>
            <div class="detail-row">
              <strong>Reservation Number:</strong>
              <span>${reservation.number}</span>
            </div>
            <div class="detail-row">
              <strong>Customer:</strong>
              <span>${reservation.client_first_name} ${reservation.client_last_name}</span>
            </div>
            <div class="detail-row">
              <strong>Contact:</strong>
              <span>${reservation.client_email} / ${reservation.client_phone}</span>
            </div>
            <div class="detail-row">
              <strong>Vehicle:</strong>
              <span>${reservation.vehicle_brand} ${reservation.vehicle_model}</span>
            </div>
            <div class="detail-row">
              <strong>Dates:</strong>
              <span>${reservation.start_date} to ${reservation.end_date}</span>
            </div>
            <div class="detail-row">
              <strong>Total:</strong>
              <span>${reservation.total_price} MAD</span>
            </div>
          </div>

          <p>Please review and confirm this reservation in your agency dashboard:</p>
          <a href="${process.env.APP_URL}/agency/reservations/${reservation.id}" class="button">Review Reservation</a>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: reservation.agency_email,
    subject: 'New Reservation Request - KIRASTAY',
    html
  });
}

async function ensureEmailTables() {
  await query(`CREATE TABLE IF NOT EXISTS email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_key VARCHAR(100) NULL,
    status ENUM('queued','sent','failed') DEFAULT 'queued',
    provider_message_id VARCHAR(255) NULL,
    error_text TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP NULL,
    retry_count INT DEFAULT 0,
    metadata JSON NULL
  )`);
  await query(`CREATE TABLE IF NOT EXISTS email_queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html MEDIUMTEXT,
    text TEXT,
    template_key VARCHAR(100),
    payload JSON,
    status ENUM('queued','processing','sent','failed') DEFAULT 'queued',
    attempts INT DEFAULT 0,
    scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_error TEXT
  )`);
  await query(`CREATE TABLE IF NOT EXISTS email_unsubscribes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await query(`CREATE TABLE IF NOT EXISTS email_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_key VARCHAR(100) NOT NULL UNIQUE,
    subject VARCHAR(255) NOT NULL,
    html MEDIUMTEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);
  await query(`CREATE TABLE IF NOT EXISTS email_rate_limits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    template_key VARCHAR(100) NOT NULL,
    window_start TIMESTAMP NOT NULL,
    count INT DEFAULT 0,
    UNIQUE KEY unique_limit (email, template_key, window_start)
  )`);
}

async function getTemplateByKey(templateKey) {
  const rows = await query('SELECT subject, html FROM email_templates WHERE template_key = ? LIMIT 1', [templateKey]);
  return rows.length > 0 ? rows[0] : null;
}

function interpolateTemplate(html, payload) {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    const v = payload[key];
    return v === undefined || v === null ? '' : String(v);
  });
}

async function isUnsubscribed(email) {
  const rows = await query('SELECT id FROM email_unsubscribes WHERE email = ? LIMIT 1', [email]);
  return rows.length > 0;
}

function currentWindowStart() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  return new Date(d);
}

async function checkRateLimit(email, templateKey, maxPerHour) {
  const ws = currentWindowStart();
  const rows = await query('SELECT count FROM email_rate_limits WHERE email = ? AND template_key = ? AND window_start = ?', [email, templateKey || '', ws]);
  const count = rows.length > 0 ? rows[0].count : 0;
  return count < maxPerHour;
}

async function incrementRateLimit(email, templateKey) {
  const ws = currentWindowStart();
  const existing = await query('SELECT id, count FROM email_rate_limits WHERE email = ? AND template_key = ? AND window_start = ?', [email, templateKey || '', ws]);
  if (existing.length > 0) {
    await query('UPDATE email_rate_limits SET count = count + 1 WHERE id = ?', [existing[0].id]);
  } else {
    await query('INSERT INTO email_rate_limits (email, template_key, window_start, count) VALUES (?, ?, ?, ?)', [email, templateKey || '', ws, 1]);
  }
}

function generateFooter(to) {
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(to)}`;
  const contact = process.env.ADMIN_EMAIL || 'smartestdevelopers@gmail.com';
  return `
    <div style="margin-top:20px;padding-top:10px;border-top:1px solid #eee;color:#666;font-size:12px;text-align:center;">
      <p>Contact: ${contact}</p>
      <p><a href="${unsubscribeUrl}">Unsubscribe</a></p>
    </div>
  `;
}

async function logEmailAttempt({ to, subject, template_key, html }) {
  const metadata = JSON.stringify({ hash: crypto.createHash('md5').update((html || '')).digest('hex') });
  const result = await query('INSERT INTO email_logs (to_email, subject, template_key, status, metadata) VALUES (?, ?, ?, ?, ?)', [to, subject, template_key || null, 'queued', metadata]);
  return result.insertId;
}

async function updateEmailLogStatus(id, status, provider_message_id, error_text) {
  await query('UPDATE email_logs SET status = ?, provider_message_id = ?, error_text = ?, sent_at = CASE WHEN ? = "sent" THEN NOW() ELSE sent_at END WHERE id = ?', [status, provider_message_id || null, error_text || null, status, id]);
}

export async function enqueueEmail({ to, subject, html, text, templateKey, payload }) {
  await ensureEmailTables();
  const result = await query('INSERT INTO email_queue (to_email, subject, html, text, template_key, payload, status, attempts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [to, subject, html || null, text || null, templateKey || null, payload ? JSON.stringify(payload) : null, 'queued', 0]);
  return { success: true, id: result.insertId };
}

export async function processEmailQueue(limit = 20) {
  await ensureEmailTables();
  const items = await query('SELECT * FROM email_queue WHERE status = "queued" ORDER BY scheduled_at ASC LIMIT ?', [limit]);
  let processed = 0;
  for (const item of items) {
    await query('UPDATE email_queue SET status = "processing" WHERE id = ?', [item.id]);
    const res = await sendEmail({ to: item.to_email, subject: item.subject, html: item.html, text: item.text });
    if (res.success) {
      await query('UPDATE email_queue SET status = "sent", attempts = attempts + 1 WHERE id = ?', [item.id]);
      processed++;
    } else {
      await query('UPDATE email_queue SET status = "queued", attempts = attempts + 1, last_error = ? WHERE id = ?', [res.error || 'Unknown', item.id]);
    }
  }
  return processed;
}
