// src/app/profile/page.tsx

import React from 'react';
import { cookies } from 'next/headers';

export default function ProfilePage() {
  const user = getUserFromSession(); // Implement this function to get the user from session

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500">You are not logged in</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Welcome, {user.username}
        </h1>
        <p className="text-gray-600 text-center">This is your profile page.</p>
      </div>
    </div>
  );
}

// Example function to get user from session
function getUserFromSession() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session');

  if (!sessionToken) return null;

  // Fetch user from sessionToken
  // This is a placeholder. Implement session handling as per your needs.
  const user = { username: 'testuser' };
  return user;
}
