// src/app/profile/[username]/followers/FollowersList.tsx

'use client';

import React from 'react';

type UserType = {
  email: string;
  id: number;
  username: string;
  userImage: string | null;
};

type FollowersListProps = {
  followers: UserType[];
  error: string | null;
};

const FollowersList: React.FC<FollowersListProps> = ({ followers, error }) => {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Users Following You
      </h1>
      {!!error && <p className="text-red-500 text-center">{error}</p>}
      <ul>
        {followers.length > 0 ? (
          followers.map((user) => (
            <li
              key={`user-${user.id}`}
              className="flex items-center space-x-4 mb-4"
            >
              <div className="h-15 w-15 rounded-full">{user.userImage}</div>
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  <a href={`/profile/${user.username}/public`}>
                    {user.username}
                  </a>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {user.email}
                </p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-700 dark:text-gray-300">
            No one is following you.
          </p>
        )}
      </ul>
    </div>
  );
};

export default FollowersList;