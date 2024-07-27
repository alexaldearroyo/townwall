import React from 'react';
import HomeContent from './HomeContent';
import IntroContent from './IntroContent';

const Home: React.FC = () => {
  return (
    <div className="w-full min-h-screen p-8 flex flex-col md:flex-row items-center md:items-start bg-orange-100 dark:bg-gray-900 space-y-8 md:space-y-0 md:space-x-8">
      <div className="w-full bg-orange-100 dark:bg-gray-900 first:p-8 flex justify-center">
        <IntroContent />
      </div>
      <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-8 flex justify-center">
        <HomeContent />
      </div>
    </div>
  );
};

export default Home;
