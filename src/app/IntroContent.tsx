import React from 'react';
import Image from 'next/image';

const IntroContent: React.FC = () => {
  return (
    <div className="w-full max-w-md space-y-6">
      <h2 className="text-3xl mt-4 font-bold text-gray-800 dark:text-white">
        Welcome to Townwall
      </h2>
      <p className="text-gray-600 dark:text-gray-200">
        Connect with people nearby who share your interests.
        <br />
        Interact with individuals who are close to you and have common hobbies
        and passions.
      </p>

      <div className="flex justify-center">
        <Image src="/town.svg" alt="Town" width={400} height={200} />
      </div>
    </div>
  );
};

export default IntroContent;
