import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signAgencySession } from '@/lib/auth';

// POST /api/agencies/register - Agency registration (Become a Partner)
export async function POST(request) {
  try {
    const { email, password, agencyName, contactPerson, phone, address, city, country } = await request.json();
    
    // Validate required fields
    if (!email || !password || !agencyName || !contactPerson) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if email exists
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return Response.json({ error: 'Email already registered' }, { status: 409 });
    }
    
    // Create user account
    const hashedPassword = await bcrypt.hash(password, 12);
    const userResult = await query(
      'INSERT INTO users (email, password, user_type, first_name, phone, city, country) VALUES (?, ?, "agency", ?, ?, ?, ?)',
      [email, hashedPassword, contactPerson, phone || '', city || '', country || '']
    );
    
    // Create agency record  
    const agencyNumber = `AGY${Date.now().toString().slice(-6)}`;
    await query(
      'INSERT INTO agencies (user_id, agency_number, name, contact_person, address, city, country, phone, email, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "pending")',
      [userResult.insertId, agencyNumber, agencyName, contactPerson, address || '', city || '', country || '', phone || '', email]
    );
    
    // Notify admin
    await query(
      'INSERT INTO notifications (user_id, title, message) SELECT id, "New Agency Application", ? FROM users WHERE user_type = "admin"',
      [`New agency application from ${agencyName}. Please review and approve.`]
    );
    
    return Response.json({ 
      message: 'Agency registration successful. Your application is pending approval.',
      status: 'pending_approval'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Agency registration error:', error);
    return Response.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}

// GET /api/agencies/register - Get registration form data
export async function GET() {
  try {
    return Response.json({
      countries: ['Morocco', 'France', 'Spain', 'Germany', 'United Kingdom', 'United States', 'Canada'],
      payment_methods: [
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'paypal', label: 'PayPal' },
        { value: 'bank_transfer', label: 'Bank Transfer' }
      ]
    });
  } catch (error) {
    return Response.json({ error: 'Failed to load registration data' }, { status: 500 });
  }
}