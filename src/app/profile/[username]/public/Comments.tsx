'use client';

import React, { useState, useEffect } from 'react';

type CommentType = {
  id: number;
  profileId: number;
  userId: number;
  content: string;
  createdAt: Date;
  username: string;
  userImage: string;
};

export default function Comments({ username }: { username: string }) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/profile/${username}/comments`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const profileComments = await response.json();
        setComments(profileComments);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to fetch comments: ${err.message}`);
        } else {
          setError('Failed to fetch comments: An unknown error occurred');
        }
      }
    };

    fetchComments();
  }, [username]);

  const handleCommentSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/profile/${username}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: newComment }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add comment');
      }

      const comment = await response.json();
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">
        Comments
      </h2>
      {!!error && <p className="text-red-500 text-center">{error}</p>}
      <div className="space-y-2">
        {comments.length === 0 ? (
          <p className="text-center text-gray-700 dark:text-gray-300">
            No comments yet
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-gray-100 rounded-md dark:bg-gray-700"
            >
              <p className="text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
              <small className="text-gray-500 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleString()} by{' '}
                <a
                  href={`/profile/${comment.username}/public`}
                  className="text-sky-700 dark:text-sky-600 hover:text-sky-800"
                >
                  {comment.username}
                </a>
              </small>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleCommentSubmit} className="space-y-4 mt-4">
        <div className="flex justify-center w-full">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-0.5/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
