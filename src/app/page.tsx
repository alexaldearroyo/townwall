import React from 'react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <p className="text-gray-600 dark:text-black mb-8">
        Get started by registering an account or signing in.
      </p>
      <div className="space-x-4">
        <a
          href="/register"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
        >
          Sign Up
        </a>
        <a
          href="/login"
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-black text-gray-900 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}
