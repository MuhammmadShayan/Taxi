import { query } from '../lib/database.js';

export class Reservation {
  static generateReservationNumber() {
    const year = new Date().getFullYear();
    const timestamp = Date.now();
    return `RES-${year}-${timestamp}`;
  }

  static async create(reservationData) {
    const {
      start_date,
      end_date,
      pickup_location,
      pickup_time,
      client_id,
      vehicle_id,
      agency_id,
      driver_id = null,
      extras = null,
      total_price
    } = reservationData;

    const reservationNumber = this.generateReservationNumber();

    const sql = `
      INSERT INTO reservations (
        number, start_date, end_date, pickup_location, pickup_time,
        client_id, vehicle_id, agency_id, driver_id, status,
        extras, total_price, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, NOW(), NOW())
    `;

    const values = [
      reservationNumber, start_date, end_date, pickup_location, pickup_time,
      client_id, vehicle_id, agency_id, driver_id,
      JSON.stringify(extras), total_price
    ];

    const result = await query(sql, values);
    return {
      id: result.insertId,
      number: reservationNumber
    };
  }

  static async findById(id) {
    const sql = `
      SELECT r.*, 
             u.first_name as client_first_name,
             u.last_name as client_last_name,
             u.email as client_email,
             u.phone_number as client_phone,
             u.driving_license_number as client_license,
             v.make as vehicle_brand,
             v.model as vehicle_model,
             v.vehicle_number,
             v.seats as vehicle_seats,
             v.doors as vehicle_doors,
             v.energy as vehicle_energy,
             v.gear_type as vehicle_gear_type,
             a.name as agency_name,
             a.contact_full_name as agency_contact,
             a.phone as agency_phone,
             a.email as agency_email,
             a.address_street,
             a.address_number,
             a.address_city,
             a.insurance_price,
             a.second_driver_price,
             a.cancellation_deadline,
             d.user_id as driver_user_id
      FROM reservations r
      JOIN users u ON r.client_id = u.id
      JOIN vehicles v ON r.vehicle_id = v.id
      JOIN agencies a ON r.agency_id = a.id
      LEFT JOIN drivers d ON r.driver_id = d.id
      WHERE r.id = ?
    `;
    const result = await query(sql, [id]);
    const reservation = result[0] || null;
    
    if (reservation) {
      reservation.extras = reservation.extras ? JSON.parse(reservation.extras) : null;
    }
    
    return reservation;
  }

  static async findByNumber(number) {
    const sql = `
      SELECT r.*, 
             u.first_name as client_first_name,
             u.last_name as client_last_name,
             u.email as client_email,
             u.phone_number as client_phone,
             v.make as vehicle_brand,
             v.model as vehicle_model,
             v.vehicle_number,
             a.name as agency_name,
             a.contact_full_name as agency_contact,
             a.phone as agency_phone,
             a.email as agency_email
      FROM reservations r
      JOIN users u ON r.client_id = u.id
      JOIN vehicles v ON r.vehicle_id = v.id
      JOIN agencies a ON r.agency_id = a.id
      WHERE r.number = ?
    `;
    const result = await query(sql, [number]);
    const reservation = result[0] || null;
    
    if (reservation) {
      reservation.extras = reservation.extras ? JSON.parse(reservation.extras) : null;
    }
    
    return reservation;
  }

  static async getByClient(clientId, filters = {}) {
    let sql = `
      SELECT r.*, 
             v.make as vehicle_brand,
             v.model as vehicle_model,
             v.vehicle_number,
             a.name as agency_name,
             a.contact_full_name as agency_contact,
             a.phone as agency_phone
      FROM reservations r
      JOIN vehicles v ON r.vehicle_id = v.id
      JOIN agencies a ON r.agency_id = a.id
      WHERE r.client_id = ?
    `;
    const values = [clientId];

    if (filters.status) {
      sql += ' AND r.status = ?';
      values.push(filters.status);
    }

    if (filters.upcoming) {
      sql += ' AND r.start_date >= CURDATE()';
    }

    sql += ' ORDER BY r.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      values.push(parseInt(filters.limit));
    }

    const reservations = await query(sql, values);
    
