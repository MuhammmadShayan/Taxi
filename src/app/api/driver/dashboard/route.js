import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifySessionToken } from '../../../../lib/auth';

export async function GET(request) {
	const token = request.cookies.get('session')?.value;
	const session = token ? verifySessionToken(token) : null;
	if (!session || session.user_type !== 'driver') {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	const [{ active }] = await query(
		`SELECT COUNT(*) AS active FROM bookings WHERE driver_id = ? AND booking_status IN ('confirmed','in_progress')`,
		[session.id]
	);
	const [{ completed }] = await query(
		`SELECT COUNT(*) AS completed FROM bookings WHERE driver_id = ? AND booking_status = 'completed'`,
		[session.id]
	);
	return NextResponse.json({ active, completed });
}


