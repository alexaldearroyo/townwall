'use client';

import React from 'react';
import Link from 'next/link';

type PostType = {
  id: number;
  userId: number;
  icon: string | null;
  title: string;
  content: string;
  categoryId: string | null;
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
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
        {username}'s Posts
      </h2>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={`post-${post.id}`} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Link
                  href={`/posts/${username}/${post.slug}`}
                  className="text-xl font-semibold text-blue-700 dark:text-blue-400 hover:text-indigo-800"
                >
                  {post.title}
                </Link>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : ''}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {post.content.slice(0, 100)}...
              </p>
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
