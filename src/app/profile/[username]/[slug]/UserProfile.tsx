'use client';

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
    <div className="w-full lg:w-3/5 p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        My Wall
      </h1>
      <div className="text-center mx-auto">
        <span className="text-9xl">{user.userImage}</span>
      </div>
      <p className="text-center text-gray-700 dark:text-gray-300">
        Username: {user.username}
      </p>
      {!!user.fullName && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Full Name: {user.fullName}
        </p>
      )}
      {!!user.description && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Description: {user.description}
        </p>
      )}
      {!!user.interests && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Interests: {user.interests}
        </p>
      )}
      {!!user.profileLinks && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Links: {user.profileLinks}
        </p>
      )}
      {!!location && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Location: {location.city}, {location.country}
        </p>
      )}
      {!!user.birthdate && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Birthdate: {user.birthdate}
        </p>
      )}
      {!!user.profession && (
        <p className="text-center text-gray-700 dark:text-gray-300">
          Profession: {user.profession}
        </p>
      )}
      {!!error && <p className="text-red-500 text-center">{error}</p>}
      <div className="flex space-x-4 justify-center">
        <button
          onClick={() =>
            (window.location.href = `/profile/${user.username}/edit`)
          }
          className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
      <div className="w-full space-y-4">
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Comments by Friends
        </h2>
        <div className="space-y-2">
          <p className="text-center text-gray-700 dark:text-gray-300">
            No comments yet
          </p>
          {/* Puedes añadir más estructura para los comentarios aquí */}
        </div>
      </div>
    </div>
  );
}
