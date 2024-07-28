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

export async function getCategories(): Promise<Category[]> {
  const categories = await sql<
    { id: number; categoryName: string; description: string | null }[]
  >`
    SELECT
      id,
      category_name AS "categoryName",
      description
    FROM
      categories
  `;

  return categories.map((category) => ({
    ...category,
    description: category.description ?? undefined,
  })) as Category[];
}

export async function getCategoryByName(
  categoryName: string,
): Promise<Category | undefined> {
  const categories = await sql<
    { id: number; categoryName: string; description: string | null }[]
  >`
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

  if (categories.length === 0) {
    return undefined;
  }

  const category = categories[0];
  if (!category) {
    return undefined;
  }

  return {
    id: category.id,
    categoryName: category.categoryName,
    description: category.description ?? undefined,
  };
}

export async function createCategory(
  categoryName: string,
  description?: string,
): Promise<Category> {
  const titleCaseCategoryName = toTitleCase(categoryName);

  const categories = await sql<
    { id: number; categoryName: string; description: string | null }[]
  >`
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

  const category = categories[0];
  if (!category) {
    throw new Error('Failed to create category');
  }

  return {
    id: category.id,
    categoryName: category.categoryName,
    description: category.description ?? undefined,
  };
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

export async function getUserCategories(userId: number): Promise<Category[]> {
  const categories = await sql<
    { id: number; categoryName: string; description: string | null }[]
  >`
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

  return categories.map((category) => ({
    ...category,
    description: category.description ?? undefined,
  })) as Category[];
}

export async function removeUserCategory(
  userId: number,
  categoryName: string,
): Promise<void> {
  const category = await getCategoryByName(categoryName);

  if (!category) {
    throw new Error('Category not found');
  }

  await sql`
    DELETE FROM users_categories
    WHERE
      user_id = ${userId}
      AND category_id = ${category.id}
  `;
}

export async function removePostCategory(
  postId: number,
  categoryName: string,
): Promise<void> {
  const category = await getCategoryByName(categoryName);

  if (!category) {
    throw new Error('Category not found');
  }

  await sql`
    DELETE FROM posts_categories
    WHERE
      post_id = ${postId}
      AND category_id = ${category.id}
  `;
}

export async function getCategoryIdsByNames(
  categoryNames: string[],
): Promise<number[]> {
  const categories = await sql<{ id: number; categoryName: string }[]>`
    SELECT
      id,
      category_name
    FROM
      categories
    WHERE
      category_name = ANY (
        ${categoryNames}
      )
  `;
  return categories.map((category) => category.id);
}

export async function addPostCategories(
  postId: number,
  categoryIds: number[],
): Promise<void> {
  if (categoryIds.length === 0) {
    throw new Error('No valid categories found');
  }

  console.log('Category IDs to insert:', categoryIds);

  // Insert categories to post
  await sql`
    INSERT INTO
      posts_categories (post_id, category_id)
    SELECT
      ${postId},
      unnest(
        ${categoryIds}::INT[]
      )
  `;
}

export async function getPostCategories(postId: number) {
  const categories = await sql<{ id: number; categoryName: string }[]>`
    SELECT
      c.id,
      c.category_name AS "categoryName"
    FROM
      categories c
      JOIN posts_categories pc ON c.id = pc.category_id
    WHERE
      pc.post_id = ${postId}
  `;
  return categories;
}

export async function findOrCreateCategory(categoryName: string) {
  const titleCaseCategoryName = categoryName.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });

  let [category] = await sql<
    { id: number; categoryName: string; description: string | null }[]
  >`
    SELECT
      *
    FROM
      categories
    WHERE
      category_name = ${titleCaseCategoryName}
    LIMIT
      1
  `;

  if (!category) {
    [category] = await sql<
      { id: number; categoryName: string; description: string | null }[]
    >`
      INSERT INTO
        categories (category_name)
      VALUES
        (
          ${titleCaseCategoryName}
        )
      RETURNING
        *
    `;
  }

  return category;
}
