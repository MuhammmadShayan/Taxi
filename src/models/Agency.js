import { query } from '../lib/database.js';

export class Agency {
  static async create(agencyData) {
    const {
      name,
      surname,
      address_street,
      address_number,
      address_postal_code,
      address_city,
      address_state,
      address_country,
      phone,
      email,
      contact_full_name,
      description = null,
      payment_methods = null,
      provided_seats_baby = 0,
      provided_seats_child = 0,
      provided_seats_booster = 0,
      navigation_system = 0,
      insurance_price = null,
      second_driver_price = null,
      pickup_locations,
      cancellation_deadline = 2
    } = agencyData;

    const sql = `
      INSERT INTO agencies (
        name, surname, address_street, address_number, address_postal_code,
        address_city, address_state, address_country, phone, email,
        contact_full_name, description, payment_methods, provided_seats_baby,
        provided_seats_child, provided_seats_booster, navigation_system,
        insurance_price, second_driver_price, pickup_locations,
        cancellation_deadline, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
    `;

    const values = [
      name, surname, address_street, address_number, address_postal_code,
      address_city, address_state, address_country, phone, email,
      contact_full_name, description, JSON.stringify(payment_methods),
      provided_seats_baby, provided_seats_child, provided_seats_booster,
      navigation_system, insurance_price, second_driver_price,
      JSON.stringify(pickup_locations), cancellation_deadline
    ];

    const result = await query(sql, values);
    return result.insertId;
  }

  static async findById(id) {
    const sql = `
      SELECT * FROM agencies WHERE id = ? AND is_active = 1
    `;
    const result = await query(sql, [id]);
    const agency = result[0] || null;
    
    if (agency) {
      // Parse JSON fields
      agency.payment_methods = agency.payment_methods ? JSON.parse(agency.payment_methods) : null;
      agency.pickup_locations = JSON.parse(agency.pickup_locations);
    }
    
    return agency;
  }

  static async findByEmail(email) {
    const sql = `SELECT * FROM agencies WHERE email = ? AND is_active = 1`;
    const result = await query(sql, [email]);
    const agency = result[0] || null;
    
    if (agency) {
      agency.payment_methods = agency.payment_methods ? JSON.parse(agency.payment_methods) : null;
      agency.pickup_locations = JSON.parse(agency.pickup_locations);
    }
    
    return agency;
  }

  static async getAll(filters = {}) {
    let sql = `
      SELECT a.*, 
             COUNT(v.id) as vehicle_count,
             COUNT(r.id) as reservation_count
      FROM agencies a
      LEFT JOIN vehicles v ON a.id = v.agency_id AND v.is_available = 1
      LEFT JOIN reservations r ON a.id = r.agency_id
      WHERE a.is_active = 1
    `;
    const values = [];

    if (filters.status) {
      sql += ' AND a.status = ?';
      values.push(filters.status);
    }

    if (filters.city) {
      sql += ' AND a.address_city = ?';
      values.push(filters.city);
    }

    if (filters.search) {
      sql += ' AND (a.name LIKE ? OR a.contact_full_name LIKE ? OR a.address_city LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' GROUP BY a.id ORDER BY a.rating DESC, a.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      values.push(parseInt(filters.limit));
    }

    const agencies = await query(sql, values);
    
    // Parse JSON fields for each agency
    return agencies.map(agency => ({
      ...agency,
      payment_methods: agency.payment_methods ? JSON.parse(agency.payment_methods) : null,
      pickup_locations: JSON.parse(agency.pickup_locations)
    }));
  }

  static async updateStatus(id, status, adminId, reason = null) {
    const connection = await query('SELECT 1'); // Get connection for transaction
    
    try {
      // Update agency status
      await query(
        `UPDATE agencies SET status = ?, updated_at = NOW() WHERE id = ?`,
        [status, id]
      );

      // Insert approval record
      await query(
        `INSERT INTO agency_approvals (agency_id, admin_id, status, reason, created_at, updated_at) 
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [id, adminId, status, reason]
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        if (key === 'payment_methods' || key === 'pickup_locations') {
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

    const sql = `UPDATE agencies SET ${fields.join(', ')} WHERE id = ?`;
    return await query(sql, values);
  }

  static async updateRating(id) {
    const sql = `
      UPDATE agencies a
      SET rating = (
        SELECT COALESCE(AVG(r.rating), 0)
        FROM reviews r
        WHERE r.agency_id = a.id
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews r
        WHERE r.agency_id = a.id
      ),
      updated_at = NOW()
      WHERE a.id = ?
    `;
    return await query(sql, [id]);
  }

  static async getVehicles(agencyId, filters = {}) {
    let sql = `
      SELECT v.*, vc.name as category_name
      FROM vehicles v
      LEFT JOIN vehicle_categories vc ON v.category_id = vc.id
      WHERE v.agency_id = ? AND v.is_available = 1
    `;
    const values = [agencyId];

    if (filters.search) {
      sql += ' AND (v.make LIKE ? OR v.model LIKE ? OR v.vehicle_number LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY v.created_at DESC';

    const vehicles = await query(sql, values);
    
    return vehicles.map(vehicle => ({
      ...vehicle,
      features: vehicle.features ? JSON.parse(vehicle.features) : null,
      images: vehicle.images ? JSON.parse(vehicle.images) : null
    }));
  }

  static async getReservations(agencyId, filters = {}) {
    let sql = `
      SELECT r.*, 
             u.first_name, u.last_name, u.email, u.phone_number,
             v.make, v.model, v.vehicle_number
      FROM reservations r
      JOIN users u ON r.client_id = u.id
      JOIN vehicles v ON r.vehicle_id = v.id
      WHERE r.agency_id = ?
    `;
    const values = [agencyId];

    if (filters.status) {
      sql += ' AND r.status = ?';
      values.push(filters.status);
    }

    if (filters.start_date) {
      sql += ' AND r.start_date >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      sql += ' AND r.end_date <= ?';
      values.push(filters.end_date);
    }

    sql += ' ORDER BY r.created_at DESC';

    const reservations = await query(sql, values);
    
    return reservations.map(reservation => ({
      ...reservation,
      extras: reservation.extras ? JSON.parse(reservation.extras) : null
    }));
  }

  static async deactivate(id) {
    const sql = `UPDATE agencies SET is_active = 0, updated_at = NOW() WHERE id = ?`;
    return await query(sql, [id]);
  }

  static async getPickupLocations() {
    const locations = [
      'Agency Address',
      'Mohammed V International Airport',
      'Rabat-Salé Airport',
      'Marrakech Menara Airport',
      'Fes–Saïs Airport',
      'Agadir–Al Massira Airport',
      'Tangier Ibn Battouta Airport',
      'Casablanca Train Station',
      'Rabat Train Station',
      'Marrakech Train Station',
      'Fes Train Station',
      'Tangier Train Station',
      'Beni Mellal Train Station',
      'Casablanca City Center',
      'Rabat City Center',
      'Marrakech City Center',
      'Fes City Center',
      'Tangier City Center',
      'Agadir City Center',
      'Meknes City Center',
      'Oujda City Center'
    ];
    return locations;
  }
}
