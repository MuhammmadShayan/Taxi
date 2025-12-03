const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'holikey',
  multipleStatements: true
};

async function runDynamicContentMigration() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database successfully');

    // Read the dynamic content schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'migrations', 'dynamic_content_schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    // Execute the SQL
    console.log('Running dynamic content migration...');
    await connection.execute(sql);
    console.log('Dynamic content migration completed successfully!');

    // Verify tables were created
    const [tables] = await connection.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_name IN (
        'team_members', 'about_sections', 'destinations', 'faq_items', 
        'site_statistics', 'client_logos', 'testimonials', 'services', 
        'site_settings', 'blog_posts', 'contact_info'
      )
    `, [dbConfig.database]);

    console.log('Created tables:');
    tables.forEach(table => {
      console.log(`- ${table.table_name}`);
    });

    // Check if sample data was inserted
    const [teamCount] = await connection.execute('SELECT COUNT(*) as count FROM team_members');
    const [statsCount] = await connection.execute('SELECT COUNT(*) as count FROM site_statistics');
    const [aboutCount] = await connection.execute('SELECT COUNT(*) as count FROM about_sections');
    const [destCount] = await connection.execute('SELECT COUNT(*) as count FROM destinations');
    const [faqCount] = await connection.execute('SELECT COUNT(*) as count FROM faq_items');

    console.log('\nSample data inserted:');
    console.log(`- Team members: ${teamCount[0].count}`);
    console.log(`- Site statistics: ${statsCount[0].count}`);
    console.log(`- About sections: ${aboutCount[0].count}`);
    console.log(`- Destinations: ${destCount[0].count}`);
    console.log(`- FAQ items: ${faqCount[0].count}`);

  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the migration
runDynamicContentMigration();
