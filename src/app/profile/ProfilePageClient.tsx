'use client';

import React, { useState } from 'react';

export default function ProfilePageClient({
  user,
}: {
  user: {
    username: string;
    fullName?: string | null;
    description?: string | null;
    interests?: string | null;
    profileLinks?: string | null;
    userImage?: string | null;
    location?: string | null;
    birthdate?: string | null;
    profession?: string | null;
  };
}) {
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    const response = await fetch('/api/logout', {
      method: 'POST',
    });

    if (response.ok) {
      window.location.href = '/login'; // Redirect to login page after logout
    } else {
      setError('Failed to log out');
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action is irreversible.',
    );
    if (!confirmed) {
      return;
    }

    const response = await fetch('/api/delete', {
      method: 'POST',
    });

    if (response.ok) {
      window.location.href = '/'; // Redirect to home page after account deletion
    } else {
      const data = await response.json();
      setError(
        data.errors ? data.errors[0].message : 'Failed to delete account',
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Welcome, {user.username}
        </h1>
        {!!user.userImage && (
          <img
            src={user.userImage}
            alt={`${user.username}`}
            className="w-32 h-32 mx-auto rounded-full"
          />
        )}
        <p className="text-center text-gray-700 dark:text-gray-300">
          {user.fullName}
        </p>
        <p className="text-center text-gray-700 dark:text-gray-300">
          {user.description}
        </p>
        <p className="text-center text-gray-700 dark:text-gray-300">
          {user.interests}
        </p>
        <p className="text-center text-gray-700 dark:text-gray-300">
          {user.profileLinks}
        </p>
        <p className="text-center text-gray-700 dark:text-gray-300">
          {user.location}
        </p>
        <p className="text-center text-gray-700 dark:text-gray-300">
          {user.birthdate}
        </p>
        <p className="text-center text-gray-700 dark:text-gray-300">
          {user.profession}
        </p>
        {!!error && <p className="text-red-500 text-center">{error}</p>}
        <button
          onClick={handleLogout}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Sign Out
        </button>
        <button
          onClick={handleDeleteAccount}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Account
        </button>
        <button
          onClick={() => (window.location.href = `/profile/edit`)}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
