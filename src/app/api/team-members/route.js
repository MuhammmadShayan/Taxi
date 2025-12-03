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
      'SELECT * FROM team_members WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
    );

    return NextResponse.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      name,
      position,
      description,
      image,
      email,
      phone,
      social_facebook,
      social_twitter,
      social_instagram,
      social_linkedin,
      sort_order = 0
    } = data;

    const [result] = await db.execute(
      `INSERT INTO team_members 
       (name, position, description, image, email, phone, social_facebook, social_twitter, social_instagram, social_linkedin, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, position, description, image, email, phone, social_facebook, social_twitter, social_instagram, social_linkedin, sort_order]
    );

    return NextResponse.json({
      success: true,
      message: 'Team member created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}
