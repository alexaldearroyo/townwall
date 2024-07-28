'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getCityAndCountry } from '../../../../../util/geocode';
import { CldImage } from 'next-cloudinary';

const Map = dynamic(() => import('../../../../components/MapComponent'), {
  ssr: false,
});

type LocationType = {
  city: string;
  country: string;
};

export default function Wall({
  user,
  loggedInUserId,
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
  loggedInUserId: number | null;
}) {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user.location) {
      getCityAndCountry(user.location.y, user.location.x)
        .then((loc) => setLocation(loc))
        .catch((err) => setError('Failed to fetch location data'));
    }
  }, [user.location]);

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (loggedInUserId) {
        const response = await fetch(
          `/api/follows?followerId=${loggedInUserId}&followedId=${user.id}`,
        );
        const result = await response.json();
        setIsFollowing(result.isFollowing);
      }
    };

    checkIfFollowing();
  }, [loggedInUserId, user.id]);

  const handleFollow = async () => {
    await fetch('/api/follows', {
      method: isFollowing ? 'DELETE' : 'POST',
      body: JSON.stringify({ followerId: loggedInUserId, followedId: user.id }),
      headers: { 'Content-Type': 'application/json' },
    });

    setIsFollowing(!isFollowing);
  };

  return (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-bold text-center text-gray-800 dark:text-white">
        Profile of{' '}
        <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
          {user.username}
        </span>
      </h1>
      <div className="flex justify-center items-center mx-auto">
        {user.userImage && user.userImage.startsWith('http') ? (
          <CldImage
            src={user.userImage}
            width="150"
            height="150"
            crop="fill"
            alt="User profile image"
            style={{ borderRadius: '50%' }}
          />
        ) : (
          <span className="text-9xl">{user.userImage}</span>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        {!!user.fullName && user.fullName.trim() !== 'null' && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            <span className="text-sky-700 font-bold dark:text-sky-600">
              Full Name:{' '}
            </span>
            {user.fullName}
          </p>
        )}
        {!!user.profileLinks && user.profileLinks.trim() !== 'null' && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            <span className="text-sky-700 font-bold dark:text-sky-600">
              Profile Links:{' '}
            </span>
            {user.profileLinks}
          </p>
        )}
      </div>

      {!!user.description && (
        <p className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          {user.description}
        </p>
      )}

      {!!user.interests && user.interests.trim() !== 'null' && (
        <div className="text-center text-gray-700 dark:text-gray-300">
          {user.interests.split(',').map((interest) => (
            <span
              key={`interest-${interest}`}
              className="inline-block bg-orange-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
            >
              {interest}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-center space-x-4">
        {!!user.location && (
          <div className="w-full">
            {!!location && (
              <p className="text-center text-gray-700 dark:text-gray-300">
                <span className="text-sky-800 font-bold dark:text-sky-600">
                  Location:{' '}
                </span>
                {location.city}, {location.country}
              </p>
            )}
          </div>
        )}
      </div>

      {!!user.birthdate && user.birthdate.trim() !== 'null' && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          <span className="text-sky-800 font-bold dark:text-sky-600">
            Birthdate:{' '}
          </span>
          {user.birthdate}
        </p>
      )}
      {!!user.profession && user.profession.trim() !== 'null' && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          <span className="text-sky-800 font-bold dark:text-sky-600">
            Profession:{' '}
          </span>
          {user.profession}
        </p>
      )}

      {!!loggedInUserId && loggedInUserId !== user.id && (
        <div className="flex justify-center">
          <button
            onClick={handleFollow}
            className={`w-0.5/2 h-10 px-4 text-white rounded-md ${
              isFollowing ? 'bg-red-600' : 'bg-sky-600'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      )}
    </div>
  );
}
