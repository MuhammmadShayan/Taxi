/**
 * Input sanitization utilities for XSS prevention and data cleaning
 */

/**
 * HTML entity encoding for XSS prevention
 */
const htmlEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>"'\/]/g, (match) => htmlEntities[match]);
}

/**
 * Remove potentially dangerous HTML tags and attributes
 */
export function stripHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Clean and validate email addresses
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  
  // Convert to lowercase and trim
  email = email.toLowerCase().trim();
  
  // Remove any HTML entities
  email = escapeHtml(email);
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  return email;
}

/**
 * Sanitize names (first name, last name, etc.)
 */
export function sanitizeName(name) {
  if (typeof name !== 'string') return '';
  
  // Remove HTML and trim
  name = stripHtml(name).trim();
  
  // Remove special characters except spaces, hyphens, and apostrophes
  name = name.replace(/[^a-zA-Z\s\-']/g, '');
  
  // Limit length
  name = name.substring(0, 50);
  
  // Capitalize first letter of each word
  name = name.replace(/\b\w/g, l => l.toUpperCase());
  
  return name;
}

/**
 * Sanitize phone numbers
 */
export function sanitizePhone(phone) {
  if (typeof phone !== 'string') return '';
  
  // Remove all non-digit characters except +, -, (, ), and spaces
  phone = phone.replace(/[^+\d\s\-\(\)]/g, '');
  
  // Trim and limit length
  phone = phone.trim().substring(0, 20);
  
  return phone;
}

/**
 * Sanitize addresses and general text fields
 */
export function sanitizeText(text, maxLength = 200) {
  if (typeof text !== 'string') return '';
  
  // Remove HTML tags and escape entities
  text = escapeHtml(stripHtml(text));
  
  // Trim whitespace
  text = text.trim();
  
  // Remove excessive whitespace
  text = text.replace(/\s+/g, ' ');
  
  // Limit length
  text = text.substring(0, maxLength);
  
  return text;
}

/**
 * Sanitize special requests and long text fields
 */
export function sanitizeSpecialRequests(text) {
  return sanitizeText(text, 500);
}

/**
 * Sanitize numeric inputs
 */
export function sanitizeNumber(value, options = {}) {
  const { min = 0, max = Number.MAX_SAFE_INTEGER, decimals = 2 } = options;
  
  // Convert to number
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    throw new Error('Invalid number format');
  }
  
  // Check bounds
  if (num < min || num > max) {
    throw new Error(`Number must be between ${min} and ${max}`);
  }
  
  // Round to specified decimal places
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Sanitize date strings
 */
export function sanitizeDate(dateString) {
  if (typeof dateString !== 'string') return null;
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  
  // Return ISO string for consistent formatting
  return date.toISOString();
}

/**
 * Sanitize time strings (HH:MM or HH:MM:SS format)
 */
export function sanitizeTime(timeString) {
  if (typeof timeString !== 'string') return '09:00:00';
  
  timeString = timeString.trim();
  
  // Handle AM/PM format
  const amPmMatch = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (amPmMatch) {
    let hours = parseInt(amPmMatch[1]);
    const minutes = amPmMatch[2];
    const period = amPmMatch[3].toUpperCase();
    
    if (period === 'AM' && hours === 12) hours = 0;
    if (period === 'PM' && hours !== 12) hours += 12;
    
    return `${String(hours).padStart(2, '0')}:${minutes}:00`;
  }
  
  // Handle HH:MM or HH:MM:SS format
  const timeMatch = timeString.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (timeMatch) {
    const hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const seconds = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
    
    if (hours > 23 || minutes > 59 || seconds > 59) {
      throw new Error('Invalid time format');
    }
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  
  throw new Error('Invalid time format');
}

/**
 * Sanitize card numbers (for display purposes only)
 */
export function sanitizeCardNumber(cardNumber) {
  if (typeof cardNumber !== 'string') return '';
  
  // Remove all non-digit characters
  const digits = cardNumber.replace(/\D/g, '');
  
  // Validate length (13-19 digits for most cards)
  if (digits.length < 13 || digits.length > 19) {
    throw new Error('Invalid card number length');
  }
  
  return digits;
}

/**
 * Mask card number for storage/display
 */
export function maskCardNumber(cardNumber) {
  const sanitized = sanitizeCardNumber(cardNumber);
  
  // Show only last 4 digits
  return '**** **** **** ' + sanitized.slice(-4);
}

/**
 * Comprehensive object sanitization
 */
export function sanitizeObject(obj, schema = {}) {
  if (!obj || typeof obj !== 'object') return {};
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const fieldType = schema[key] || 'text';
    
    try {
      switch (fieldType) {
        case 'email':
          sanitized[key] = sanitizeEmail(value);
          break;
        case 'name':
          sanitized[key] = sanitizeName(value);
          break;
        case 'phone':
          sanitized[key] = sanitizePhone(value);
          break;
        case 'text':
          sanitized[key] = sanitizeText(value);
          break;
        case 'longText':
          sanitized[key] = sanitizeText(value, 1000);
          break;
        case 'specialRequests':
          sanitized[key] = sanitizeSpecialRequests(value);
          break;
        case 'number':
          sanitized[key] = sanitizeNumber(value);
          break;
        case 'date':
          sanitized[key] = sanitizeDate(value);
          break;
        case 'time':
          sanitized[key] = sanitizeTime(value);
          break;
        case 'cardNumber':
          sanitized[key] = sanitizeCardNumber(value);
          break;
        default:
          // Default to text sanitization
          sanitized[key] = typeof value === 'string' ? sanitizeText(value) : value;
      }
    } catch (error) {
      console.warn(`Sanitization failed for field ${key}:`, error.message);
      // Skip invalid fields rather than failing the entire operation
    }
  }
  
  return sanitized;
}

/**
 * Sanitize customer details
 */
export function sanitizeCustomerDetails(customerDetails) {
  return sanitizeObject(customerDetails, {
    email: 'email',
    firstName: 'name',
    lastName: 'name',
    phone: 'phone',
    address: 'text',
    city: 'text',
    country: 'text',
    license: 'text',
    specialRequests: 'specialRequests'
  });
}

/**
 * Sanitize booking details
 */
export function sanitizeBookingDetails(bookingDetails) {
  return sanitizeObject(bookingDetails, {
    pickup_date: 'date',
    dropoff_date: 'date',
    pickup_time: 'time',
    dropoff_time: 'time',
    pickup_location: 'text',
    dropoff_location: 'text'
  });
}

/**
 * Sanitize payment details
 */
export function sanitizePaymentDetails(paymentDetails) {
  const sanitized = sanitizeObject(paymentDetails, {
    method: 'text',
    cardNumber: 'cardNumber',
    cardName: 'name',
    expiryDate: 'text',
    billingAddress: 'text',
    billingCity: 'text',
    billingCountry: 'text',
    billingPostalCode: 'text'
  });
  
  // Mask card number immediately after sanitization
  if (sanitized.cardNumber) {
    sanitized.cardNumber_masked = maskCardNumber(sanitized.cardNumber);
    // Remove original card number for security
    delete sanitized.cardNumber;
  }
  
  return sanitized;
}

/**
 * SQL injection prevention helpers
 */
export function escapeSqlLike(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[%_\\]/g, '\\$&');
}

/**
 * File path sanitization
 */
export function sanitizeFilePath(filePath) {
  if (typeof filePath !== 'string') return '';
  
  // Remove dangerous path traversal attempts
  filePath = filePath.replace(/\.\./g, '');
  filePath = filePath.replace(/[<>:"|?*]/g, '');
  
  return filePath.trim();
}

/**
 * URL sanitization
 */
export function sanitizeUrl(url) {
  if (typeof url !== 'string') return '';
  
  try {
    const urlObj = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid protocol');
    }
    
    return urlObj.toString();
  } catch (error) {
    throw new Error('Invalid URL format');
  }
}

/**
 * Middleware for automatic request sanitization
 */
export function sanitizeRequest(schema = {}) {
  return async (request) => {
    try {
      const body = await request.json();
      const sanitizedBody = sanitizeObject(body, schema);
      
      // Attach sanitized data to request
      request.sanitizedData = sanitizedBody;
      
      return sanitizedBody;
    } catch (error) {
      throw new Error('Failed to sanitize request data: ' + error.message);
    }
  };
}
