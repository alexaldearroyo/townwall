import { sql } from './connect';

export type PostCategory = {
  id: number;
  categoryName: string;
  description?: string;
};

export async function addPostCategory(
  postId: number,
  categoryId: number,
): Promise<void> {
  await sql`
    INSERT INTO
      posts_categories (post_id, category_id)
    VALUES
      (
        ${postId},
        ${categoryId}
      )
  `;
}

export async function removePostCategory(
  postId: number,
  categoryId: number,
): Promise<void> {
  await sql`
    DELETE FROM posts_categories
    WHERE
      post_id = ${postId}
      AND category_id = ${categoryId}
  `;
}

export async function getPostCategories(
  postId: number,
): Promise<PostCategory[]> {
  const categories = await sql<PostCategory[]>`
    SELECT
      c.id AS id,
      c.category_name AS categoryname,
      c.description AS description
    FROM
      categories c
      INNER JOIN posts_categories pc ON c.id = pc.category_id
    WHERE
      pc.post_id = ${postId}
  `;
  return categories;
}
