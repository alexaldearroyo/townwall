import { sql } from './connect';

export type Post = {
  id: number;
  userId: number;
  icon: string | null;
  title: string;
  content: string;
  categoryId?: string | number | null;
  createdAt: Date;
  updatedAt: Date | null;
  slug: string;
};

export async function getPostById(postId: number) {
  const posts = await sql<
    {
      id: number;
      userId: number;
      icon: string | null;
      title: string;
      content: string;
      categoryId: string | null;
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
      category_id AS "categoryId",
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
      categoryId: string | null;
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
      category_id AS "categoryId",
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

export async function getPostByUserAndId(slug: string) {
  const posts = await sql<
    {
      id: number;
      userId: number;
      icon: string | null;
      title: string;
      content: string;
      categoryId: string | null;
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
      category_id AS "categoryId",
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      slug
    FROM
      posts
    WHERE
      slug = ${slug}
  `;
  return posts[0];
}

export async function createPost(
  userId: number,
  title: string,
  content: string,
  slug: string,
  icon: string = '',
  categoryId?: number,
): Promise<Post> {
  const [post] = await sql<
    {
      id: number;
      userId: number;
      icon: string | null;
      title: string;
      content: string;
      categoryId: string | null;
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
        category_id,
        slug
      )
    VALUES
      (
        ${userId},
        ${icon || null},
        ${title},
        ${content},
        ${categoryId ?? null},
        ${slug}
      )
    RETURNING
      id,
      user_id AS "userId",
      icon,
      title,
      content,
      category_id AS "categoryId",
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      slug
  `;

  if (!post) {
    throw new Error('Failed to create post');
  }

  const createdAt = new Date(post.createdAt);
  const updatedAt = post.updatedAt ? new Date(post.updatedAt) : new Date();

  const result: Post = {
    ...post,
    createdAt,
    updatedAt,
  };

  return result;
}
