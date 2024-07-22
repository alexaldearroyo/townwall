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
    <div className="flex items-center justify-center mt-20 mb-20 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-3xl p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
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
                  className="text-blue-700 dark:text-blue-400"
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
              className="w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
