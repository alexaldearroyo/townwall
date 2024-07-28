'use client';

import React from 'react';
import Link from 'next/link';

type CategoryType = {
  id: number;
  categoryName: string;
};

type PostType = {
  id: number;
  userId: number;
  icon: string | null;
  title: string;
  content: string;
  categories: CategoryType[];
  createdAt: Date | null;
  updatedAt: Date | null;
  slug: string;
};

export default function Posts({
  posts,
  username,
}: {
  posts: PostType[];
  username: string;
}) {
  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">
        Posts
      </h2>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={`post-${post.id}`} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Link
                  href={`/posts/${username}/${post.slug}`}
                  className="text-lg font-semibold text-sky-700 dark:text-sky-600 hover:text-sky-800"
                >
                  {post.title}
                </Link>
                {post.categories.length > 0 && (
                  <div className="flex flex-wrap items-center space-x-2 mt-2">
                    {post.categories.map((category) => (
                      <span
                        key={`category-${category.id}`}
                        className="inline-block bg-orange-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mt-2"
                      >
                        {category.categoryName}
                      </span>
                    ))}
                  </div>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : ''}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {post.content.slice(0, 100)}...
              </p>
              {posts.indexOf(post) < posts.length - 1 && (
                <hr className="border-t mt-4 border-gray-300 dark:border-gray-700" />
              )}
            </li>
          ))
        ) : (
          <p className="text-center text-gray-700 dark:text-gray-300">
            No posts yet
          </p>
        )}
      </ul>
    </div>
  );
}
