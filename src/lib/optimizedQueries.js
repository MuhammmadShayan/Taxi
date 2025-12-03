import { query } from './db.js';
import { DatabaseError } from './errorHandler.js';

/**
 * Get booking details with all related information
 */
export async function getBookingWithDetails(bookingId) {
  try {
    const bookings = await query(`
      SELECT 
        r.*,
        v.make as brand,
        v.model,
        v.year,
        v.images,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name,
        u.email as customer_email,
        u.phone as customer_phone,
        u.address as customer_address,
        u.city as customer_city,
        u.country as customer_country,
        pl.location_name as pickup_location_name,
        pl.address as pickup_address,
        dl.location_name as dropoff_location_name,
        dl.address as dropoff_address,
        a.business_name as agency_name
      FROM reservations r
      LEFT JOIN vehicles v ON r.vehicle_id = v.id
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN pickup_locations pl ON r.pickup_location_id = pl.location_id
      LEFT JOIN pickup_locations dl ON r.dropoff_location_id = dl.location_id
      LEFT JOIN agencies a ON r.agency_id = a.agency_id
      WHERE r.reservation_id = ?
    `, [bookingId]);

    if (bookings.length === 0) {
      throw new Error('Booking not found');
    }

    const booking = bookings[0];

    // Get reservation extras if any
    try {
      const extras = await query(`
        SELECT re.*, e.name as extra_name, e.description as extra_description
        FROM reservation_extras re
        LEFT JOIN extras e ON re.extra_id = e.extra_id
        WHERE re.reservation_id = ?
      `, [bookingId]);

      if (extras.length > 0) {
        booking.extras = extras;
      }
    } catch (extrasError) {
      console.log('No extras found or table does not exist:', extrasError.message);
      booking.extras = [];
    }

    return booking;
  } catch (error) {
    console.error('Error getting booking details:', error);
    throw new DatabaseError('Failed to fetch booking details', error);
  }
}

/**
 * Simple batch insert reservation extras
 */
export async function batchInsertExtras(reservationId, extras) {
  if (!extras || typeof extras !== 'object') {
    return { insertedCount: 0 };
  }

  const extrasList = [
    { key: 'gps', name: 'GPS Navigation', price: 5 },
    { key: 'childSeat', name: 'Child Safety Seat', price: 8 },
    { key: 'additionalDriver', name: 'Additional Driver', price: 15 },
    { key: 'insurance', name: 'Comprehensive Insurance', price: 12 },
    { key: 'wifi', name: 'WiFi Hotspot', price: 4 },
    { key: 'fuelService', name: 'Fuel Service', price: 10 }
  ];

  const selectedExtras = extrasList.filter(extra => extras[extra.key]);
  
  if (selectedExtras.length === 0) {
    return { insertedCount: 0 };
  }

  try {
    let insertedCount = 0;
    
    for (const extra of selectedExtras) {
      try {
        await query(`
          INSERT INTO reservation_extras (reservation_id, extra_id, quantity, unit_price, total_price)
          SELECT ?, e.extra_id, 1, ?, ?
          FROM extras e WHERE e.name LIKE ?
          LIMIT 1
        `, [reservationId, extra.price, extra.price, `%${extra.name.split(' ')[0]}%`]);
        insertedCount++;
      } catch (err) {
        console.warn(`Failed to insert extra ${extra.name}:`, err.message);
      }
    }

    console.log(`✅ Inserted ${insertedCount} extras for reservation ${reservationId}`);
    return { insertedCount };

  } catch (error) {
    console.error('Batch insert extras failed:', error);
    throw new DatabaseError('Failed to insert reservation extras', error);
  }
}

/**
 * Get paginated list of bookings with filters
 */
