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
    const section_type = searchParams.get('section_type');

    let query = 'SELECT * FROM about_sections WHERE is_active = 1';
    let params = [];

    if (section_type) {
      query += ' AND section_type = ?';
      params.push(section_type);
    }

    query += ' ORDER BY sort_order ASC, id ASC';

    const [rows] = await db.execute(query, params);

    return NextResponse.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching about sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about sections' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      section_type,
      title,
      subtitle,
      description,
      image,
      button_text,
      button_link,
      sort_order = 0
    } = data;

    const [result] = await db.execute(
      `INSERT INTO about_sections 
       (section_type, title, subtitle, description, image, button_text, button_link, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [section_type, title, subtitle, description, image, button_text, button_link, sort_order]
    );

    return NextResponse.json({
      success: true,
      message: 'About section created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating about section:', error);
    return NextResponse.json(
      { error: 'Failed to create about section' },
      { status: 500 }
    );
  }
}

