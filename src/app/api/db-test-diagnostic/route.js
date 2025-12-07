import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const results = {
    ip: 'unknown',
    connection: 'pending',
    error: null,
    config: {
      host: process.env.DB_HOST || 'derived from URL',
      user: '***',
      database: 'smartes_my_travel_app'
    }
  };

  try {
    // 1. Get Vercel's Outbound IP
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();
    results.ip = ipData.ip;

    // 2. Parse Config
    const dbUrl = process.env.DATABASE_URL;
    let connectionConfig = {};
    
    if (dbUrl) {
        try {
            const u = new URL(dbUrl);
            connectionConfig = {
                host: u.hostname,
                user: decodeURIComponent(u.username),
                password: decodeURIComponent(u.password),
                database: u.pathname.replace(/^\//, ''),
                port: Number(u.port || 3306),
                connectTimeout: 5000 // 5s timeout
            };
        } catch (e) {
             console.error('Invalid DATABASE_URL', e);
        }
    } 
    
    // Fallback if no URL or invalid
    if (!connectionConfig.host) {
        connectionConfig = {
            host: process.env.DB_HOST || 'webhosting2026.is.cc',
            user: process.env.DB_USER || 'smartes_my_travel_app',
            password: process.env.DB_PASSWORD || 'my_travel_app_2025',
            database: process.env.DB_NAME || 'smartes_my_travel_app',
            port: Number(process.env.DB_PORT || 3306),
            connectTimeout: 5000
        };
    }

    results.config.host = connectionConfig.host;

    // 3. Test Connection
    const conn = await mysql.createConnection(connectionConfig);
    await conn.ping();
    await conn.end();
    
    results.connection = 'success';
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully!',
      details: results
    });

  } catch (error) {
    results.connection = 'failed';
    results.error = error.message;
    
    return NextResponse.json({
      success: false,
      message: 'Connection Failed',
      action_required: `Please whitelist IP: ${results.ip} in cPanel Remote MySQL`,
      details: results
    }, { status: 500 });
  }
}
