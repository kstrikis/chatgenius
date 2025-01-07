import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;
import { UserModel } from '../models/user.js';

// Test user data from our tests
const TEST_USERS = [
  {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test1234!',
    is_guest: false,
  },
  // Add more test users here if needed
];

async function createTestUsers() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/chatgenius_test',
  });

  try {
    const userModel = new UserModel(pool);

    for (const userData of TEST_USERS) {
      try {
        const user = await userModel.create(userData);
        console.log('Created test user:', {
          id: user.id,
          username: user.username,
          email: user.email,
        });
      } catch (error) {
        if (error instanceof Error) {
          // Skip if user already exists
          if (error.message.includes('duplicate key')) {
            console.log(`Test user ${userData.username} already exists, skipping...`);
            continue;
          }
        }
        throw error;
      }
    }

    console.log('\nTest users credentials:');
    TEST_USERS.forEach(user => {
      console.log(`\nUsername: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
    });
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if this file is executed directly
if (import.meta.url.endsWith('create-test-users.ts')) {
  createTestUsers();
} 