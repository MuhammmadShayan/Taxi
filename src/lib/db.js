import mysql from 'mysql2';

let pool;

export function getDbPool() {
    if (!pool) {
        // Support DATABASE_URL (mysql://user:pass@host:port/dbname)
        const url = process.env.DATABASE_URL;
        let config;
        if (url) {
            try {
                const u = new URL(url);
                config = {
                    host: u.hostname,
                    user: decodeURIComponent(u.username),
                    password: decodeURIComponent(u.password),
                    database: u.pathname.replace(/^\//, ''),
                    port: Number(u.port || 3306),
                    waitForConnections: true,
                    connectionLimit: 10,
                    queueLimit: 0,
                    multipleStatements: true, // Allow multiple statements for imports
                };
            } catch (e) {
                console.error('Invalid DATABASE_URL, falling back to discrete env vars:', e.message);
            }
        }
        if (!config) {
            config = {
                host: process.env.DB_HOST || 'webhosting2026.is.cc',
                user: process.env.DB_USER || 'smartes_my_travel_app',
                password: process.env.DB_PASSWORD || 'my_travel_app_2025',
                database: process.env.DB_NAME || 'smartes_my_travel_app',
                port: Number(process.env.DB_PORT || 3306),
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                multipleStatements: true, // Allow multiple statements for imports
            };
        }
        // Optional TLS for managed providers; enable only if explicitly requested
        if (process.env.DB_SSL === 'true') {
            config.ssl = {};
        }
        pool = mysql.createPool(config).promise();
    }
    return pool;
}

export async function query(sql, params = []) {
	const poolRef = getDbPool();
	const sanitizedParams = params.map(param => (param === undefined ? null : param));
    try {
        const [rows] = await poolRef.execute(sql, sanitizedParams);
        return rows;
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Database connection refused. Please ensure your MySQL server is running and accessible at the configured host and port, and that your .env.local file is correctly configured.');
            throw new Error('Database connection refused: ' + error.message);
        }
        throw error; // Re-throw other errors
    }
	return rows;
}

// Test connection
export async function testConnection() {
	try {
		const poolRef = getDbPool();
		const connection = await poolRef.getConnection();
		console.log('✅ Database connected successfully');
		connection.release();
		return true;
	} catch (error) {
		console.error('❌ Database connection failed:', error.message);
		return false;
	}
}

// Get all cars with optional filters
export async function getCars(filters = {}) {
	let sql = `
		SELECT c.*, GROUP_CONCAT(cf.feature_name) as features 
		FROM cars c 
		LEFT JOIN car_features cf ON c.id = cf.car_id 
		WHERE c.is_available = TRUE
	`;
	
	const params = [];
	
	// Apply filters
	if (filters.category && filters.category !== 'all') {
		sql += ' AND c.category_id = (SELECT id FROM car_categories WHERE name = ?)';
		params.push(filters.category);
	}
	
	if (filters.transmission && filters.transmission !== 'all') {
		sql += ' AND c.transmission = ?';
		params.push(filters.transmission);
	}
	
	if (filters.fuel_type && filters.fuel_type !== 'all') {
		sql += ' AND c.fuel_type = ?';
		params.push(filters.fuel_type);
	}
	
	if (filters.min_price) {
		sql += ' AND c.price_per_day >= ?';
		params.push(filters.min_price);
	}
	
	if (filters.max_price) {
		sql += ' AND c.price_per_day <= ?';
		params.push(filters.max_price);
	}
	
	if (filters.seats) {
		sql += ' AND c.seats >= ?';
		params.push(filters.seats);
	}
	
	if (filters.location && filters.location !== 'all') {
		sql += ' AND c.location = ?';
		params.push(filters.location);
	}
	
	sql += ' GROUP BY c.id';
	
	// Apply sorting
	if (filters.sort_by) {
		switch (filters.sort_by) {
			case 'price_low':
				sql += ' ORDER BY c.price_per_day ASC';
				break;
			case 'price_high':
				sql += ' ORDER BY c.price_per_day DESC';
				break;
			case 'rating':
				sql += ' ORDER BY c.rating DESC';
				break;
			case 'name':
				sql += ' ORDER BY c.make ASC, c.model ASC';
				break;
			default:
				sql += ' ORDER BY c.rating DESC';
		}
	} else {
		sql += ' ORDER BY c.rating DESC';
	}
	
	return await query(sql, params);
}

// Save car booking search
export async function saveCarBookingSearch(searchData) {
	const sql = `
		INSERT INTO car_booking_searches 
		(pickup_location, pickup_date, pickup_time, dropoff_date, dropoff_time) 
		VALUES (?, ?, ?, ?, ?)
	`;
	
	const params = [
		searchData.pickup_location,
		searchData.pickup_date,
		searchData.pickup_time,
		searchData.dropoff_date,
		searchData.dropoff_time
	];
	
	return await query(sql, params);
}

// Get car by ID
export async function getCarById(id) {
	const sql = `
		SELECT c.*, GROUP_CONCAT(cf.feature_name) as features 
		FROM cars c 
		LEFT JOIN car_features cf ON c.id = cf.car_id 
		WHERE c.id = ? AND c.is_available = TRUE
		GROUP BY c.id
	`;
	
	const results = await query(sql, [id]);
	return results[0] || null;
}

// Get distinct filter options
export async function getFilterOptions() {
	const [categories, transmissions, fuelTypes, locations] = await Promise.all([
		query('SELECT DISTINCT cc.name as category FROM cars c LEFT JOIN car_categories cc ON c.category_id = cc.id WHERE c.is_available = TRUE ORDER BY cc.name'),
		query('SELECT DISTINCT transmission FROM cars WHERE is_available = TRUE ORDER BY transmission'),
		query('SELECT DISTINCT fuel_type FROM cars WHERE is_available = TRUE ORDER BY fuel_type'),
		query('SELECT DISTINCT location FROM cars WHERE is_available = TRUE ORDER BY location')
	]);
	
	return {
		categories: categories.map(row => row.category),
		transmissions: transmissions.map(row => row.transmission),
		fuelTypes: fuelTypes.map(row => row.fuel_type),
		locations: locations.map(row => row.location)
	};
}


