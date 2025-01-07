import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

async function main(): Promise<void> {
  try {
    const pool = new Pool({
      connectionString:
        process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/chatgenius',
    });

    // Delete all test users
    await pool.query(`
      DELETE FROM users 
      WHERE email LIKE '%@example.com' 
      OR username LIKE 'testuser%' 
      OR username LIKE 'guestuser%'
    `);

    await pool.end();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error cleaning up test users:', error.message);
      process.exit(1);
    }
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.url.endsWith('cleanup-test-users.ts')) {
  main();
}
