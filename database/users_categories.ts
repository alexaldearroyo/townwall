import { sql } from './connect';

export type UserCategory = {
  id: number;
  categoryName: string;
  description?: string;
};

export async function addUserCategory(
  userId: number,
  categoryId: number,
): Promise<void> {
  await sql`
    INSERT INTO
      users_categories (user_id, category_id)
    VALUES
      (
        ${userId},
        ${categoryId}
      )
  `;
}

export async function removeUserCategory(
  userId: number,
  categoryId: number,
): Promise<void> {
  await sql`
    DELETE FROM users_categories
    WHERE
      user_id = ${userId}
      AND category_id = ${categoryId}
  `;
}

export async function getUserCategories(
  userId: number,
): Promise<UserCategory[]> {
  const categories = await sql<
    { id: number; categoryName: string; description: string | null }[]
  >`
    SELECT
      c.id AS id,
      c.category_name AS "categoryName",
      c.description AS description
    FROM
      categories c
      INNER JOIN users_categories uc ON c.id = uc.category_id
    WHERE
      uc.user_id = ${userId}
  `;
  return categories.map((category) => ({
    ...category,
    description: category.description ?? undefined,
  }));
}
