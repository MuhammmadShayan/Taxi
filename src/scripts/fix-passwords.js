#!/usr/bin/env node

/**
 * Utility script to fix plain text passwords in the users table
 * This script will find all users with plain text passwords and hash them properly
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

async function fixPlainTextPasswords() {
  console.log('🔍 Checking for users with plain text passwords...');
  
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'holikey',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('📡 Connected to database');
    
    // First, let's see what columns exist in the users table
    const [columns] = await connection.execute('DESCRIBE users');
    console.log('📋 Users table structure:');
    columns.forEach(col => console.log(`  - ${col.Field} (${col.Type})`));
    
    // Get all users with their passwords (adjust column names based on actual schema)
    let userQuery = 'SELECT id, email, password FROM users WHERE password IS NOT NULL AND password != ""';
    
    // Try different possible column names
    try {
      const [testUsers] = await connection.execute('SELECT user_id FROM users LIMIT 1');
      userQuery = 'SELECT user_id as id, email, password_hash as password FROM users WHERE password_hash IS NOT NULL AND password_hash != ""';
    } catch {
      // user_id doesn't exist, try other combinations
      try {
        const [testUsers] = await connection.execute('SELECT password_hash FROM users LIMIT 1');
        userQuery = 'SELECT id, email, password_hash as password FROM users WHERE password_hash IS NOT NULL AND password_hash != ""';
      } catch {
        // password_hash doesn't exist either, use password
        userQuery = 'SELECT id, email, password FROM users WHERE password IS NOT NULL AND password != ""';
      }
    }
    
    console.log(`🔍 Using query: ${userQuery}`);
    const [users] = await connection.execute(userQuery);
    
    console.log(`📊 Found ${users.length} users with passwords`);
    
    let fixedCount = 0;
    let alreadyHashedCount = 0;
    
    for (const user of users) {
      const { id, email, password } = user;
      
      // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, etc.)
      if (password.startsWith('$2a$') || password.startsWith('$2b$') || password.startsWith('$2y$')) {
        alreadyHashedCount++;
        console.log(`✅ User ${email} already has hashed password`);
        continue;
      }
      
      // This appears to be a plain text password, hash it
      console.log(`🔧 Fixing plain text password for user: ${email}`);
      
      try {
        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        
        // Determine the correct column names for update
        let updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
        if (userQuery.includes('password_hash')) {
          updateQuery = 'UPDATE users SET password_hash = ? WHERE id = ?';
        }
        if (userQuery.includes('user_id')) {
          updateQuery = updateQuery.replace('WHERE id', 'WHERE user_id');
        }
        
        await connection.execute(updateQuery, [hashedPassword, id]);
        
        fixedCount++;
        console.log(`✅ Fixed password for user: ${email}`);
        
      } catch (hashError) {
        console.error(`❌ Error fixing password for user ${email}:`, hashError.message);
      }
    }
    
    console.log('\n📈 Summary:');
    console.log(`✅ Users with properly hashed passwords: ${alreadyHashedCount}`);
    console.log(`🔧 Fixed plain text passwords: ${fixedCount}`);
    console.log(`📊 Total users processed: ${users.length}`);
    
    if (fixedCount > 0) {
      console.log('\n🎉 Password fix completed successfully!');
      console.log('📧 Consider notifying affected users to update their passwords for security.');
    } else {
      console.log('\n✨ No plain text passwords found. All passwords are properly hashed!');
    }
    
  } catch (error) {
    console.error('❌ Error fixing passwords:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script
fixPlainTextPasswords().then(() => {
  console.log('✅ Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
