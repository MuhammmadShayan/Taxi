import { NextResponse } from 'next/server';

/**
 * Custom Application Error class for operational errors
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Database specific errors
 */
export class DatabaseError extends AppError {
  constructor(message, originalError = null) {
    super(message, 500, true);
    this.name = 'DatabaseError';
    this.originalError = originalError;
  }
}

/**
 * Validation specific errors
 */
export class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400, true);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Authentication specific errors
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, true);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization specific errors
 */
export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, true);
    this.name = 'AuthorizationError';
  }
}

/**
 * Resource not found errors
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, true);
    this.name = 'NotFoundError';
  }
}

/**
 * Centralized API error handler
 */
export function handleAPIError(error, context = {}) {
  // Log error with context
  console.error('API Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context
  });

  // Handle custom app errors
  if (error instanceof AppError) {
    return NextResponse.json({
      success: false,
      error: {
        type: error.name,
        message: error.message,
        ...(error.field && { field: error.field })
      }
    }, { status: error.statusCode });
  }

  // Handle MySQL specific errors
  if (error.code) {
    switch (error.code) {
      case 'ER_DUP_ENTRY':
        return NextResponse.json({
          success: false,
          error: {
            type: 'DuplicateError',
            message: 'Resource already exists'
          }
        }, { status: 409 });
        
      case 'ER_NO_REFERENCED_ROW_2':
        return NextResponse.json({
          success: false,
          error: {
            type: 'ReferenceError',
            message: 'Referenced resource does not exist'
          }
        }, { status: 400 });
        
      case 'ER_BAD_NULL_ERROR':
        return NextResponse.json({
          success: false,
          error: {
            type: 'ValidationError',
            message: 'Required field cannot be null'
          }
        }, { status: 400 });
        
      case 'ECONNREFUSED':
        return NextResponse.json({
          success: false,
          error: {
            type: 'DatabaseConnectionError',
            message: 'Database connection failed'
          }
        }, { status: 503 });
        
      default:
        console.error('Unhandled database error:', error.code, error.sqlMessage);
    }
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && error.message.includes('JSON')) {
    return NextResponse.json({
      success: false,
      error: {
        type: 'InvalidJSON',
        message: 'Invalid JSON in request body'
      }
    }, { status: 400 });
  }

  // Handle validation errors from libraries like Zod
  if (error.name === 'ZodError') {
    return NextResponse.json({
      success: false,
      error: {
        type: 'ValidationError',
        message: 'Invalid input data',
        details: error.errors
      }
    }, { status: 400 });
  }

  // Default server error for unknown errors
  return NextResponse.json({
    success: false,
    error: {
      type: 'InternalServerError',
      message: 'An unexpected error occurred'
    }
  }, { status: 500 });
}

/**
 * Async wrapper for API route handlers with automatic error handling
 */
export function withErrorHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleAPIError(error, {
        url: request.url,
        method: request.method,
        userAgent: request.headers.get('user-agent')
      });
    }
  };
}

/**
 * Database operation wrapper with error handling
 */
export async function safeDbOperation(operation, errorMessage = 'Database operation failed') {
  try {
    return await operation();
  } catch (error) {
    if (error.code) {
      throw new DatabaseError(`${errorMessage}: ${error.sqlMessage || error.message}`, error);
    }
    throw new DatabaseError(errorMessage, error);
  }
}

/**
 * Validation helper
 */
export function validateRequired(data, requiredFields) {
  const missing = requiredFields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new ValidationError(`Missing required fields: ${missing.join(', ')}`);
  }
}

/**
 * Email validation helper
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', 'email');
  }
}

/**
 * Date validation helper
 */
export function validateDate(dateString, fieldName) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new ValidationError(`Invalid date format for ${fieldName}`, fieldName);
  }
  return date;
}

/**
 * ID validation helper
 */
export function validateId(id, fieldName = 'id') {
  const numId = parseInt(id);
  if (isNaN(numId) || numId <= 0) {
    throw new ValidationError(`Invalid ${fieldName}`, fieldName);
  }
  return numId;
}
