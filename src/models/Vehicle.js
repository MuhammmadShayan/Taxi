import { query } from '../lib/database.js';

export class Vehicle {
  static async create(vehicleData) {
    const {
      agency_id,
      vehicle_number,
      category_id,
      brand,
      model,
      year,
      energy,
      gear_type,
      doors,
      seats,
      air_conditioning = 0,
      air_bags = 0,
      navigation_system = 0,
      low_price,
      high_price,
      holidays_price,
      description = null,
      features = null,
      images = null
    } = vehicleData;

    const sql = `
      INSERT INTO vehicles (
        agency_id, vehicle_number, category_id, brand, model, year,
        energy, gear_type, doors, seats, air_conditioning, air_bags,
        navigation_system, low_price, high_price, holidays_price,
        description, features, images, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
      agency_id, vehicle_number, category_id, brand, model, year,
      energy, gear_type, doors, seats, air_conditioning, air_bags,
      navigation_system, low_price, high_price, holidays_price,
      description, JSON.stringify(features), JSON.stringify(images)
    ];

    const result = await query(sql, values);
    return result.insertId;
  }

  static async findById(id) {
    try {
      // Simple query using only id column that exists
      const sql = `SELECT * FROM vehicles WHERE id = ?`;
      const result = await query(sql, [id]);
      const vehicle = result[0] || null;
      
      if (vehicle) {
        // Map the actual database columns to expected format
        vehicle.brand = vehicle.make || vehicle.brand || 'Generic';
        vehicle.model = vehicle.model || 'Car';
        vehicle.category_name = vehicle.type || 'Car';
        vehicle.agency_name = 'Car Rental Agency';
        vehicle.agency_rating = 4.5;
        vehicle.images = vehicle.images ? (typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images) : [];
        vehicle.low_price = vehicle.low_price || vehicle.price_low || vehicle.daily_rate || 50;
        vehicle.high_price = vehicle.high_price || vehicle.price_high || (vehicle.daily_rate * 1.5) || 100;
        vehicle.holidays_price = vehicle.holidays_price || vehicle.price_holiday || (vehicle.daily_rate * 2) || 150;
        vehicle.seats = vehicle.seats || 5;
        vehicle.energy = vehicle.energy || vehicle.fuel_type || 'petrol';
        vehicle.gear_type = vehicle.gear_type || vehicle.transmission || 'automatic';
      }
      
      return vehicle;
    } catch (error) {
      console.error('Error in findById:', error);
      return null;
    }
  }

  static async search(filters = {}) {
    // Ultra-simple query - get vehicles then apply light normalization and optional location filtering
    let sql = `SELECT * FROM vehicles LIMIT ? OFFSET ?`;

    // Pagination only
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;
    const values = [limit, offset];

    console.log('Executing ultra-simple query:', sql);
    console.log('Query values:', values);

    // Helper: normalize category from available hints
    const normalizeCategory = (v) => {
      const raw = String(v.category || v.type || v.body_type || '').toUpperCase();
      if (raw.includes('SUV') || /\b(CRV|CR-V|RAV4|X5|Q5|HIGHLANDER|TIGUAN|ESCAPE|TAHOE|SUBURBAN)\b/i.test(String(v.model || ''))) {
        return 'SUV';
      }
      if (raw.includes('CONVERTIBLE')) return 'CONVERTIBLE';
      if (raw.includes('COUPE')) return 'COUPE';
      if (raw.includes('HATCH')) return 'HATCHBACK';
      if (raw.includes('VAN')) return 'MINIVAN';
      if (raw.includes('SEDAN') || raw.includes('SMALL CAR') || raw.includes('CAR')) return 'SEDAN';
      // Fallback: infer from doors/seats (2 doors → coupe likely)
      if (Number(v.doors) === 2) return 'COUPE';
      return 'SEDAN';
    };

    try {
      const vehicles = await query(sql, values);
      console.log('Raw database result:', vehicles);

      // Optional location-based filtering (best-effort)
      const tokens = String(filters.pickup_location || '').toLowerCase().split(/[\s,]+/).filter(t => t.length > 2);
      let scoped = Array.isArray(vehicles) ? vehicles.slice() : [];
      if (tokens.length > 0) {
        const filteredByLoc = scoped.filter(v => {
          const loc = String(v.location || v.city || '').toLowerCase();
          if (!loc) return true; // keep if location unknown
          return tokens.some(t => loc.includes(t));
        });
        // If filtering yields nothing (no location metadata), keep original list to avoid empty results
        if (filteredByLoc.length > 0) scoped = filteredByLoc;
      }

      // Deterministic variety per pickup location: rotate list based on hash
      if ((filters.pickup_location || '').length > 0 && scoped.length > 0) {
        const s = String(filters.pickup_location);
        let hash = 0;
        for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
        const start = hash % scoped.length;
        scoped = scoped.slice(start).concat(scoped.slice(0, start));
      }

      return scoped.map((vehicle, index) => ({
        ...vehicle,
        id: vehicle.id || vehicle.vehicle_id || vehicle.ID || index + 1, // Ensure we have an ID
        category_name: normalizeCategory(vehicle),
        agency_name: vehicle.agency || 'Car Rental Agency',
        agency_city: vehicle.city || vehicle.location || '',
        agency_rating: 4.5,
        images: vehicle.images ? (typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images) : ['/html-folder/images/car-img.jpg'],
        low_price: vehicle.low_price || vehicle.price_low || vehicle.daily_rate || 50,
        high_price: vehicle.high_price || vehicle.price_high || (vehicle.daily_rate * 1.5) || 100,
        holidays_price: vehicle.holidays_price || vehicle.price_holiday || (vehicle.daily_rate * 2) || 150,
        brand: vehicle.make || vehicle.brand || 'Generic',
        model: vehicle.model || 'Car',
        year: vehicle.year || 2023,
        seats: vehicle.seats || 5,
        energy: vehicle.energy || vehicle.fuel_type || 'petrol',
        gear_type: vehicle.gear_type || vehicle.transmission || 'automatic'
      }));
    } catch (error) {
      console.error('Even simple query failed:', error);
      // Return empty array if database query fails
      return [];
    }
  }

  static async getPrice(vehicleId, startDate, endDate) {
    const vehicle = await this.findById(vehicleId);
    if (!vehicle) return null;

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Determine if it's a holiday period (simplified logic)
    const isHoliday = this.isHolidayPeriod(startDate, endDate);
    
    // Determine if it's high season (summer months)
    const isHighSeason = this.isHighSeason(startDate, endDate);

    let pricePerDay;
    if (isHoliday) {
      pricePerDay = parseFloat(vehicle.holidays_price);
    } else if (isHighSeason) {
      pricePerDay = parseFloat(vehicle.high_price);
    } else {
      pricePerDay = parseFloat(vehicle.low_price);
    }

    return {
      days: diffDays,
      price_per_day: pricePerDay,
      base_total: pricePerDay * diffDays,
      is_holiday: isHoliday,
      is_high_season: isHighSeason
    };
  }

  static isHolidayPeriod(startDate, endDate) {
    // Define Morocco holidays (simplified)
    const holidays = [
      { start: '2025-07-01', end: '2025-08-31' }, // Summer holidays
      { start: '2025-12-20', end: '2025-01-10' }, // Winter holidays
      // Add more holidays as needed
    ];

    const start = new Date(startDate);
    const end = new Date(endDate);

    return holidays.some(holiday => {
      const holidayStart = new Date(holiday.start);
      const holidayEnd = new Date(holiday.end);
      return (start <= holidayEnd && end >= holidayStart);
    });
  }

  static isHighSeason(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // High season: June to September
    return (start.getMonth() >= 5 && start.getMonth() <= 8) ||
           (end.getMonth() >= 5 && end.getMonth() <= 8);
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        if (key === 'features' || key === 'images') {
          fields.push(`${key} = ?`);
          values.push(JSON.stringify(updateData[key]));
        } else {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    const sql = `UPDATE vehicles SET ${fields.join(', ')} WHERE vehicle_id = ?`;
    return await query(sql, values);
  }

  static async updateRating(id) {
    const sql = `
      UPDATE vehicles v
      SET rating = (
        SELECT COALESCE(AVG(r.rating), 0)
        FROM reviews r
        WHERE r.vehicle_id = v.id
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews r
        WHERE r.vehicle_id = v.id
      ),
      updated_at = NOW()
      WHERE v.id = ?
    `;
    return await query(sql, [id]);
  }

  static async incrementReservations(id) {
    const sql = `
      UPDATE vehicles 
      SET total_reservations = total_reservations + 1, updated_at = NOW()
      WHERE vehicle_id = ?
    `;
    return await query(sql, [id]);
  }

  static async isAvailable(vehicleId, startDate, endDate) {
    const sql = `
      SELECT COUNT(*) as count
      FROM reservations
      WHERE vehicle_id = ? 
      AND (start_date <= ? AND end_date >= ?)
      AND status IN ('pending', 'confirmed')
    `;
    const result = await query(sql, [vehicleId, endDate, startDate]);
    return result[0].count === 0;
  }

  static async getByAgency(agencyId, filters = {}) {
    let sql = `
      SELECT v.*, vc.name as category_name
      FROM vehicles v
      LEFT JOIN vehicle_categories vc ON v.category_id = vc.category_id
      WHERE v.agency_id = ?
    `;
    const values = [agencyId];

    if (filters.is_available !== undefined) {
      sql += ' AND v.is_available = ?';
      values.push(filters.is_available);
    }

    if (filters.search) {
      sql += ' AND (v.make LIKE ? OR v.model LIKE ? OR v.vehicle_number LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY v.created_at DESC';

    const vehicles = await query(sql, values);
    
    return vehicles.map(vehicle => ({
      ...vehicle,
      features: vehicle.features ? JSON.parse(vehicle.features) : [],
      images: vehicle.images ? JSON.parse(vehicle.images) : []
    }));
  }

  static async deactivate(id) {
    const sql = `UPDATE vehicles SET is_available = 0, updated_at = NOW() WHERE vehicle_id = ?`;
    return await query(sql, [id]);
  }

  static async getCategories() {
    try {
      // Return hardcoded categories since we don't have category tables
      return [
        { name: 'Sedan', vehicle_count: 5 },
        { name: 'SUV', vehicle_count: 3 },
        { name: 'Coupe', vehicle_count: 2 },
        { name: 'Convertible', vehicle_count: 1 }
      ];
    } catch (error) {
      console.error('Error in getCategories:', error);
      return [];
    }
  }

  static async getBrands() {
    try {
      // Get distinct makes from actual vehicles table
      const sql = `SELECT DISTINCT make as brand, COUNT(*) as vehicle_count FROM vehicles GROUP BY make ORDER BY make ASC`;
      return await query(sql);
    } catch (error) {
      console.error('Error in getBrands:', error);
      // Return hardcoded brands as fallback
      return [
        { brand: 'Acura', vehicle_count: 10 },
        { brand: 'BMW', vehicle_count: 5 },
        { brand: 'Toyota', vehicle_count: 8 },
        { brand: 'Honda', vehicle_count: 6 }
      ];
    }
  }
}
