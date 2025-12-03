import mysql from 'mysql2/promise';

let connection;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'my_travel_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  reconnect: true,
  acquireTimeout: 60000,
  timeout: 60000,
};

// Create connection pool
function getConnection() {
  if (!connection) {
    connection = mysql.createPool(dbConfig);
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
