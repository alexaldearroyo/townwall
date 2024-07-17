import { sql } from './connect';
import crypto from 'node:crypto';

export type Session = {
  id: number;
  userId: number;
  token: string;
  createdAt: Date;
  expiresAt: Date;
};

export async function createSession(userId: number): Promise<Session> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  const [session] = await sql<
    {
      id: number;
      userId: number;
      token: string;
      createdAt: Date;
      expiresAt: Date;
    }[]
  >`
    INSERT INTO
      sessions (user_id, token, expires_at)
    VALUES
      (
        ${userId},
        ${token},
        ${expiresAt}
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

export async function getSessionByToken(
  token: string,
): Promise<Session | null> {
  const [session] = await sql<
    {
      id: number;
      userId: number;
      token: string;
      createdAt: Date;
      expiresAt: Date;
    }[]
  >`
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

  return session
    ? {
        id: session.id,
        userId: session.userId,
        token: session.token,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
      }
    : null;
}

export async function deleteSessionByToken(token: string): Promise<void> {
  await sql`
    DELETE FROM sessions
    WHERE
      token = ${token}
  `;
}
