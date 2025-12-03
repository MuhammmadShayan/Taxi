// Test database connection
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'my_travel_app',
  port: parseInt(process.env.DB_PORT || '3306')
};

console.log('🔍 Testing database connection...');
console.log('📋 Database config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port,
  password: dbConfig.password ? '***hidden***' : '(empty)'
});

async function testConnection() {
  let connection;
  try {
    console.log('\n🔌 Attempting to connect to MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Successfully connected to MySQL!');

    // Test query
    console.log('\n📊 Testing query...');
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query successful:', rows);

    // Check if database exists
    console.log('\n🗄️  Checking database...');
    const [databases] = await connection.execute('SHOW DATABASES LIKE ?', [dbConfig.database]);
    if (databases.length > 0) {
      console.log('✅ Database exists:', dbConfig.database);
    } else {
      console.log('❌ Database does not exist:', dbConfig.database);
      console.log('💡 Please create the database using:');
      console.log(`   CREATE DATABASE ${dbConfig.database};`);
    }

    // Check users table
    console.log('\n👥 Checking users table...');
    try {
      const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
      if (tables.length > 0) {
        console.log('✅ Users table exists');
        
        // Count users
        const [count] = await connection.execute('SELECT COUNT(*) as count FROM users');
        console.log(`📊 Total users in database: ${count[0].count}`);
      } else {
        console.log('❌ Users table does not exist');
        console.log('💡 Please run database migrations');
      }
    } catch (tableError) {
      console.log('❌ Error checking users table:', tableError.message);
    }

    console.log('\n✅ All tests passed!');
    return true;
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Make sure MySQL server is running');
      console.log('2. Check if port 3306 is correct');
      console.log('3. Verify firewall settings');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Check username and password in .env.local');
      console.log('2. Verify MySQL user has proper permissions');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Database does not exist');
      console.log(`2. Create it with: CREATE DATABASE ${dbConfig.database};`);
    }
    
    return false;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
