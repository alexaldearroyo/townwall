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

async function fetchFriends(userId: number) {
  const response = await fetch(`/api/friends?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch friends');
  }
  const data = await response.json();
  return data;
}

export default function UserFriends({
  user,
}: {
  user: {
    id: number;
    username: string;
    location?: { x: number; y: number } | null;
  };
}) {
  const [friends, setFriends] = React.useState<
    { id: number; username: string; location: string }[]
  >([]);

  React.useEffect(() => {
    fetchFriends(user.id).then(setFriends).catch(console.error);
  }, [user.id]);

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
          className="flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          Followed Friends
        </button>
        <button
          onClick={() =>
            (window.location.href = `/profile/${user.username}/followers`)
          }
          className="flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          My Followers
        </button>
      </div>

      <h3 className="text-lg text-center text-gray-900 dark:text-white">
        Nearby friends
      </h3>
      {!!user.location && (
        <div className="w-full h-96 mt-4 rounded-lg overflow-hidden">
          <MapComponent
            latitude={user.location.y || 0}
            longitude={user.location.x || 0}
            markers={friends}
          />
        </div>
      )}
    </div>
  );
}
