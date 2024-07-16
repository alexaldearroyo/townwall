import React from 'react';
import { cookies } from 'next/headers';
import { getUserByUsername } from '../../../../database/users';
import { getSessionByToken } from '../../../../database/sessions';
import { getPostsByUserId } from '../../../../database/posts';

export default async function UserPostsPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session');

  if (!sessionToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500">You are not logged in</p>
      </div>
    );
  }

  const session = await getSessionByToken(sessionToken.value);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500">You are not logged in</p>
      </div>
    );
  }

  const user = await getUserByUsername(username);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500">User not found</p>
      </div>
    );
  }

  const posts = await getPostsByUserId(user.id);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Posts by {user.username}
        </h1>
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={`post-${post.id}`} className="mb-4">
                <a
                  href={`/posts/${user.username}/${post.slug}`}
                  className="text-xl font-semibold text-blue-600 hover:underline"
                >
                  {post.title}
                </a>
                <p className="text-gray-700 dark:text-gray-300">
                  {post.content.slice(0, 100)}...
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-700 dark:text-gray-300">
            Loading...
          </p>
        )}
      </div>
    </div>
  );
}
