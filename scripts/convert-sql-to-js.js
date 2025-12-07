const fs = require('fs');
const path = require('path');

const sqlPath = path.join(__dirname, '../my_travel_app.sql');
const outPath = path.join(__dirname, '../src/lib/sqlDump.js');

try {
    const sql = fs.readFileSync(sqlPath, 'utf8');
    // Escape backticks and backslashes
    const escapedSql = sql.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');
    
    const jsContent = `// Auto-generated from my_travel_app.sql
export const sqlDump = \`${escapedSql}\`;
`;

    fs.writeFileSync(outPath, jsContent);
    console.log(`Successfully converted SQL to JS module at ${outPath}`);
} catch (e) {
    console.error('Error converting SQL:', e);
    process.exit(1);
}
