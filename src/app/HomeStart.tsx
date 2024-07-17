import React from 'react';

const HomeContent: React.FC = () => {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        Get started by registering an account or signing in.
      </p>
      <div className="flex justify-center space-x-4">
        <a
          href="/register"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
        >
          Sign Up
        </a>
        <a
          href="/login"
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 text-gray-900 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Sign In
        </a>
      </div>
    </div>
  );
};

export default HomeContent;