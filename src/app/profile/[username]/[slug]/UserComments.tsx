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

export default function UserComments({ userId }: { userId: number }) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/profile/${userId}/comments`);
        if (response.ok) {
          const profileComments = await response.json();
          setComments(profileComments);
        } else {
          setFetchError('Failed to fetch comments');
        }
      } catch (err) {
        setFetchError('Failed to fetch comments');
      }
    };

    fetchComments();
  }, [userId]);

  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
        My Wall
      </h2>
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
                  className="text-sky-800 font-bold dark:text-sky-600 hover:text-indigo-800"
                >
                  {comment.username}
                </a>
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
