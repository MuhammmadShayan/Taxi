// Email templates for different types of notifications

// Base template wrapper
const baseTemplate = (content, title = 'KIRASTAY Notification') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 0; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .btn:hover { background: #5a6fd8; }
        .info-box { background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 15px 0; }
        .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
        .success-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; }
        .details-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .details-table th, .details-table td { padding: 10px; border-bottom: 1px solid #eee; text-align: left; }
        .details-table th { background: #f8f9fa; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>KIRASTAY</h1>
            <p>Your Premier Vehicle Rental Platform</p>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>&copy; 2024 KIRASTAY. All rights reserved.</p>
            <p>Visit us at <a href="http://localhost:3000">localhost:3000</a></p>
        </div>
    </div>
</body>
</html>
`;

// Agency Registration Templates
const agencyRegistrationConfirmation = (agencyData) => {
  const content = `
    <h2>Welcome to KIRASTAY!</h2>
    <p>Dear <strong>${agencyData.contact_full_name}</strong>,</p>
    
    <p>Thank you for registering <strong>${agencyData.agency_name}</strong> with KIRASTAY. Your application has been received and is currently under review.</p>
    
    <div class="info-box">
        <h3>Registration Details:</h3>
        <table class="details-table">
            <tr><th>Agency Name</th><td>${agencyData.agency_name}</td></tr>
            <tr><th>Contact Person</th><td>${agencyData.contact_full_name}</td></tr>
            <tr><th>Email</th><td>${agencyData.contact_email}</td></tr>
            <tr><th>Phone</th><td>${agencyData.contact_phone}</td></tr>
            <tr><th>Address</th><td>${agencyData.street_number}, ${agencyData.city}, ${agencyData.country}</td></tr>
            <tr><th>Username</th><td>${agencyData.username}</td></tr>
        </table>
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
  `;
  
  return baseTemplate(content, 'Agency Registration Confirmation - KIRASTAY');
};

const agencyRegistrationAdminNotification = (agencyData) => {
  const content = `
    <h2>New Agency Registration</h2>
    <p>A new agency has registered on the platform and requires review.</p>
    
    <div class="info-box">
        <h3>Agency Details:</h3>
        <table class="details-table">
            <tr><th>Agency Name</th><td>${agencyData.agency_name}</td></tr>
            <tr><th>Contact Person</th><td>${agencyData.contact_full_name}</td></tr>
            <tr><th>Email</th><td>${agencyData.contact_email}</td></tr>
            <tr><th>Phone</th><td>${agencyData.contact_phone}</td></tr>
            <tr><th>Address</th><td>${agencyData.street_number}, ${agencyData.city}, ${agencyData.country}</td></tr>
            <tr><th>Username</th><td>${agencyData.username}</td></tr>
            <tr><th>Role</th><td>${agencyData.role || 'Not specified'}</td></tr>
            <tr><th>Payment Options</th><td>
                ${agencyData.payment_pay_all ? 'Full Payment' : ''}
                ${agencyData.payment_20_percent ? '20% Advance' : ''}
            </td></tr>
            <tr><th>GPS Navigation</th><td>${agencyData.navigation_system === 'yes' ? 'Available' : 'Not Available'}</td></tr>
            <tr><th>Child Seats</th><td>
                ${agencyData.baby_seat ? `Baby seat (${agencyData.baby_seat_price} MAD)` : ''}
                ${agencyData.child_seat ? `Child seat (${agencyData.child_seat_price} MAD)` : ''}
                ${agencyData.booster_seat ? `Booster seat (${agencyData.booster_seat_price} MAD)` : ''}
            </td></tr>
            <tr><th>Insurance</th><td>${agencyData.all_risks_insurance ? `All risks (${agencyData.insurance_price} MAD/day)` : 'Not offered'}</td></tr>
        </table>
    </div>
    
    ${agencyData.other_services ? `
    <div class="info-box">
        <h3>Additional Services:</h3>
        <p>${agencyData.other_services}</p>
    </div>
    ` : ''}
    
    ${agencyData.comment ? `
    <div class="info-box">
        <h3>Comments:</h3>
        <p>${agencyData.comment}</p>
    </div>
    ` : ''}
    
    <a href="http://localhost:3000/admin/agencies" class="btn">Review Application</a>
    
    <p>Please review this application and approve or reject as appropriate.</p>
  `;
  
  return baseTemplate(content, 'New Agency Registration - Admin Review Required');
};

// User Registration Templates
const userRegistrationWelcome = (userData) => {
  const content = `
    <h2>Welcome to KIRASTAY!</h2>
    <p>Dear <strong>${userData.full_name}</strong>,</p>
    
    <p>Welcome to KIRASTAY! Your account has been successfully created.</p>
    
    <div class="success-box">
        <h3>Account Details:</h3>
        <table class="details-table">
            <tr><th>Full Name</th><td>${userData.full_name}</td></tr>
            <tr><th>Email</th><td>${userData.email}</td></tr>
            <tr><th>Username</th><td>${userData.username}</td></tr>
            <tr><th>Phone</th><td>${userData.phone || 'Not provided'}</td></tr>
        </table>
    </div>
    
    <div class="info-box">
        <h3>Get Started:</h3>
        <ul>
            <li>Browse our extensive collection of vehicles</li>
            <li>Make bookings with trusted agencies</li>
            <li>Manage your reservations in your dashboard</li>
            <li>Leave reviews and ratings</li>
        </ul>
    </div>
    
    <a href="http://localhost:3000/login" class="btn">Login to Your Account</a>
    
    <p>If you have any questions, our support team is here to help!</p>
    
    <p>Best regards,<br>The KIRASTAY Team</p>
  `;
  
  return baseTemplate(content, 'Welcome to KIRASTAY!');
};

const userRegistrationAdminNotification = (userData) => {
  const content = `
    <h2>New User Registration</h2>
    <p>A new user has registered on the platform.</p>
    
    <div class="info-box">
        <h3>User Details:</h3>
        <table class="details-table">
            <tr><th>Full Name</th><td>${userData.full_name}</td></tr>
            <tr><th>Email</th><td>${userData.email}</td></tr>
            <tr><th>Username</th><td>${userData.username}</td></tr>
            <tr><th>Phone</th><td>${userData.phone || 'Not provided'}</td></tr>
            <tr><th>Registration Date</th><td>${new Date().toLocaleString()}</td></tr>
        </table>
    </div>
    
    <a href="http://localhost:3000/admin/users" class="btn">View User Management</a>
  `;
  
  return baseTemplate(content, 'New User Registration - KIRASTAY');
};

// Password Reset Templates
const passwordResetRequest = (userData, resetToken) => {
  const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken}`;
  
  const content = `
    <h2>Password Reset Request</h2>
    <p>Dear <strong>${userData.full_name || userData.username}</strong>,</p>
    
    <p>We received a request to reset your password for your KIRASTAY account.</p>
    
    <div class="warning-box">
        <h3>Important:</h3>
        <ul>
            <li>This link will expire in 1 hour</li>
            <li>If you didn't request this reset, please ignore this email</li>
            <li>Never share this link with anyone</li>
        </ul>
    </div>
    
    <a href="${resetLink}" class="btn">Reset Your Password</a>
    
    <p>Or copy and paste this link in your browser:</p>
    <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">${resetLink}</p>
    
    <p>If you continue to have problems, please contact our support team.</p>
    
    <p>Best regards,<br>The KIRASTAY Team</p>
  `;
  
  return baseTemplate(content, 'Password Reset Request - KIRASTAY');
};

// Booking Templates
const bookingConfirmation = (bookingData, userData, agencyData) => {
  const content = `
    <h2>Booking Confirmation</h2>
    <p>Dear <strong>${userData.full_name}</strong>,</p>
    
    <p>Your booking has been confirmed! Here are the details:</p>
    
    <div class="success-box">
        <h3>Booking Details:</h3>
        <table class="details-table">
            <tr><th>Booking ID</th><td>#${bookingData.id}</td></tr>
            <tr><th>Vehicle</th><td>${bookingData.vehicle_name}</td></tr>
            <tr><th>Agency</th><td>${agencyData.agency_name}</td></tr>
            <tr><th>Pickup Date</th><td>${bookingData.pickup_date}</td></tr>
            <tr><th>Return Date</th><td>${bookingData.return_date}</td></tr>
            <tr><th>Pickup Location</th><td>${bookingData.pickup_location}</td></tr>
            <tr><th>Total Amount</th><td>${bookingData.total_amount} MAD</td></tr>
            <tr><th>Status</th><td>${bookingData.status}</td></tr>
        </table>
    </div>
    
    <div class="info-box">
        <h3>Agency Contact:</h3>
        <table class="details-table">
            <tr><th>Agency</th><td>${agencyData.agency_name}</td></tr>
            <tr><th>Contact</th><td>${agencyData.contact_full_name}</td></tr>
            <tr><th>Phone</th><td>${agencyData.contact_phone}</td></tr>
            <tr><th>Email</th><td>${agencyData.contact_email}</td></tr>
        </table>
    </div>
    
    <a href="http://localhost:3000/dashboard/bookings" class="btn">View Booking Details</a>
    
    <p>Please contact the agency directly for any specific arrangements or questions about your booking.</p>
    
    <p>Best regards,<br>The KIRASTAY Team</p>
  `;
  
  return baseTemplate(content, 'Booking Confirmation - KIRASTAY');
};

const bookingStatusUpdate = (bookingData, userData, agencyData, newStatus, oldStatus) => {
  const content = `
    <h2>Booking Status Update</h2>
    <p>Dear <strong>${userData.full_name}</strong>,</p>
    
    <p>Your booking status has been updated.</p>
    
    <div class="info-box">
        <h3>Booking Details:</h3>
        <table class="details-table">
            <tr><th>Booking ID</th><td>#${bookingData.id}</td></tr>
            <tr><th>Vehicle</th><td>${bookingData.vehicle_name}</td></tr>
            <tr><th>Agency</th><td>${agencyData.agency_name}</td></tr>
            <tr><th>Previous Status</th><td>${oldStatus}</td></tr>
            <tr><th>New Status</th><td><strong>${newStatus}</strong></td></tr>
        </table>
    </div>
    
    <a href="http://localhost:3000/dashboard/bookings" class="btn">View Booking Details</a>
    
    <p>If you have any questions about this update, please contact the agency directly.</p>
    
    <p>Best regards,<br>The KIRASTAY Team</p>
  `;
  
  return baseTemplate(content, 'Booking Status Update - KIRASTAY');
};

const newBookingAgencyNotification = (bookingData, userData, agencyData) => {
  const content = `
    <h2>New Booking Received!</h2>
    <p>Dear <strong>${agencyData.contact_full_name}</strong>,</p>
    
    <p>You have received a new booking for your vehicle!</p>
    
    <div class="success-box">
        <h3>Booking Details:</h3>
        <table class="details-table">
            <tr><th>Booking ID</th><td>#${bookingData.id}</td></tr>
            <tr><th>Vehicle</th><td>${bookingData.vehicle_name}</td></tr>
            <tr><th>Customer</th><td>${userData.full_name}</td></tr>
            <tr><th>Customer Email</th><td>${userData.email}</td></tr>
            <tr><th>Customer Phone</th><td>${userData.phone || 'Not provided'}</td></tr>
            <tr><th>Pickup Date</th><td>${bookingData.pickup_date}</td></tr>
            <tr><th>Return Date</th><td>${bookingData.return_date}</td></tr>
            <tr><th>Pickup Location</th><td>${bookingData.pickup_location}</td></tr>
            <tr><th>Total Amount</th><td>${bookingData.total_amount} MAD</td></tr>
        </table>
    </div>
    
    <a href="http://localhost:3000/agency/bookings" class="btn">Manage Booking</a>
    
    <p>Please review and confirm this booking as soon as possible.</p>
    
    <p>Best regards,<br>The KIRASTAY Team</p>
  `;
  
  return baseTemplate(content, 'New Booking Received - KIRASTAY');
};

const bookingAdminNotification = (bookingData, userData, agencyData, action = 'created') => {
  const content = `
    <h2>Booking ${action.charAt(0).toUpperCase() + action.slice(1)}</h2>
    <p>A booking has been ${action} in the system.</p>
    
    <div class="info-box">
        <h3>Booking Information:</h3>
        <table class="details-table">
            <tr><th>Booking ID</th><td>#${bookingData.id}</td></tr>
            <tr><th>Action</th><td>${action.toUpperCase()}</td></tr>
            <tr><th>Vehicle</th><td>${bookingData.vehicle_name}</td></tr>
            <tr><th>Customer</th><td>${userData.full_name} (${userData.email})</td></tr>
            <tr><th>Agency</th><td>${agencyData.agency_name} (${agencyData.contact_email})</td></tr>
            <tr><th>Pickup Date</th><td>${bookingData.pickup_date}</td></tr>
            <tr><th>Return Date</th><td>${bookingData.return_date}</td></tr>
            <tr><th>Total Amount</th><td>${bookingData.total_amount} MAD</td></tr>
            <tr><th>Status</th><td>${bookingData.status}</td></tr>
            <tr><th>Timestamp</th><td>${new Date().toLocaleString()}</td></tr>
        </table>
    </div>
    
    <a href="http://localhost:3000/admin/bookings" class="btn">View All Bookings</a>
  `;
  
  return baseTemplate(content, `Booking ${action.charAt(0).toUpperCase() + action.slice(1)} - Admin Notification`);
};

// Agency Approval Templates
const agencyApprovalNotification = (agencyData, approved = true) => {
  const content = approved ? `
    <h2>Agency Application Approved!</h2>
    <p>Dear <strong>${agencyData.contact_full_name}</strong>,</p>
    
    <p>Congratulations! Your agency <strong>${agencyData.agency_name}</strong> has been approved to join the KIRASTAY platform.</p>
    
    <div class="success-box">
        <h3>You can now:</h3>
        <ul>
            <li>Login to your agency dashboard</li>
            <li>Add and manage your vehicle fleet</li>
            <li>Accept and manage bookings</li>
            <li>Track your earnings</li>
            <li>Update your profile and settings</li>
        </ul>
    </div>
    
    <a href="http://localhost:3000/agency/login" class="btn">Access Your Dashboard</a>
    
    <p>Welcome to the KIRASTAY family! We're excited to have you as a partner.</p>
  ` : `
    <h2>Agency Application Update</h2>
    <p>Dear <strong>${agencyData.contact_full_name}</strong>,</p>
    
    <p>We regret to inform you that your agency application for <strong>${agencyData.agency_name}</strong> has not been approved at this time.</p>
    
    <div class="warning-box">
        <h3>Next Steps:</h3>
        <ul>
            <li>Please review our agency requirements</li>
            <li>You may reapply after addressing any issues</li>
            <li>Contact our support team for more information</li>
        </ul>
    </div>
    
    <p>If you have any questions about this decision, please don't hesitate to contact our support team.</p>
  `;
  
  return baseTemplate(content, approved ? 'Agency Approved - KIRASTAY' : 'Agency Application Update - KIRASTAY');
};

// Booking Success Templates
const bookingSuccessCustomerConfirmation = (bookingData, userData, agencyData) => {
  const content = `
    <h2>Reservation Successful - Awaiting Agency Confirmation</h2>
    <p>Dear <strong>${userData.full_name}</strong>,</p>
    
    <p>Great news! Your payment has been processed successfully. Your booking is now awaiting confirmation from the rental agency.</p>
    
    <div class="success-box">
        <h3>Payment Confirmed:</h3>
        <table class="details-table">
            <tr><th>Booking Reference</th><td>BK${bookingData.id}${Date.now().toString().slice(-6)}</td></tr>
            <tr><th>Vehicle</th><td>${bookingData.vehicle_name}</td></tr>
            <tr><th>Pickup Date</th><td>${new Date(bookingData.pickup_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
            <tr><th>Return Date</th><td>${new Date(bookingData.return_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
            <tr><th>Pickup Time</th><td>${bookingData.pickup_time || 'TBD'}</td></tr>
            <tr><th>Pickup Location</th><td>${bookingData.pickup_location || 'To be confirmed'}</td></tr>
            <tr><th>Total Paid</th><td>$${bookingData.total_amount}</td></tr>
            <tr><th>Payment Status</th><td><strong style="color: #28a745;">PAID</strong></td></tr>
            <tr><th>Booking Status</th><td><strong style="color: #ffc107;">AWAITING AGENCY CONFIRMATION</strong></td></tr>
        </table>
    </div>
    
    <div class="warning-box">
        <h3>Next Steps:</h3>
        <ul>
            <li><strong>Agency Review:</strong> The rental agency will review and confirm your booking</li>
            <li><strong>Confirmation Email:</strong> You'll receive another email once the agency confirms</li>
            <li><strong>Payment Security:</strong> Your payment is secured and will be processed upon agency confirmation</li>
            <li><strong>Estimated Confirmation:</strong> Most agencies respond within 24 hours</li>
        </ul>
    </div>
    
    <div class="info-box">
        <h3>Agency Contact Information:</h3>
        <table class="details-table">
            <tr><th>Agency</th><td>${agencyData.agency_name}</td></tr>
            <tr><th>Contact Person</th><td>${agencyData.contact_full_name}</td></tr>
            <tr><th>Phone</th><td>${agencyData.contact_phone}</td></tr>
            <tr><th>Email</th><td>${agencyData.contact_email}</td></tr>
        </table>
    </div>
    
    <a href="http://localhost:3000/booking-confirmation/${bookingData.id}" class="btn">View Booking Details</a>
    
    <p>Thank you for choosing KIRASTAY! Your payment is secure and your booking will be confirmed soon.</p>
    
    <p>Best regards,<br>The KIRASTAY Team</p>
  `;
  
  return baseTemplate(content, 'Reservation Successful - Awaiting Agency Confirmation');
};

const bookingSuccessAdminNotification = (bookingData, userData, agencyData) => {
  const content = `
    <h2>Payment Received - Awaiting Agency Confirmation</h2>
    <p>A customer has successfully completed payment for their booking. The booking is now awaiting agency confirmation.</p>
    
    <div class="success-box">
        <h3>Payment Details:</h3>
        <table class="details-table">
            <tr><th>Booking Reference</th><td>BK${bookingData.id}${Date.now().toString().slice(-6)}</td></tr>
            <tr><th>Payment Status</th><td><strong style="color: #28a745;">PAID</strong></td></tr>
            <tr><th>Booking Status</th><td><strong style="color: #ffc107;">AWAITING AGENCY CONFIRMATION</strong></td></tr>
            <tr><th>Amount Paid</th><td>$${bookingData.total_amount}</td></tr>
            <tr><th>Payment Date</th><td>${new Date().toLocaleString()}</td></tr>
        </table>
    </div>
    
    <div class="info-box">
        <h3>Booking Information:</h3>
        <table class="details-table">
            <tr><th>Vehicle</th><td>${bookingData.vehicle_name}</td></tr>
            <tr><th>Pickup Date</th><td>${new Date(bookingData.pickup_date).toLocaleDateString()}</td></tr>
            <tr><th>Return Date</th><td>${new Date(bookingData.return_date).toLocaleDateString()}</td></tr>
            <tr><th>Total Days</th><td>${bookingData.total_days || 'N/A'}</td></tr>
        </table>
    </div>
    
    <div class="info-box">
        <h3>Customer Information:</h3>
        <table class="details-table">
            <tr><th>Customer</th><td>${userData.full_name}</td></tr>
            <tr><th>Email</th><td>${userData.email}</td></tr>
            <tr><th>Phone</th><td>${userData.phone || 'Not provided'}</td></tr>
        </table>
    </div>
    
    <div class="info-box">
        <h3>Agency Information:</h3>
        <table class="details-table">
            <tr><th>Agency</th><td>${agencyData.agency_name}</td></tr>
            <tr><th>Contact</th><td>${agencyData.contact_full_name}</td></tr>
            <tr><th>Email</th><td>${agencyData.contact_email}</td></tr>
            <tr><th>Phone</th><td>${agencyData.contact_phone}</td></tr>
        </table>
    </div>
    
    <div class="warning-box">
        <h3>Action Required:</h3>
        <ul>
            <li>Agency needs to confirm the booking</li>
            <li>Customer will be notified upon agency confirmation</li>
            <li>Monitor for agency response</li>
        </ul>
    </div>
    
    <a href="http://localhost:3000/admin/bookings" class="btn">View All Bookings</a>
    
    <p>The customer and agency have been notified of the successful payment.</p>
  `;
  
  return baseTemplate(content, 'Payment Received - Admin Notification');
};

const bookingSuccessAgencyNotification = (bookingData, userData, agencyData) => {
  const content = `
    <h2>Customer Payment Received - Confirmation Required</h2>
    <p>Dear <strong>${agencyData.contact_full_name}</strong>,</p>
    
    <p>Great news! A customer has successfully completed payment for their booking with your agency. Please review and confirm this booking.</p>
    
    <div class="success-box">
        <h3>Payment Confirmed:</h3>
        <table class="details-table">
            <tr><th>Booking Reference</th><td>BK${bookingData.id}${Date.now().toString().slice(-6)}</td></tr>
            <tr><th>Payment Status</th><td><strong style="color: #28a745;">PAID</strong></td></tr>
            <tr><th>Amount Received</th><td>$${bookingData.total_amount}</td></tr>
            <tr><th>Payment Date</th><td>${new Date().toLocaleString()}</td></tr>
        </table>
    </div>
    
    <div class="info-box">
        <h3>Booking Details:</h3>
        <table class="details-table">
            <tr><th>Vehicle</th><td>${bookingData.vehicle_name}</td></tr>
            <tr><th>Pickup Date</th><td>${new Date(bookingData.pickup_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
            <tr><th>Return Date</th><td>${new Date(bookingData.return_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
            <tr><th>Pickup Time</th><td>${bookingData.pickup_time || 'TBD'}</td></tr>
            <tr><th>Pickup Location</th><td>${bookingData.pickup_location || 'To be confirmed'}</td></tr>
            <tr><th>Total Days</th><td>${bookingData.total_days || 'N/A'}</td></tr>
        </table>
    </div>
    
    <div class="info-box">
        <h3>Customer Information:</h3>
        <table class="details-table">
            <tr><th>Customer Name</th><td>${userData.full_name}</td></tr>
            <tr><th>Email</th><td>${userData.email}</td></tr>
            <tr><th>Phone</th><td>${userData.phone || 'Not provided'}</td></tr>
        </table>
    </div>
    
    <div class="warning-box">
        <h3>Action Required:</h3>
        <ul>
            <li><strong>Review the booking details above</strong></li>
            <li><strong>Confirm vehicle availability</strong> for the requested dates</li>
            <li><strong>Update booking status</strong> in your dashboard</li>
            <li><strong>Contact customer</strong> if you need any clarification</li>
        </ul>
    </div>
    
    <a href="http://localhost:3000/agency/bookings" class="btn">Confirm Booking</a>
    
    <p>Please confirm this booking as soon as possible. The customer is waiting for your confirmation.</p>
    
    <p>Best regards,<br>The KIRASTAY Team</p>
  `;
  
  return baseTemplate(content, 'Customer Payment Received - Confirmation Required');
};

// Generic notification template
const genericNotification = (title, message, recipientName = '', actionUrl = '', actionText = '') => {
  const content = `
    <h2>${title}</h2>
    ${recipientName ? `<p>Dear <strong>${recipientName}</strong>,</p>` : ''}
    
    <div class="info-box">
        ${message}
    </div>
    
    ${actionUrl && actionText ? `<a href="${actionUrl}" class="btn">${actionText}</a>` : ''}
    
    <p>Best regards,<br>The KIRASTAY Team</p>
  `;
  
  return baseTemplate(content, title + ' - KIRASTAY');
};

module.exports = {
  agencyRegistrationConfirmation,
  agencyRegistrationAdminNotification,
  userRegistrationWelcome,
  userRegistrationAdminNotification,
  passwordResetRequest,
  bookingConfirmation,
  bookingStatusUpdate,
  newBookingAgencyNotification,
  bookingAdminNotification,
  agencyApprovalNotification,
  bookingSuccessCustomerConfirmation,
  bookingSuccessAdminNotification,
  bookingSuccessAgencyNotification,
  genericNotification
};
