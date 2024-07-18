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

export default function CommentsPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserAndComments = async () => {
      try {
        const userResponse = await fetch(`/api/users/username/${username}`);
        const user = await userResponse.json();
        setProfileId(user.id);

        const commentsResponse = await fetch(
          `/api/profile/comments?profileId=${user.id}`,
        );
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (err) {
        setError('Failed to fetch comments or user');
      }
    };

    fetchUserAndComments();
  }, [username]);

  const handleCommentSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!profileId) {
      setError('Profile ID is not set');
      return;
    }

    try {
      const response = await fetch('/api/profile/comments', {
        method: 'POST',
        body: JSON.stringify({ profileId, content: newComment }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add comment');
      }

      const comment = await response.json();
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Comments for {username}
        </h1>
        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md"
          >
            Submit
          </button>
        </form>
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
              <small className="text-gray-500 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