export async function getBookingsList(filters = {}) {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = filters;

    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const queryParams = [];
    
    if (status && status !== 'all') {
      whereClause += ' AND r.status = ?';
      queryParams.push(status);
    }
    
    // Valid sort columns
    const validSortColumns = ['created_at', 'start_date', 'total_price', 'status'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agency_vehicles v ON r.vehicle_id = v.vehicle_id
      LEFT JOIN agencies a ON r.agency_id = a.agency_id
      ${whereClause}
    `;
    
    const countResult = await query(countQuery, queryParams);
    const totalCount = countResult[0]?.total || 0;
    
    // Get bookings
    const bookingsQuery = `
      SELECT 
        r.*,
        u.first_name AS customer_first_name,
        u.last_name AS customer_last_name,
        u.email AS customer_email,
        CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
        v.brand,
        v.model,
        v.year,
        v.images,
        a.business_name AS agency_name
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agency_vehicles v ON r.vehicle_id = v.vehicle_id
      LEFT JOIN agencies a ON r.agency_id = a.agency_id
      ${whereClause}
      ORDER BY r.${sortColumn} ${order}
      LIMIT ? OFFSET ?
    `;
    
    queryParams.push(limit, offset);
    const bookings = await query(bookingsQuery, queryParams);

    // Post-process rows to include images array and formatted display fields
    const formattedBookings = bookings.map((b) => {
      const booking = { ...b };
      // images JSON -> array
      if (booking.images) {
        try {
          booking.images = JSON.parse(booking.images);
        } catch {
          booking.images = [];
        }
      } else {
        booking.images = [];
      }

      // Vehicle display name
      booking.vehicle_display_name = `${booking.brand || ''} ${booking.model || ''} ${booking.year || ''}`.trim() || 'Unknown Vehicle';

      // Booking reference
      if (booking.reservation_id) {
        booking.booking_reference = `HLK-${String(booking.reservation_id).padStart(4, '0')}`;
      }

      // Status display
      if (booking.status) {
        booking.status_display = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
      }

      // Date formatting
      if (booking.start_date) {
        booking.start_date_formatted = new Date(booking.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      }
      if (booking.end_date) {
        booking.end_date_formatted = new Date(booking.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      }

      // Pickup location display
      booking.pickup_location_display = booking.pickup_location_name || '';

      // Price formatting (MAD)
      const amount = booking.total_price || 0;
      booking.total_price_formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD', minimumFractionDigits: 0 }).format(amount).replace('MAD', '') + ' MAD';

      return booking;
    });

      return {
      bookings: formattedBookings,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    console.error('Error getting bookings list:', error);
    throw new DatabaseError('Failed to fetch bookings list', error);
  }
}

/**
 * Batch update multiple bookings
 */
export async function batchUpdateBookings(updates) {
  try {
    if (!Array.isArray(updates) || updates.length === 0) {
      return { updatedCount: 0 };
    }

    let updatedCount = 0;
    
    for (const update of updates) {
      const { reservation_id, status, ...otherFields } = update;
      
      if (!reservation_id) {
        continue;
      }
      
      // Build SET clause dynamically
      const setParts = [];
      const updateParams = [];
      
      if (status) {
        setParts.push('status = ?');
        updateParams.push(status);
      }
      
      // Add other fields that might be updated
      Object.keys(otherFields).forEach(field => {
        const validFields = ['payment_status', 'cancellation_reason', 'total_price'];
        if (validFields.includes(field) && otherFields[field] !== undefined) {
          setParts.push(`${field} = ?`);
          updateParams.push(otherFields[field]);
        }
      });
      
      if (setParts.length === 0) {
        continue;
      }
      
      // Add updated_at timestamp
      setParts.push('updated_at = NOW()');
      updateParams.push(reservation_id);
      
      const updateQuery = `
        UPDATE reservations 
        SET ${setParts.join(', ')}
        WHERE reservation_id = ?
      `;
      
      try {
        await query(updateQuery, updateParams);
        updatedCount++;
      } catch (err) {
        console.warn(`Failed to update booking ${reservation_id}:`, err.message);
      }
    }
    
    return { updatedCount };
  } catch (error) {
    console.error('Error in batch update bookings:', error);
    throw new DatabaseError('Failed to batch update bookings', error);
  }
}
