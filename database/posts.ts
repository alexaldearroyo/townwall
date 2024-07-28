import { sql } from './connect';
import { addPostCategories, getPostCategories } from './categories';

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

  return {
    ...post,
    author: username,
    categories: await getPostCategories(post.id),
  };
}

export async function createPost(
  userId: number,
  title: string,
  content: string,
  slug: string,
  icon: string = '',
  categoryIds: number[] = [],
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

  if (categoryIds.length > 0) {
    await addPostCategories(post.id, categoryIds);
  }

  const createdAt = new Date(post.createdAt);
  const updatedAt = post.updatedAt ? new Date(post.updatedAt) : new Date();

  return { ...post, createdAt, updatedAt };
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
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
      author: string;
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
      p.slug,
      u.username AS "author"
    FROM
      posts p
      JOIN posts_categories pc ON p.id = pc.post_id
      JOIN users u ON p.user_id = u.id
    WHERE
      pc.category_id = ${categoryId}
  `;

  return posts;
}
