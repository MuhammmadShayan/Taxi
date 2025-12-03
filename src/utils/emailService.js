const nodemailer = require('nodemailer');

// Email configuration
const EMAIL_CONFIG = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_EMAIL, // Your Gmail email
    pass: process.env.GMAIL_APP_PASSWORD // Your Gmail app password
  }
};

// Admin email for notifications
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@kirastay.com';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter(EMAIL_CONFIG);
};

// Send email function
const sendEmail = async (to, subject, htmlContent, attachments = []) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'KIRASTAY',
        address: process.env.GMAIL_EMAIL
      },
      to: to,
      subject: subject,
      html: htmlContent,
      attachments: attachments
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send email to admin
const sendAdminNotification = async (subject, htmlContent, attachments = []) => {
  return await sendEmail(ADMIN_EMAIL, subject, htmlContent, attachments);
};

// Send email to multiple recipients
const sendBulkEmail = async (recipients, subject, htmlContent, attachments = []) => {
  const results = [];
  
  for (const recipient of recipients) {
    const result = await sendEmail(recipient, subject, htmlContent, attachments);
    results.push({ recipient, ...result });
  }
  
  return results;
};

module.exports = {
  sendEmail,
  sendAdminNotification,
  sendBulkEmail,
  ADMIN_EMAIL
};
