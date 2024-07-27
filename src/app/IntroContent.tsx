import React from 'react';

const IntroContent: React.FC = () => {
  return (
    <div className="w-full max-w-md space-y-7">
      <h2 className="text-6xl mt-4 font-bold text-gray-800 dark:text-white">
        Welcome to Townwall
      </h2>
      <p className="text-gray-600 dark:text-gray-200">
        Connect with people nearby who share your interests.
        <br />
        Interact with individuals who are close to you and have common hobbies
        and passions.
      </p>
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-8 mt-8">
        <h2 className="text-center text-xl font-bold text-gray-800 dark:text-white mb-4">
          Start Participating
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Get started by registering an account or signing in.
        </p>
        <div className="flex justify-center space-x-4 mt-8">
          <a
            href="/register"
            className="px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-md hover:bg-sky-700"
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
      {/* add a copyright by Alex Arroyo */}
      <div className="text-center text-gray-600 dark:text-gray-300 mt-8">
        Made with ❤️ by Alex Arroyo
      </div>
    </div>
  );
};

export default IntroContent;
