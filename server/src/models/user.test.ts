import { Pool } from 'pg';
import { UserModel, createUserSchema } from './user';

describe('User Model', () => {
  let pool: Pool;
  let userModel: UserModel;

  beforeAll(async () => {
    // Create a new pool for testing
    pool = new Pool({
      connectionString:
        process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/chatgenius_test',
    });

    // Run migrations
    await pool.query('BEGIN');
  });

  beforeEach(() => {
    userModel = new UserModel(pool);
  });

  afterEach(async () => {
    // Clean up test data
    await pool.query('DELETE FROM users');
  });

  afterAll(async () => {
    await pool.query('ROLLBACK');
    await pool.end();
  });

  describe('Validation', () => {
    it('should validate a valid user input', () => {
      const validInput = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test1234!',
        is_guest: false,
      };

      const result = createUserSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should reject invalid username', () => {
      const invalidInput = {
        username: 'te', // too short
        email: 'test@example.com',
        password: 'Test1234!',
        is_guest: false,
      };

      const result = createUserSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const invalidInput = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'Test1234!',
        is_guest: false,
      };

      const result = createUserSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const invalidInput = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak',
        is_guest: false,
      };

      const result = createUserSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('Database Operations', () => {
    const validUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test1234!',
      is_guest: false,
    };

    it('should create a new user', async () => {
      const user = await userModel.create(validUser);
      expect(user).toHaveProperty('id');
      expect(user.username).toBe(validUser.username);
      expect(user.email).toBe(validUser.email);
      expect(user.is_guest).toBe(validUser.is_guest);
      expect(user.password_hash).toBeDefined();
      expect(user.created_at).toBeDefined();
      expect(user.updated_at).toBeDefined();
    });

    it('should find user by ID', async () => {
      const created = await userModel.create(validUser);
      const found = await userModel.findById(created.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should find user by email', async () => {
      await userModel.create(validUser);
      const found = await userModel.findByEmail(validUser.email);
      expect(found).toBeDefined();
      expect(found?.email).toBe(validUser.email);
    });

    it('should find user by username', async () => {
      await userModel.create(validUser);
      const found = await userModel.findByUsername(validUser.username);
      expect(found).toBeDefined();
      expect(found?.username).toBe(validUser.username);
    });

    it('should verify correct password', async () => {
      const user = await userModel.create(validUser);
      const isValid = await userModel.verifyPassword(user, validUser.password);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const user = await userModel.create(validUser);
      const isValid = await userModel.verifyPassword(user, 'wrongpassword');
      expect(isValid).toBe(false);
    });

    it('should update user information', async () => {
      const user = await userModel.create(validUser);
      const updates = {
        username: 'newusername',
        email: 'newemail@example.com',
      };
      const updated = await userModel.update(user.id, updates);
      expect(updated).toBeDefined();
      expect(updated?.username).toBe(updates.username);
      expect(updated?.email).toBe(updates.email);
    });

    it('should delete user', async () => {
      const user = await userModel.create(validUser);
      const deleted = await userModel.delete(user.id);
      expect(deleted).toBe(true);
      const found = await userModel.findById(user.id);
      expect(found).toBeNull();
    });

    it('should enforce unique username', async () => {
      await userModel.create(validUser);
      const duplicateUser = {
        ...validUser,
        email: 'another@example.com',
      };
      await expect(userModel.create(duplicateUser)).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      await userModel.create(validUser);
      const duplicateUser = {
        ...validUser,
        username: 'anotheruser',
      };
      await expect(userModel.create(duplicateUser)).rejects.toThrow();
    });
  });
}); 