import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db';
import { verifyToken } from '../../../../../lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get support tickets for this user
    // Since we don't have a support_tickets table yet, return empty array
    const tickets = [];

    return NextResponse.json({
      success: true,
      tickets: tickets
    });

  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { subject, category, priority, description } = await request.json();

    // Validate required fields
    if (!subject || !description) {
      return NextResponse.json({ error: 'Subject and description are required' }, { status: 400 });
    }

    // For now, just log the ticket since we don't have support_tickets table
    console.log('Support ticket submitted:', {
      user_id: decoded.user_id,
      subject,
      category,
      priority,
      description,
      created_at: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Support ticket submitted successfully',
      ticket_id: Math.floor(Math.random() * 10000) // Mock ticket ID
    });

  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
