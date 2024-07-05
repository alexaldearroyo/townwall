// src/app/profile/ProfilePageClient.tsx

'use client';

import React, { useState } from 'react';

export default function ProfilePageClient({
  user,
}: {
  user: { username: string };
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Welcome, {user.username}
        </h1>
        <p className="text-gray-600 text-center">This is your profile page.</p>
        {!!error && <p className="text-red-500 text-center">{error}</p>}
        <button
          onClick={handleLogout}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
