import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { AuthenticationError, AuthorizationError } from './errorHandler.js';
import { query } from './database.js';

/**
 * JWT Configuration
 */
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

if (!JWT_SECRET) {
  console.error('⚠️ JWT_SECRET environment variable is not set!');
}

/**
 * Generate JWT token for user
 */
export function generateToken(user) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }

  const payload = {
    user_id: user.user_id,
    email: user.email,
    role: user.role,
    status: user.status
  };

  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'kirastay-platform',
    subject: user.user_id.toString()
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
  if (!JWT_SECRET) {
    throw new AuthenticationError('JWT not configured');
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid token');
    } else {
      throw new AuthenticationError('Token verification failed');
    }
  }
}

/**
 * Extract token from request headers
 */
export function extractToken(request) {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies (if using cookie-based auth)
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/);
    if (tokenMatch) {
      return tokenMatch[1];
    }
  }

  return null;
}

/**
 * Get user information from database
 */
export async function getUserById(userId) {
  try {
    const users = await query(
      'SELECT user_id, email, role, status, first_name, last_name FROM users WHERE user_id = ? AND status = ?',
      [userId, 'active']
    );

    if (users.length === 0) {
      throw new AuthenticationError('User not found or inactive');
    }

    return users[0];
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError('Failed to verify user');
  }
}

/**
 * Authentication middleware - requires valid JWT
 */
export function requireAuth(handler) {
  return async (request, context) => {
    try {
      const token = extractToken(request);
      
      if (!token) {
        throw new AuthenticationError('Authentication token required');
      }

      // Verify token
      const decoded = verifyToken(token);
      
      // Get fresh user data from database
      const user = await getUserById(decoded.user_id);
      
      // Attach user to request
      request.user = user;
      
      return await handler(request, context);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return NextResponse.json({
          success: false,
          error: {
            type: 'AuthenticationError',
            message: error.message
          }
        }, { status: 401 });
      }
      
      console.error('Authentication middleware error:', error);
      return NextResponse.json({
        success: false,
        error: {
          type: 'AuthenticationError',
          message: 'Authentication failed'
        }
      }, { status: 401 });
    }
  };
}

/**
 * Role-based authorization middleware
 */
export function requireRole(roles) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return function(handler) {
    return requireAuth(async (request, context) => {
      const userRole = request.user.role;
      
      if (!roles.includes(userRole)) {
        throw new AuthorizationError(`Access denied. Required role(s): ${roles.join(', ')}`);
      }
      
      return await handler(request, context);
    });
  };
}

/**
 * Admin-only middleware
 */
export function requireAdmin(handler) {
  return requireRole(['admin'])(handler);
}

/**
 * Agency or Admin middleware
 */
export function requireAgencyOrAdmin(handler) {
  return requireRole(['agency', 'admin'])(handler);
}

/**
 * Customer authentication (less strict - for customer-facing APIs)
 */
export function requireCustomer(handler) {
  return requireRole(['customer', 'agency', 'admin'])(handler);
}

/**
 * Optional authentication - doesn't fail if no token provided
 */
export function optionalAuth(handler) {
  return async (request, context) => {
    try {
      const token = extractToken(request);
      
      if (token) {
        const decoded = verifyToken(token);
        const user = await getUserById(decoded.user_id);
        request.user = user;
      }
      
      return await handler(request, context);
    } catch (error) {
      // Ignore auth errors for optional auth
      console.log('Optional auth failed (ignored):', error.message);
      return await handler(request, context);
    }
  };
}

/**
 * Check if user owns resource or is admin
 */
export function requireOwnershipOrAdmin(getResourceOwnerId) {
  return function(handler) {
    return requireAuth(async (request, context) => {
      const user = request.user;
      
      // Admin can access everything
      if (user.role === 'admin') {
        return await handler(request, context);
      }
      
      // Get resource owner ID
      const ownerId = await getResourceOwnerId(request, context);
      
      if (user.user_id !== ownerId) {
        throw new AuthorizationError('Access denied. You can only access your own resources.');
      }
      
      return await handler(request, context);
    });
  };
}

/**
 * Refresh token (for future implementation)
 */
export function generateRefreshToken(user) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }

  const payload = {
    user_id: user.user_id,
    type: 'refresh'
  };

  return jwt.sign(payload, JWT_SECRET + '_refresh', { 
    expiresIn: '7d' // Refresh tokens last longer
  });
}

/**
 * Rate limiting helpers
 */
const requestCounts = new Map();

export function checkRateLimit(identifier, maxRequests = 100, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!requestCounts.has(identifier)) {
    requestCounts.set(identifier, []);
  }
  
  const requests = requestCounts.get(identifier);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  
  if (validRequests.length >= maxRequests) {
    throw new AuthenticationError('Rate limit exceeded. Please try again later.');
  }
  
  // Add current request
  validRequests.push(now);
  requestCounts.set(identifier, validRequests);
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance
    for (const [key, timestamps] of requestCounts.entries()) {
      const filtered = timestamps.filter(ts => ts > windowStart);
      if (filtered.length === 0) {
        requestCounts.delete(key);
      } else {
        requestCounts.set(key, filtered);
      }
    }
  }
}

/**
 * Rate limiting middleware
 */
export function rateLimit(options = {}) {
  const { maxRequests = 100, windowMs = 15 * 60 * 1000, keyGenerator } = options;

  return function(handler) {
    return async (request, context) => {
      try {
        // Generate rate limit key
        const identifier = keyGenerator 
          ? keyGenerator(request) 
          : request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        
        checkRateLimit(identifier, maxRequests, windowMs);
        
        return await handler(request, context);
      } catch (error) {
        if (error instanceof AuthenticationError && error.message.includes('Rate limit')) {
          return NextResponse.json({
            success: false,
            error: {
              type: 'RateLimitError',
              message: error.message
            }
          }, { status: 429 });
        }
        throw error;
      }
    };
  };
}
