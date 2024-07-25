import { sql } from './connect';

export type Category = {
  id: number;
  categoryName: string;
  description?: string;
};

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}

export function getCategories(): Promise<Category[]> {
  return sql<Category[]>`
    SELECT
      id,
      category_name AS "categoryName",
      description
    FROM
      categories
  `;
}

export async function getCategoryByName(
  categoryName: string,
): Promise<Category | undefined> {
  const categories = await sql<Category[]>`
    SELECT
      id,
      category_name AS "categoryName",
      description
    FROM
      categories
    WHERE
      lower(category_name) = lower(
        ${categoryName}
      )
  `;
  return categories[0] || undefined;
}

export async function createCategory(
  categoryName: string,
  description?: string,
): Promise<Category> {
  const titleCaseCategoryName = toTitleCase(categoryName);

  const categories = await sql<Category[]>`
    INSERT INTO
      categories (category_name, description)
    VALUES
      (
        ${titleCaseCategoryName},
        ${description ?? null}
      )
    RETURNING
      id,
      category_name AS "categoryName",
      description
  `;
  return categories[0]!;
}

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

export function getUserCategories(userId: number): Promise<Category[]> {
  return sql<Category[]>`
    SELECT
      c.id,
      c.category_name AS "categoryName",
      c.description
    FROM
      categories c
      INNER JOIN users_categories uc ON c.id = uc.category_id
    WHERE
      uc.user_id = ${userId}
  `;
}
