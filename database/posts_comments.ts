import { sql } from './connect';

export type Comment = {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
};

export async function createPostComment(
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
      posts_comments (post_id, user_id, content)
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
      posts_comments.id,
      posts_comments.post_id AS "postId",
      posts_comments.user_id AS "userId",
      posts_comments.content,
      posts_comments.created_at AS "createdAt",
      users.username
    FROM
      posts_comments
      JOIN users ON posts_comments.user_id = users.id
    WHERE
      posts_comments.post_id = ${postId}
    ORDER BY
      posts_comments.created_at DESC
  `;
}
