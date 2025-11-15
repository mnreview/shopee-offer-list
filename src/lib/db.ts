import { createClient, type Client } from '@libsql/client';

/**
 * Turso Database Client
 * Provides connection to LibSQL database with automatic configuration
 */

let dbClient: Client | null = null;

/**
 * Initialize Turso database client
 * @returns Database client instance
 * @throws Error if required environment variables are missing
 */
export function initDatabase(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('TURSO_DATABASE_URL environment variable is required');
  }

  if (!authToken) {
    throw new Error('TURSO_AUTH_TOKEN environment variable is required');
  }

  if (!dbClient) {
    dbClient = createClient({
      url,
      authToken,
    });

    console.log('✅ Turso database client initialized');
  }

  return dbClient;
}

/**
 * Get existing database client or create new one
 * @returns Database client instance
 */
export function getDatabase(): Client {
  if (!dbClient) {
    return initDatabase();
  }
  return dbClient;
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (dbClient) {
    await dbClient.close();
    dbClient = null;
    console.log('Database connection closed');
  }
}

/**
 * Test database connection
 * @returns true if connection is successful
 */
export async function testConnection(): Promise<boolean> {
  try {
    const db = getDatabase();
    const result = await db.execute('SELECT 1 as test');
    return result.rows.length > 0;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}
