import { getConnection } from './db';

// Email notification service
export class NotificationService {
  
  // Queue a notification to be sent
  static async queueNotification(type, recipientEmail, subject, message, bookingId = null, recipientPhone = null) {
    try {
      const connection = await getConnection();
      
      const query = `
        INSERT INTO notifications (
          booking_id, recipient_email, recipient_phone, type, subject, message, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        bookingId,
        recipientEmail,
        recipientPhone,
        type,
        subject,
        message,
        new Date()
      ];
      
      await connection.execute(query, values);
      await connection.end();
      
      // In a real application, you would trigger the actual sending here
      // For now, we'll just log the notification
      console.log(`Notification queued: ${type} to ${recipientEmail} - ${subject}`);
      
      return true;
    } catch (error) {
      console.error('Error queueing notification:', error);
      return false;
    }
  }

  // Send booking confirmation email
  static async sendBookingConfirmationEmail(booking) {
    const subject = `Booking Confirmation - ${booking.booking_reference}`;
    const message = `
      Dear ${booking.customer_first_name} ${booking.customer_last_name},

      Your car rental booking has been confirmed!

      Booking Details:
      - Reference: ${booking.booking_reference}
      - Car: ${booking.make} ${booking.model}
      - Pick-up: ${booking.pickup_date} at ${booking.pickup_time}
      - Location: ${booking.pickup_location}
      - Total Amount: $${booking.total_amount}

      Please arrive 15 minutes before your scheduled pick-up time.
      
      Thank you for choosing our service!
      
      Best regards,
      Kirastay Car Rental Team
    `;

    return await this.queueNotification(
      'email',
      booking.customer_email,
      subject,
      message,
      booking.id
    );
  }

  // Send status update email
  static async sendStatusUpdateEmail(booking, oldStatus, newStatus) {
    const statusMessages = {
      confirmed: 'Your booking has been confirmed! We are preparing your vehicle.',
      assigned: `A driver has been assigned to your booking. Driver: ${booking.driver_name}, Phone: ${booking.driver_phone}`,
      in_progress: 'Your rental period has started. Enjoy your trip!',
      completed: 'Your rental has been completed. Thank you for choosing our service!',
      cancelled: 'Your booking has been cancelled as requested.'
    };

    const subject = `Booking Update - ${booking.booking_reference}`;
    const message = `
      Dear ${booking.customer_first_name} ${booking.customer_last_name},

      Your booking status has been updated:

      Booking Reference: ${booking.booking_reference}
      Previous Status: ${oldStatus.replace('_', ' ').toUpperCase()}
      New Status: ${newStatus.replace('_', ' ').toUpperCase()}

      ${statusMessages[newStatus] || ''}

      ${booking.make} ${booking.model}
      Pick-up: ${booking.pickup_date} at ${booking.pickup_time}
      Location: ${booking.pickup_location}

      If you have any questions, please contact us.
      
      Best regards,
      Kirastay Car Rental Team
    `;

    return await this.queueNotification(
      'email',
      booking.customer_email,
      subject,
      message,
      booking.id
    );
  }

  // Send payment confirmation email
  static async sendPaymentConfirmationEmail(booking) {
    const subject = `Payment Confirmation - ${booking.booking_reference}`;
    const message = `
      Dear ${booking.customer_first_name} ${booking.customer_last_name},

      Your payment has been successfully processed!

      Payment Details:
      - Booking Reference: ${booking.booking_reference}
      - Amount Paid: $${booking.total_amount}
      - Payment Method: ${booking.payment_method.replace('_', ' ')}
      - Transaction Date: ${new Date().toLocaleDateString()}

      Your car rental is now confirmed and ready for pick-up.

      Best regards,
      Kirastay Car Rental Team
    `;

    return await this.queueNotification(
      'email',
      booking.customer_email,
      subject,
      message,
      booking.id
    );
  }

  // Send driver assignment notification
  static async sendDriverAssignmentEmail(driverEmail, booking) {
    const subject = `New Booking Assignment - ${booking.booking_reference}`;
    const message = `
      Hello,

      You have been assigned to a new booking:

      Booking Reference: ${booking.booking_reference}
      Customer: ${booking.customer_first_name} ${booking.customer_last_name}
      Customer Phone: ${booking.customer_phone}
      Car: ${booking.make} ${booking.model}
      Pick-up Date: ${booking.pickup_date} at ${booking.pickup_time}
      Pick-up Location: ${booking.pickup_location}
      Drop-off Date: ${booking.dropoff_date} at ${booking.dropoff_time}
      Duration: ${booking.rental_days} days

      Please contact the customer to coordinate the pick-up details.

      Best regards,
      Kirastay Car Rental Team
    `;

    return await this.queueNotification(
      'email',
      driverEmail,
      subject,
      message,
      booking.id
    );
  }

  // Send reminder email (1 day before pickup)
  static async sendPickupReminderEmail(booking) {
    const subject = `Pickup Reminder - ${booking.booking_reference}`;
    const message = `
      Dear ${booking.customer_first_name} ${booking.customer_last_name},

      This is a friendly reminder that your car rental pick-up is tomorrow!

      Booking Details:
      - Reference: ${booking.booking_reference}
      - Car: ${booking.make} ${booking.model}
      - Pick-up Date: ${booking.pickup_date} at ${booking.pickup_time}
      - Pick-up Location: ${booking.pickup_location}

      ${booking.driver_assigned ? `Your driver ${booking.driver_name} will contact you. Driver phone: ${booking.driver_phone}` : 'We will assign a driver and notify you soon.'}

      Please remember to bring:
      - Valid driver's license
      - Credit card for security deposit
      - Any additional documentation

      Looking forward to serving you!
      
      Best regards,
      Kirastay Car Rental Team
    `;

    return await this.queueNotification(
      'email',
      booking.customer_email,
      subject,
      message,
      booking.id
    );
  }

  // Process pending notifications (this would be called by a cron job)
  static async processPendingNotifications() {
    try {
      const connection = await getConnection();
      
      const [pendingNotifications] = await connection.execute(
        'SELECT * FROM notifications WHERE status = ? ORDER BY created_at ASC LIMIT 50',
        ['pending']
      );

      for (const notification of pendingNotifications) {
        try {
          // In a real application, you would integrate with your email service here
          // For example: SendGrid, AWS SES, Mailgun, etc.
          
          const emailSent = await this.sendActualEmail(notification);
          
          if (emailSent) {
            await connection.execute(
              'UPDATE notifications SET status = ?, sent_at = ? WHERE id = ?',
              ['sent', new Date(), notification.id]
            );
          } else {
            await connection.execute(
              'UPDATE notifications SET status = ? WHERE id = ?',
              ['failed', notification.id]
            );
          }
        } catch (error) {
          console.error(`Error processing notification ${notification.id}:`, error);
          await connection.execute(
            'UPDATE notifications SET status = ? WHERE id = ?',
            ['failed', notification.id]
          );
        }
      }
      
      await connection.end();
      return pendingNotifications.length;
    } catch (error) {
      console.error('Error processing pending notifications:', error);
      return 0;
    }
  }

  // Mock email sending function - replace with real email service
  static async sendActualEmail(notification) {
    try {
      // This is a placeholder for actual email sending
      // You would integrate with your chosen email service here
      
      console.log('Sending email:', {
        to: notification.recipient_email,
        subject: notification.subject,
        body: notification.message
      });
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Return true to simulate successful sending
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Get pickup reminders for tomorrow
  static async getPickupReminders() {
    try {
      const connection = await getConnection();
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];
      
      const query = `
        SELECT b.*, c.make, c.model, c.category
        FROM bookings b
        LEFT JOIN cars c ON b.car_id = c.id
        WHERE b.pickup_date = ? 
        AND b.booking_status IN ('confirmed', 'assigned')
        AND b.id NOT IN (
          SELECT DISTINCT booking_id 
          FROM notifications 
          WHERE type = 'email' 
          AND subject LIKE '%Pickup Reminder%' 
          AND status = 'sent'
          AND booking_id IS NOT NULL
        )
      `;
      
      const [rows] = await connection.execute(query, [tomorrowDate]);
      await connection.end();
      
      return rows;
    } catch (error) {
      console.error('Error fetching pickup reminders:', error);
      return [];
    }
  }

  // Send all pickup reminders
  static async sendPickupReminders() {
    try {
      const bookingsForReminder = await this.getPickupReminders();
      
      for (const booking of bookingsForReminder) {
        await this.sendPickupReminderEmail(booking);
      }
      
      return bookingsForReminder.length;
    } catch (error) {
      console.error('Error sending pickup reminders:', error);
      return 0;
    }
  }
}

// Booking status workflow helper
export class BookingStatusManager {
  
  static async updateBookingStatus(bookingId, newStatus, changedBy = 'system', changeReason = '') {
    try {
      const connection = await getConnection();
      
      // Get current booking details
      const [bookingRows] = await connection.execute(
        `SELECT b.*, c.make, c.model, c.category 
         FROM bookings b 
         LEFT JOIN cars c ON b.car_id = c.id 
         WHERE b.id = ?`,
        [bookingId]
      );
      
      if (bookingRows.length === 0) {
        await connection.end();
        throw new Error('Booking not found');
      }
      
      const booking = bookingRows[0];
      const oldStatus = booking.booking_status;
      
      // Validate status transition
      if (!this.isValidStatusTransition(oldStatus, newStatus)) {
        await connection.end();
        throw new Error(`Invalid status transition from ${oldStatus} to ${newStatus}`);
      }
      
      // Update booking status
      await connection.execute(
        'UPDATE bookings SET booking_status = ?, updated_at = ? WHERE id = ?',
        [newStatus, new Date(), bookingId]
      );
      
      // Record status change history
      await connection.execute(
        `INSERT INTO booking_status_history 
         (booking_id, old_status, new_status, changed_by, change_reason, changed_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [bookingId, oldStatus, newStatus, changedBy, changeReason, new Date()]
      );
      
      await connection.end();
      
      // Send status update notification
      const updatedBooking = { ...booking, booking_status: newStatus };
      await NotificationService.sendStatusUpdateEmail(updatedBooking, oldStatus, newStatus);
      
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }
  
  static isValidStatusTransition(fromStatus, toStatus) {
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['assigned', 'in_progress', 'cancelled'],
      assigned: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
      completed: [], // Final state
      cancelled: [] // Final state
    };
    
    return validTransitions[fromStatus]?.includes(toStatus) || false;
  }
  
