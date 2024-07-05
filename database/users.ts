import { sql } from './connect';
import bcrypt from 'bcrypt';

export type User = {
  id: number;
  username: string;
  passwordHash: string;
};

// Function to create a user
export async function createUser(
  username: string,
  password: string,
): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 10); // Hash password
  const [user] = await sql<
    {
      id: number | null;
      username: string | null;
      passwordHash: string | null;
    }[]
  >`
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
    id: user.id!,
    username: user.username!,
    passwordHash: user.passwordHash!,
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

export async function deleteUserById(id: number): Promise<void> {
  await sql`
    DELETE FROM users
    WHERE
      id = ${id}
  `;
}
