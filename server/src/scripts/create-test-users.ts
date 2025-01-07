import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;
import { UserModel } from '../models/user.js';

async function main(): Promise<void> {
  try {
    const pool = new Pool({
      connectionString:
        process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/chatgenius',
    });

    const userModel = new UserModel(pool);

    // Create test users
    const users = [
      {
        username: 'testuser1',
        email: 'test1@example.com',
        password: 'Test1234!',
        is_guest: false,
      },
      {
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'Test1234!',
        is_guest: false,
      },
      {
        username: 'guestuser1',
        email: 'guest1@example.com',
        password: 'Guest1234!',
        is_guest: true,
      },
    ];

    for (const userData of users) {
      try {
        await userModel.create(userData);
      } catch (error) {
        if (error instanceof Error) {
          // Skip if user already exists
          if (error.message.includes('duplicate key')) {
            continue;
          }
        }
        throw error;
      }
    }

    await pool.end();
  } catch (error) {
    if (error instanceof Error) {
      process.exit(1);
    }
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.url.endsWith('create-test-users.ts')) {
  main();
}
