import { z } from 'zod';

/**
 * Common validation patterns
 */
const emailSchema = z.string().email('Invalid email format');
const phoneSchema = z.string().regex(/^[\+]?[\d\s\-\(\)]{7,20}$/, 'Invalid phone number format').optional();
const nameSchema = z.string().min(1, 'Name is required').max(50, 'Name too long');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

/**
 * User-related schemas
 */
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  address: z.string().max(200).optional(),
  city: z.string().max(50).optional(),
  country: z.string().max(50).optional(),
  role: z.enum(['customer', 'agency', 'admin']).default('customer')
});

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

export const userUpdateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: phoneSchema,
  address: z.string().max(200).optional(),
  city: z.string().max(50).optional(),
  country: z.string().max(50).optional()
});

/**
 * Customer details schema
 */
export const customerDetailsSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  address: z.string().max(200).optional(),
  city: z.string().max(50).optional(),
  country: z.string().max(50).optional(),
  license: z.string().max(50).optional(),
  specialRequests: z.string().max(500).optional()
});

/**
 * Booking details schema
 */
export const bookingDetailsSchema = z.object({
  pickup_date: z.string().datetime('Invalid pickup date format'),
  dropoff_date: z.string().datetime('Invalid dropoff date format'),
  pickup_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?(\s?(AM|PM))?$/i, 'Invalid time format').optional(),
  dropoff_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?(\s?(AM|PM))?$/i, 'Invalid time format').optional(),
  pickup_location: z.string().max(200).optional(),
  dropoff_location: z.string().max(200).optional()
}).refine(data => {
  const pickup = new Date(data.pickup_date);
  const dropoff = new Date(data.dropoff_date);
  return dropoff > pickup;
}, {
  message: 'Dropoff date must be after pickup date',
  path: ['dropoff_date']
});

/**
 * Payment details schema
 */
export const paymentDetailsSchema = z.object({
  method: z.enum(['credit_card', 'debit_card', 'paypal', 'cash']),
  cardNumber: z.string().regex(/^[0-9]{13,19}$/, 'Invalid card number').optional(),
  cardName: z.string().min(1).max(100).optional(),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)').optional(),
  cvv: z.string().regex(/^[0-9]{3,4}$/, 'Invalid CVV').optional(),
  billingAddress: z.string().max(200).optional(),
  billingCity: z.string().max(50).optional(),
  billingCountry: z.string().max(50).optional(),
  billingPostalCode: z.string().max(20).optional()
}).refine(data => {
  if (data.method === 'credit_card' || data.method === 'debit_card') {
    return data.cardNumber && data.cardName && data.expiryDate && data.cvv;
  }
  return true;
}, {
  message: 'Card details are required for card payments'
});

/**
 * Pricing schema
 */
export const pricingSchema = z.object({
  subtotal: z.number().min(0, 'Subtotal cannot be negative'),
  extras_total: z.number().min(0, 'Extras total cannot be negative').default(0),
  tax: z.number().min(0, 'Tax cannot be negative').default(0),
  total: z.number().min(0, 'Total cannot be negative')
}).refine(data => {
  const calculatedTotal = data.subtotal + data.extras_total + data.tax;
  return Math.abs(data.total - calculatedTotal) < 0.01; // Allow for small floating point differences
}, {
  message: 'Total must equal subtotal + extras + tax'
});

/**
 * Extras schema
 */
export const extrasSchema = z.object({
  gps: z.boolean().default(false),
  childSeat: z.boolean().default(false),
  additionalDriver: z.boolean().default(false),
  insurance: z.boolean().default(false),
  wifi: z.boolean().default(false),
  fuelService: z.boolean().default(false)
});

/**
 * Complete booking creation schema
 */
