import { cookies } from 'next/headers';
import { getPostByUserAndSlug } from '../../../../../database/posts';
import { getSessionByToken } from '../../../../../database/sessions';
import React from 'react';

export default async function PostPage({
  params,
}: {
  params: { username: string; slug: string };
}) {
  const { username, slug } = params;
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

  const post = await getPostByUserAndSlug(username, slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500">Post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          {post.title}
        </h1>
        <p className="text-center text-gray-700 dark:text-gray-300">
          {post.content}
        </p>
      </div>
    </div>
  );
}
