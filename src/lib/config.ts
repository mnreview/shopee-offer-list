import { config } from 'dotenv';
import type { EnvConfig } from '../types';

// Load environment variables from .env file (development only)
if (process.env.NODE_ENV !== 'production') {
  config();
}

/**
 * Validate and return environment configuration
 * @throws Error if required variables are missing
 */
export function getConfig(): EnvConfig {
  const required = ['TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file or cloud function configuration.'
    );
  }

  return {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL!,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN!,
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    LOG_LEVEL: (process.env.LOG_LEVEL as any) || 'info',
  };
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}
