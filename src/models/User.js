import { query } from '../lib/database.js';
import bcrypt from 'bcryptjs';

export class User {
  static async create(userData) {
    const {
      first_name,
      last_name,
      company = null,
      date_of_birth,
      phone_number,
      email,
      driving_license_number,
      issued_date,
      address_street = null,
      address_number = null,
      address_postal_code = null,
      address_city = null,
      address_state = null,
      address_country = null,
      password,
      user_type = 'client',
      agency_id = null
    } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);

    const sql = `
      INSERT INTO users (
        first_name, last_name, company, date_of_birth, phone_number, email,
        driving_license_number, issued_date, address_street, address_number,
        address_postal_code, address_city, address_state, address_country,
        password, user_type, agency_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
      first_name, last_name, company, date_of_birth, phone_number, email,
      driving_license_number, issued_date, address_street, address_number,
      address_postal_code, address_city, address_state, address_country,
      hashedPassword, user_type, agency_id
    ];

    const result = await query(sql, values);
    return result.insertId;
  }

  static async findById(id) {
    const sql = `
      SELECT u.*, a.name as agency_name
      FROM users u
      LEFT JOIN agencies a ON u.agency_id = a.id
      WHERE u.id = ? AND u.is_active = 1
    `;
    const result = await query(sql, [id]);
    return result[0] || null;
  }

  static async findByEmail(email) {
    const sql = `
      SELECT u.*, a.name as agency_name
      FROM users u
      LEFT JOIN agencies a ON u.agency_id = a.id
      WHERE u.email = ? AND u.is_active = 1
    `;
    const result = await query(sql, [email]);
    return result[0] || null;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateEmailVerification(userId) {
    const sql = `
      UPDATE users 
      SET email_verified = 1, email_verified_at = NOW(), updated_at = NOW()
      WHERE id = ?
    `;
    return await query(sql, [userId]);
  }

  static async setPasswordResetToken(email, token, expires) {
    const sql = `
      UPDATE users 
      SET password_reset_token = ?, password_reset_expires = ?, updated_at = NOW()
      WHERE email = ?
    `;
    return await query(sql, [token, expires, email]);
  }

  static async resetPassword(token, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
    const sql = `
      UPDATE users 
      SET password = ?, password_reset_token = NULL, password_reset_expires = NULL, updated_at = NOW()
      WHERE password_reset_token = ? AND password_reset_expires > NOW()
    `;
    return await query(sql, [hashedPassword, token]);
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    return await query(sql, values);
  }

  static async getAll(filters = {}) {
    let sql = `
      SELECT u.*, a.name as agency_name
      FROM users u
      LEFT JOIN agencies a ON u.agency_id = a.id
      WHERE u.is_active = 1
    `;
    const values = [];

    if (filters.user_type) {
      sql += ' AND u.user_type = ?';
      values.push(filters.user_type);
    }

    if (filters.agency_id) {
      sql += ' AND u.agency_id = ?';
      values.push(filters.agency_id);
    }

    if (filters.search) {
      sql += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY u.created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      values.push(parseInt(filters.limit));
    }

    return await query(sql, values);
  }

  static async deactivate(id) {
    const sql = `UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?`;
    return await query(sql, [id]);
  }
}
