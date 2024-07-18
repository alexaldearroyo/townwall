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
      id: number | null;
      postId: number | null;
      userId: number | null;
      content: string | null;
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
  if (comment === undefined || comment.id === null) {
    throw new Error('Comment not found');
  }
  return comment as Comment;
}

export function getCommentsByPostId(postId: number): Promise<Comment[]> {
  return sql<Comment[]>`
    SELECT
      id,
      coalesce(post_id, 0) AS "postId",
      coalesce(user_id, 0) AS "userId",
      content,
      created_at AS "createdAt"
    FROM
      comments
    WHERE
      post_id = ${postId}
    ORDER BY
      created_at DESC
  `;
}

export async function createProfileComment(
  profileId: number,
  userId: number,
  content: string,
): Promise<ProfileComment> {
  const [comment] = await sql<ProfileComment[]>`
    INSERT INTO
      profile_comments (profile_id, user_id, content)
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
  return comment as ProfileComment;
}

export function getCommentsByProfileId(profileId: number): Promise<Comment[]> {
  return sql<Comment[]>`
    SELECT
      profile_comments.id,
      profile_comments.profile_id AS "profileId",
      profile_comments.user_id AS "userId",
      profile_comments.content,
      profile_comments.created_at AS "createdAt",
      users.username,
      users.user_image AS "userImage"
    FROM
      profile_comments
      JOIN users ON profile_comments.user_id = users.id
    WHERE
      profile_comments.profile_id = ${profileId}
    ORDER BY
      profile_comments.created_at DESC
  `;
}
