#!/usr/bin/env node

/**
 * Update Vehicles Schema Script
 * 
 * This script updates the vehicles table to include all necessary columns
 * for comprehensive car scraping and agency vehicle management.
 */

import { query } from '../src/lib/database.js';

// Enhanced vehicle columns for comprehensive scraping
const REQUIRED_COLUMNS = [
    { name: 'daily_rate', type: 'DECIMAL(10,2) DEFAULT NULL' },
    { name: 'price_usd', type: 'INT(11) DEFAULT NULL' },
    { name: 'mileage', type: 'INT(11) DEFAULT NULL' },
    { name: 'location', type: 'VARCHAR(150) DEFAULT NULL' },
    { name: 'energy', type: 'VARCHAR(50) DEFAULT NULL' },
    { name: 'gear_type', type: 'VARCHAR(50) DEFAULT NULL' },
    { name: 'seats', type: 'INT(11) DEFAULT NULL' },
    { name: 'doors', type: 'INT(11) DEFAULT NULL' },
    { name: 'color', type: 'VARCHAR(50) DEFAULT NULL' },
    { name: 'body_type', type: 'VARCHAR(100) DEFAULT NULL' },
    { name: 'trim', type: 'VARCHAR(150) DEFAULT NULL' },
    { name: 'images', type: 'TEXT DEFAULT NULL' },
    { name: 'description', type: 'TEXT DEFAULT NULL' },
    { name: 'source', type: 'VARCHAR(100) DEFAULT NULL' },
    { name: 'source_url', type: 'TEXT DEFAULT NULL' },
    { name: 'created_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    { name: 'updated_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    { name: 'status', type: 'ENUM("active", "inactive") DEFAULT "active"' }
];

async function checkColumnExists(tableName, columnName) {
    const result = await query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = ? 
         AND COLUMN_NAME = ?`,
        [tableName, columnName]
    );
    return result.length > 0;
}

async function updateVehiclesSchema() {
    console.log('🔧 Starting vehicles table schema update...');

    try {
        // Check if vehicles table exists
        const tableExists = await query(
            `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'vehicles'`
        );

        if (tableExists.length === 0) {
            console.log('❌ Vehicles table does not exist. Creating...');
            await query(`
                CREATE TABLE vehicles (
                    id INT(11) NOT NULL AUTO_INCREMENT,
                    make VARCHAR(50) NOT NULL,
                    model VARCHAR(100) NOT NULL,
                    year INT(11) NOT NULL,
                    PRIMARY KEY (id),
                    INDEX idx_make_model (make, model),
                    INDEX idx_year (year)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            `);
            console.log('✅ Vehicles table created successfully');
        }

        // Ensure AUTO_INCREMENT primary key
        const hasAutoIncrement = await query(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
             WHERE TABLE_SCHEMA = DATABASE() 
             AND TABLE_NAME = 'vehicles' 
             AND COLUMN_NAME = 'id' 
             AND EXTRA = 'auto_increment'`
        );

        if (hasAutoIncrement.length === 0) {
            console.log('🔧 Setting up auto-increment primary key...');
            try {
                await query('ALTER TABLE vehicles MODIFY id INT(11) NOT NULL AUTO_INCREMENT');
                console.log('✅ Auto-increment primary key set up');
            } catch (error) {
                console.log('⚠️ Primary key already configured:', error.message);
            }
        }

        // Add missing columns
        let updatedColumns = 0;
        for (const column of REQUIRED_COLUMNS) {
            const exists = await checkColumnExists('vehicles', column.name);
            if (!exists) {
                try {
                    await query(`ALTER TABLE vehicles ADD COLUMN ${column.name} ${column.type}`);
                    console.log(`✅ Added column: ${column.name}`);
                    updatedColumns++;
                } catch (error) {
                    console.error(`❌ Failed to add column ${column.name}:`, error.message);
                }
            }
        }

        // Add indexes for better performance
        const indexes = [
            { name: 'idx_vehicles_make_model', columns: 'make, model' },
            { name: 'idx_vehicles_year', columns: 'year' },
            { name: 'idx_vehicles_source', columns: 'source' },
            { name: 'idx_vehicles_status', columns: 'status' },
            { name: 'idx_vehicles_created_at', columns: 'created_at' }
        ];

        for (const index of indexes) {
            try {
                await query(`ALTER TABLE vehicles ADD INDEX ${index.name} (${index.columns})`);
                console.log(`✅ Added index: ${index.name}`);
            } catch (error) {
                if (error.message.includes('Duplicate key name')) {
                    console.log(`⚠️ Index ${index.name} already exists`);
                } else {
                    console.error(`❌ Failed to add index ${index.name}:`, error.message);
                }
            }
        }

        console.log(`\n🎉 Schema update completed!`);
        console.log(`📊 Updated ${updatedColumns} columns`);
        
        // Show current table structure
        const tableStructure = await query('DESCRIBE vehicles');
        console.log('\n📋 Current vehicles table structure:');
        console.log('─'.repeat(60));
        tableStructure.forEach(col => {
            console.log(`${col.Field.padEnd(20)} | ${col.Type.padEnd(20)} | ${col.Null} | ${col.Key} | ${col.Default || 'NULL'}`);
        });

        return true;
    } catch (error) {
        console.error('❌ Schema update failed:', error);
        throw error;
    }
}

// Run the update
updateVehiclesSchema()
    .then(() => {
        console.log('\n✅ Vehicles schema update completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Schema update failed:', error);
        process.exit(1);
    });
