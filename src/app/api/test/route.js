import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      message: 'API is working',
      timestamp: new Date().toISOString(),
      success: true
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'API test failed', message: error.message },
      { status: 500 }
    );
  }
}