export const createBookingSchema = z.object({
  vehicle_id: z.number().int().positive('Invalid vehicle ID'),
  car_id: z.number().int().positive('Invalid car ID').optional(), // fallback
  customer_details: customerDetailsSchema,
  booking_details: bookingDetailsSchema,
  payment_details: paymentDetailsSchema,
  pricing: pricingSchema,
  extras: extrasSchema.optional(),
  newsletter_subscribe: z.boolean().default(false)
}).refine(data => {
  return data.vehicle_id || data.car_id;
}, {
  message: 'Either vehicle_id or car_id is required'
});

/**
 * Booking update schema
 */
export const updateBookingSchema = z.object({
  booking_id: z.number().int().positive('Invalid booking ID'),
  updates: z.object({
    status: z.enum(['pending', 'confirmed', 'active', 'completed', 'canceled', 'cancelled']).optional(),
    payment_status: z.enum(['pending', 'completed', 'failed', 'refunded']).optional(),
    start_date: z.string().datetime().optional(),
    end_date: z.string().datetime().optional(),
    pickup_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).optional(),
    dropoff_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).optional(),
    special_requests: z.string().max(500).optional(),
    total_days: z.number().int().min(1).optional(),
    subtotal: z.number().min(0).optional(),
    extras_total: z.number().min(0).optional(),
    tax_amount: z.number().min(0).optional(),
    total_price: z.number().min(0).optional()
  }).refine(data => {
    if (data.start_date && data.end_date) {
      return new Date(data.end_date) > new Date(data.start_date);
    }
    return true;
  }, {
    message: 'End date must be after start date'
  })
});

/**
 * Query parameters schema for GET requests
 */
export const bookingQuerySchema = z.object({
  booking_id: z.string().regex(/^[0-9]+$/, 'Invalid booking ID').optional(),
  customer_email: emailSchema.optional(),
  status: z.enum(['pending', 'confirmed', 'active', 'completed', 'canceled', 'cancelled', 'all']).optional(),
  page: z.string().regex(/^[0-9]+$/).transform(val => parseInt(val)).refine(val => val >= 1).default('1'),
  limit: z.string().regex(/^[0-9]+$/).transform(val => parseInt(val)).refine(val => val >= 1 && val <= 100).default('10')
});

/**
 * Vehicle schema
 */
export const vehicleSchema = z.object({
  make: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  license_plate: z.string().min(1).max(20),
  daily_rate: z.number().min(0),
  type: z.enum(['economy', 'compact', 'intermediate', 'standard', 'full-size', 'premium', 'luxury', 'suv', 'minivan']),
  fuel_type: z.enum(['gasoline', 'diesel', 'hybrid', 'electric']).optional(),
  transmission: z.enum(['manual', 'automatic']).optional(),
  seats: z.number().int().min(1).max(15).optional(),
  doors: z.number().int().min(2).max(5).optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  status: z.enum(['active', 'inactive', 'maintenance']).default('active')
});

/**
 * Agency schema
 */
export const agencySchema = z.object({
  business_name: z.string().min(1).max(100),
  business_email: emailSchema,
  business_phone: phoneSchema,
  contact_name: nameSchema,
  address: z.string().min(1).max(200),
  city: z.string().min(1).max(50),
  country: z.string().min(1).max(50),
  description: z.string().max(1000).optional(),
  website: z.string().url().optional(),
  license_number: z.string().max(50).optional()
});

/**
 * Validation wrapper function
 */
export function validateInput(schema, data) {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));
      
      throw new Error(JSON.stringify({
        name: 'ZodError',
        message: 'Validation failed',
        errors: formattedErrors
      }));
    }
    throw error;
  }
}

/**
 * Middleware for request validation
 */
export function validateRequest(schema) {
  return async (request) => {
    try {
      const body = await request.json();
      const validatedData = schema.parse(body);
      
      // Attach validated data to request for use in handler
      request.validatedData = validatedData;
      return validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(JSON.stringify({
          name: 'ZodError',
          message: 'Invalid input data',
          errors: error.errors
        }));
      }
      throw error;
    }
  };
}
