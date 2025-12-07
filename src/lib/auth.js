import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { User } from '../models/User.js';

const DEFAULT_SECRET = 'holikey_secret_change_in_production';

// HOLIKEY Platform User Roles (updated to match database schema)
export const USER_ROLES = {
  ADMIN: 'admin',
  AGENCY: 'agency_admin', 
  CLIENT: 'client',
  DRIVER: 'driver'
};

// Role permissions mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    'manage_agencies',
    'manage_clients', 
    'manage_vehicles',
    'manage_reservations',
    'view_reports',
    'system_settings'
  ],
  [USER_ROLES.AGENCY]: [
    'manage_own_vehicles',
    'manage_own_reservations', 
    'view_own_clients',
    'update_own_profile',
    'view_own_reports'
  ],
  [USER_ROLES.CLIENT]: [
    'search_vehicles',
    'make_reservations',
    'view_own_reservations',
    'update_own_profile',
    'cancel_reservations'
  ],
  [USER_ROLES.DRIVER]: [
    'view_assigned_trips',
    'update_trip_status',
    'update_own_profile'
  ]
};

export function signSession(user, additionalData = {}) {
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
  const payload = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    user_type: user.user_type,
    role: user.user_type, // alias for compatibility
    permissions: ROLE_PERMISSIONS[user.user_type] || [],
    ...additionalData,
    iat: Math.floor(Date.now() / 1000)
  };
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifySessionToken(token) {
  try {
    const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (e) {
    console.error('Token verification failed:', e.message);
    return null;
  }
}

// Get current user session from cookies
export async function getCurrentSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('holikey_session')?.value;
    
    if (!token) {
      return null;
    }
    
    const session = verifySessionToken(token);
    return session;
  } catch (error) {
    console.error('Session retrieval failed:', error.message);
    return null;
  }
}

// Compatibility alias for existing routes
export async function getSession() {
  return await getCurrentSession();
}

// Check if user has specific permission
export function hasPermission(user, permission) {
  if (!user || !user.user_type) {
    return false;
  }
  
  const userPermissions = ROLE_PERMISSIONS[user.user_type] || [];
  return userPermissions.includes(permission);
}

// Role-based access control middleware
export function requireRole(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || 
                   req.cookies?.holikey_session;
      
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const user = verifySessionToken(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.user_type)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      req.user = user;
      if (next) next();
      return user;
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Authentication error' });
    }
  };
}

// Check if user is admin
export function isAdmin(user) {
  return user?.user_type === USER_ROLES.ADMIN;
}

// Check if user is agency
export function isAgency(user) {
  return user?.user_type === USER_ROLES.AGENCY;
}

// Check if user is client
export function isClient(user) {
  return user?.user_type === USER_ROLES.CLIENT;
}

// Generate agency-specific session data
export function signAgencySession(user, agencyData) {
  return signSession(user, {
    agency_id: agencyData?.id,
    agency_name: agencyData?.name,
    agency_status: agencyData?.status
  });
}

// Refresh session with updated data
export function refreshSession(currentSession, updates = {}) {
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
  const payload = {
    ...currentSession,
    ...updates,
    iat: Math.floor(Date.now() / 1000)
  };
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}
// Session validation for API routes
export async function validateApiSession(req) {
  const token = req.headers.authorization?.replace('Bearer ', '') || 
               req.cookies?.holikey_session;
  
  if (!token) {
    return { error: 'Authentication required', status: 401 };
  }
  
  const user = verifySessionToken(token);
  if (!user) {
    return { error: 'Invalid or expired session', status: 401 };
  }
  
  return { user, status: 200 };
}

// Get user role display name
export function getRoleDisplayName(role) {
  const roleNames = {
    [USER_ROLES.ADMIN]: 'Administrator',
    [USER_ROLES.AGENCY]: 'Agency Partner',
    [USER_ROLES.CLIENT]: 'Client',
    [USER_ROLES.DRIVER]: 'Driver'
  };
  return roleNames[role] || 'Unknown';
}

// Verify token and return user data for chat API
export async function verifyToken(token) {
  try {
    if (!token) {
      return null;
    }

    const decoded = verifySessionToken(token);
    if (!decoded) {
      return null;
    }

    // Return user data in the format expected by chat API
    return {
      user_id: decoded.id,
      email: decoded.email,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      role: mapRoleForChat(decoded.user_type),
      user_type: decoded.user_type,
      permissions: decoded.permissions || []
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Map role from user_type to chat API expected format
function mapRoleForChat(userType) {
  const roleMapping = {
    'admin': 'admin',
    'agency_admin': 'agency_owner',
    'agency_owner': 'agency_owner',
    'client': 'customer',
    'customer': 'customer',
    'driver': 'customer'
  };
  return roleMapping[userType] || 'customer';
}


