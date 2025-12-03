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
    const key = searchParams.get('key');
    const group = searchParams.get('group');
    const publicOnly = searchParams.get('public') === 'true';

    let query = 'SELECT * FROM site_settings WHERE 1=1';
    let params = [];

    if (key) {
      query += ' AND setting_key = ?';
      params.push(key);
    }

    if (group) {
      query += ' AND group_name = ?';
      params.push(group);
    }

    if (publicOnly) {
      query += ' AND is_public = 1';
    }

    query += ' ORDER BY group_name ASC, setting_key ASC';

    const [rows] = await db.execute(query, params);

    // If requesting a single key, return just the value
    if (key && rows.length > 0) {
      const setting = rows[0];
      return NextResponse.json({
        success: true,
        data: {
          key: setting.setting_key,
          value: setting.setting_value,
          type: setting.setting_type
        }
      });
    }

    // Convert to key-value pairs for easier frontend usage
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = {
        value: row.setting_value,
        type: row.setting_type,
        description: row.description,
        group: row.group_name
      };
    });

    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      setting_key,
      setting_value,
      setting_type = 'text',
      description,
      group_name = 'general',
      is_public = true
    } = data;

    const [result] = await db.execute(
      `INSERT INTO site_settings 
       (setting_key, setting_value, setting_type, description, group_name, is_public) 
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       setting_value = VALUES(setting_value),
       setting_type = VALUES(setting_type),
       description = VALUES(description),
       group_name = VALUES(group_name),
       is_public = VALUES(is_public)`,
      [setting_key, setting_value, setting_type, description, group_name, is_public]
    );

    return NextResponse.json({
      success: true,
      message: 'Site setting saved successfully'
    });
  } catch (error) {
    console.error('Error saving site setting:', error);
    return NextResponse.json(
      { error: 'Failed to save site setting' },
      { status: 500 }
    );
  }
}
