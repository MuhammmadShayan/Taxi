import { NextResponse } from 'next/server';
import { query } from '../../../lib/database.js';

export async function GET() {
  try {
    // Simple test query
    const result = await query('SELECT 1 as test');
    
    return NextResponse.json({
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      testResult: result[0],
      success: true
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        error: 'Database connection failed', 
        message: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}
