import mysql from 'mysql2/promise';

const config = {
    host: 'webhosting2026.is.cc',
    user: 'smartes_my_travel_app',
    password: 'my_travel_app_2025',
    database: 'smartes_my_travel_app',
    port: 3306,
    connectTimeout: 10000
    // SSL removed entirely
};

console.log('Testing connection to:', config.host);
console.log('User:', config.user);

async function test() {
    try {
        const conn = await mysql.createConnection(config);
        console.log('✅ Connection established successfully!');
        
        const [rows] = await conn.execute('SELECT 1 as val');
        console.log('Query result:', rows);
        
        const [tables] = await conn.execute('SHOW TABLES');
        console.log('Tables:', tables.map(t => Object.values(t)[0]));
        
        await conn.end();
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        if (err.code === 'ETIMEDOUT') {
            console.error('Possible causes: Firewall blocking port 3306, or wrong host.');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Possible causes: Wrong password, or IP not whitelisted in cPanel.');
        }
    }
}

test();
