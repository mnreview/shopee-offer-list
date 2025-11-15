/**
 * Shopee Offer List Sync - Serverless Function Entry Point
 * Epic 1: Foundation & Infrastructure Setup
 */

import { getDatabase, testConnection } from './lib/db';
import { getConfig } from './lib/config';
import { logger } from './lib/logger';
import type { HealthCheckResponse } from './types';

/**
 * Main handler function for serverless deployment
 * This will be triggered by Cloud Scheduler
 */
export async function handler(event: any): Promise<any> {
  const startTime = Date.now();
  logger.info('Function execution started', { event });

  try {
    // Validate configuration
    const config = getConfig();
    logger.debug('Configuration loaded', {
      env: config.NODE_ENV,
    });

    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    logger.info('Database connection successful');

    // For Epic 1, just return health check
    const response: HealthCheckResponse = {
      status: 'ok',
      timestamp: Date.now(),
      database: {
        connected: true,
        latency_ms: Date.now() - startTime,
      },
      version: '0.1.0-epic1',
    };

    logger.info('Function execution completed', {
      duration_ms: Date.now() - startTime,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    logger.error('Function execution failed', error as Error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      }),
    };
  }
}

/**
 * Health check endpoint
 * Can be called directly to verify function is running
 */
export async function health(): Promise<HealthCheckResponse> {
  try {
    const startTime = Date.now();
    const isConnected = await testConnection();

    return {
      status: 'ok',
      timestamp: Date.now(),
      database: {
        connected: isConnected,
        latency_ms: Date.now() - startTime,
      },
      version: '0.1.0-epic1',
    };
  } catch (error) {
    logger.error('Health check failed', error as Error);

    return {
      status: 'error',
      timestamp: Date.now(),
      database: {
        connected: false,
      },
    };
  }
}

// For local testing
if (require.main === module) {
  logger.info('Running in local mode');

  handler({})
    .then((response) => {
      console.log('Response:', response);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
