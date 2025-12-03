import mysql from 'mysql2/promise';

let connection;

export async function getConnection() {
  if (!connection) {
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'my_travel_app',
        timezone: '+00:00',
        dateStrings: true,
        supportBigNumbers: true,
        bigNumberStrings: true
      });
      
      console.log('✅ Connected to HOLIKEY MySQL database');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }
  return connection;
}

// Enhanced connection pool with monitoring
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'my_travel_app',
  waitForConnections: true,
  connectionLimit: 20, // Increased from 10
  queueLimit: 0,
  idleTimeout: 300000, // 5 minutes - valid timeout option
  timezone: '+00:00',
  dateStrings: true,
  supportBigNumbers: true,
  bigNumberStrings: true
});

// Connection monitoring (reduced logging for development)
pool.on('connection', (connection) => {
  if (process.env.NODE_ENV !== 'development') {
    console.log('🔗 New DB connection established:', connection.threadId);
  }
});

pool.on('error', (err) => {
  console.error('💥 Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Attempting to reconnect to database...');
  }
});

// Only log connection acquire/release in non-development or when debugging
if (process.env.DEBUG_DB_CONNECTIONS === 'true') {
  pool.on('acquire', (connection) => {
    console.log('📤 Connection acquired:', connection.threadId);
  });
  
  pool.on('release', (connection) => {
    console.log('📥 Connection released:', connection.threadId);
  });
}

// Track connection pool stats
let poolStats = {
  totalConnections: 0,
  activeConnections: 0,
  queuedRequests: 0,
  lastStatsUpdate: Date.now()
};

export async function query(sql, values = []) {
  try {
    const [rows] = await pool.execute(sql, values);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function beginTransaction() {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
}

export async function commitTransaction(connection) {
  await connection.commit();
  connection.release();
}

export async function rollbackTransaction(connection) {
  await connection.rollback();
  connection.release();
}
export async function getDbPool() {
  return await pool.getConnection();
}

/**
 * Get current pool status for monitoring
 */
export function getPoolStatus() {
  const poolInfo = {
    connectionLimit: 20,
    connectionsCreated: pool._allConnections ? pool._allConnections.length : 0,
    connectionsAcquired: pool._acquiredConnections ? pool._acquiredConnections.length : 0,
    connectionsFree: pool._freeConnections ? pool._freeConnections.length : 0,
    connectionsQueued: pool._connectionQueue ? pool._connectionQueue.length : 0,
    timestamp: new Date().toISOString()
  };
  
  // Update stats
  poolStats = {
    ...poolStats,
    totalConnections: poolInfo.connectionsCreated,
    activeConnections: poolInfo.connectionsAcquired,
    queuedRequests: poolInfo.connectionsQueued,
    lastStatsUpdate: Date.now()
  };
  
  return poolInfo;
}

/**
 * Health check for database connection
 */
export async function healthCheck() {
  try {
    const startTime = Date.now();
    await pool.execute('SELECT 1 as health_check');
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      pool: getPoolStatus(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      pool: getPoolStatus(),
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Safe query with automatic retry on connection loss
 */
export async function safeQuery(sql, values = [], maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const [rows] = await pool.execute(sql, values);
      
      if (attempt > 1) {
        console.log(`✅ Query succeeded on attempt ${attempt}`);
      }
      
      return rows;
    } catch (error) {
      lastError = error;
      
      if (error.code === 'PROTOCOL_CONNECTION_LOST' && attempt < maxRetries) {
        console.log(`🔄 Connection lost, retrying... (${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        continue;
      }
      
      console.error(`Database query error (attempt ${attempt}):`, error);
      throw error;
    }
  }
  
  throw lastError;
}

/**
 * Graceful shutdown
 */
export async function closePool() {
  try {
    await pool.end();
    console.log('🔚 Database pool closed gracefully');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
}

// Log pool status periodically in development
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const status = getPoolStatus();
    if (status.connectionsAcquired > 15) { // Alert if high usage
      console.warn('⚠️ High database connection usage:', status);
    }
  }, 30000); // Every 30 seconds
}

export default pool;
