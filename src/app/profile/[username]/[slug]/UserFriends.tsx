'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { CldImage } from 'next-cloudinary';

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

async function fetchFollowing(username: string) {
  const response = await fetch(`/api/following?username=${username}`);
  if (!response.ok) {
    throw new Error('Failed to fetch following users');
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
  const router = useRouter();
  const [friends, setFriends] = useState<
    { id: number; username: string; location: string }[]
  >([]);
  const [following, setFollowing] = useState<
    {
      id: number;
      username: string;
      userImage: string | null;
      interests: string;
    }[]
  >([]);
  const [showFollowing, setShowFollowing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFriends(user.id).then(setFriends).catch(console.error);
  }, [user.id]);

  const handleShowFollowing = async () => {
    try {
      const data = await fetchFollowing(user.username);
      setFollowing(data);
      setShowFollowing(true);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">
        My Friends
      </h2>
      <div className="flex space-x-4 justify-center">
        <button
          onClick={handleShowFollowing}
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

      {showFollowing && (
        <div className="w-full mt-4">
          <h3 className="font-semibold text-center text-sky-700 dark:text-sky-600">
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              {user.username}
            </span>{' '}
            is following:
          </h3>
          {!!error && <p className="text-red-500 text-center">{error}</p>}
          <ul className="flex flex-wrap justify-center space-x-4 mt-6">
            {following.map((user) => (
              <li
                key={`user-${user.id}`}
                className="flex flex-col items-center space-y-2 mt-6 w-40"
              >
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {user.userImage && user.userImage.startsWith('http') ? (
                    <CldImage
                      src={user.userImage}
                      width="40"
                      height="40"
                      crop="fill"
                      alt="User profile image"
                      style={{ borderRadius: '50%' }}
                    />
                  ) : (
                    <span className="text-xl">{user.userImage}</span>
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-800 dark:text-white">
                    {user.username}
                  </p>
                  {!!user.interests && (
                    <div className="flex flex-wrap items-center space-x-2 mt-2">
                      {user.interests.split(',').map((interest) => (
                        <span
                          key={`interest-${interest}`}
                          className="inline-block bg-orange-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mt-2"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="text-lg text-center text-sky-700 font-bold dark:text-sky-600">
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
