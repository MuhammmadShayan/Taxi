// Edge Runtime compatible JWT implementation using Web Crypto API
// This replaces jsonwebtoken for middleware usage

const DEFAULT_SECRET = 'holikey_secret_change_in_production';

// Base64 URL encoding/decoding functions
function base64UrlEncode(input) {
  let binary = '';
  
  if (input instanceof ArrayBuffer || input instanceof Uint8Array) {
    const bytes = new Uint8Array(input);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
  } else if (typeof input === 'string') {
    binary = input;
  } else {
    // Handle the case where input might be a TextEncoder result
    const bytes = new Uint8Array(input);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
  }
  
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64UrlDecode(str) {
  // Add padding if needed
  str += '='.repeat((4 - str.length % 4) % 4);
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  
  try {
    const decoded = atob(str);
    return new Uint8Array(decoded.split('').map(char => char.charCodeAt(0)));
  } catch (error) {
    throw new Error('Invalid base64 string');
  }
}

function stringToUint8Array(str) {
  return new TextEncoder().encode(str);
}

function uint8ArrayToString(array) {
  return new TextDecoder().decode(array);
}

// Generate HMAC signature using Web Crypto API
async function sign(message, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    stringToUint8Array(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    stringToUint8Array(message)
  );
  
  return base64UrlEncode(signature);
}

// Verify HMAC signature using Web Crypto API
async function verify(message, signature, secret) {
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      stringToUint8Array(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signatureBytes = base64UrlDecode(signature);
    
    return await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      stringToUint8Array(message)
    );
  } catch (error) {
    return false;
  }
}

// Sign JWT token
export async function signJWT(payload, secret = null) {
  const jwtSecret = secret || process.env.JWT_SECRET || DEFAULT_SECRET;
  
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = {
    ...payload,
    iat: now,
    exp: now + (7 * 24 * 60 * 60) // 7 days
  };
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload));
  
  const message = `${encodedHeader}.${encodedPayload}`;
  const signature = await sign(message, jwtSecret);
  
  return `${message}.${signature}`;
}

// Verify JWT token
export async function verifyJWT(token, secret = null) {
  try {
    const jwtSecret = secret || process.env.JWT_SECRET || DEFAULT_SECRET;
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const [encodedHeader, encodedPayload, signature] = parts;
    const message = `${encodedHeader}.${encodedPayload}`;
    
    // Verify signature
    const isValid = await verify(message, signature, jwtSecret);
    if (!isValid) {
      throw new Error('Invalid signature');
    }
    
    // Decode payload
    const payloadBytes = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(uint8ArrayToString(payloadBytes));
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token expired');
    }
    
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

// Edge-compatible session signing function
export async function signSessionEdge(user, additionalData = {}) {
  const payload = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    user_type: user.user_type,
    role: user.user_type, // alias for compatibility
    ...additionalData
  };
  
  return await signJWT(payload);
}

// Edge-compatible session verification function
export async function verifySessionTokenEdge(token) {
  if (!token) {
    return null;
  }
  return await verifyJWT(token);
}
