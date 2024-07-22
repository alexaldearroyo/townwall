'use client';

import React from 'react';
import dynamic from 'next/dynamic';

interface MapProps {
  latitude: number;
  longitude: number;
  height: string;
}

const MapComponent = dynamic(
  () => import('../../../../components/MapComponent'),
  {
    ssr: false,
  },
);

export default function UserFriends({
  user,
}: {
  user: {
    username: string;
    location?: { x: number; y: number } | null;
  };
}) {
  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
        My Friends
      </h2>
      <div className="flex space-x-4 justify-center">
        <button
          onClick={() =>
            (window.location.href = `/profile/${user.username}/following`)
          }
          className="flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Followed Friends
        </button>
        <button
          onClick={() =>
            (window.location.href = `/profile/${user.username}/followers`)
          }
          className="flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          My Followers
        </button>
      </div>

      <h3 className="text-lg text-center text-gray-900 dark:text-white">
        Nearby friends:
      </h3>
      {!!user.location && (
        <div className="w-full flex justify-center">
          <div className="w-full rounded-lg max-w-lg">
            <MapComponent
              latitude={user.location.y}
              longitude={user.location.x}
              height="300px"
            />
          </div>
        </div>
      )}
    </div>
  );
}
