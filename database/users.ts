// database/users.ts

import { sql } from './connect';
import bcrypt from 'bcrypt';

export type User = {
  id: number;
  username: string;
  passwordHash: string;
};

export async function createUser(username: string, passwordHash: string): Promise<User> {
  const [user] = await sql<User[]>`
    INSERT INTO users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    RETURNING id, username, password_hash
  `;
  if (!user) {
    throw new Error('User creation failed');
  }
  return user;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const [user] = await sql<User[]>`
    SELECT id, username, password_hash
    FROM users
    WHERE username = ${username}
  `;
  return user;
}
