import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Create a small pool for this route, consistent with other API routes
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'my_travel_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Check for existing subscriber
    const [existing] = await db.execute(
      'SELECT id FROM newsletter_subscribers WHERE email = ? LIMIT 1',
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: "You're already subscribed. Stay tuned for updates!",
        alreadySubscribed: true
      });
    }

    // Insert new subscriber
    await db.execute(
      'INSERT INTO newsletter_subscribers (email, status) VALUES (?, ?)',
      [email, 'active']
    );

    return NextResponse.json({
      success: true,
      message: 'Thanks for subscribing! You will now receive our latest updates and offers.'
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again in a moment.' },
      { status: 500 }
    );
  }
}