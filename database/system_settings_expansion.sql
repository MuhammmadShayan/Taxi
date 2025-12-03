-- Enhanced system settings for KIRASTAY vehicle rental platform
-- This file adds comprehensive settings to support all application features

-- First, let's add category support to organize settings
ALTER TABLE system_settings ADD COLUMN category VARCHAR(50) DEFAULT 'general' AFTER type;
ALTER TABLE system_settings ADD COLUMN display_order INT DEFAULT 0 AFTER category;
ALTER TABLE system_settings ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER display_order;

-- Insert comprehensive settings for the vehicle rental application
INSERT INTO system_settings (setting_key, setting_value, description, type, category, display_order) VALUES

-- General Settings
('site_name', 'KIRASTAY', 'Main site name displayed in header and branding', 'text', 'general', 1),
('site_tagline', 'Your Premier Vehicle Rental Partner', 'Site tagline/slogan', 'text', 'general', 2),
('site_logo_url', '/html-folder/images/logo.png', 'URL to site logo', 'text', 'general', 3),
('site_favicon_url', '/html-folder/images/favicon.png', 'URL to site favicon', 'text', 'general', 4),
('default_language', 'en', 'Default site language code', 'text', 'general', 5),
('default_currency', 'MAD', 'Default currency for pricing', 'text', 'general', 6),
('currency_symbol', 'DH', 'Currency symbol to display', 'text', 'general', 7),
('site_timezone', 'Africa/Casablanca', 'Default timezone', 'text', 'general', 8),

-- Contact Information
('contact_phone', '+212 123 456 789', 'Main contact phone number', 'text', 'contact', 10),
('contact_email', 'info@kirastay.com', 'Main contact email', 'text', 'contact', 11),
('support_email', 'support@kirastay.com', 'Support email address', 'text', 'contact', 12),
('business_address', 'Casablanca, Morocco', 'Main business address', 'text', 'contact', 13),
('business_hours', 'Monday - Sunday: 8:00 AM - 10:00 PM', 'Business operating hours', 'text', 'contact', 14),

-- Booking Settings
('booking_advance_days', '180', 'Maximum days in advance for booking', 'number', 'booking', 20),
('booking_minimum_hours', '6', 'Minimum rental period in hours', 'number', 'booking', 21),
('booking_cancellation_hours', '24', 'Hours before pickup for free cancellation', 'number', 'booking', 22),
('booking_modification_hours', '12', 'Hours before pickup for modifications', 'number', 'booking', 23),
('auto_confirm_bookings', 'false', 'Automatically confirm bookings', 'boolean', 'booking', 24),
('require_driver_license', 'true', 'Require driver license upload', 'boolean', 'booking', 25),
('minimum_driver_age', '21', 'Minimum age for drivers', 'number', 'booking', 26),
('security_deposit_percentage', '20', 'Security deposit percentage of rental cost', 'number', 'booking', 27),

-- Payment Settings  
('default_commission', '15.00', 'Default commission rate for agencies (%)', 'number', 'payment', 30),
('payment_processing_fee', '2.50', 'Payment processing fee (%)', 'number', 'payment', 31),
('late_fee_daily', '50.00', 'Daily late return fee', 'number', 'payment', 32),
('damage_assessment_fee', '25.00', 'Fee for damage assessment', 'number', 'payment', 33),
('refund_processing_days', '5', 'Days to process refunds', 'number', 'payment', 34),
('accept_cash_payments', 'true', 'Accept cash payments', 'boolean', 'payment', 35),
('accept_card_payments', 'true', 'Accept card payments', 'boolean', 'payment', 36),
('payment_gateway_stripe', 'false', 'Enable Stripe payment gateway', 'boolean', 'payment', 37),
('payment_gateway_paypal', 'false', 'Enable PayPal payment gateway', 'boolean', 'payment', 38),

-- Email Settings
('smtp_host', '', 'SMTP server host', 'text', 'email', 40),
('smtp_port', '587', 'SMTP server port', 'number', 'email', 41),
('smtp_username', '', 'SMTP username', 'text', 'email', 42),
('smtp_password', '', 'SMTP password (encrypted)', 'text', 'email', 43),
('smtp_encryption', 'tls', 'SMTP encryption (tls/ssl)', 'text', 'email', 44),
('email_from_name', 'KIRASTAY Support', 'From name for emails', 'text', 'email', 45),
('email_from_address', 'noreply@kirastay.com', 'From email address', 'text', 'email', 46),

-- Notification Settings
('notify_new_booking', 'true', 'Send notification for new bookings', 'boolean', 'notifications', 50),
('notify_booking_confirmed', 'true', 'Send notification when booking confirmed', 'boolean', 'notifications', 51),
('notify_booking_cancelled', 'true', 'Send notification when booking cancelled', 'boolean', 'notifications', 52),
('notify_payment_received', 'true', 'Send notification when payment received', 'boolean', 'notifications', 53),
('notify_review_submitted', 'true', 'Send notification when review submitted', 'boolean', 'notifications', 54),
('sms_notifications_enabled', 'false', 'Enable SMS notifications', 'boolean', 'notifications', 55),
('push_notifications_enabled', 'true', 'Enable push notifications', 'boolean', 'notifications', 56),

