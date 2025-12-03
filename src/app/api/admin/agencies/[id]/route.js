import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';
import { verifySessionToken } from '../../../../../lib/auth';

export async function PUT(request, { params }) {
  const { id } = (await params);
  const token = request.cookies.get('session')?.value;
  const session = token ? verifySessionToken(token) : null;
  
  if (!session || (session.user_type !== 'admin' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      business_name, 
      contact_name, 
      business_email, 
      business_phone, 
      business_address, 
      business_city, 
      business_country, 
      commission_rate, 
      status 
    } = body;

    // Validate required fields
    if (!business_name || !contact_name || !business_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (status && !['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await query(
      `UPDATE agencies SET 
        business_name = ?, 
        contact_name = ?, 
        business_email = ?, 
        business_phone = ?, 
        business_address = ?, 
        business_city = ?, 
        business_country = ?, 
        commission_rate = ?, 
        status = ?, 
        updated_at = CURRENT_TIMESTAMP 
      WHERE agency_id = ?`,
      [
        business_name, 
        contact_name, 
        business_email, 
        business_phone || null, 
        business_address || null, 
        business_city || null, 
        business_country || null, 
        commission_rate || 10, 
        status || 'pending', 
        id
      ]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Agency updated successfully' 
    });

  } catch (error) {
    console.error('Error updating agency:', error);
    return NextResponse.json({ 
      error: 'Failed to update agency' 
    }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { id } = (await params);
  const token = request.cookies.get('session')?.value;
  const session = token ? verifySessionToken(token) : null;
  
  if (!session || (session.user_type !== 'admin' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await query(
      'UPDATE agencies SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE agency_id = ?',
      [status, id]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Agency status updated successfully' 
    });

  } catch (error) {
    console.error('Error updating agency:', error);
    return NextResponse.json({ 
      error: 'Failed to update agency status' 
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = (await params);
  const token = request.cookies.get('session')?.value;
  const session = token ? verifySessionToken(token) : null;
  
  if (!session || (session.user_type !== 'admin' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await query(
      'DELETE FROM agencies WHERE agency_id = ?',
      [id]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Agency deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting agency:', error);
    return NextResponse.json({ 
      error: 'Failed to delete agency' 
    }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { id } = (await params);
  const token = request.cookies.get('session')?.value;
  const session = token ? verifySessionToken(token) : null;
  
  if (!session || (session.user_type !== 'admin' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const agencies = await query(`
      SELECT 
        a.*,
        u.first_name,
        u.last_name,
        u.email as owner_email
      FROM agencies a
      LEFT JOIN users u ON a.user_id = u.user_id
      WHERE a.agency_id = ?
    `, [id]);

    if (agencies.length === 0) {
      return NextResponse.json({ error: 'Agency not found' }, { status: 404 });
    }

    return NextResponse.json({ agency: agencies[0] });

  } catch (error) {
    console.error('Error fetching agency:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch agency details' 
    }, { status: 500 });
  }
}
