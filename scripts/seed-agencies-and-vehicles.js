#!/usr/bin/env node

/**
 * Seed 5 agency users with vehicles copied from vehicles catalog
 * Emails: agency1@kirastay.com .. agency5@kirastay.com
 * Passwords: agency1 .. agency5 (bcrypt hashed)
 */

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function getDb() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'my_travel_app',
    timezone: '+00:00',
    dateStrings: true,
  });
}

async function main() {
  const db = await getDb();
  try {
    console.log('🔄 Starting seed for agencies and vehicles');
    await db.beginTransaction();

    const agenciesToCreate = [1,2,3,4,5].map((n) => ({
      email: `agency${n}@kirastay.com`,
      password: `agency${n}`,
      first_name: `Agency${n}`,
      last_name: 'Owner',
      business_name: `KiraStay Agency ${n}`,
    }));

    // Fetch candidate vehicles from catalog (with images prioritized)
    const [vehRows] = await db.execute(
      `SELECT * FROM vehicles ORDER BY (images IS NOT NULL AND images != '[]') DESC, created_at DESC LIMIT 50`
    );
    if (!vehRows || vehRows.length === 0) {
      throw new Error('No vehicles found in vehicles catalog to seed agency_vehicles.');
    }

    const created = [];

    for (let i = 0; i < agenciesToCreate.length; i++) {
      const a = agenciesToCreate[i];
      // Ensure user doesn't already exist
      const [userExisting] = await db.execute('SELECT user_id FROM users WHERE email = ?', [a.email]);
      let userId;
      if (userExisting.length > 0) {
        userId = userExisting[0].user_id;
        console.log(`ℹ️ User exists: ${a.email} (user_id=${userId})`);
      } else {
        const hash = await bcrypt.hash(a.password, 12);
        const [userRes] = await db.execute(
          `INSERT INTO users (role, first_name, last_name, email, password_hash, status, created_at, updated_at)
           VALUES ('agency_owner', ?, ?, ?, ?, 'active', NOW(), NOW())`,
          [a.first_name, a.last_name, a.email, hash]
        );
        userId = userRes.insertId;
        console.log(`✅ Created user ${a.email} (user_id=${userId})`);
      }

      // Ensure agency exists for this user
      const [agencyExisting] = await db.execute('SELECT agency_id FROM agencies WHERE user_id = ?', [userId]);
      let agencyId;
      if (agencyExisting.length > 0) {
        agencyId = agencyExisting[0].agency_id;
        console.log(`ℹ️ Agency exists for user ${userId} (agency_id=${agencyId})`);
        // Approve agency to ensure visibility
        await db.execute('UPDATE agencies SET status = "approved", updated_at = NOW() WHERE agency_id = ?', [agencyId]);
      } else {
        const [agencyRes] = await db.execute(
          `INSERT INTO agencies (user_id, business_name, business_email, contact_name, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, 'approved', NOW(), NOW())`,
          [userId, a.business_name, a.email, `${a.first_name} ${a.last_name}`]
        );
        agencyId = agencyRes.insertId;
        console.log(`✅ Created agency ${a.business_name} (agency_id=${agencyId})`);
      }

      // Assign 3 vehicles to each agency from catalog
      const startIdx = i * 3;
      const chosen = vehRows.slice(startIdx, startIdx + 3);
      if (chosen.length === 0) {
        // fallback: reuse from start
        chosen.push(...vehRows.slice(0, 3));
      }

      for (const v of chosen) {
        // Parse images to ensure JSON array
        let images = [];
        if (v.images) {
          try {
            const parsed = typeof v.images === 'string' ? JSON.parse(v.images) : v.images;
            images = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
          } catch {
            images = [];
          }
        }

        // Check if this make+model+year already exists for this agency to avoid duplicates
        const [exists] = await db.execute(
          `SELECT vehicle_id FROM agency_vehicles WHERE agency_id = ? AND brand = ? AND model = ? AND year = ? LIMIT 1`,
          [agencyId, v.make || '', v.model || '', v.year || 0]
        );
        if (exists.length > 0) {
          continue;
        }

        const vehicleNumber = `${agencyId}-${Date.now()}-${Math.floor(Math.random()*1000)}`;

        await db.execute(
          `INSERT INTO agency_vehicles (
            agency_id, category_id, vehicle_number, type, brand, model, year,
            energy, gear_type, doors, seats,
            air_conditioning, airbags, navigation_system, bluetooth, wifi,
            price_low, price_high, price_holiday, daily_rate, weekly_rate, monthly_rate,
            deposit_amount, mileage_limit, extra_mileage_cost,
            description, images, status, created_at, updated_at
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, 'available', NOW(), NOW()
          )`,
          [
            agencyId, 1, vehicleNumber,
            v.body_type === 'suv' ? 'suv' : (v.body_type === 'van' ? 'van' : 'small_car'),
            v.make || 'Brand', v.model || 'Model', v.year || 2020,
            v.energy || 'petrol', v.gear_type || 'manual', v.doors || 4, v.seats || 5,
            1, 1, 0, 0, 0,
            v.daily_rate || v.price_usd || 50.00,
            v.daily_rate ? v.daily_rate * 1.3 : (v.price_usd ? v.price_usd * 1.3 : 65.00),
            v.daily_rate ? v.daily_rate * 1.5 : (v.price_usd ? v.price_usd * 1.5 : 75.00),
            v.daily_rate || 50.00,
            v.daily_rate ? v.daily_rate * 6 : 300.00,
            v.daily_rate ? v.daily_rate * 25 : 1250.00,
            200.00, 200, 0.15,
            `${v.make || ''} ${v.model || ''} ${v.year || ''}`.trim(),
            JSON.stringify(images),
          ]
        );
      }

      created.push({ email: a.email, password: a.password });
    }

    await db.commit();
    console.log('🎉 Seed complete! Test accounts:');
    created.forEach(c => console.log(`- ${c.email} / ${c.password}`));
  } catch (err) {
    console.error('❌ Seed failed:', err);
    try { await db.rollback(); } catch {}
    process.exit(1);
  } finally {
    try { await db.end(); } catch {}
  }
}

main();


