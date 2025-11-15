/**
 * Database Migration Runner
 * Applies SQL migrations to Turso database
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getDatabase } from '../src/lib/db';
import { getConfig } from '../src/lib/config';
import { logger } from '../src/lib/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MIGRATIONS_DIR = join(__dirname, '..', 'db', 'migrations');

interface MigrationRecord {
  id: number;
  name: string;
  applied_at: number;
}

/**
 * Get list of applied migrations from database
 */
async function getAppliedMigrations(): Promise<string[]> {
  const db = getDatabase();

  // Create migrations table if it doesn't exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at INTEGER NOT NULL
    )
  `);

  const result = await db.execute('SELECT name FROM _migrations ORDER BY id');
  return result.rows.map((row) => row.name as string);
}

/**
 * Get list of migration files from filesystem
 */
function getMigrationFiles(): string[] {
  try {
    const files = readdirSync(MIGRATIONS_DIR);
    return files
      .filter((file) => file.endsWith('.sql'))
      .sort(); // Sort alphabetically (001, 002, etc.)
  } catch (error) {
    logger.error('Failed to read migrations directory', error as Error);
    return [];
  }
}

/**
 * Apply a single migration
 */
async function applyMigration(filename: string): Promise<void> {
  const db = getDatabase();
  const filepath = join(MIGRATIONS_DIR, filename);

  logger.info(`Applying migration: ${filename}`);

  try {
    // Read migration SQL
    const sql = readFileSync(filepath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    // Execute all statements in the migration
    for (const statement of statements) {
      await db.execute(statement);
    }

    // Record migration as applied
    await db.execute({
      sql: 'INSERT INTO _migrations (name, applied_at) VALUES (?, ?)',
      args: [filename, Date.now()],
    });

    logger.info(`✅ Migration applied: ${filename}`);
  } catch (error) {
    logger.error(`❌ Failed to apply migration: ${filename}`, error as Error);
    throw error;
  }
}

/**
 * Run all pending migrations
 */
async function migrate() {
  try {
    logger.info('Starting database migration');

    // Load configuration
    getConfig();

    // Get applied and available migrations
    const applied = await getAppliedMigrations();
    const available = getMigrationFiles();

    logger.info('Migration status', {
      applied: applied.length,
      available: available.length,
    });

    // Find pending migrations
    const pending = available.filter((file) => !applied.includes(file));

    if (pending.length === 0) {
      logger.info('✅ Database is up to date, no migrations to apply');
      return;
    }

    logger.info(`Found ${pending.length} pending migration(s)`);

    // Apply each pending migration
    for (const migration of pending) {
      await applyMigration(migration);
    }

    logger.info(`✅ Successfully applied ${pending.length} migration(s)`);
  } catch (error) {
    logger.error('Migration failed', error as Error);
    process.exit(1);
  }
}

/**
 * Show migration status
 */
async function status() {
  try {
    logger.info('Checking migration status');

    getConfig();

    const applied = await getAppliedMigrations();
    const available = getMigrationFiles();
    const pending = available.filter((file) => !applied.includes(file));

    console.log('\n📊 Migration Status:');
    console.log(`  Applied:   ${applied.length}`);
    console.log(`  Available: ${available.length}`);
    console.log(`  Pending:   ${pending.length}\n`);

    if (applied.length > 0) {
      console.log('✅ Applied migrations:');
      applied.forEach((name) => console.log(`  - ${name}`));
      console.log('');
    }

    if (pending.length > 0) {
      console.log('⏳ Pending migrations:');
      pending.forEach((name) => console.log(`  - ${name}`));
      console.log('');
    }
  } catch (error) {
    logger.error('Failed to get migration status', error as Error);
    process.exit(1);
  }
}

// CLI
const command = process.argv[2];

if (command === 'up' || !command) {
  migrate().then(() => process.exit(0));
} else if (command === 'status') {
  status().then(() => process.exit(0));
} else {
  console.log('Usage:');
  console.log('  pnpm migrate        - Apply pending migrations');
  console.log('  pnpm migrate up     - Apply pending migrations');
  console.log('  pnpm migrate status - Show migration status');
  process.exit(1);
}