  static getAvailableActions(status) {
    const actions = {
      pending: [
        { action: 'confirm', label: 'Confirm Booking', status: 'confirmed' },
        { action: 'cancel', label: 'Cancel Booking', status: 'cancelled' }
      ],
      confirmed: [
        { action: 'assign', label: 'Assign Driver', status: 'assigned' },
        { action: 'start', label: 'Start Trip', status: 'in_progress' },
        { action: 'cancel', label: 'Cancel Booking', status: 'cancelled' }
      ],
      assigned: [
        { action: 'start', label: 'Start Trip', status: 'in_progress' },
        { action: 'cancel', label: 'Cancel Booking', status: 'cancelled' }
      ],
      in_progress: [
        { action: 'complete', label: 'Complete Trip', status: 'completed' },
        { action: 'cancel', label: 'Cancel Booking', status: 'cancelled' }
      ],
      completed: [],
      cancelled: []
    };
    
    return actions[status] || [];
  }
}

// Utility functions for booking management
export const BookingUtils = {
  
  // Calculate cancellation fee
  calculateCancellationFee(booking) {
    const pickupDate = new Date(booking.pickup_date);
    const today = new Date();
    const daysUntilPickup = Math.ceil((pickupDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilPickup >= 7) {
      return 0; // Free cancellation
    } else if (daysUntilPickup >= 3) {
      return booking.total_amount * 0.25; // 25% fee
    } else if (daysUntilPickup >= 1) {
      return booking.total_amount * 0.50; // 50% fee
    } else {
      return booking.total_amount; // Full charge
    }
  },
  
  // Check if booking can be modified
  canModifyBooking(booking) {
    const pickupDate = new Date(booking.pickup_date);
    const today = new Date();
    const hoursUntilPickup = Math.ceil((pickupDate - today) / (1000 * 60 * 60));
    
    return ['pending', 'confirmed'].includes(booking.booking_status) && hoursUntilPickup >= 24;
  },
  
  // Format booking status for display
  formatStatus(status) {
    const statusLabels = {
      pending: 'Pending Confirmation',
      confirmed: 'Confirmed',
      assigned: 'Driver Assigned',
      in_progress: 'Trip in Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    
    return statusLabels[status] || status;
  },
  
  // Get status color class
  getStatusColorClass(status) {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      assigned: 'primary',
      in_progress: 'success',
      completed: 'success',
      cancelled: 'danger'
    };
    
    return colors[status] || 'secondary';
  }
};

// Email templates
export const EmailTemplates = {
  
  bookingConfirmation: (booking) => ({
    subject: `Booking Confirmation - ${booking.booking_reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #007bff; color: white; padding: 20px; text-align: center;">
          <h1>Booking Confirmed!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${booking.customer_first_name} ${booking.customer_last_name},</p>
          
          <p>Your car rental booking has been successfully confirmed. Here are your booking details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Booking Reference</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${booking.booking_reference}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Car</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${booking.make} ${booking.model}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Pick-up Date</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${booking.pickup_date} at ${booking.pickup_time}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Pick-up Location</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${booking.pickup_location}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Drop-off Date</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${booking.dropoff_date} at ${booking.dropoff_time}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Total Amount</strong></td>
              <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>$${booking.total_amount}</strong></td>
            </tr>
          </table>
          
          <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Important Reminders:</h4>
            <ul>
              <li>Please arrive 15 minutes before your scheduled pick-up time</li>
              <li>Bring a valid driver's license and credit card</li>
              <li>Contact us if you need to make any changes</li>
            </ul>
          </div>
          
          <p>If you have any questions, please don't hesitate to contact us:</p>
          <p>Phone: +41 78 214 97 95<br />Email: support@kirastay.com</p>
          
          <p>Thank you for choosing Kirastay Car Rental!</p>
          
          <p>Best regards,<br />The Kirastay Team</p>
        </div>
      </div>
    `
  }),
  
  statusUpdate: (booking, oldStatus, newStatus) => ({
    subject: `Booking Update - ${booking.booking_reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #28a745; color: white; padding: 20px; text-align: center;">
          <h1>Booking Status Updated</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${booking.customer_first_name} ${booking.customer_last_name},</p>
          
          <p>Your booking status has been updated:</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Booking Reference:</strong> ${booking.booking_reference}</p>
            <p><strong>Status:</strong> ${BookingUtils.formatStatus(newStatus)}</p>
            <p><strong>Car:</strong> ${booking.make} ${booking.model}</p>
            <p><strong>Pick-up:</strong> ${booking.pickup_date} at ${booking.pickup_time}</p>
          </div>
          
          ${booking.driver_assigned ? `
            <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0;">Driver Information:</h4>
              <p><strong>Name:</strong> ${booking.driver_name}</p>
              <p><strong>Phone:</strong> ${booking.driver_phone}</p>
            </div>
          ` : ''}
          
          <p>Thank you for choosing Kirastay Car Rental!</p>
          
          <p>Best regards,<br />The Kirastay Team</p>
        </div>
      </div>
    `
  })
};

export default NotificationService;
