import { NextResponse } from 'next/server';
import { verifySessionTokenEdge } from '../../../../lib/jwt-edge';

export async function GET(request) {
	const token = request.cookies.get('session')?.value;
	const session = token ? await verifySessionTokenEdge(token) : null;
	if (!session) return NextResponse.json({ user: null });
	return NextResponse.json({ user: session });
}


