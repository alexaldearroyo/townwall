import { sql } from './connect';

export type Comment = {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
};

export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  try {
    const comments = await sql<
      {
        id: number;
        postId: number;
        userId: number;
        content: string;
        createdAt: Date | null;
      }[]
    >`
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

    return comments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt ?? new Date(), // Assuming new Date() if createdAt is null
    })) as Comment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error(`Failed to fetch comments: ${(error as Error).message}`);
  }
}

export async function createPostComment(
  postId: number,
  userId: number,
  content: string,
): Promise<Comment> {
  try {
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

    if (!comment) {
      throw new Error('Failed to create comment');
    }

    // Convert null to a default date
    const convertedComment: Comment = {
      ...comment,
      createdAt: comment.createdAt ?? new Date(), // Assuming new Date() if createdAt is null
    };

    return convertedComment;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw new Error(`Failed to create comment: ${(error as Error).message}`);
  }
}