    return reservations.map(reservation => ({
      ...reservation,
      extras: reservation.extras ? JSON.parse(reservation.extras) : null
    }));
  }

  static async getByAgency(agencyId, filters = {}) {
    let sql = `
      SELECT r.*, 
             u.first_name as client_first_name,
             u.last_name as client_last_name,
             u.email as client_email,
             u.phone_number as client_phone,
             v.make as vehicle_brand,
             v.model as vehicle_model,
             v.vehicle_number
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

    if (filters.search) {
      sql += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR r.number LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY r.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      values.push(parseInt(filters.limit));
    }

    const reservations = await query(sql, values);
    
    return reservations.map(reservation => ({
      ...reservation,
      extras: reservation.extras ? JSON.parse(reservation.extras) : null
    }));
  }

  static async updateStatus(id, status, reason = null) {
    const sql = `
      UPDATE reservations 
      SET status = ?, cancellation_reason = ?, updated_at = NOW()
      WHERE id = ?
    `;
    return await query(sql, [status, reason, id]);
  }

  static async confirm(id, driverId = null) {
    const sql = `
      UPDATE reservations 
      SET status = 'confirmed', driver_id = ?, updated_at = NOW()
      WHERE id = ? AND status = 'pending'
    `;
    return await query(sql, [driverId, id]);
  }

  static async cancel(id, reason = null) {
    const sql = `
      UPDATE reservations 
      SET status = 'canceled', cancellation_reason = ?, updated_at = NOW()
      WHERE id = ? AND status IN ('pending', 'confirmed')
    `;
    return await query(sql, [reason, id]);
  }

  static async complete(id) {
    const sql = `
      UPDATE reservations 
      SET status = 'completed', updated_at = NOW()
      WHERE id = ? AND status = 'confirmed' AND end_date <= CURDATE()
    `;
    return await query(sql, [id]);
  }

  static async updatePayment(id, paidPrice, paymentMethod, paymentDate = null) {
    const sql = `
      UPDATE reservations 
      SET paid_price = ?, payment_method = ?, payment_date = ?, updated_at = NOW()
      WHERE id = ?
    `;
    const paymentDateTime = paymentDate || new Date().toISOString().slice(0, 19).replace('T', ' ');
    return await query(sql, [paidPrice, paymentMethod, paymentDateTime, id]);
  }

  static async addReview(id, rating, comment = null) {
    const sql = `
      UPDATE reservations 
      SET review_rating = ?, review_comment = ?, updated_at = NOW()
      WHERE id = ? AND status = 'completed'
    `;
    return await query(sql, [rating, comment, id]);
  }

  static async setPostInfo(id, postInfo) {
    const sql = `
      UPDATE reservations 
      SET post_reservation_infos = ?, updated_at = NOW()
      WHERE id = ?
    `;
    return await query(sql, [postInfo, id]);
  }

  static async canCancel(id) {
    const sql = `
      SELECT r.start_date, a.cancellation_deadline
      FROM reservations r
      JOIN agencies a ON r.agency_id = a.id
      WHERE r.id = ? AND r.status IN ('pending', 'confirmed')
    `;
    const result = await query(sql, [id]);
    
    if (result.length === 0) {
      return false;
    }

    const reservation = result[0];
    const startDate = new Date(reservation.start_date);
    const now = new Date();
    const hoursUntilStart = (startDate - now) / (1000 * 60 * 60);
    const deadlineHours = reservation.cancellation_deadline * 24;

    return hoursUntilStart > deadlineHours;
  }

  static async getStats(filters = {}) {
    let sql = `
      SELECT 
        COUNT(*) as total_reservations,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_reservations,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_reservations,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_reservations,
        COUNT(CASE WHEN status = 'canceled' THEN 1 END) as canceled_reservations,
        SUM(total_price) as total_revenue,
        SUM(paid_price) as paid_revenue,
        AVG(total_price) as average_reservation_value
      FROM reservations r
      WHERE 1=1
    `;
    const values = [];

    if (filters.agency_id) {
      sql += ' AND r.agency_id = ?';
      values.push(filters.agency_id);
    }

    if (filters.start_date) {
      sql += ' AND r.created_at >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      sql += ' AND r.created_at <= ?';
      values.push(filters.end_date);
    }

    const result = await query(sql, values);
    return result[0];
  }

  static async getDailyStats(startDate, endDate, agencyId = null) {
    let sql = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_reservations,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_reservations,
        SUM(total_price) as total_revenue
      FROM reservations
      WHERE DATE(created_at) BETWEEN ? AND ?
    `;
    const values = [startDate, endDate];

    if (agencyId) {
      sql += ' AND agency_id = ?';
      values.push(agencyId);
    }

    sql += ' GROUP BY DATE(created_at) ORDER BY DATE(created_at)';

    return await query(sql, values);
  }

  static async getUpcoming(filters = {}) {
    let sql = `
      SELECT r.*, 
             u.first_name as client_first_name,
             u.last_name as client_last_name,
             u.phone_number as client_phone,
             v.make as vehicle_brand,
             v.model as vehicle_model,
             v.vehicle_number,
             a.name as agency_name
      FROM reservations r
      JOIN users u ON r.client_id = u.id
      JOIN vehicles v ON r.vehicle_id = v.id
      JOIN agencies a ON r.agency_id = a.id
      WHERE r.start_date > CURDATE() AND r.status IN ('pending', 'confirmed')
    `;
    const values = [];

    if (filters.agency_id) {
      sql += ' AND r.agency_id = ?';
      values.push(filters.agency_id);
    }

    if (filters.days_ahead) {
      sql += ' AND r.start_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)';
      values.push(filters.days_ahead);
    }

    sql += ' ORDER BY r.start_date ASC';

    const reservations = await query(sql, values);
    
    return reservations.map(reservation => ({
      ...reservation,
      extras: reservation.extras ? JSON.parse(reservation.extras) : null
    }));
  }
}
