import { cookies } from 'next/headers';
import { getPostByUserAndSlug } from '../../../../../database/posts';
import { getSessionByToken } from '../../../../../database/sessions';
import PostClient from './PostClient';
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

  return <PostClient post={post} />;
}
