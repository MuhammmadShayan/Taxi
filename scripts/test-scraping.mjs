#!/usr/bin/env node

/**
 * Test Vehicle Scraping Script
 * 
 * This script tests the vehicle scraping functionality
 */

import { scrapeAllSources, scrapeCarsComToVehicles } from '../src/lib/vehicles-scraper.js';
import { query } from '../src/lib/database.js';

async function testScraping() {
    console.log('🧪 Starting vehicle scraping test...');
    
    try {
        console.log('📊 Current vehicle count in database:');
        const currentCount = await query('SELECT COUNT(*) as count FROM vehicles');
        console.log(`   Current vehicles: ${currentCount[0].count}`);
        
        console.log('\n🚗 Starting Cars.com scraping (1 page for testing)...');
        const results = await scrapeCarsComToVehicles({
            carsdotcomPages: 1
        });
        
        console.log('\n✅ Scraping completed!');
        console.log('📊 Results:');
        console.log(`   Total scraped: ${results.totalScraped}`);
        console.log(`   Unique vehicles: ${results.uniqueCars}`);
        console.log(`   Successfully saved: ${results.totalSaved}`);
        console.log(`   Failed to save: ${results.totalFailed}`);
        
        if (results.failed && results.failed.length > 0) {
            console.log('\n❌ Failed vehicles:');
            results.failed.forEach(failed => {
                console.log(`   - ${failed.make} ${failed.model} ${failed.year}: ${failed.error}`);
            });
        }
        
        if (results.saved && results.saved.length > 0) {
            console.log('\n✅ Sample saved vehicles:');
            results.saved.slice(0, 5).forEach(vehicle => {
                console.log(`   - ${vehicle.make} ${vehicle.model} ${vehicle.year} - $${vehicle.daily_rate || 'N/A'}/day`);
            });
        }
        
        // Check updated count
        const newCount = await query('SELECT COUNT(*) as count FROM vehicles');
        console.log(`\n📈 Updated vehicle count: ${newCount[0].count} (+${newCount[0].count - currentCount[0].count})`);
        
        // Show some sample vehicles with images
        const vehiclesWithImages = await query(
            'SELECT make, model, year, images, source FROM vehicles WHERE images IS NOT NULL AND images != "[]" LIMIT 3'
        );
        
        if (vehiclesWithImages.length > 0) {
            console.log('\n🖼️  Sample vehicles with images:');
            vehiclesWithImages.forEach(vehicle => {
                try {
                    const images = JSON.parse(vehicle.images);
                    console.log(`   - ${vehicle.make} ${vehicle.model} ${vehicle.year} from ${vehicle.source}: ${images.length} image(s)`);
                } catch (e) {
                    console.log(`   - ${vehicle.make} ${vehicle.model} ${vehicle.year} from ${vehicle.source}: Error parsing images`);
                }
            });
        }
        
        console.log('\n🎉 Test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run the test
testScraping()
    .then(() => {
        console.log('\n✅ Vehicle scraping test completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    });
