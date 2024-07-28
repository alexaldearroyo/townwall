'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Friends({
  user,
}: {
  user: {
    username: string;
  };
}) {
  const router = useRouter();

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">
        Friends
      </h2>
      <div className="flex space-x-4 justify-center">
        <button
          onClick={() => router.push(`/profile/${user.username}/following`)}
          className="flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          Following
        </button>
        <button
          onClick={() => router.push(`/profile/${user.username}/followers`)}
          className="flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          Followers
        </button>
      </div>
    </div>
  );
}
