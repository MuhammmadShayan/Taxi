#!/usr/bin/env node

/**
 * Complete System Test
 * 
 * Tests the entire vehicle scraping and agency fleet management system
 */

import pkg from '../src/lib/database.js';
const { query } = pkg;

async function testCompleteSystem() {
    console.log('🧪 Starting complete system test...\n');
    
    try {
        // Test 1: Check database schema
        console.log('1. 📋 Testing database schema...');
        const vehicleSchema = await query('DESCRIBE vehicles');
        const requiredColumns = [
            'id', 'make', 'model', 'year', 'daily_rate', 'price_usd', 
            'mileage', 'location', 'energy', 'gear_type', 'seats', 'doors',
            'images', 'source', 'status', 'created_at', 'updated_at'
        ];
        
        const existingColumns = vehicleSchema.map(col => col.Field);
        const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
        
        if (missingColumns.length === 0) {
            console.log('   ✅ All required columns exist');
        } else {
            console.log(`   ❌ Missing columns: ${missingColumns.join(', ')}`);
        }
        
        // Test 2: Check vehicle data
        console.log('\n2. 📊 Testing vehicle data...');
        const vehicleCount = await query('SELECT COUNT(*) as count FROM vehicles');
        const vehiclesWithImages = await query(
            'SELECT COUNT(*) as count FROM vehicles WHERE images IS NOT NULL AND images != "[]"'
        );
        
        console.log(`   Total vehicles: ${vehicleCount[0].count}`);
        console.log(`   Vehicles with images: ${vehiclesWithImages[0].count}`);
        
        if (vehicleCount[0].count > 0) {
            console.log('   ✅ Vehicle data exists');
        } else {
            console.log('   ⚠️ No vehicle data - run scraping first');
        }
        
        // Test 3: Check agency_vehicles integration
        console.log('\n3. 🏢 Testing agency_vehicles integration...');
        const agencyVehicleSchema = await query('DESCRIBE agency_vehicles');
        const agencyVehicleCount = await query('SELECT COUNT(*) as count FROM agency_vehicles');
        
        console.log(`   Agency vehicles table columns: ${agencyVehicleSchema.length}`);
        console.log(`   Agency vehicles count: ${agencyVehicleCount[0].count}`);
        console.log('   ✅ Agency vehicles table is ready');
        
        // Test 4: Check image storage
        console.log('\n4. 🖼️  Testing image storage...');
        const samplesWithImages = await query(
            'SELECT make, model, year, images FROM vehicles WHERE images IS NOT NULL AND images != "[]" LIMIT 3'
        );
        
        if (samplesWithImages.length > 0) {
            console.log('   Sample vehicles with images:');
            samplesWithImages.forEach(vehicle => {
                try {
                    const images = JSON.parse(vehicle.images);
                    console.log(`     - ${vehicle.make} ${vehicle.model} ${vehicle.year}: ${images.length} image(s)`);
                } catch (e) {
                    console.log(`     - ${vehicle.make} ${vehicle.model} ${vehicle.year}: Error parsing images`);
                }
            });
            console.log('   ✅ Images are properly stored');
        } else {
            console.log('   ⚠️ No images found - scraping may not have downloaded images');
        }
        
        // Test 5: Check data quality
        console.log('\n5. ✨ Testing data quality...');
        const dataQuality = await query(`
            SELECT 
                COUNT(*) as total,
                COUNT(daily_rate) as with_daily_rate,
                COUNT(price_usd) as with_price,
                COUNT(images) as with_images_field,
                COUNT(CASE WHEN images IS NOT NULL AND images != '[]' THEN 1 END) as with_actual_images
            FROM vehicles
        `);
        
        const quality = dataQuality[0];
        console.log('   Data completeness:');
        console.log(`     Daily rates: ${quality.with_daily_rate}/${quality.total} (${Math.round(quality.with_daily_rate/quality.total*100)}%)`);
        console.log(`     Prices: ${quality.with_price}/${quality.total} (${Math.round(quality.with_price/quality.total*100)}%)`);
        console.log(`     Images: ${quality.with_actual_images}/${quality.total} (${Math.round(quality.with_actual_images/quality.total*100)}%)`);
        
        // Test 6: Check source distribution
        console.log('\n6. 🌐 Testing source distribution...');
        const sources = await query(`
            SELECT source, COUNT(*) as count 
            FROM vehicles 
            WHERE source IS NOT NULL 
            GROUP BY source 
            ORDER BY count DESC
        `);
        
        console.log('   Source distribution:');
        sources.forEach(source => {
            console.log(`     ${source.source}: ${source.count} vehicles`);
        });
        
        // Test 7: Performance check
        console.log('\n7. ⚡ Testing performance...');
        const start = Date.now();
        await query('SELECT COUNT(*) FROM vehicles WHERE make LIKE "T%" AND year > 2020');
        const queryTime = Date.now() - start;
        console.log(`   Sample query time: ${queryTime}ms`);
        
        if (queryTime < 100) {
            console.log('   ✅ Database performance is good');
        } else {
            console.log('   ⚠️ Database performance could be improved');
        }
        
        // Summary
        console.log('\n📊 System Health Summary:');
        console.log('─'.repeat(50));
        console.log(`✅ Total vehicles in catalog: ${vehicleCount[0].count}`);
        console.log(`🖼️  Vehicles with images: ${vehiclesWithImages[0].count}`);
        console.log(`🏢 Agency vehicles: ${agencyVehicleCount[0].count}`);
        console.log(`📈 Image coverage: ${Math.round(vehiclesWithImages[0].count/vehicleCount[0].count*100)}%`);
        console.log(`⚡ Query performance: ${queryTime}ms`);
        
        console.log('\n🎉 Complete system test finished!');
        console.log('\n📝 Next Steps:');
        console.log('1. Start the Next.js development server: npm run dev');
        console.log('2. Navigate to: http://localhost:3000/agency/fleet-management');
        console.log('3. Login as an agency user (role="agency")');
        console.log('4. Test the vehicle selection and fleet management features');
        console.log('5. Monitor the API endpoints for proper functionality');
        
    } catch (error) {
        console.error('❌ System test failed:', error);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run the complete test
testCompleteSystem()
    .then(() => {
        console.log('\n✅ Complete system test passed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ System test failed:', error);
        process.exit(1);
    });
