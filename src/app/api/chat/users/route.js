import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    // Verify user authentication (accept header Bearer or session cookie)
    const headerToken = req.headers.get('authorization')?.replace('Bearer ', '');
    const cookieToken = req.cookies.get('session')?.value || req.cookies.get('holikey_session')?.value;
    const token = headerToken || cookieToken;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userRole = searchParams.get('role');
    const search = searchParams.get('search');

    let whereClause = 'WHERE u.user_id != ? AND u.status = "active"';
    let queryParams = [user.user_id];

    // Filter by role if specified
    if (userRole) {
      whereClause += ' AND u.role = ?';
      queryParams.push(userRole);
    }

    // Add search functionality
    if (search) {
      whereClause += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Get users based on current user's role
    let users;
    
    if (user.role === 'admin') {
      // Admin can see all users
      users = await query(`
        SELECT 
          u.user_id,
          u.first_name,
          u.last_name,
          u.email,
          u.role,
          u.profile_image,
          u.created_at,
          CASE 
            WHEN u.role = 'agency_owner' THEN a.business_name
            ELSE NULL
          END as business_name,
          CASE 
            WHEN u.role = 'agency_owner' THEN a.status
            ELSE NULL
          END as agency_status
        FROM users u
        LEFT JOIN agencies a ON u.user_id = a.user_id
        ${whereClause}
        ORDER BY u.first_name, u.last_name
      `, queryParams);
    } else if (user.role === 'agency_owner' || user.role === 'agency_admin') {
      // For agency role: if a role filter is provided, list all active users of that role (excluding self). Otherwise, restrict to prior contacts (admins + customers who booked with this agency)
      if (userRole) {
        users = await query(`
          SELECT 
            u.user_id,
            u.first_name,
            u.last_name,
            u.email,
            u.role,
            u.profile_image,
            u.created_at,
            a.business_name
          FROM users u
          LEFT JOIN agencies a ON u.user_id = a.user_id
          WHERE u.user_id != ?
            AND u.status = 'active'
            AND u.role = ?
            ${search ? 'AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR a.business_name LIKE ?)' : ''}
          ORDER BY u.first_name, u.last_name
        `, search ? 
          [user.user_id, userRole, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`] :
          [user.user_id, userRole]
        );
      } else {
        users = await query(`
          SELECT DISTINCT
            u.user_id,
            u.first_name,
            u.last_name,
            u.email,
            u.role,
            u.profile_image,
            u.created_at
          FROM users u
          WHERE (
            u.role = 'admin' OR 
            (u.role = 'customer' AND u.user_id IN (
              SELECT DISTINCT c.user_id
              FROM customers c
              INNER JOIN reservations r ON c.customer_id = r.customer_id
              INNER JOIN agencies a ON r.agency_id = a.agency_id
              WHERE a.user_id = ?
            ))
          ) 
          AND u.user_id != ? 
          AND u.status = 'active'
          ${search ? 'AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)' : ''}
          ORDER BY u.first_name, u.last_name
        `, search ? 
          [user.user_id, user.user_id, `%${search}%`, `%${search}%`, `%${search}%`] : 
          [user.user_id, user.user_id]
        );
      }
    } else {
      // Customer: if a role filter is provided, list all active users of that role (excluding self). Otherwise, restrict to prior contacts (admins + agencies they've booked with)
      if (userRole) {
        users = await query(`
          SELECT 
            u.user_id,
            u.first_name,
            u.last_name,
            u.email,
            u.role,
            u.profile_image,
            u.created_at,
            a.business_name
          FROM users u
          LEFT JOIN agencies a ON u.user_id = a.user_id
          WHERE u.user_id != ?
            AND u.status = 'active'
            AND u.role = ?
            ${search ? 'AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR a.business_name LIKE ?)' : ''}
          ORDER BY u.first_name, u.last_name
        `, search ? 
          [user.user_id, userRole, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`] : 
          [user.user_id, userRole]
        );
      } else {
        users = await query(`
          SELECT DISTINCT
            u.user_id,
            u.first_name,
            u.last_name,
            u.email,
            u.role,
            u.profile_image,
            u.created_at,
            CASE 
              WHEN u.role = 'agency_owner' THEN a.business_name
              ELSE NULL
            END as business_name
          FROM users u
          LEFT JOIN agencies a ON u.user_id = a.user_id
          WHERE (
            u.role = 'admin' OR 
            (u.role = 'agency_owner' AND u.user_id IN (
              SELECT DISTINCT a.user_id
              FROM agencies a
              INNER JOIN reservations r ON a.agency_id = r.agency_id
              INNER JOIN customers c ON r.customer_id = c.customer_id
              WHERE c.user_id = ?
            ))
          ) 
          AND u.user_id != ? 
          AND u.status = 'active'
          ${search ? 'AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR a.business_name LIKE ?)' : ''}
          ORDER BY u.first_name, u.last_name
        `, search ? 
          [user.user_id, user.user_id, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`] : 
          [user.user_id, user.user_id]
        );
      }
    }

    return NextResponse.json({ users });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
