import { sql } from './connect';
import crypto from 'node:crypto';

export type Session = {
  id: number;
  userId: number;
  token: string;
  createdAt: Date | null;
  expiresAt: Date | null;
};

// Function to create a session
export async function createSession(userId: number): Promise<Session> {
  const token = crypto.randomBytes(32).toString('hex');

  const [session] = await sql<
    {
      id: number;
      userId: number;
      token: string;
      createdAt: Date | null;
      expiresAt: Date | null;
    }[]
  >`
    INSERT INTO
      sessions (user_id, token)
    VALUES
      (
        ${userId},
        ${token}
      )
    RETURNING
      id,
      user_id AS "userId",
      token,
      created_at AS "createdAt",
      expires_at AS "expiresAt"
  `;

  if (!session) {
    throw new Error('Session creation failed');
  }

  return {
    id: session.id,
    userId: session.userId,
    token: session.token,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
  };
}

// Function to get a session by token
export async function getSessionByToken(
  token: string,
): Promise<Session | null> {
  const [session] = await sql<Session[]>`
    SELECT
      id,
      user_id AS "userId",
      token,
      created_at AS "createdAt",
      expires_at AS "expiresAt"
    FROM
      sessions
    WHERE
      token = ${token}
  `;

  return session || null;
}

// Function to delete a session by token
export async function deleteSessionByToken(token: string): Promise<void> {
  await sql`
    DELETE FROM sessions
    WHERE
      token = ${token}
  `;
}
