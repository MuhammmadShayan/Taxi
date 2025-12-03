import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { getSession } from '../../../../lib/auth';

// GET /api/reviews/[id] - Get specific review with responses
export async function GET(request, { params }) {
  try {
    const session = await getSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviewId = params.id;

    // Get review with all related data
    const [review] = await query(`
      SELECT 
        r.*,
        
        -- Customer info
        CONCAT(u.first_name, ' ', u.last_name) as customer_name,
        u.email as customer_email,
        
        -- Agency info
        a.name as agency_name,
        a.agency_id,
        
        -- Vehicle info
        CONCAT(av.brand, ' ', av.model, ' ', av.year) as vehicle_display_name,
        av.vehicle_number as license_plate,
        
        -- Reservation info
        res.start_date,
        res.end_date,
        res.total_price,
        res.status as reservation_status
        
      FROM reviews r
      LEFT JOIN customers c ON r.customer_id = c.customer_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN agencies a ON r.agency_id = a.agency_id
      LEFT JOIN agency_vehicles av ON r.vehicle_id = av.vehicle_id
      LEFT JOIN reservations res ON r.reservation_id = res.reservation_id
      WHERE r.review_id = ? AND r.deleted_at IS NULL
    `, [reviewId]);

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check access permissions
    if (session.user.role === 'customer' && review.customer_id !== session.user.customer_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    if (session.user.role === 'agency' && review.agency_id !== session.user.agency_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get review responses
    const responses = await query(`
      SELECT 
        rr.*,
        CASE 
          WHEN rr.responder_type = 'agency' THEN a.name
          WHEN rr.responder_type = 'admin' THEN CONCAT(u.first_name, ' ', u.last_name)
        END as responder_name
      FROM review_responses rr
      LEFT JOIN agencies a ON rr.responder_type = 'agency' AND rr.responder_id = a.agency_id
      LEFT JOIN users u ON rr.responder_type = 'admin' AND rr.responder_id = u.user_id
      WHERE rr.review_id = ? AND rr.deleted_at IS NULL
      ORDER BY rr.created_at ASC
    `, [reviewId]);

    return NextResponse.json({
      success: true,
      review: {
        ...review,
        created_at_formatted: new Date(review.created_at).toLocaleDateString(),
        updated_at_formatted: new Date(review.updated_at).toLocaleDateString(),
        start_date_formatted: new Date(review.start_date).toLocaleDateString(),
        end_date_formatted: new Date(review.end_date).toLocaleDateString(),
        total_price_formatted: `$${parseFloat(review.total_price || 0).toFixed(2)}`,
        recommendation_text: review.would_recommend ? 'Yes' : 'No'
      },
      responses: responses.map(response => ({
        ...response,
        created_at_formatted: new Date(response.created_at).toLocaleDateString(),
        updated_at_formatted: new Date(response.updated_at).toLocaleDateString()
      }))
    });

  } catch (error) {
    console.error('Get review error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/reviews/[id] - Update existing review
export async function PUT(request, { params }) {
  try {
    const session = await getSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviewId = params.id;
    const body = await request.json();

    // Get existing review to verify ownership
    const [existingReview] = await query(`
      SELECT r.*, c.user_id
      FROM reviews r
      JOIN customers c ON r.customer_id = c.customer_id
      WHERE r.review_id = ? AND r.deleted_at IS NULL
    `, [reviewId]);

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check permissions - only customer who created it or admin can update
    if (session.user.role === 'customer' && existingReview.user_id !== session.user.user_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (session.user.role === 'agency') {
      return NextResponse.json({ error: 'Agencies cannot modify reviews' }, { status: 403 });
    }

    // Extract update fields
    const {
      title,
      comment,
      pros,
      cons,
      overall_rating,
      vehicle_rating,
      service_rating,
      value_rating,
      would_recommend
    } = body;

    // Validate ratings if provided
    if (overall_rating && (overall_rating < 1 || overall_rating > 5)) {
      return NextResponse.json({ error: 'Overall rating must be between 1 and 5' }, { status: 400 });
    }
    if (vehicle_rating && (vehicle_rating < 1 || vehicle_rating > 5)) {
      return NextResponse.json({ error: 'Vehicle rating must be between 1 and 5' }, { status: 400 });
    }
    if (service_rating && (service_rating < 1 || service_rating > 5)) {
      return NextResponse.json({ error: 'Service rating must be between 1 and 5' }, { status: 400 });
    }
    if (value_rating && (value_rating < 1 || value_rating > 5)) {
      return NextResponse.json({ error: 'Value rating must be between 1 and 5' }, { status: 400 });
    }

    // Build update query dynamically
    const updateFields = [];
    const updateParams = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateParams.push(title);
    }
    if (comment !== undefined) {
      updateFields.push('comment = ?');
      updateParams.push(comment);
    }
    if (pros !== undefined) {
      updateFields.push('pros = ?');
      updateParams.push(pros);
    }
    if (cons !== undefined) {
      updateFields.push('cons = ?');
      updateParams.push(cons);
    }
    if (overall_rating !== undefined) {
      updateFields.push('overall_rating = ?');
      updateParams.push(overall_rating);
    }
    if (vehicle_rating !== undefined) {
      updateFields.push('vehicle_rating = ?');
      updateParams.push(vehicle_rating);
    }
    if (service_rating !== undefined) {
      updateFields.push('service_rating = ?');
      updateParams.push(service_rating);
    }
    if (value_rating !== undefined) {
      updateFields.push('value_rating = ?');
      updateParams.push(value_rating);
    }
    if (would_recommend !== undefined) {
      updateFields.push('would_recommend = ?');
      updateParams.push(would_recommend);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Add status change if admin is updating
    if (session.user.role === 'admin') {
      updateFields.push('status = ?');
      updateParams.push('pending_moderation');
    }

    updateParams.push(reviewId);

    // Update the review
    await query(`
      UPDATE reviews 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE review_id = ?
    `, updateParams);

    // Create audit log entry
    await query(`
      INSERT INTO review_audit_log (
        review_id, action, changed_by_type, changed_by_id, reason
      ) VALUES (?, 'updated', ?, ?, 'Review updated')
    `, [
      reviewId, 
      session.user.role, 
      session.user.role === 'admin' ? session.user.user_id : session.user.user_id
    ]);

    // Fetch updated review
    const [updatedReview] = await query(`
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
      message: 'Review updated successfully',
      review: {
        ...updatedReview,
        updated_at_formatted: new Date(updatedReview.updated_at).toLocaleDateString()
      }
    });

  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Failed to update review', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - Soft delete a review
export async function DELETE(request, { params }) {
  try {
    const session = await getSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviewId = params.id;

    // Get existing review to verify ownership
    const [existingReview] = await query(`
      SELECT r.*, c.user_id
      FROM reviews r
      JOIN customers c ON r.customer_id = c.customer_id
      WHERE r.review_id = ? AND r.deleted_at IS NULL
    `, [reviewId]);

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check permissions - only customer who created it or admin can delete
    if (session.user.role === 'customer' && existingReview.user_id !== session.user.user_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (session.user.role === 'agency') {
      return NextResponse.json({ error: 'Agencies cannot delete reviews' }, { status: 403 });
    }

    // Soft delete the review
    await query(`
      UPDATE reviews 
      SET deleted_at = NOW()
      WHERE review_id = ?
    `, [reviewId]);

    // Also soft delete associated responses
    await query(`
      UPDATE review_responses 
      SET deleted_at = NOW()
      WHERE review_id = ?
    `, [reviewId]);

    // Create audit log entry
    await query(`
      INSERT INTO review_audit_log (
        review_id, action, changed_by_type, changed_by_id, reason
      ) VALUES (?, 'deleted', ?, ?, 'Review deleted by user')
    `, [
      reviewId, 
      session.user.role,
      session.user.role === 'admin' ? session.user.user_id : session.user.user_id
    ]);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Failed to delete review', details: error.message },
      { status: 500 }
    );
  }
}
