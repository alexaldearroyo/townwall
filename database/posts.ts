// database/posts.ts

import { sql } from './connect';

export type Post = {
  id: number;
  userId: number;
  icon: string | null;
  title: string;
  content: string;
  categoryId?: string | number | null;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
};

export async function createPost(
  userId: number,
  title: string,
  content: string,
  icon: string = '',
  categoryId?: number,
): Promise<Post> {
  const slug = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(); // Generate a slug
  const [post] = await sql<
    {
      id: number;
      userId: number;
      icon: string | null;
      title: string;
      content: string;
      categoryId: string | null;
      createdAt: Date | null;
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
      *
  `;

  if (!post) {
    throw new Error('Failed to create post');
  }

  const createdAt = post.createdAt ? new Date(post.createdAt) : new Date();
  const updatedAt = post.updatedAt ? new Date(post.updatedAt) : new Date();

  const result: Post = {
    ...post,
    createdAt,
    updatedAt,
  };

  return result;
}
