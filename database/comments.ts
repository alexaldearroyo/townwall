import { sql } from './connect';

export type Comment = {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
};

export type ProfileComment = {
  id: number;
  profileId: number;
  userId: number;
  content: string;
  createdAt: Date;
  username: string;
  userImage: string;
};

export async function createComment(
  postId: number,
  userId: number,
  content: string,
): Promise<Comment> {
  const [comment] = await sql<
    {
      id: number;
      postId: number;
      userId: number;
      content: string;
      createdAt: Date | null;
    }[]
  >`
    INSERT INTO
      comments (post_id, user_id, content)
    VALUES
      (
        ${postId},
        ${userId},
        ${content}
      )
    RETURNING
      id,
      post_id AS "postId",
      user_id AS "userId",
      content,
      created_at AS "createdAt"
  `;
  if (comment === undefined) {
    throw new Error('Comment not found');
  }
  return comment as Comment;
}

export function getCommentsByPostId(postId: number): Promise<Comment[]> {
  return sql<Comment[]>`
    SELECT
      comments.id,
      comments.post_id AS "postId",
      comments.user_id AS "userId",
      comments.content,
      comments.created_at AS "createdAt",
      users.username -- Agregar el username aquí
    FROM
      comments
      JOIN users ON comments.user_id = users.id -- Asegurarse de hacer el join con la tabla de usuarios
    WHERE
      comments.post_id = ${postId}
    ORDER BY
      comments.created_at DESC
  `;
}

export async function createProfileComment(
  profileUserId: number,
  userId: number,
  content: string,
): Promise<ProfileComment> {
  try {
    // Validar si el profileUserId existe en la tabla users
    const user = await sql<{ id: number }[]>`
      SELECT
        id
      FROM
        users
      WHERE
        id = ${profileUserId}
    `;

    if (user.length === 0) {
      throw new Error(
        `El user_id ${profileUserId} no existe en la tabla users.`,
      );
    }

    const [comment] = await sql<ProfileComment[]>`
      INSERT INTO
        profile_comments (
          user_id,
          commenter_id,
          content
        )
      VALUES
        (
          ${profileUserId},
          ${userId},
          ${content}
        )
      RETURNING
        id,
        user_id AS "userId",
        commenter_id AS "commenterId",
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
      throw new Error(
        `El user_id ${profileUserId} no existe en la tabla users.`,
      );
    } else {
      throw error;
    }
  }
}

export function getCommentsByProfileUserId(
  profileUserId: number,
): Promise<ProfileComment[]> {
  return sql<ProfileComment[]>`
    SELECT
      profile_comments.id,
      profile_comments.user_id AS "userId",
      profile_comments.commenter_id AS "commenterId",
      profile_comments.content,
      profile_comments.created_at AS "createdAt",
      users.username,
      users.user_image AS "userImage"
    FROM
      profile_comments
      JOIN users ON profile_comments.commenter_id = users.id
    WHERE
      profile_comments.user_id = ${profileUserId}
    ORDER BY
      profile_comments.created_at DESC
  `;
}
