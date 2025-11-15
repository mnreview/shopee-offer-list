/**
 * Type definitions for Shopee Offer List Sync Service
 */

/**
 * Offer data structure matching database schema
 */
export interface Offer {
  offer_id: string;
  name: string;
  price: number | null;
  commission_rate: number | null;
  commission: number | null;
  link: string | null;
  image_url: string | null;
  category_name: string | null;
  updated_at: number;
}

/**
 * Database migration record
 */
export interface Migration {
  id: number;
  name: string;
  applied_at: number;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: number;
  database: {
    connected: boolean;
    latency_ms?: number;
  };
  version?: string;
}

/**
 * Cloud Function event (generic)
 */
export interface CloudFunctionEvent {
  type: string;
  timestamp: string;
  [key: string]: any;
}

/**
 * Cloud Function response
 */
export interface CloudFunctionResponse {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

/**
 * Environment configuration
 */
export interface EnvConfig {
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;
  NODE_ENV?: 'development' | 'production' | 'test';
  LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
}
