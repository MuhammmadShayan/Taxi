import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Get the customer's email from the Authorization header or query params
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const customerEmail = searchParams.get('customer_email');

    let userEmail = customerEmail;

    // If we have an authorization header, verify JWT and get user email
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        userEmail = decoded.email;
      } catch (jwtError) {
        console.log('JWT verification failed, using query params');
      }
    }

    if (!userEmail) {
      return NextResponse.json({
        success: false,
        message: 'Customer email is required'
      }, { status: 400 });
    }

    // Get customer ID first
    const customerQuery = `
      SELECT c.customer_id, u.user_id
      FROM customers c
      LEFT JOIN users u ON c.user_id = u.user_id
      WHERE u.email = ?
      LIMIT 1
    `;
    
    const customerResult = await query(customerQuery, [userEmail]);
    
    if (customerResult.length === 0) {
      // Customer doesn't exist, return zero stats
      return NextResponse.json({
        success: true,
        statistics: {
          active_bookings: 0,
          total_bookings: 0,
          completed_bookings: 0,
          pending_bookings: 0,
          confirmed_bookings: 0,
          canceled_bookings: 0,
          wishlist_items: 0,
          average_rating: 0,
          total_spent: 0,
          upcoming_bookings: 0
        }
      });
    }

    const customerId = customerResult[0].customer_id;
    const userId = customerResult[0].user_id;

    // Get booking statistics
    const bookingStatsQuery = `
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_bookings,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
        SUM(CASE WHEN status = 'canceled' THEN 1 ELSE 0 END) as canceled_bookings,
        SUM(CASE WHEN status IN ('confirmed', 'active') AND start_date > CURDATE() THEN 1 ELSE 0 END) as upcoming_bookings,
        COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total_price ELSE 0 END), 0) as total_spent
      FROM reservations 
      WHERE customer_id = ?
    `;

    const bookingStats = await query(bookingStatsQuery, [customerId]);

    // Get wishlist count (assuming you have a wishlist table - if not, we'll set to 0)
    let wishlistCount = 0;
    try {
      const wishlistQuery = `SELECT COUNT(*) as wishlist_count FROM wishlists WHERE user_id = ?`;
      const wishlistResult = await query(wishlistQuery, [userId]);
      wishlistCount = wishlistResult[0]?.wishlist_count || 0;
    } catch (wishlistError) {
      // Wishlist table might not exist, default to 0
      console.log('Wishlist table not found, setting count to 0');
    }

    // Get average rating given by this customer (their reviews)
    let averageRating = 0;
    try {
      const ratingQuery = `
        SELECT AVG(overall_rating) as avg_rating 
        FROM reviews 
        WHERE customer_id = ? AND overall_rating IS NOT NULL
      `;
      const ratingResult = await query(ratingQuery, [customerId]);
      averageRating = parseFloat(ratingResult[0]?.avg_rating || 0);
    } catch (ratingError) {
      console.log('Reviews table not found or error getting ratings');
    }

    // Get recent bookings for additional context
    const recentBookingsQuery = `
      SELECT 
        r.reservation_id,
        r.start_date,
        r.end_date,
        r.status,
        r.total_price,
        v.make,
        v.model,
        v.year,
        a.business_name as agency_name
      FROM reservations r
      LEFT JOIN vehicles v ON r.vehicle_id = v.id
      LEFT JOIN agencies a ON r.agency_id = a.agency_id
      WHERE r.customer_id = ?
      ORDER BY r.created_at DESC
      LIMIT 5
    `;

    const recentBookings = await query(recentBookingsQuery, [customerId]);

    // Format recent bookings
    const formattedRecentBookings = recentBookings.map(booking => ({
      ...booking,
      vehicle_display_name: `${booking.make} ${booking.model} ${booking.year}`,
      start_date_formatted: booking.start_date ? new Date(booking.start_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : null,
      end_date_formatted: booking.end_date ? new Date(booking.end_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : null,
      total_price_formatted: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 0
      }).format(booking.total_price || 0).replace('MAD', '') + ' MAD'
    }));

    const stats = bookingStats[0] || {};

    return NextResponse.json({
      success: true,
      statistics: {
        // Main dashboard stats
        active_bookings: parseInt(stats.active_bookings) || 0,
        total_bookings: parseInt(stats.total_bookings) || 0,
        completed_bookings: parseInt(stats.completed_bookings) || 0,
        pending_bookings: parseInt(stats.pending_bookings) || 0,
        confirmed_bookings: parseInt(stats.confirmed_bookings) || 0,
        canceled_bookings: parseInt(stats.canceled_bookings) || 0,
        upcoming_bookings: parseInt(stats.upcoming_bookings) || 0,
        
        // Additional stats
        wishlist_items: wishlistCount,
        average_rating: parseFloat(averageRating.toFixed(1)) || 0,
        total_spent: parseFloat(stats.total_spent) || 0,
        total_spent_formatted: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'MAD',
          minimumFractionDigits: 0
        }).format(stats.total_spent || 0).replace('MAD', '') + ' MAD'
      },
      recent_bookings: formattedRecentBookings
    });

  } catch (error) {
    console.error('Error fetching customer dashboard statistics:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch dashboard statistics. Please try again.'
    }, { status: 500 });
  }
}
