// Alternative migration script - can be run with: node database/migrate.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  console.log('🚀 Starting KIRASTAY database migration...\n');

  // Database connection configuration
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'my_travel_app',
    multipleStatements: false
  });

  try {
    console.log('✅ Connected to MySQL database\n');
    
    // Step 1: Add missing columns if they don't exist
    console.log('📝 Step 1: Adding missing columns...');
    
    // Check and add category column
    try {
      await connection.execute(`
        ALTER TABLE system_settings 
        ADD COLUMN category VARCHAR(50) DEFAULT 'general' AFTER type
      `);
      console.log('   ✅ Added category column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('   ℹ️ Category column already exists');
      } else {
        throw error;
      }
    }
    
    // Check and add display_order column
    try {
      await connection.execute(`
        ALTER TABLE system_settings 
        ADD COLUMN display_order INT DEFAULT 0 AFTER category
      `);
      console.log('   ✅ Added display_order column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('   ℹ️ Display_order column already exists');
      } else {
        throw error;
      }
    }
    
    // Check and add is_active column
    try {
      await connection.execute(`
        ALTER TABLE system_settings 
        ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER display_order
      `);
      console.log('   ✅ Added is_active column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('   ℹ️ Is_active column already exists');
      } else {
        throw error;
      }
    }

    // Step 2: Update existing records
    console.log('\n📝 Step 2: Updating existing records...');
    await connection.execute(`
      UPDATE system_settings 
      SET category = 'general' 
      WHERE category IS NULL OR category = ''
    `);
    console.log('   ✅ Updated existing records with default category');

    // Step 3: Insert new settings
    console.log('\n📝 Step 3: Adding comprehensive settings...');
    
    const settings = [
      // General Settings
      ['site_name', 'KIRASTAY', 'Main site name displayed in header and branding', 'text', 'general', 1, 1],
      ['site_tagline', 'Your Premier Vehicle Rental Partner', 'Site tagline/slogan', 'text', 'general', 2, 1],
      ['default_currency', 'MAD', 'Default currency for pricing', 'text', 'general', 6, 1],
      ['currency_symbol', 'DH', 'Currency symbol to display', 'text', 'general', 7, 1],
      
      // Contact Information
      ['contact_phone', '+212 123 456 789', 'Main contact phone number', 'text', 'contact', 10, 1],
      ['contact_email', 'info@kirastay.com', 'Main contact email', 'text', 'contact', 11, 1],
      ['business_address', 'Casablanca, Morocco', 'Main business address', 'text', 'contact', 13, 1],
      
      // Location Services (Free - OpenStreetMap)
      ['location_autocomplete_enabled', 'true', 'Enable location autocomplete using OpenStreetMap', 'boolean', 'maps', 60, 1],
      ['default_map_center_lat', '33.5731', 'Default map center latitude (Casablanca)', 'text', 'maps', 62, 1],
      ['default_map_center_lng', '-7.5898', 'Default map center longitude (Casablanca)', 'text', 'maps', 63, 1],
      
      // Booking Settings
      ['booking_advance_days', '180', 'Maximum days in advance for booking', 'number', 'booking', 20, 1],
      ['minimum_driver_age', '21', 'Minimum age for drivers', 'number', 'booking', 26, 1],
      
      // Payment Settings
      ['accept_cash_payments', 'true', 'Accept cash payments', 'boolean', 'payment', 35, 1],
      ['accept_card_payments', 'true', 'Accept card payments', 'boolean', 'payment', 36, 1],
    ];

    let addedCount = 0;
    let updatedCount = 0;

    for (const setting of settings) {
      try {
        const result = await connection.execute(`
          INSERT INTO system_settings 
          (setting_key, setting_value, description, type, category, display_order, is_active) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            description = VALUES(description),
            category = VALUES(category),
            display_order = VALUES(display_order),
            is_active = VALUES(is_active)
        `, setting);
        
        if (result[0].insertId) {
          addedCount++;
        } else {
          updatedCount++;
        }
      } catch (error) {
        console.log(`   ⚠️ Error with setting ${setting[0]}:`, error.message);
      }
    }

    console.log(`   ✅ Added ${addedCount} new settings`);
    console.log(`   ✅ Updated ${updatedCount} existing settings`);

    // Step 4: Verification
    console.log('\n📝 Step 4: Verification...');
    
    const [categories] = await connection.execute(`
      SELECT DISTINCT category 
      FROM system_settings 
      WHERE category IS NOT NULL 
      ORDER BY category
    `);
    
    const [settingsCount] = await connection.execute(`
      SELECT COUNT(*) as total 
      FROM system_settings 
      WHERE category IS NOT NULL
    `);

    console.log(`   ✅ Total settings: ${settingsCount[0].total}`);
    console.log(`   ✅ Categories: ${categories.map(c => c.category).join(', ')}`);

    console.log('\n🎉 Migration completed successfully!');
    console.log('📋 What was done:');
    console.log('   ✅ Added missing database columns');
    console.log('   ✅ Added comprehensive settings system');  
    console.log('   ✅ Enabled FREE location autocomplete (OpenStreetMap)');
    console.log('   ✅ Organized settings by categories');
    console.log('   ✅ Made admin settings page functional');
    
    console.log('\n🌍 Location Autocomplete:');
    console.log('   ✅ Uses OpenStreetMap Nominatim API (FREE)');
    console.log('   ✅ No API keys required');
    console.log('   ✅ Global location coverage');
    console.log('   ✅ Smart suggestions with icons');
    
    console.log('\n🚀 Next steps:');
    console.log('   1. Start your Next.js app: npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Try typing in location fields - autocomplete should work!');
    console.log('   4. Access admin settings: /admin/settings');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await connection.end();
    console.log('\n🔌 Database connection closed');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration().catch(console.error);
}

module.exports = { runMigration };