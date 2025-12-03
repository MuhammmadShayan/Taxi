/**
 * Profile Validation Schema
 * Comprehensive validation rules for all profile types
 */

export const validateProfileData = (profileData, type = 'user') => {
  const errors = {};

  // Common validations
  if (!profileData.first_name?.trim()) {
    errors.first_name = 'First name is required';
  } else if (profileData.first_name.trim().length < 2) {
    errors.first_name = 'First name must be at least 2 characters';
  } else if (profileData.first_name.trim().length > 50) {
    errors.first_name = 'First name cannot exceed 50 characters';
  } else if (!/^[a-zA-Z\s'-]+$/.test(profileData.first_name.trim())) {
    errors.first_name = 'First name can only contain letters, spaces, hyphens, and apostrophes';
  }

  if (!profileData.last_name?.trim()) {
    errors.last_name = 'Last name is required';
  } else if (profileData.last_name.trim().length < 2) {
    errors.last_name = 'Last name must be at least 2 characters';
  } else if (profileData.last_name.trim().length > 50) {
    errors.last_name = 'Last name cannot exceed 50 characters';
  } else if (!/^[a-zA-Z\s'-]+$/.test(profileData.last_name.trim())) {
    errors.last_name = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
  }

  // Email validation (if provided and not disabled)
  if (profileData.email && !isValidEmail(profileData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation (optional but if provided must be valid)
  if (profileData.phone?.trim()) {
    if (!isValidPhoneNumber(profileData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number';
    }
  }

  // Address validation
  if (profileData.address?.trim()) {
    if (profileData.address.trim().length > 255) {
      errors.address = 'Address cannot exceed 255 characters';
    }
  }

  // City validation
  if (profileData.city?.trim()) {
    if (profileData.city.trim().length < 2) {
      errors.city = 'City name must be at least 2 characters';
    } else if (profileData.city.trim().length > 100) {
      errors.city = 'City name cannot exceed 100 characters';
    }
  }

  // Country validation
  if (profileData.country?.trim()) {
    if (profileData.country.trim().length < 2) {
      errors.country = 'Country name must be at least 2 characters';
    } else if (profileData.country.trim().length > 100) {
      errors.country = 'Country name cannot exceed 100 characters';
    }
  }

  // Postal code validation
  if (profileData.postal_code?.trim()) {
    if (profileData.postal_code.trim().length < 3) {
      errors.postal_code = 'Postal code must be at least 3 characters';
    } else if (profileData.postal_code.trim().length > 20) {
      errors.postal_code = 'Postal code cannot exceed 20 characters';
    }
  }

  // Agency-specific validations
  if (type === 'agency') {
    if (profileData.business_name?.trim() && profileData.business_name.trim().length < 2) {
      errors.business_name = 'Business name must be at least 2 characters';
    }

    if (profileData.tax_id?.trim() && profileData.tax_id.trim().length < 5) {
      errors.tax_id = 'Tax ID must be at least 5 characters';
    }

    if (profileData.license_number?.trim() && profileData.license_number.trim().length < 5) {
      errors.license_number = 'License number must be at least 5 characters';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPhoneNumber = (phone) => {
  // Accepts various phone formats: +1234567890, (123) 456-7890, 123-456-7890, 1234567890
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.trim()) && phone.trim().replace(/\D/g, '').length >= 7;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  // Remove leading/trailing whitespace
  return input.trim();
};

export const sanitizeProfileData = (profileData) => {
  const sanitized = {};
  
  Object.keys(profileData).forEach(key => {
    if (typeof profileData[key] === 'string') {
      sanitized[key] = sanitizeInput(profileData[key]);
    } else {
      sanitized[key] = profileData[key];
    }
  });

  return sanitized;
};

export const profileValidationRules = {
  first_name: {
    required: 'First name is required',
    minLength: { value: 2, message: 'Minimum 2 characters' },
    maxLength: { value: 50, message: 'Maximum 50 characters' },
    pattern: { value: /^[a-zA-Z\s'-]+$/, message: 'Only letters allowed' }
  },
  last_name: {
    required: 'Last name is required',
    minLength: { value: 2, message: 'Minimum 2 characters' },
    maxLength: { value: 50, message: 'Maximum 50 characters' },
    pattern: { value: /^[a-zA-Z\s'-]+$/, message: 'Only letters allowed' }
  },
  email: {
    required: 'Email is required',
    pattern: { 
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      message: 'Invalid email format' 
    }
  },
  phone: {
    pattern: { 
      value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 
      message: 'Invalid phone format' 
    }
  },
  address: {
    maxLength: { value: 255, message: 'Maximum 255 characters' }
  },
  city: {
    maxLength: { value: 100, message: 'Maximum 100 characters' }
  },
  country: {
    maxLength: { value: 100, message: 'Maximum 100 characters' }
  }
};
