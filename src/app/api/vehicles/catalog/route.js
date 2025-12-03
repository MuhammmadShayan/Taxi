import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const year = searchParams.get('year');
    const limit = Math.min(parseInt(searchParams.get('limit')) || 20, 100);

    const conditions = [];
    const params = [];
    if (q) {
      conditions.push('(make LIKE ? OR model LIKE ? OR CONCAT(make, " ", model) LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (make) { conditions.push('make = ?'); params.push(make); }
    if (model) { conditions.push('model = ?'); params.push(model); }
    if (year) { conditions.push('year = ?'); params.push(parseInt(year)); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const rows = await query(
      `SELECT id, make, model, year, daily_rate, price_usd, mileage, location, images FROM vehicles ${where} ORDER BY year DESC, make ASC, model ASC LIMIT ?`,
      [...params, limit]
    );
    const results = rows.map(r => ({
      ...r,
      images: r.images ? (typeof r.images === 'string' ? JSON.parse(r.images) : r.images) : []
    }));
    return NextResponse.json({ success: true, results });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}


