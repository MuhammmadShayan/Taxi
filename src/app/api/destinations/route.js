import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'holikey',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured_only = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit');

    let query = 'SELECT * FROM destinations WHERE is_active = 1';
    let params = [];

    if (featured_only) {
      query += ' AND is_featured = 1';
    }

    query += ' ORDER BY sort_order ASC, id ASC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [rows] = await db.execute(query, params);

    return NextResponse.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      name,
      country,
      city,
      description,
      image,
      featured_image,
      price_range,
      popular_attractions,
      best_time_to_visit,
      is_featured = false,
      sort_order = 0,
      meta_title,
      meta_description
    } = data;

    const [result] = await db.execute(
      `INSERT INTO destinations 
       (name, country, city, description, image, featured_image, price_range, popular_attractions, best_time_to_visit, is_featured, sort_order, meta_title, meta_description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, country, city, description, image, featured_image, price_range, 
       JSON.stringify(popular_attractions), best_time_to_visit, is_featured, sort_order, meta_title, meta_description]
    );

    return NextResponse.json({
      success: true,
      message: 'Destination created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating destination:', error);
    return NextResponse.json(
      { error: 'Failed to create destination' },
      { status: 500 }
    );
  }
}
