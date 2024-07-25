import React from 'react';
import Image from 'next/image';

const IntroContent: React.FC = () => {
  return (
    <div className="w-full max-w-md space-y-8">
      <h2 className="text-center text-xl font-bold text-gray-900 dark:text-white">
        Welcome to Townwall
      </h2>
      <div className="flex justify-center">
        <Image src="/town.svg" alt="Town" width={300} height={200} />
      </div>
      <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
        Connect with people nearby who share your interests.
        <br />
        Our platform helps you find and interact with individuals who are close
        to you and have common hobbies and passions.
      </p>
    </div>
  );
};

export default IntroContent;
