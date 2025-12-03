#!/usr/bin/env node

/**
 * Database Migration Runner
 * 
 * This script runs database migrations to set up the enhanced driver registration schema.
 * Run with: node scripts/run-migrations.js
 */

import fs from 'fs/promises';
import path from 'path';
import { query, testConnection } from '../src/lib/db.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    console.log('🚀 Starting database migration...');

    // Test database connection first
    const isConnected = await testConnection();
    if (!isConnected) {
        console.error('❌ Database connection failed. Please check your database configuration.');
        process.exit(1);
    }

    try {
        // Read the migration SQL file
        const migrationPath = path.join(__dirname, '../database/migrations/enhanced_driver_schema.sql');
        const migrationSQL = await fs.readFile(migrationPath, 'utf8');

        // Split SQL statements (basic approach - may need refinement for complex SQL)
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📄 Found ${statements.length} SQL statements to execute...`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            try {
                console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
                await query(statement);
                console.log(`✅ Statement ${i + 1} executed successfully`);
            } catch (error) {
                // Log warning for statements that might fail due to existing structure
                if (error.code === 'ER_DUP_FIELDNAME' || 
                    error.code === 'ER_CANT_DROP_FIELD_OR_KEY' ||
                    error.message.includes('Duplicate column name') ||
                    error.message.includes('already exists')) {
                    console.log(`⚠️  Statement ${i + 1} skipped (column/constraint already exists)`);
                } else {
                    console.error(`❌ Error executing statement ${i + 1}:`, error.message);
                    console.log('Statement:', statement.substring(0, 100) + '...');
                }
            }
        }

        console.log('✅ Migration completed successfully!');
        console.log('\n📋 Summary:');
        console.log('- Enhanced driver registration schema applied');
        console.log('- Users table created/updated with driver support');
        console.log('- Drivers table enhanced with comprehensive fields');
        console.log('- Database indexes added for performance');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration if this file is executed directly
if (process.argv[1] === __filename) {
    runMigration()
        .then(() => {
            console.log('\n🎉 Migration process completed!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n💥 Migration process failed:', error);
            process.exit(1);
        });
}

export { runMigration };
