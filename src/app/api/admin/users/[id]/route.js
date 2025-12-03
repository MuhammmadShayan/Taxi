import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';
import { verifySessionToken } from '../../../../../lib/auth';

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

    if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await query(
      'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [status, id]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'User status updated successfully' 
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ 
      error: 'Failed to update user status' 
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
    const users = await query(
      'SELECT user_id, email, first_name, last_name, role, phone, status, address, city, country, created_at FROM users WHERE user_id = ?',
      [id]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: users[0] });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch user details' 
    }, { status: 500 });
  }
}
