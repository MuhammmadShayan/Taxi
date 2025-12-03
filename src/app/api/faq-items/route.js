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
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    let query = 'SELECT * FROM faq_items WHERE is_active = 1';
    let params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
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
    console.error('Error fetching FAQ items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQ items' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      question,
      answer,
      category = 'general',
      sort_order = 0
    } = data;

    const [result] = await db.execute(
      `INSERT INTO faq_items 
       (question, answer, category, sort_order) 
       VALUES (?, ?, ?, ?)`,
      [question, answer, category, sort_order]
    );

    return NextResponse.json({
      success: true,
      message: 'FAQ item created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating FAQ item:', error);
    return NextResponse.json(
      { error: 'Failed to create FAQ item' },
      { status: 500 }
    );
  }
}
