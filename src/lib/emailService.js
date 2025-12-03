import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function sendBookingConfirmationEmail(customerEmail, bookingDetails) {
  try {
    const transporter = createTransporter();

    const {
      bookingReference,
      customerName,
      vehicleInfo,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      pickupLocation,
      dropoffLocation,
      totalPrice,
      specialRequests
    } = bookingDetails;

    // Email HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation - ${process.env.APP_NAME}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .booking-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; display: inline-block; width: 150px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .total { font-size: 18px; font-weight: bold; color: #007bff; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${process.env.APP_NAME} - Booking Confirmation</h1>
          </div>
          
          <div class="content">
            <p>Dear ${customerName},</p>
            <p>Thank you for choosing ${process.env.APP_NAME}! Your vehicle rental booking has been confirmed.</p>
            
            <div class="booking-details">
              <h3>Booking Details</h3>
              <div class="detail-row">
                <span class="label">Booking Reference:</span>
                <strong>${bookingReference}</strong>
              </div>
              <div class="detail-row">
                <span class="label">Vehicle:</span>
                ${vehicleInfo}
              </div>
              <div class="detail-row">
                <span class="label">Pickup Date:</span>
                ${pickupDate} at ${pickupTime}
              </div>
              <div class="detail-row">
                <span class="label">Dropoff Date:</span>
                ${dropoffDate} at ${dropoffTime}
              </div>
              <div class="detail-row">
                <span class="label">Pickup Location:</span>
                ${pickupLocation}
              </div>
              <div class="detail-row">
                <span class="label">Dropoff Location:</span>
                ${dropoffLocation}
              </div>
              ${specialRequests ? `
              <div class="detail-row">
                <span class="label">Special Requests:</span>
                ${specialRequests}
              </div>
              ` : ''}
              <div class="detail-row total">
                <span class="label">Total Price:</span>
                $${totalPrice}
              </div>
            </div>
            
            <p><strong>Important Information:</strong></p>
            <ul>
              <li>Please bring a valid driver's license and credit card for pickup</li>
              <li>Arrive 15 minutes before your scheduled pickup time</li>
              <li>Keep this booking reference for your records</li>
              <li>Contact us if you need to modify or cancel your booking</li>
            </ul>
            
            <p>We look forward to serving you!</p>
            <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply directly to this email.</p>
            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email text content (fallback)
    const textContent = `
      ${process.env.APP_NAME} - Booking Confirmation
      
      Dear ${customerName},
      
      Thank you for choosing ${process.env.APP_NAME}! Your vehicle rental booking has been confirmed.
      
      Booking Details:
      - Booking Reference: ${bookingReference}
      - Vehicle: ${vehicleInfo}
      - Pickup: ${pickupDate} at ${pickupTime}
      - Dropoff: ${dropoffDate} at ${dropoffTime}
      - Pickup Location: ${pickupLocation}
      - Dropoff Location: ${dropoffLocation}
      ${specialRequests ? `- Special Requests: ${specialRequests}` : ''}
      - Total Price: $${totalPrice}
      
      Important Information:
      - Please bring a valid driver's license and credit card for pickup
      - Arrive 15 minutes before your scheduled pickup time
      - Keep this booking reference for your records
      - Contact us if you need to modify or cancel your booking
      
      We look forward to serving you!
      
      Best regards,
      The ${process.env.APP_NAME} Team
      
      © ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.
    `;

    // Email options
    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Booking Confirmation - ${bookingReference}`,
      text: textContent,
      html: htmlContent,
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Failed to send booking confirmation email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendStatusUpdateEmail(customerEmail, bookingReference, newStatus) {
  try {
    const transporter = createTransporter();

    const statusMessages = {
      confirmed: 'Your booking has been confirmed!',
      canceled: 'Your booking has been cancelled.',
      completed: 'Your rental has been completed. Thank you for choosing us!',
      pending: 'Your booking is being processed.',
    };

    const message = statusMessages[newStatus] || `Your booking status has been updated to: ${newStatus}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Update - ${process.env.APP_NAME}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${process.env.APP_NAME} - Booking Update</h1>
          </div>
          
          <div class="content">
            <p>Dear Valued Customer,</p>
            <p>${message}</p>
            <p><strong>Booking Reference:</strong> ${bookingReference}</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Booking Update - ${bookingReference}`,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Booking status update email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Failed to send booking status update email:', error);
    return { success: false, error: error.message };
  }
}
