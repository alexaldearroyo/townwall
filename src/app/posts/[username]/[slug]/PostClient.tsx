'use client';

import React, { useState, useEffect } from 'react';

type CommentType = {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
  username: string;
};

type CategoryType = {
  id: number;
  categoryName: string;
};

export default function PostClient({ post }: { post: any }) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/comments?postId=${post.id}`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((err) => setError('Failed to fetch comments'));
  }, [post.id]);

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ postId: post.id, content: newComment }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const comment = await response.json();
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  return (
    <div className="w-full min-h-screen p-8 flex flex-col md:flex-row items-center md:items-start bg-gray-100 dark:bg-gray-900 space-y-8 md:space-y-0 md:space-x-8">
      <div className="w-full max-w-3xl mx-auto p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          {post.title}
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          By{' '}
          <a
            href={`/profile/${post.author}/public`}
            className="text-blue-700 dark:text-blue-400"
          >
            {post.author}
          </a>{' '}
          on {new Date(post.createdAt).toLocaleDateString()}
          {post.categories && post.categories.length > 0 && (
            <span className="ml-2 inline-block text-sm text-gray-500 dark:text-gray-400">
              {post.categories.map((category: CategoryType) => (
                <span
                  key={`category-${category.id}`}
                  className="ml-1 inline-block bg-amber-300 rounded-full px-2 py-1 text-sm font-semibold text-gray-700"
                >
                  {category.id}
                </span>
              ))}
            </span>
          )}
        </p>
        <p className="text-gray-700 dark:text-gray-300">{post.content}</p>

        <hr className="my-4 border-gray-300 dark:border-gray-600" />

        <h2 className="text-lg font-bold text-center text-gray-900 dark:text-white mt-8">
          Comments
        </h2>

        {!!error && <p className="text-red-500 text-center">{error}</p>}

        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-gray-100 rounded-md dark:bg-gray-700"
            >
              <p className="text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
              <small className="text-gray-500">
                {new Date(comment.createdAt).toLocaleString()} by{' '}
                <a
                  href={`/profile/${comment.username}/public`}
                  className="text-blue-700 dark:text-blue-400 hover:text-sky-800"
                >
                  {comment.username}
                </a>
              </small>
            </div>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
