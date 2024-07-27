import React from 'react';
import Image from 'next/image';
import { UserGroupIcon, MapIcon, HeartIcon } from '@heroicons/react/24/outline';

const features = [
  {
    id: 'connect-with-friends',
    icon: <UserGroupIcon className="h-12 w-12 text-sky-600" />,
    title: 'Connect',
    description: 'Connect with people who share your interests.',
  },
  {
    id: 'explore-nearby',
    icon: <MapIcon className="h-12 w-12 text-sky-600" />,
    title: 'Explore',
    description: 'Discover content published around you.',
  },
  {
    id: 'share-interests',
    icon: <HeartIcon className="h-12 w-12 text-sky-600" />,
    title: 'Share',
    description: 'Share your hobbies and passions.',
  },
];

const HomeContent: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-2 flex flex-col items-center">
      <div className="flex justify-center">
        <Image src="/town.svg" alt="Town" width={350} height={175} />
      </div>
      <div className="flex flex-nowrap justify-around bg-transparent w-full">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex-grow sm:flex-grow-0 sm:w-1/2 md:w-1/3 p-4 flex flex-col items-center text-center"
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
