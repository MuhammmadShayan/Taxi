import mysql from 'mysql2/promise';

let connection;

// Build configuration from envs or DATABASE_URL
function buildConfig() {
  const url = process.env.DATABASE_URL;
  if (url) {
    try {
      const u = new URL(url);
      const cfg = {
        host: u.hostname,
        user: decodeURIComponent(u.username),
        password: decodeURIComponent(u.password),
        database: u.pathname.replace(/^\//, ''),
        port: Number(u.port || 3306),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true,
      };
      if (process.env.DB_SSL === 'true') {
        cfg.ssl = {};
      }
      return cfg;
    } catch (e) {
      console.error('Invalid DATABASE_URL, falling back to discrete envs:', e.message);
    }
  }
  const cfg = {
    host: process.env.DB_HOST || 'webhosting2026.is.cc',
    user: process.env.DB_USER || 'smartes_my_travel_app',
    password: process.env.DB_PASSWORD || 'my_travel_app_2025',
    database: process.env.DB_NAME || 'smartes_my_travel_app',
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
  };
  if (process.env.DB_SSL === 'true') {
    cfg.ssl = {};
  }
  return cfg;
}

// Create connection pool
function getConnection() {
  if (!connection) {
    connection = mysql.createPool(buildConfig());
  }
  return connection;
}

// Execute query function
export async function query(sql, params = []) {
  const conn = getConnection();
  try {
    const [results] = await conn.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Close connection
export async function closeConnection() {
  if (connection) {
    await connection.end();
    connection = null;
  }
}

// Test connection
export async function testConnection() {
  try {
    const result = await query('SELECT 1 as test');
    console.log('Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Expose pool for routes expecting getDbPool
export function getDbPool() {
  return getConnection();
}

// Health check utility
export async function healthCheck() {
  const start = Date.now();
  try {
    await query('SELECT 1 as ok');
    const responseTime = Date.now() - start;
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error?.message,
    };
  }
}

// Basic pool status info
export function getPoolStatus() {
  const conn = getConnection();
  return {
    type: 'mysql2/promise',
    // Connection pool from mysql2 doesn't expose counts consistently; provide minimal info
    available: !!conn,
  };
}
