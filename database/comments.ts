import { sql } from './connect';

export type Comment = {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
};

// Función para obtener comentarios por postId
export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  try {
    return await sql<Comment[]>`
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
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error(`Failed to fetch comments: ${(error as Error).message}`);
  }
}

// Función para crear un comentario
export async function createPostComment(
  postId: number,
  userId: number,
  content: string,
): Promise<Comment> {
  try {
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

    if (!comment) {
      throw new Error('Failed to create comment');
    }

    return comment;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw new Error(`Failed to create comment: ${(error as Error).message}`);
  }
}
