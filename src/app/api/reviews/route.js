import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { getSession } from '../../../lib/auth';

// GET /api/reviews - Fetch reviews with filters
export async function GET(request) {
  try {
    // Session is optional when requesting only approved reviews for public pages
    let session = null;
    try { session = await getSession(request); } catch {}

    const url = new URL(request.url);
    const agencyId = url.searchParams.get('agency_id');
    const vehicleId = url.searchParams.get('vehicle_id');
    const customerId = url.searchParams.get('customer_id');
    const status = url.searchParams.get('status') || 'approved';
    const sortBy = url.searchParams.get('sort_by') || 'created_at';
    const sortOrder = url.searchParams.get('sort_order') || 'DESC';
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    // If no session, only allow approved reviews
    if (!session?.user && status !== 'approved') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    // Build WHERE conditions
    let whereConditions = ['r.deleted_at IS NULL'];
    let queryParams = [];

    if (agencyId) {
      whereConditions.push('r.agency_id = ?');
      queryParams.push(agencyId);
    }

    if (vehicleId) {
      whereConditions.push('r.vehicle_id = ?');
      queryParams.push(vehicleId);
    }

    if (customerId) {
      whereConditions.push('r.customer_id = ?');
      queryParams.push(customerId);
    }

    if (status !== 'all') {
      whereConditions.push('r.status = ?');
      queryParams.push(status);
    }

    // Role-based access control
    if (session?.user?.role === 'agency') {
      whereConditions.push('r.agency_id = ?');
      queryParams.push(session.user.agency_id);
    } else if (session?.user?.role === 'customer') {
      whereConditions.push('r.customer_id = ?');
      queryParams.push(session.user.customer_id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Validate sort column
    const validSortColumns = ['created_at', 'updated_at', 'overall_rating', 'helpful_votes'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM reviews r
      ${whereClause}
    `;
    const [{ total }] = await query(countQuery, queryParams);

    // Get reviews with related data
    const reviewsQuery = `
      SELECT 
        r.*,
        
        -- Customer info
        CONCAT(u.first_name, ' ', u.last_name) as customer_name,
        u.email as customer_email,
        
        -- Agency info
        a.name as agency_name,
        
        -- Vehicle info
        CONCAT(av.brand, ' ', av.model, ' ', av.year) as vehicle_display_name,
        av.vehicle_number as license_plate,
        
        -- Reservation info
        res.start_date,
        res.end_date,
        res.total_price,
        res.status as reservation_status,
        
        -- Review responses count
        (SELECT COUNT(*) FROM review_responses rr WHERE rr.review_id = r.review_id AND rr.deleted_at IS NULL) as responses_count
        
      FROM reviews r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agencies a ON r.agency_id = a.agency_id
      LEFT JOIN agency_vehicles av ON r.vehicle_id = av.vehicle_id
      LEFT JOIN reservations res ON r.reservation_id = res.reservation_id
      ${whereClause}
      ORDER BY r.${sortColumn} ${sortDirection}
      LIMIT ? OFFSET ?
    `;

    const reviews = await query(reviewsQuery, [...queryParams, limit, offset]);

    // Format the response
    const formattedReviews = reviews.map(review => ({
      ...review,
      created_at_formatted: new Date(review.created_at).toLocaleDateString(),
      updated_at_formatted: new Date(review.updated_at).toLocaleDateString(),
      start_date_formatted: new Date(review.start_date).toLocaleDateString(),
      end_date_formatted: new Date(review.end_date).toLocaleDateString(),
      total_price_formatted: `$${parseFloat(review.total_price || 0).toFixed(2)}`,
      recommendation_text: review.would_recommend ? 'Yes' : 'No'
    }));

    return NextResponse.json({
      success: true,
      reviews: formattedReviews,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_reviews: total,
        per_page: limit
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create new review
export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session?.user || session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      reservation_id,
      title,
      comment,
      pros,
      cons,
      overall_rating,
      vehicle_rating,
      service_rating,
      value_rating,
      would_recommend = true
    } = body;

    // Validate required fields
    if (!reservation_id || !title || !comment || !overall_rating || !vehicle_rating || !service_rating || !value_rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate ratings
    const ratings = [overall_rating, vehicle_rating, service_rating, value_rating];
    if (ratings.some(rating => rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Ratings must be between 1 and 5' }, { status: 400 });
    }

    // Verify reservation eligibility
    const [reservation] = await query(`
      SELECT 
        res.reservation_id,
        res.customer_id,
        res.agency_id,
        res.vehicle_id,
        res.status,
        c.customer_id as user_customer_id
      FROM reservations res
      JOIN customers c ON res.customer_id = c.customer_id
      WHERE res.reservation_id = ? 
        AND c.user_id = ?
        AND res.status = 'completed'
    `, [reservation_id, session.user.user_id]);

    if (!reservation) {
      return NextResponse.json({ 
        error: 'Invalid reservation or reservation not completed' 
      }, { status: 400 });
    }

    // Check if review already exists for this reservation
    const [existingReview] = await query(`
      SELECT review_id FROM reviews WHERE reservation_id = ? AND deleted_at IS NULL
    `, [reservation_id]);

    if (existingReview) {
      return NextResponse.json({ 
        error: 'Review already exists for this reservation' 
      }, { status: 400 });
    }

    // Create the review
    const result = await query(`
      INSERT INTO reviews (
        reservation_id, customer_id, agency_id, vehicle_id,
        title, comment, pros, cons,
        overall_rating, vehicle_rating, service_rating, value_rating,
        would_recommend, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted')
    `, [
      reservation_id, reservation.customer_id, reservation.agency_id, reservation.vehicle_id,
      title, comment, pros || null, cons || null,
      overall_rating, vehicle_rating, service_rating, value_rating,
      would_recommend
    ]);

    const reviewId = result.insertId;

    // Create audit log entry
    await query(`
      INSERT INTO review_audit_log (
        review_id, action, changed_by_type, changed_by_id, reason
      ) VALUES (?, 'created', 'customer', ?, 'Review created by customer')
    `, [reviewId, session.user.user_id]);

    // Fetch the created review with related data
    const [newReview] = await query(`
      SELECT 
        r.*,
        CONCAT(u.first_name, ' ', u.last_name) as customer_name,
        a.name as agency_name,
        CONCAT(av.brand, ' ', av.model, ' ', av.year) as vehicle_display_name
      FROM reviews r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agencies a ON r.agency_id = a.agency_id
      LEFT JOIN agency_vehicles av ON r.vehicle_id = av.vehicle_id
      WHERE r.review_id = ?
    `, [reviewId]);

    return NextResponse.json({
      success: true,
      message: 'Review created successfully',
      review: {
        ...newReview,
        created_at_formatted: new Date(newReview.created_at).toLocaleDateString()
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to format time ago
function formatTimeAgo(date) {
  const now = new Date();
  const reviewDate = new Date(date);
  const diffInSeconds = Math.floor((now - reviewDate) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return reviewDate.toLocaleDateString();
  }
}
