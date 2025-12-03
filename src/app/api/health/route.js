import { NextResponse } from 'next/server';
import { healthCheck, getPoolStatus } from '../../../lib/database.js';
import { requireAdmin } from '../../../lib/authMiddleware.js';
import { withErrorHandler } from '../../../lib/errorHandler.js';

/**
 * Public health check endpoint
 */
export async function GET(request) {
  try {
    const dbHealth = await healthCheck();
    
    // Public health check - limited information
    const publicHealth = {
      status: dbHealth.status,
      timestamp: dbHealth.timestamp,
      responseTime: dbHealth.responseTime
    };
    
    const statusCode = dbHealth.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json({
      success: true,
      health: publicHealth
    }, { status: statusCode });
    
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      success: false,
      health: {
        status: 'unhealthy',
        timestamp: new Date().toISOString()
      }
    }, { status: 503 });
  }
}

/**
 * Detailed health check for admins only
 */
export const POST = withErrorHandler(requireAdmin(async (request) => {
  const dbHealth = await healthCheck();
  const poolStatus = getPoolStatus();
  
  // Detailed system information for admins
  const detailedHealth = {
    database: dbHealth,
    connectionPool: poolStatus,
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    },
    timestamp: new Date().toISOString()
  };
  
  const statusCode = dbHealth.status === 'healthy' ? 200 : 503;
  
  return NextResponse.json({
    success: true,
    health: detailedHealth
  }, { status: statusCode });
}));


