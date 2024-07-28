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
  username: string;
  loggedInUsername: string;
};

const FollowingList: React.FC<FollowingListProps> = ({ following, error, username, loggedInUsername }) => {
  return (
    <div className="flex items-center justify-center mt-20 mb-20 ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          {username === loggedInUsername ? 'You are following:' : `${username} is following:`}
        </h1>
        {!!error && <p className="text-red-500 text-center">{error}</p>}
        <ul className="flex flex-wrap space-x-2">
          {following.length > 0 ? (
            following.map((user) => (
              <li
                key={`user-${user.id}`}
                className="flex items-center space-x-2 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <div className="text-xl font-bold text-center text-gray-800 dark:text-white">
                    <a href={`/profile/${user.username}/public`}>
                      <span className="inline-block bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                        {user.username}
                      </span>{' '}
                    </a>
                  </div>
                </div>
                {/* <div className="h-15 w-15 rounded-full">{user.userImage}</div> */}
                {/* <div className="text-sm text-gray-500 dark:text-gray-300">
                  {user.location ? user.location : 'Location not available'}
                </div> */}
              </li>
            ))
          ) : (
            <p className="text-center text-gray-700 dark:text-gray-300">
              {username === loggedInUsername ? 'You are not following anyone.' : `${username} is not following anyone.`}
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FollowingList;
