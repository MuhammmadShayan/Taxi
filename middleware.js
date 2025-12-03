import { NextResponse } from 'next/server';
import { verifySessionTokenEdge } from './src/lib/jwt-edge';

function roleDashboard(role) {
	const r = (role || '').toLowerCase();
	switch (r) {
		case 'admin':
			return '/admin/dashboard';
		case 'agency_owner':
		case 'agency_admin':
		case 'agency':
			return '/agency/dashboard';
		case 'driver':
			return '/driver/dashboard';
		case 'customer':
		case 'client':
		case 'passenger':
		case 'user':
			return '/customer/dashboard';
		default:
			return '/';
	}
}

export async function middleware(request) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get('session')?.value;
	const session = token ? await verifySessionTokenEdge(token) : null;

	if (pathname.startsWith('/admin')) {
		if (!session) {
			const url = new URL('/', request.url);
			return NextResponse.redirect(url);
		}
		if (session.user_type !== 'admin' && session.role !== 'admin') {
			const url = new URL(roleDashboard(session?.user_type || ''), request.url);
			return NextResponse.redirect(url);
		}
	}

	if (pathname.startsWith('/user')) {
		if (!session || session.user_type !== 'passenger') {
			const url = new URL(roleDashboard(session?.user_type || ''), request.url);
			return NextResponse.redirect(url);
		}
	}

	if (pathname.startsWith('/driver')) {
		if (!session || session.user_type !== 'driver') {
			const url = new URL(roleDashboard(session?.user_type || ''), request.url);
			return NextResponse.redirect(url);
		}
	}

	if (pathname.startsWith('/agency')) {
		if (!session || !['agency_owner', 'agency_admin', 'agency', 'driver'].includes(session.user_type)) {
			const url = new URL(roleDashboard(session?.user_type || ''), request.url);
			return NextResponse.redirect(url);
		}
	}

	if (pathname.startsWith('/customer')) {
		if (!session || !['customer', 'client', 'passenger', 'user'].includes(session.user_type)) {
			const url = new URL(roleDashboard(session?.user_type || ''), request.url);
			return NextResponse.redirect(url);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/admin/:path*', 
		'/user/:path*', 
		'/driver/:path*', 
		'/agency/:path*', 
		'/customer/:path*'
	],
};


