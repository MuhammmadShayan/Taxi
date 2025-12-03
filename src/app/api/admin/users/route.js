import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifySessionTokenEdge } from '../../../../lib/jwt-edge';
import bcrypt from 'bcryptjs';

export async function GET(request) {
	try {
		const token = request.cookies.get('session')?.value;
		const session = token ? await verifySessionTokenEdge(token) : null;
		if (!session || (session.user_type !== 'admin' && session.role !== 'admin')) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '10');
		const search = searchParams.get('search') || '';
		const role = searchParams.get('role') || 'all';
		const status = searchParams.get('status') || 'all';
		const offset = (page - 1) * limit;
		
		// Build WHERE clause
		let whereClause = 'WHERE 1=1';
		let queryParams = [];
		
		if (search) {
			whereClause += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
			const searchPattern = `%${search}%`;
			queryParams.push(searchPattern, searchPattern, searchPattern);
		}
		
		if (role !== 'all') {
			whereClause += ' AND role = ?';
			queryParams.push(role);
		}
		
		if (status !== 'all') {
			whereClause += ' AND status = ?';
			queryParams.push(status);
		}
		
		// Get total count
		const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
		const countResult = await query(countQuery, queryParams);
		const total = countResult[0]?.total || 0;
		
		// Get users with pagination
		const usersQuery = `
			SELECT user_id, email, first_name, last_name, role, phone, status, created_at 
			FROM users 
			${whereClause} 
			ORDER BY created_at DESC 
			LIMIT ? OFFSET ?
		`;
		const users = await query(usersQuery, [...queryParams, limit, offset]);
		
		return NextResponse.json({ users, total, page, limit });
	} catch (error) {
		console.error('Error fetching users:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function POST(request) {
	try {
		const token = request.cookies.get('session')?.value;
		const session = token ? await verifySessionTokenEdge(token) : null;
		if (!session || (session.user_type !== 'admin' && session.role !== 'admin')) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		
		const body = await request.json();
		const { first_name, last_name, email, phone, role, status } = body;
		
		// Validate required fields
		if (!first_name || !last_name || !email || !role || !status) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}
		
		// Check if email already exists
		const existingUser = await query('SELECT user_id FROM users WHERE email = ?', [email]);
		if (existingUser.length > 0) {
			return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
		}
		
		// Generate temporary password (user should change on first login)
		const tempPassword = Math.random().toString(36).slice(-8);
		const hashedPassword = await bcrypt.hash(tempPassword, 10);
		
	const result = await query(
			`INSERT INTO users (first_name, last_name, email, phone, role, status, password_hash, created_at) 
			 VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
			[first_name, last_name, email, phone, role, status, hashedPassword]
		);
		
		return NextResponse.json({ 
			success: true, 
			user_id: result.insertId,
			tempPassword: tempPassword,
			message: 'User created successfully' 
		});
	} catch (error) {
		console.error('Error creating user:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request) {
	try {
		const token = request.cookies.get('session')?.value;
		const session = token ? await verifySessionTokenEdge(token) : null;
		if (!session || (session.user_type !== 'admin' && session.role !== 'admin')) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		
		const body = await request.json();
		const { user_id, first_name, last_name, email, phone, role, status } = body;
		
		// Validate required fields
		if (!user_id) {
			return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
		}
		
		// If only updating status (for quick status toggle)
		if (Object.keys(body).length === 2 && body.user_id && body.status) {
			await query('UPDATE users SET status = ? WHERE user_id = ?', [status, user_id]);
			return NextResponse.json({ success: true, message: 'Status updated successfully' });
		}
		
		// Full user update
		if (!first_name || !last_name || !role || !status) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}
		
		await query(
			`UPDATE users SET first_name = ?, last_name = ?, phone = ?, role = ?, status = ?, updated_at = NOW() 
			 WHERE user_id = ?`,
			[first_name, last_name, phone, role, status, user_id]
		);
		
		return NextResponse.json({ success: true, message: 'User updated successfully' });
	} catch (error) {
		console.error('Error updating user:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(request) {
	try {
		const token = request.cookies.get('session')?.value;
		const session = token ? await verifySessionTokenEdge(token) : null;
		if (!session || (session.user_type !== 'admin' && session.role !== 'admin')) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		
		const { searchParams } = new URL(request.url);
		const user_id = searchParams.get('user_id');
		
		if (!user_id) {
			return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
		}
		
		// Prevent deleting the main admin user
		if (parseInt(user_id) === 1) {
			return NextResponse.json({ error: 'Cannot delete main admin user' }, { status: 400 });
		}
		
		const result = await query('DELETE FROM users WHERE user_id = ?', [user_id]);
		
		if (result.affectedRows === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}
		
		return NextResponse.json({ success: true, message: 'User deleted successfully' });
	} catch (error) {
		console.error('Error deleting user:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

