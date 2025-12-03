#!/usr/bin/env node

/**
 * Fix User Passwords Script for KIRASTAY
 * 
 * This script fixes user passwords in the database by ensuring they are properly
 * bcrypt hashed instead of plain text.
 */

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// Database connection function
async function getDbConnection() {
  return await mysql.createConnection({
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
}

// Query helper function
async function query(sql, params = []) {
  const connection = await getDbConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    await connection.end();
  }
}

async function fixUserPasswords() {
  console.log('🔐 Starting password fix process...');
  
  try {
    // Get all users with potentially problematic passwords
    const users = await query('SELECT user_id, email, password_hash FROM users');
    console.log(`📊 Found ${users.length} users to check`);
    
    const updates = [];
    
    for (const user of users) {
      const { user_id, email, password_hash } = user;
      
      // Check if password is already a valid bcrypt hash
      const isBcryptHash = password_hash && (
        password_hash.startsWith('$2a$') || 
        password_hash.startsWith('$2b$') || 
        password_hash.startsWith('$2y$')
      );
      
      if (!isBcryptHash) {
        // Generate a default password based on the user type
        let defaultPassword = 'password123'; // Default password
        
        if (email === 'smartestdevelopers@gmail.com') {
          defaultPassword = 'admin123';
        } else if (email.includes('agency')) {
          defaultPassword = 'agency123';
        } else if (email.includes('user')) {
          defaultPassword = 'user123';
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(defaultPassword, 12);
        
        updates.push({
          user_id,
          email,
          old_hash: password_hash,
          new_hash: hashedPassword,
          default_password: defaultPassword
        });
      }
    }
    
    console.log(`🔧 Found ${updates.length} users needing password fixes`);
    
    if (updates.length === 0) {
      console.log('✅ All user passwords are already properly hashed');
      return;
    }
    
    // Update passwords in database
    for (const update of updates) {
      try {
        await query(
          'UPDATE users SET password_hash = ? WHERE user_id = ?',
          [update.new_hash, update.user_id]
        );
        console.log(`✅ Fixed password for: ${update.email} (default: ${update.default_password})`);
      } catch (error) {
        console.error(`❌ Failed to update ${update.email}:`, error.message);
      }
    }
    
    console.log('\n🎉 Password fix process complete!');
    console.log('\n📝 Test Login Credentials:');
    console.log('─'.repeat(50));
    
    updates.forEach(update => {
      console.log(`Email: ${update.email}`);
      console.log(`Password: ${update.default_password}`);
      console.log('─'.repeat(30));
    });
    
    // Also show existing properly hashed users
    const properUsers = users.filter(u => 
      u.password_hash && (
        u.password_hash.startsWith('$2a$') || 
        u.password_hash.startsWith('$2b$') || 
        u.password_hash.startsWith('$2y$')
      )
    );
    
    if (properUsers.length > 0) {
      console.log('\n✅ Users with existing proper hashes:');
      properUsers.forEach(user => {
        console.log(`- ${user.email}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Password fix failed:', error);
    process.exit(1);
  }
}

// Run the fix
fixUserPasswords();
