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

export default function UserProfile({
  user,
  location,
  error,
  handleLogout,
}: {
  user: {
    id: number;
    username: string;
    fullName?: string;
    description?: string;
    interests?: string;
    profileLinks?: string;
    userImage?: string;
    location?: { x: number; y: number } | null;
    birthdate?: string;
    profession?: string;
  };
  location: { city: string; country: string } | null;
  error: string | null;
  handleLogout: () => void;
}) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `/api/profile/comments?profileId=${user.id}`,
        );
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
  }, [user.id]);

  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
        My Wall
      </h2>
      <div className="text-center mx-auto">
        <span className="text-9xl">{user.userImage}</span>
      </div>
      <p className="text-center text-gray-700 dark:text-gray-300">
        Username: {user.username}
      </p>
      {!!user.fullName && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Full Name: {user.fullName}
        </p>
      )}
      {!!user.description && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Description: {user.description}
        </p>
      )}
      {!!user.interests && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Interests: {user.interests}
        </p>
      )}
      {!!user.profileLinks && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Links: {user.profileLinks}
        </p>
      )}
      {!!location && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Location: {location.city}, {location.country}
        </p>
      )}
      {!!user.birthdate && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Birthdate: {user.birthdate}
        </p>
      )}
      {!!user.profession && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Profession: {user.profession}
        </p>
      )}
      {!!error && <p className="text-red-500 text-center">{error}</p>}
      <div className="flex space-x-4 justify-center">
        <button
          onClick={() =>
            (window.location.href = `/profile/${user.username}/edit`)
          }
          className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit Profile
        </button>
        <button
          onClick={handleLogout}
          className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Sign Out
        </button>
      </div>
      <hr className="my-8 border-gray-300 dark:border-gray-600" />
      <div className="w-full space-y-4">
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Comments
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
                    className="text-blue-700 dark:text-blue-400"
                  >
                    {comment.username}
                  </a>
                </small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
