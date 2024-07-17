'use client';

import React, { ReactNode } from 'react';

type UserType = {
  email: ReactNode;
  id: number;
  username: string;
  userImage: string | null;
};

type FollowingListProps = {
  following: UserType[];
  error: string | null;
};

const FollowingList: React.FC<FollowingListProps> = ({ following, error }) => {
  return (
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
              <div className="h-15 w-15 rounded-full">{user.userImage}</div>
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
  );
};

export default FollowingList;
