import 'dotenv/config';
import { Pool } from 'pg';
import { promises as fs } from 'fs';
import path from 'path';

// Connection to postgres database to create our app database if it doesn't exist
const postgresPool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://postgres:postgres@localhost:5432/postgres'
});

// Connection to our app database for running migrations
const appPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/chatgenius'
});

async function createDatabaseIfNotExists() {
  try {
    const dbName = 'chatgenius';
    const result = await postgresPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rows.length === 0) {
      await postgresPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully`);
    }
  } finally {
    await postgresPool.end();
  }
}

async function runMigrations() {
  try {
    await createDatabaseIfNotExists();

    // Create migrations table if it doesn't exist
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Read migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

    // Run each migration
    for (const file of sqlFiles) {
      const result = await appPool.query(
        'SELECT id FROM migrations WHERE name = $1',
        [file]
      );

      if (result.rows.length === 0) {
        const sql = await fs.readFile(
          path.join(migrationsDir, file),
          'utf-8'
        );
        
        await appPool.query('BEGIN');
        try {
          await appPool.query(sql);
          await appPool.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [file]
          );
          await appPool.query('COMMIT');
          console.log(`Migrated: ${file}`);
        } catch (error) {
          await appPool.query('ROLLBACK');
          throw error;
        }
      }
    }

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await appPool.end();
  }
}

runMigrations(); 