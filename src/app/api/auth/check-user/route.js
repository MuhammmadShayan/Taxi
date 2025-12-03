import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const users = await query(
      'SELECT user_id, first_name, last_name, email, phone, address, city, country FROM users WHERE email = ?',
      [email]
    );

    if (users.length > 0) {
      const user = users[0];
      return NextResponse.json({
        success: true,
        exists: true,
        user: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          city: user.city,
          country: user.country
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        exists: false
      });
    }

  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
