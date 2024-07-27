'use client';
import { CldImage } from 'next-cloudinary';
import React from 'react';

export default function UserProfile({
  user,
  location,
  error,
  handleLogout,
}: {
  user: {
    id: number;
    username: string;
    email: string;
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
  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">
        My Info
      </h2>
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
        <p className="text-center text-gray-700 dark:text-gray-300">
          <span className="text-sky-700 font-bold dark:text-sky-600">
            Username:{' '}
          </span>
          {user.username}
        </p>
        <p className="text-center text-gray-700 dark:text-gray-300">
          <span className="text-sky-700 font-bold dark:text-sky-600">
            Email:{' '}
          </span>
          {user.email}
        </p>
      </div>
      <div className="flex justify-center space-x-4">
        {!!user.fullName && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            <span className="text-sky-700 font-bold dark:text-sky-600">
              Full Name:{' '}
            </span>
            {user.fullName}
          </p>
        )}
        {!!user.profileLinks && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            <span className="text-sky-700 font-bold dark:text-sky-600">
              Profile Links:{' '}
            </span>
            {user.profileLinks}
          </p>
        )}
      </div>

      {!!user.description && (
        <p className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700  p-4 rounded-lg">
          {/* <span className="text-sky-800 font-bold dark:text-sky-600">
            Description:{' '}
          </span> */}
          {user.description}
        </p>
      )}

      {!!user.interests && (
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
        {!!location && (
          <p className="text-center text-gray-700 dark:text-gray-300">
            <span className="text-sky-700 font-bold dark:text-sky-600">
              Location:{' '}
            </span>
            {location.city}, {location.country}
          </p>
        )}
      </div>

      {!!user.birthdate && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          <span className="text-sky-700 font-bold dark:text-sky-600">
            Birthdate:{' '}
          </span>
          {user.birthdate}
        </p>
      )}
      {!!user.profession && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          <span className="text-sky-700 font-bold dark:text-sky-600">
            Profession:{' '}
          </span>
          {user.profession}
        </p>
      )}
      {!!error && <p className="text-red-500 text-center">{error}</p>}
      <div className="flex space-x-4 justify-center">
        <button
          onClick={() =>
            (window.location.href = `/profile/${user.username}/edit`)
          }
          className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
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
    </div>
  );
}
