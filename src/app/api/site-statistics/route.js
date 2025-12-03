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
    const [rows] = await db.execute(
      'SELECT * FROM site_statistics WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
    );

    return NextResponse.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching site statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site statistics' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      title,
      value,
      symbol,
      icon,
      description,
      sort_order = 0
    } = data;

    const [result] = await db.execute(
      `INSERT INTO site_statistics 
       (title, value, symbol, icon, description, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, value, symbol, icon, description, sort_order]
    );

    return NextResponse.json({
      success: true,
      message: 'Site statistic created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating site statistic:', error);
    return NextResponse.json(
      { error: 'Failed to create site statistic' },
      { status: 500 }
    );
  }
}
