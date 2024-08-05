import { cookies } from 'next/headers';
import { getPostByUserAndSlug } from '../../../../../database/posts';
import { getPostCategories } from '../../../../../database/categories';
import { getSessionByToken } from '../../../../../database/sessions';
import { getUserById } from '../../../../../database/users';
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

  // Get posts categories
  const categories = await getPostCategories(post.id);

  // Include the author's username and categories in the post data
  post.author = username;
  post.categories = categories;

  // Get the current user
  const currentUser = await getUserById(session.userId);

  return <PostClient post={post} currentUser={currentUser} />;
}
