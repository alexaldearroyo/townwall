import { sql } from './connect';

export type ProfileComment = {
  id: number;
  profileId: number;
  userId: number;
  content: string;
  createdAt: Date;
  username: string;
};

export async function createProfileComment(
  profileId: number,
  userId: number,
  content: string,
): Promise<ProfileComment> {
  try {
    const user = await sql<{ id: number }[]>`
      SELECT
        id
      FROM
        users
      WHERE
        id = ${profileId}
    `;

    if (user.length === 0) {
      throw new Error(`El user_id ${profileId} no existe en la tabla users.`);
    }

    const [comment] = await sql<ProfileComment[]>`
      INSERT INTO
        profiles_comments (profile_id, user_id, content)
      VALUES
        (
          ${profileId},
          ${userId},
          ${content}
        )
      RETURNING
        id,
        profile_id AS "profileId",
        user_id AS "userId",
        content,
        created_at AS "createdAt",
        (
          SELECT
            username
          FROM
            users
          WHERE
            id = ${userId}
        ) AS "username",
        (
          SELECT
            user_image
          FROM
            users
          WHERE
            id = ${userId}
        ) AS "userImage"
    `;

    if (!comment) {
      throw new Error('Failed to create profile comment');
    }

    return comment;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('violates foreign key constraint')
    ) {
      throw new Error(`El user_id ${profileId} no existe en la tabla users.`);
    } else {
      throw error;
    }
  }
}

export function getCommentsByProfileUserId(
  profileId: number,
): Promise<ProfileComment[]> {
  return sql<ProfileComment[]>`
    SELECT
      profiles_comments.id,
      profiles_comments.profile_id AS "profileId",
      profiles_comments.user_id AS "userId",
      profiles_comments.content,
      profiles_comments.created_at AS "createdAt",
      users.username,
      users.user_image AS "userImage"
    FROM
      profiles_comments
      JOIN users ON profiles_comments.user_id = users.id
    WHERE
      profiles_comments.profile_id = ${profileId}
    ORDER BY
      profiles_comments.created_at DESC
  `;
}
