import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { validate as isValidEmail } from 'email-validator';

// Validation schema for user creation
export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(255, 'Username must be at most 255 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be at most 255 characters')
    .refine((email) => isValidEmail(email), 'Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(255, 'Password must be at most 255 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  is_guest: z.boolean().default(false),
});

// Type for user creation
export type CreateUserInput = z.infer<typeof createUserSchema>;

// Type for user data from database
export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  is_guest: boolean;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  private pool: Pool;
  private static SALT_ROUNDS = 12;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Create a new user
   */
  async create(input: CreateUserInput): Promise<User> {
    // Validate input
    const validatedInput = createUserSchema.parse(input);

    // Hash password
    const password_hash = await bcrypt.hash(validatedInput.password, UserModel.SALT_ROUNDS);

    // Debug log
    console.log('Creating user with:', {
      username: validatedInput.username,
      email: validatedInput.email,
      is_guest: validatedInput.is_guest
    });

    // Insert user into database
    const query = `
      INSERT INTO users (username, email, password_hash, is_guest)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    console.log('SQL Query:', query);
    console.log('Values:', [validatedInput.username, validatedInput.email, password_hash, validatedInput.is_guest]);

    const result = await this.pool.query<User>(
      query,
      [validatedInput.username, validatedInput.email, password_hash, validatedInput.is_guest],
    );

    return result.rows[0];
  }

  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query<User>('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query<User>('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  /**
   * Find a user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    const result = await this.pool.query<User>('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
  }

  /**
   * Verify a user's password
   */
  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }

  /**
   * Update a user's information
   */
  async update(
    id: string,
    updates: Partial<Omit<CreateUserInput, 'password'>>,
  ): Promise<User | null> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return this.findById(id);

    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    const values = fields.map((field) => updates[field as keyof typeof updates]);

    const result = await this.pool.query<User>(
      `
      UPDATE users
      SET ${setClause}
      WHERE id = $1
      RETURNING *
      `,
      [id, ...values],
    );

    return result.rows[0] || null;
  }

  /**
   * Delete a user
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
} 