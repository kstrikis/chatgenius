import 'dotenv/config';
import pg from 'pg';
import { promises as fs } from 'fs';
import path from 'path';

const { Pool } = pg;
const MIGRATIONS_DIR = path.join(process.cwd(), 'db', 'migrations');

async function main(): Promise<void> {
  // First connect to postgres database to create our test database
  const pool = new Pool({
    connectionString: 'postgres://postgres:postgres@localhost:5432/postgres',
  });

  try {
    // Drop test database if it exists
    await pool.query('DROP DATABASE IF EXISTS chatgenius');
    // Create fresh test database
    await pool.query('CREATE DATABASE chatgenius');
    await pool.end();

    // Now connect to our test database
    const testPool = new Pool({
      connectionString: 'postgres://postgres:postgres@localhost:5432/chatgenius',
    });

    // Get all migration files and sort them
    const files = await fs.readdir(MIGRATIONS_DIR);
    const migrationFiles = files.filter((file) => file.endsWith('.sql')).sort();

    // Run migrations in order
    for (const file of migrationFiles) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      // eslint-disable-next-line no-console
      console.log('Reading migration file:', filePath);
      const sql = await fs.readFile(filePath, 'utf8');
      await testPool.query(sql);
    }

    await testPool.end();
  } catch (error) {
    console.error('Error setting up test database:', error);
    if (error instanceof Error) {
      console.error(error.message);
      if ('code' in error) {
        console.error('Error code:', error.code);
      }
    }
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url.endsWith('setup-test-db.ts')) {
  main();
}
