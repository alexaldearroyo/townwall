import { sql } from './connect';

export type Comment = {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
};

export async function createComment(
  postId: number,
  userId: number,
  content: string,
): Promise<Comment> {
  const [comment] = await sql<Comment[]>`
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
  return comment;
}

export function getCommentsByPostId(postId: number): Promise<Comment[]> {
  return sql<Comment[]>`
    SELECT
      id,
      post_id AS "postId",
      user_id AS "userId",
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
