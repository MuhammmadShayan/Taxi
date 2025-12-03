import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'success',
      platform: 'HOLIKEY',
      version: '1.0.0',
      description: 'Multi-vendor vehicle rental platform connecting Moroccan agencies with global customers',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      features: [
        'Multi-vendor vehicle rental',
        'Flexible payment (20% or 100%)',
        'Multi-language support (EN, FR, DE)',
        'Stripe payment integration',
        'Email notifications',
        'Real-time availability',
        'Comprehensive dashboards',
        'Review system'
      ]
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}
