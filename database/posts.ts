import { sql } from './connect';
import { getCategoryIdsByNames } from './categories';

export type Post = {
  id: number;
  userId: number;
  icon: string | null;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  slug: string;
  author?: string;
  categories?: { id: number; categoryName: string }[];
};

export async function getPostById(postId: number) {
  const posts = await sql<
    {
      id: number;
      userId: number;
      icon: string | null;
      title: string;
      content: string;
      createdAt: Date;
      updatedAt: Date | null;
      slug: string;
    }[]
  >`
    SELECT
      id,
      user_id AS "userId",
      icon,
      title,
      content,
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      slug
    FROM
      posts
    WHERE
      id = ${postId}
  `;
  return posts[0];
}

export async function getPostsByUserId(userId: number) {
  const posts = await sql<
    {
      id: number;
      userId: number;
      icon: string | null;
      title: string;
      content: string;
      createdAt: Date;
      updatedAt: Date | null;
      slug: string;
    }[]
  >`
    SELECT
      id,
      user_id AS "userId",
      icon,
      title,
      content,
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      slug
    FROM
      posts
    WHERE
      user_id = ${userId}
  `;
  return posts;
}

export async function getPostByUserAndSlug(username: string, slug: string) {
  const posts = await sql<
    {
      id: number;
      userId: number;
      icon: string | null;
      title: string;
      content: string;
      createdAt: Date;
      updatedAt: Date | null;
      slug: string;
    }[]
  >`
    SELECT
      p.id,
      p.user_id AS "userId",
      p.icon,
      p.title,
      p.content,
      p.created_at AS "createdAt",
      p.updated_at AS "updatedAt",
      p.slug
    FROM
      posts p
      JOIN users u ON p.user_id = u.id
    WHERE
      u.username = ${username}
      AND p.slug = ${slug}
  `;
  const post = posts[0];
  if (!post) {
    return undefined;
  }

  const categories = await getPostCategories(post.id);

  return {
    ...post,
    author: username,
    categories,
  };
}

export async function createPost(
  userId: number,
  title: string,
  content: string,
  slug: string,
  icon: string = '',
): Promise<Post> {
  const [post] = await sql<
    {
      id: number;
      userId: number;
      icon: string | null;
      title: string;
      content: string;
      createdAt: Date;
      updatedAt: Date | null;
      slug: string;
    }[]
  >`
    INSERT INTO
      posts (
        user_id,
        icon,
        title,
        content,
        slug
      )
    VALUES
      (
        ${userId},
        ${icon || null},
        ${title},
        ${content},
        ${slug}
      )
    RETURNING
      id,
      user_id AS "userId",
      icon,
      title,
      content,
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      slug
  `;

  if (!post) {
    throw new Error('Failed to create post');
  }

  const createdAt = new Date(post.createdAt);
  const updatedAt = post.updatedAt ? new Date(post.updatedAt) : new Date();

  return { ...post, createdAt, updatedAt };
}

export async function addPostCategories(
  postId: number,
  categoryNames: string[],
): Promise<void> {
  const categoryIds = await getCategoryIdsByNames(categoryNames);
  if (categoryIds.length === 0) {
    throw new Error('No valid categories found');
  }

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
