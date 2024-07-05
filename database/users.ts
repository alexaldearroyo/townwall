import { sql } from './connect';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

export type User = {
  id: number;
  username: string;
  passwordHash: string;
};

export type Session = {
  id: number;
  userId: number;
  token: string;
  createdAt: Date | null;
  expiresAt: Date | null;
};

// REGISTRATION

// Function to create a user
export async function createUser(
  username: string,
  password: string,
): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 10); // Hash password
  const [user] = await sql<User[]>`
    INSERT INTO
      users (username, password_hash)
    VALUES
      (
        ${username},
        ${passwordHash}
      )
    RETURNING
      id,
      username,
      password_hash AS "passwordHash"
  `;

  if (!user) {
    throw new Error('User creation failed');
  }

  return {
    id: user.id,
    username: user.username,
    passwordHash: user.passwordHash,
  };
}

// Function to get a user by their username
export async function getUserByUsername(
  username: string,
): Promise<User | undefined> {
  const [user] = await sql<User[]>`
    SELECT
      id,
      username,
      password_hash AS "passwordHash"
    FROM
      users
    WHERE
      username = ${username}
  `;

  return user || undefined;
}

// Function to get a user by their ID
export async function getUserById(id: number): Promise<User | undefined> {
  const [user] = await sql<User[]>`
    SELECT
      id,
      username,
      password_hash AS "passwordHash"
    FROM
      users
    WHERE
      id = ${id}
  `;

  return user || undefined;
}

// SESSION MANAGEMENT

// Function to create a session
export async function createSession(userId: number): Promise<Session> {
  const token = crypto.randomBytes(32).toString('hex');
  const [session] = await sql<Session[]>`
    INSERT INTO
      sessions (user_id, token)
    VALUES
      (
        ${userId},
        ${token}
      )
    RETURNING
      id,
      user_id,
      token,
      created_at AS "createdAt",
      expires_at AS "expiresAt"
  `;

  if (!session) {
    throw new Error('Failed to create session');
  }

  return session;
}

// Function to get a session by token
export async function getSessionByToken(
  token: string,
): Promise<Session | undefined> {
  const [session] = await sql<Session[]>`
    SELECT
      id,
      user_id,
      token,
      created_at,
      expires_at
    FROM
      sessions
    WHERE
      token = ${token}
  `;
  return session;
}

// Function to delete a session
export async function deleteSession(token: string): Promise<void> {
  await sql`
    DELETE FROM sessions
    WHERE
      token = ${token}
  `;
}
