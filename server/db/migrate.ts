import pg from 'pg';
const { Pool } = pg;
import { promises as fs } from 'fs';
import { join } from 'path';

// Database configuration
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/chatgenius_test',
});

// Migration table name
const MIGRATIONS_TABLE = 'migrations';

/**
 * Creates the migrations table if it doesn't exist
 */
async function createMigrationsTable(): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  // eslint-disable-next-line no-console
  console.log('Migrations table created or already exists');
}

/**
 * Executes a SQL file
 */
async function executeSqlFile(filePath: string): Promise<void> {
  const sql = await fs.readFile(filePath, 'utf-8');
  await pool.query(sql);
}

/**
 * Runs all pending migrations
 */
async function runMigrations(): Promise<void> {
  try {
    // Create migrations table if it doesn't exist
    await createMigrationsTable();

    // Get list of executed migrations
    const { rows: executedMigrations } = await pool.query(
      `SELECT name FROM ${MIGRATIONS_TABLE} ORDER BY executed_at ASC;`,
    );
    const executedMigrationNames = executedMigrations.map((row) => row.name);

    // Get list of migration files
    const migrationsDir = join(process.cwd(), 'db', 'migrations');
    const files = await fs.readdir(migrationsDir);
    const pendingMigrations = files
      .filter((file) => file.endsWith('.sql'))
      .filter((file) => !executedMigrationNames.includes(file))
      .sort();

    // Execute pending migrations
    for (const migration of pendingMigrations) {
      // eslint-disable-next-line no-console
      console.log(`Executing migration: ${migration}`);
      await executeSqlFile(join(migrationsDir, migration));
      await pool.query(`INSERT INTO ${MIGRATIONS_TABLE} (name) VALUES ($1);`, [migration]);
    }

    if (pendingMigrations.length === 0) {
      // eslint-disable-next-line no-console
      console.log('No pending migrations');
    }
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.cwd()}/db/migrate.ts`) {
  runMigrations();
}
