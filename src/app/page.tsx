import React from 'react';
import HomeContent from './HomeContent';
import IntroContent from './IntroContent';

const Home: React.FC = () => {
  return (
    <div className="w-full min-h-screen p-8 flex flex-col md:flex-row items-center md:items-start bg-orange-100 dark:bg-gray-900 space-y-8 md:space-y-0">
      <div className="w-full bg-orange-100 dark:bg-gray-900 pl-24 p-8 flex justify-center">
        <IntroContent />
      </div>
      <div className="w-full bg-transparent p-8 dark:bg-gray-800  justify-center">
        <HomeContent />
      </div>
    </div>
  );
};

export default Home;
