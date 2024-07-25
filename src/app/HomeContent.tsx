import React from 'react';
import { UserGroupIcon, MapIcon, HeartIcon } from '@heroicons/react/24/outline';

const features = [
  {
    id: 'connect-with-friends',
    icon: <UserGroupIcon className="h-12 w-12 text-sky-700" />,
    title: 'Connect with Friends',
    description: 'Find and connect with people who share your interests.',
  },
  {
    id: 'explore-nearby',
    icon: <MapIcon className="h-12 w-12 text-sky-700" />,
    title: 'Explore Nearby',
    description: 'Discover people and events happening around you.',
  },
  {
    id: 'share-interests',
    icon: <HeartIcon className="h-12 w-12 text-sky-700" />,
    title: 'Share Your Interests',
    description: 'Create and join groups to share your hobbies and passions.',
  },
];

const HomeContent: React.FC = () => {
  return (
    <div className="w-full max-w-md space-y-6">
      <h2 className="text-center text-xl font-bold text-gray-900 dark:text-white">
        Start Participating
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300">
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
      <hr className="my-6 border-gray-300 dark:border-gray-600" />
      <h2 className="text-center text-xl font-bold text-gray-900 dark:text-white">
        Features
      </h2>
      <div className="flex flex-wrap justify-around">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="w-full md:w-1/3 p-2 flex flex-col items-center text-center"
          >
            {feature.icon}
            <h3 className="mt-4 text-md font-bold text-gray-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeContent;
