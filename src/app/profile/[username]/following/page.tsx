'use client';

import React, { ReactNode, useEffect, useState } from 'react';

type UserType = {
  email: ReactNode;
  id: number;
  username: string;
  userImage: string | null;
};

export default function FollowingPage() {
  const [following, setFollowing] = useState<UserType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await fetch('/api/following');
        if (!response.ok) {
          throw new Error('Failed to fetch following users');
        }
        const data = await response.json();
        setFollowing(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchFollowing();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Users You Follow
        </h1>
        {!!error && <p className="text-red-500 text-center">{error}</p>}
        <ul>
          {following.length > 0 ? (
            following.map((user) => (
              <li
                key={`user-${user.id}`}
                className="flex items-center space-x-4 mb-4"
              >
                {!!user.userImage && (
                  <img
                    src={user.userImage}
                    alt={user.username}
                    className="h-10 w-10 rounded-full"
                  />
                )}
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {user.email}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-700 dark:text-gray-300">
              You are not following anyone.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
