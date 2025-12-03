import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function POST(request) {
	try {
		const body = await request.json();
		const { full_name, email, phone = null, city = null, about = null } = body;
		if (!full_name || !email) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}
		await query(
			`INSERT INTO settings (setting_key, setting_value, description)
			 VALUES (?, ?, ?)`,
			[
				`local_expert_${Date.now()}`,
				JSON.stringify({ full_name, email, phone, city, about }),
				'local_expert_request',
			]
		);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('POST /api/local-experts error', error);
		return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
	}
}


