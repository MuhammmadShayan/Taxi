# 📧 KIRASTAY Email Notification System

## Overview
This document explains how to set up and configure the comprehensive email notification system for KIRASTAY using Gmail SMTP.

## Features Implemented

### ✅ Email Notifications Included:
1. **Agency Registration**
   - Confirmation email to agency
   - Admin notification for review

2. **User Registration**
   - Welcome email to new users
   - Admin notification of new registrations

3. **Password Reset**
   - Password reset link email to users
   - Secure token-based reset system

4. **Booking Management**
   - Booking confirmation to customers
   - New booking notification to agencies
   - Booking status updates to all parties
   - Admin notifications for all booking activities

5. **Agency Approval/Rejection**
   - Approval/rejection emails to agencies
   - Admin audit trail

## 🔧 Setup Instructions

### Step 1: Gmail App Password Setup
1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to "Security" → "App Passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character app password

### Step 2: Environment Variables
Create a `.env.local` file in your project root with:

```bash
# Gmail SMTP Configuration
GMAIL_EMAIL=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
ADMIN_EMAIL=admin@kirastay.com

# Application URL
APP_URL=http://localhost:3000
```

**Important**: 
- Replace `your-gmail@gmail.com` with your actual Gmail address
- Replace `your-16-character-app-password` with the app password from Step 1
- Replace `admin@kirastay.com` with your admin email address

### Step 3: Test Email Configuration
Run your Next.js application:
```bash
npm run dev
```

Test the email system by:
1. Registering a new agency at `http://localhost:3000/agency/register`
2. Check both the agency email and admin email for notifications

## 📋 Email Types and Triggers

### Agency Registration
**Trigger**: When an agency submits registration form
**Recipients**: 
- Agency contact email (confirmation)
- Admin email (review notification)

### User Registration  
**Trigger**: When a user creates an account
**Recipients**:
- User email (welcome message)
- Admin email (new user notification)

### Password Reset
**Trigger**: When user requests password reset
**Recipients**:
- User email (reset link)

### Booking Created
**Trigger**: When a new booking is made
**Recipients**:
- Customer email (booking confirmation)
- Agency email (new booking notification)
- Admin email (booking activity notification)

### Booking Status Update
**Trigger**: When booking status changes (pending → confirmed → active → completed)
**Recipients**:
- Customer email (status update)
- Agency email (status update)
- Admin email (audit notification)

### Agency Approval/Rejection
**Trigger**: When admin approves/rejects agency application
**Recipients**:
- Agency email (approval/rejection notification)

## 🛡️ Security Features

1. **Environment Variables**: All sensitive data stored in environment variables
2. **Error Handling**: Email failures don't break application functionality
3. **Token Expiry**: Password reset tokens expire in 1 hour
4. **HTML + Text**: Emails include both HTML and plain text versions
5. **Professional Templates**: Branded email templates with consistent styling

## 🔧 File Structure

```
src/
├── utils/
│   ├── emailService.js          # Core email service with Gmail SMTP
│   └── emailTemplates.js        # All email templates
├── app/api/
│   ├── agency/register/route.js # Agency registration with emails
│   ├── auth/
│   │   ├── register/route.js    # User registration with emails
│   │   └── forgot-password/route.js # Password reset emails
│   ├── bookings/route.js        # Booking creation/update emails
│   └── admin/
│       ├── agencies/[id]/approve/route.js # Agency approval emails
│       └── bookings/[id]/status/route.js  # Booking status emails
```

## 🧪 Testing

### Test Agency Registration:
1. Go to `http://localhost:3000/agency/register`
2. Fill out the form and submit
3. Check:
   - Agency email for confirmation
   - Admin email for review notification

### Test User Registration:
1. Register a new user
2. Check:
   - User email for welcome message
   - Admin email for new user notification

### Test Password Reset:
1. Go to forgot password page
2. Enter email and submit
3. Check user email for reset link

### Test Booking Flow:
1. Create a booking
2. Update booking status via admin panel
3. Check all party emails for notifications

## 🐛 Troubleshooting

### Common Issues:

1. **"Authentication failed" error**
   - Verify Gmail app password is correct
   - Ensure 2FA is enabled on Gmail account
   - Check GMAIL_EMAIL environment variable

2. **"Network timeout" error**
   - Check internet connection
   - Verify Gmail SMTP settings
   - Try port 465 with secure: true if 587 fails

3. **Emails not being sent**
   - Check console logs for detailed error messages
   - Verify environment variables are loaded
   - Test with a simple email first

4. **Admin not receiving emails**
   - Verify ADMIN_EMAIL environment variable
   - Check spam folder
   - Ensure admin email is valid

### Debug Tips:
- Check browser console and server logs for email sending status
- All email operations log success/failure status
- Email failures don't break the main application flow

## 📞 Support
If you encounter issues with the email system, check:
1. Server console logs for detailed error messages
2. Gmail account security settings
3. Environment variable configuration
4. Network connectivity

The email system is designed to be fault-tolerant - if emails fail to send, the main application functionality (registration, bookings, etc.) will still work properly.