-- Google Maps & Location Settings
('google_maps_api_key', '', 'Google Maps API key', 'text', 'maps', 60),
('google_places_api_key', '', 'Google Places API key for autocomplete', 'text', 'maps', 61),
('default_map_center_lat', '33.5731', 'Default map center latitude (Casablanca)', 'text', 'maps', 62),
('default_map_center_lng', '-7.5898', 'Default map center longitude (Casablanca)', 'text', 'maps', 63),
('default_map_zoom', '11', 'Default map zoom level', 'number', 'maps', 64),
('enable_location_restrictions', 'true', 'Enable location-based restrictions', 'boolean', 'maps', 65),
('service_radius_km', '100', 'Service radius in kilometers', 'number', 'maps', 66),

-- Security Settings
('session_timeout_minutes', '480', 'Session timeout in minutes (8 hours)', 'number', 'security', 70),
('password_min_length', '8', 'Minimum password length', 'number', 'security', 71),
('require_password_special_chars', 'true', 'Require special characters in password', 'boolean', 'security', 72),
('max_login_attempts', '5', 'Maximum login attempts before lockout', 'number', 'security', 73),
('account_lockout_minutes', '30', 'Account lockout duration in minutes', 'number', 'security', 74),
('enable_two_factor_auth', 'false', 'Enable two-factor authentication', 'boolean', 'security', 75),
('jwt_secret_key', '', 'JWT secret key for token generation', 'text', 'security', 76),

-- File Upload Settings
('max_file_size_mb', '5', 'Maximum file upload size in MB', 'number', 'uploads', 80),
('allowed_image_formats', 'jpg,jpeg,png,gif,webp', 'Allowed image file formats', 'text', 'uploads', 81),
('allowed_document_formats', 'pdf,doc,docx', 'Allowed document file formats', 'text', 'uploads', 82),
('vehicle_photos_max', '10', 'Maximum photos per vehicle', 'number', 'uploads', 83),
('compress_uploaded_images', 'true', 'Compress uploaded images', 'boolean', 'uploads', 84),

-- SEO Settings
('site_meta_description', 'KIRASTAY - Premier vehicle rental services in Morocco. Book cars, motorcycles, and more with trusted local agencies.', 'Site meta description', 'text', 'seo', 90),
('site_meta_keywords', 'car rental, vehicle rental, Morocco, Casablanca, travel, booking', 'Site meta keywords', 'text', 'seo', 91),
('enable_sitemap', 'true', 'Enable XML sitemap generation', 'boolean', 'seo', 92),
('google_analytics_id', '', 'Google Analytics tracking ID', 'text', 'seo', 93),
('facebook_pixel_id', '', 'Facebook Pixel ID', 'text', 'seo', 94),

-- Social Media Links
('social_facebook_url', '', 'Facebook page URL', 'text', 'social', 100),
('social_twitter_url', '', 'Twitter profile URL', 'text', 'social', 101),
('social_instagram_url', '', 'Instagram profile URL', 'text', 'social', 102),
('social_linkedin_url', '', 'LinkedIn profile URL', 'text', 'social', 103),
('social_youtube_url', '', 'YouTube channel URL', 'text', 'social', 104),

-- API Settings
('enable_api_access', 'false', 'Enable external API access', 'boolean', 'api', 110),
('api_rate_limit_per_hour', '1000', 'API rate limit per hour per key', 'number', 'api', 111),
('webhook_booking_url', '', 'Webhook URL for booking events', 'text', 'api', 112),
('webhook_payment_url', '', 'Webhook URL for payment events', 'text', 'api', 113),

-- Maintenance Settings
('maintenance_mode', 'false', 'Enable maintenance mode', 'boolean', 'maintenance', 120),
('maintenance_message', 'We are currently performing scheduled maintenance. Please check back soon.', 'Maintenance mode message', 'text', 'maintenance', 121),
('debug_mode', 'false', 'Enable debug mode (development only)', 'boolean', 'maintenance', 122),
('log_level', 'info', 'Application log level (error, warn, info, debug)', 'text', 'maintenance', 123),
('backup_frequency_days', '7', 'Database backup frequency in days', 'number', 'maintenance', 124);

-- ON DUPLICATE KEY UPDATE to avoid conflicts with existing data
INSERT INTO system_settings (setting_key, setting_value, description, type, category, display_order) VALUES
('site_name', 'KIRASTAY', 'Main site name displayed in header and branding', 'text', 'general', 1)
ON DUPLICATE KEY UPDATE 
  category = VALUES(category),
  display_order = VALUES(display_order),
  description = VALUES(description);