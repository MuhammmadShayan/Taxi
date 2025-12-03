import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { verifySessionToken } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('session')?.value;
    const session = token ? verifySessionToken(token) : null;
    if (!session || session.user_type !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categoriesQuery = `
      SELECT 
        category_id,
        name,
        description,
        icon
      FROM vehicle_categories
      ORDER BY name ASC
    `;
    
    const categories = await query(categoriesQuery);
    
    return NextResponse.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Error fetching vehicle categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
