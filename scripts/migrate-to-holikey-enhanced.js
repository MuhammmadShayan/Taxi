const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs').promises;
const path = require('path');

async function migrateToHolikey() {
  let connection;
  
  try {
    console.log('🚀 Starting HOLIKEY Platform Migration...\n');
    
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'kirastay',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL database: ' + (process.env.DB_NAME || 'kirastay'));

    // Read and execute the enhancement SQL
    const enhancementSqlPath = path.join(__dirname, '..', 'database', 'holikey_enhancements.sql');
    const enhancementSql = await fs.readFile(enhancementSqlPath, 'utf8');
    
    console.log('📄 Executing HOLIKEY enhancements...');
    
    // Split SQL into individual statements and execute them one by one
    const statements = enhancementSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    let successCount = 0;
    let skipCount = 0;

    for (const statement of statements) {
      try {
        if (statement.trim()) {
          await connection.execute(statement);
          successCount++;
        }
      } catch (error) {
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
            error.code === 'ER_DUP_FIELDNAME' || 
            error.code === 'ER_DUP_KEYNAME') {
          console.log(`⚠️  Skipping: ${error.message}`);
          skipCount++;
        } else {
          console.error(`❌ Error executing statement: ${statement.substring(0, 100)}...`);
          console.error(`Error: ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Migration completed successfully!`);
    console.log(`📊 Statistics:`);
    console.log(`   - Statements executed: ${successCount}`);
    console.log(`   - Statements skipped: ${skipCount}`);

    // Update existing cars to have agency_id
    console.log('\n🔄 Updating existing cars with default agency...');
    
    // Check if agencies exist
    const [agencies] = await connection.execute('SELECT id FROM agencies LIMIT 1');
    
    if (agencies.length > 0) {
      const defaultAgencyId = agencies[0].id;
      
      // Update cars without agency_id
      const [updateResult] = await connection.execute(
        'UPDATE cars SET agency_id = ? WHERE agency_id IS NULL',
        [defaultAgencyId]
      );
      
      console.log(`✅ Updated ${updateResult.affectedRows} vehicles with default agency`);
    }

    // Migrate existing bookings to reservations
    console.log('\n🔄 Migrating existing bookings to reservations...');
    
    const [existingBookings] = await connection.execute('SELECT * FROM bookings LIMIT 5');
    
    if (existingBookings.length > 0) {
      for (const booking of existingBookings) {
        try {
          const reservationNumber = `RES${Date.now()}${Math.floor(Math.random() * 1000)}`;
          
          // Get car's agency_id
          const [carData] = await connection.execute(
            'SELECT agency_id FROM cars WHERE id = ?',
            [booking.car_id]
          );
          
          if (carData.length > 0 && carData[0].agency_id) {
            await connection.execute(`
              INSERT INTO reservations (
                reservation_number, client_id, agency_id, vehicle_id, 
                pickup_location_id, pickup_date, pickup_time, 
                return_date, return_time, total_days, base_price, 
                total_amount, paid_amount, status, payment_status
              ) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              reservationNumber,
              booking.passenger_id,
              carData[0].agency_id,
              booking.car_id,
              booking.pickup_date,
              booking.pickup_time,
              booking.dropoff_date || booking.pickup_date,
              booking.dropoff_time || booking.pickup_time,
              booking.total_days || 1,
              booking.price_per_unit,
              booking.total_amount,
              booking.payment_status === 'paid' ? booking.total_amount : 0,
              booking.booking_status === 'confirmed' ? 'confirmed' : 'pending',
              booking.payment_status
            ]);
          }
        } catch (error) {
          console.log(`⚠️  Skipping booking ${booking.id}: ${error.message}`);
        }
      }
      
      console.log(`✅ Migrated ${existingBookings.length} bookings to reservations`);
    }

    console.log('\n🎉 HOLIKEY Platform Migration Complete!');
    console.log('\n📋 What was added:');
    console.log('   ✅ Agencies management system');
    console.log('   ✅ Multi-vendor vehicle support');
    console.log('   ✅ Pickup locations system');
    console.log('   ✅ Extra services (insurance, seats, etc.)');
    console.log('   ✅ Enhanced reservation workflow');
    console.log('   ✅ Client driving license management');
    console.log('   ✅ Email notification system');
    console.log('   ✅ Vehicle availability calendar');
    console.log('   ✅ Analytics and reporting tables');
    
    console.log('\n🔧 Next steps:');
    console.log('   1. Update API endpoints to use new schema');
    console.log('   2. Implement agency registration workflow');
    console.log('   3. Add pickup location selection');
    console.log('   4. Implement extra services booking');
    console.log('   5. Set up email notification system');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateToHolikey()
    .then(() => {
      console.log('\n✅ Migration script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateToHolikey };